import { getStore } from "@netlify/blobs";
import { serveAiVideo } from "../../lib/ai-video-service.mjs";
export default async (request) => {
  const env = (name) => globalThis.Netlify?.env?.get(name) ?? process.env[name] ?? "";
  const blobs = getStore({ name: `ai-video-jobs-${env("CONTEXT") || "production"}`, consistency: "strong" });
  return serveAiVideo(request, { apiKey: env("XAI_API_KEY"), accessCode: env("AI_VIDEO_ACCESS_CODE"), store: {
    get: (key) => blobs.get(key, { type: "json" }),
    set: (key, job) => blobs.setJSON(key, job),
    claim: async (key, job) => (await blobs.setJSON(key, job, { onlyIfNew: true })).modified,
  } });
};
export const config = { path: "/api/ai-video/*", rateLimit: { action: "rate_limit", aggregateBy: ["ip", "domain"], windowSize: 60, windowLimit: 30 } };
