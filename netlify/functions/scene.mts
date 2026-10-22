// GET  /api/scene/:id   → serves stored artwork / photos
// POST /api/scene        → stores an uploaded image (artwork or couple photo) so guest links stay short
import { getStore } from "@netlify/blobs";

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export default async (req: Request, context: { params?: Record<string, string> }) => {
  const store = getStore({ name: "scene-art", consistency: "strong" });

  if (req.method === "POST") {
    const type = req.headers.get("content-type") ?? "";
    if (!/^image\/(jpeg|png|webp)$/.test(type)) return json(415, { error: "Send a JPEG, PNG or WebP image" });
    const buf = await req.arrayBuffer();
    if (buf.byteLength > 3_500_000) return json(413, { error: "Image is too large (max 3.5 MB)" });
    const usage = getStore({ name: "scene-usage", consistency: "strong" });
    const key = `${new Date().toISOString().slice(0, 10)}/upload/${(context as { ip?: string }).ip ?? "unknown"}`;
    const count = Number((await usage.get(key)) ?? 0);
    if (count >= 40) return json(429, { error: "Upload limit reached for today" });
    await usage.set(key, String(count + 1));
    const id = crypto.randomUUID();
    await store.set(id, buf, { metadata: { contentType: type, uploaded: Date.now() } });
    return json(200, { id, url: `/api/scene/${id}` });
  }

  const id = context.params?.id ?? new URL(req.url).pathname.split("/").pop() ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response("Not found", { status: 404 });
  const found = await store.getWithMetadata(id, { type: "arrayBuffer" });
  if (!found) return new Response("Not found", { status: 404 });
  return new Response(found.data, {
    headers: {
      "content-type": String(found.metadata?.contentType ?? "image/jpeg"),
      "cache-control": "public, max-age=31536000, immutable",
      "access-control-allow-origin": "*",
    },
  });
};

export const config = { path: ["/api/scene", "/api/scene/:id"] };
