import test from "node:test";
import assert from "node:assert/strict";
import { serveInvitation } from "../lib/invitation-service.mjs";

const payload = { v: 2, mode: "video", design: { palette: { deep: "#000" }, scene: "sangeet" }, details: { title: 'Sangeet <script>alert("x")</script>', brideName: "Aarohi", groomName: "Reyansh", venue: "Garden & Palace" }, reel: { kind: "journey", events: [{ kind: "sangeet" }], photos: [] } };
const image = "data:image/jpeg;base64,/9j/2Q==";
function storage() { const entries = new Map(); return { set: async (key, value) => entries.set(key, value), get: async (key) => entries.get(key) ?? null }; }
async function publish(store) {
    const response = await serveInvitation(new Request("https://invites.example/api/invitation", { method: "POST", headers: { origin: "https://invites.example" }, body: JSON.stringify({ payload, image }) }), store);
    assert.equal(response.status, 201);
    return response.json();
}
test("short links round-trip the exact design, reel and details without a URL payload", async () => {
    const store = storage(); const saved = await publish(store);
    assert.match(saved.url, /^https:\/\/invites\.example\/i\/[\w-]{16}$/);
    const response = await serveInvitation(new Request(`https://invites.example/api/invitation/${saved.id}`), store);
    assert.deepEqual(await response.json(), payload);
});
test("social crawlers receive escaped server-rendered image metadata", async () => {
    const store = storage(); const saved = await publish(store);
    const response = await serveInvitation(new Request(saved.url), store);
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.ok(html.includes('property="og:image" content="' + saved.image + '"'));
    assert.ok(html.includes(`/preview?id=${saved.id}`));
    assert.ok(!html.includes('<script>alert'));
    assert.ok(html.includes("&lt;script&gt;"));
});
test("poster bytes are accessible separately with the right image content type", async () => {
    const store = storage(); const saved = await publish(store);
    const response = await serveInvitation(new Request(saved.image), store);
    assert.equal(response.headers.get("content-type"), "image/jpeg");
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), Buffer.from("/9j/2Q==", "base64"));
    assert.equal((await serveInvitation(new Request(saved.image, { method: "HEAD" }), store)).body, null);
});
test("unknown invitations and unsafe IDs do not read arbitrary storage paths", async () => {
    for (const suffix of ["missing", "../private", "abcdefghijklmnop"]) {
        assert.equal((await serveInvitation(new Request(`https://invites.example/api/invitation/${suffix}`), storage())).status, 404);
    }
});
test("incomplete invitations and cross-origin writes are rejected", async () => {
    const response = await serveInvitation(new Request("https://invites.example/api/invitation", { method: "POST", body: "{}" }), storage());
    assert.equal(response.status, 400);
    const foreign = await serveInvitation(new Request("https://invites.example/api/invitation", { method: "POST", headers: { origin: "https://elsewhere.example" }, body: JSON.stringify({ payload, image }) }), storage());
    assert.equal(foreign.status, 403);
});
