import { randomBytes } from "node:crypto";

const json = (status, body) => Response.json(body, { status, headers: { "cache-control": "no-store" } });
const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const validId = /^[a-zA-Z0-9_-]{16}$/;

// Both the local preview server and Netlify use this exact request handler.
export async function serveInvitation(request, store) {
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/api/invitation") {
        if (request.headers.get("origin") && request.headers.get("origin") !== url.origin) return json(403, { error: "Invalid origin" });
        const body = await request.text();
        if (Buffer.byteLength(body) > 4_000_000) return json(413, { error: "Invitation photos are too large. Use smaller images and try again." });
        let record;
        try { record = JSON.parse(body); } catch { return json(400, { error: "Invalid invitation" }); }
        if (record?.payload?.v !== 2 || !record.payload.design?.palette || !record.payload.details || !["card", "video"].includes(record.payload.mode) || !/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(record.image ?? "") || record.image.length > 1_000_000) return json(400, { error: "Invitation and preview image are required" });
        const id = randomBytes(12).toString("base64url");
        await store.set(id, JSON.stringify({ payload: record.payload, image: record.image }));
        return json(201, { id, url: `${url.origin}/i/${id}`, image: `${url.origin}/api/invitation/${id}/image` });
    }
    if (!["GET", "HEAD"].includes(request.method)) return json(405, { error: "Method not allowed" });
    const id = url.pathname.startsWith("/i/") ? url.pathname.split("/")[2] : url.pathname.split("/")[3];
    if (!validId.test(id ?? "")) return json(404, { error: "Invitation not found" });
    const raw = await store.get(id);
    if (!raw) return json(404, { error: "Invitation not found" });
    const record = JSON.parse(raw);
    if (url.pathname === `/api/invitation/${id}/image`) return new Response(request.method === "HEAD" ? null : Buffer.from(record.image.split(",")[1], "base64"), { headers: { "content-type": "image/jpeg", "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
    if (url.pathname === `/api/invitation/${id}`) return json(200, record.payload);
    if (url.pathname !== `/i/${id}`) return json(404, { error: "Invitation not found" });
    const { details } = record.payload;
    const title = escape(`${details.title || "You're invited"} · ${details.brideName || ""} & ${details.groomName || ""}`);
    const description = escape([details.date, details.venue, details.city].filter(Boolean).join(" · "));
    const guest = `/preview?id=${id}`;
    const image = escape(`${url.origin}/api/invitation/${id}/image`);
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${escape(url.href)}"><meta property="og:image" content="${image}"><meta property="og:image:type" content="image/jpeg"><meta property="og:image:width" content="600"><meta property="og:image:height" content="1067"><meta name="twitter:card" content="summary"><meta name="twitter:image" content="${image}"><meta http-equiv="refresh" content="0;url=${guest}"></head><body><a href="${guest}">Open invitation</a></body></html>`;
    return new Response(request.method === "HEAD" ? null : html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300", "content-security-policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'", "x-content-type-options": "nosniff" } });
}
