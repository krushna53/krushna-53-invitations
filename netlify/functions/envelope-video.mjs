import { getStore } from "@netlify/blobs";
import { serveEnvelopeVideo } from "../../lib/envelope-video-service.mjs";

// Grok writes the couple's letters on the envelope film's wax seal. Needs XAI_API_KEY and AI_VIDEO_ACCESS_CODE (Functions scope).
export default async (request) => {
  const env = (name) => globalThis.Netlify?.env?.get(name) ?? process.env[name] ?? "";
  const blobs = getStore({ name: `envelope-video-jobs-${env("CONTEXT") || "production"}`, consistency: "strong" });
  return serveEnvelopeVideo(request, { apiKey: env("XAI_API_KEY"), accessCode: env("AI_VIDEO_ACCESS_CODE"), store: {
    get: (key) => blobs.get(key, { type: "json" }),
    set: (key, job) => blobs.setJSON(key, job),
    claim: async (key, job) => (await blobs.setJSON(key, job, { onlyIfNew: true })).modified,
  } });
};
export const config = { path: "/api/envelope-video/*", rateLimit: { action: "rate_limit", aggregateBy: ["ip", "domain"], windowSize: 60, windowLimit: 30 } };
