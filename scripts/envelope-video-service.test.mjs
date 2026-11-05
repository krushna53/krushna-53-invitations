// Mocked checks for the envelope re-lettering service. No real xAI request is made.
import test from "node:test";
import assert from "node:assert/strict";
import { serveEnvelopeVideo, sealLetters, estimateEnvelopeCents } from "../lib/envelope-video-service.mjs";

const code = "test-owner-access-code-12345";
const film = Buffer.from("fake mp4 bytes");
function setup(fetcher) {
  const data = new Map();
  const deps = { apiKey: "fake-key-for-tests", accessCode: code, now: 1000000, loadFilm: async () => film,
    fetcher: fetcher || (() => { throw new Error("Unexpected provider request"); }),
    store: { get: async (k) => data.get(k), set: async (k, v) => data.set(k, v), claim: async (k, v) => { if (data.has(k)) return false; data.set(k, v); return true; } } };
  const call = (action, body, headers = {}) => serveEnvelopeVideo(new Request(`https://test.example/api/envelope-video/${action}`, { method: "POST", headers: { "content-type": "application/json", "x-ai-access-code": code, origin: "https://test.example", ...headers }, body: JSON.stringify(body) }), deps);
  return { deps, call, data };
}

test("seal letters are checked", () => {
  assert.equal(sealLetters("  a  &  m "), "a & m");
  assert.throws(() => sealLetters(""));
  assert.throws(() => sealLetters("Aarav & Meera"));
  assert.throws(() => sealLetters("<b>"));
});

test("config and quote make no provider calls and never reveal the key", async () => {
  const { deps, call } = setup();
  const config = await (await serveEnvelopeVideo(new Request("https://test.example/api/envelope-video/config"), deps)).json();
  assert.equal(config.ready, true);
  const q = await (await call("quote", { letters: "A & M" })).json();
  assert.ok(q.token); assert.equal(q.totalCents, estimateEnvelopeCents()); assert.match(q.prompt, /"A & M"/);
  assert.equal(JSON.stringify(q).includes("fake-key"), false);
});

test("needs the access code and the site's own origin", async () => {
  const { call } = setup();
  assert.equal((await call("quote", { letters: "A&M" }, { "x-ai-access-code": "wrong" })).status, 403);
  assert.equal((await call("quote", { letters: "A&M" }, { origin: "https://other.example" })).status, 403);
});

test("edit sends our film once with the confirmed prompt, then status and media follow it", async () => {
  const calls = [];
  const { call } = setup(async (url, init = {}) => {
    calls.push([String(url), init.method || "GET"]);
    if (String(url).endsWith("/v1/videos/edits")) {
      const body = JSON.parse(init.body);
      assert.equal(body.model, "grok-imagine-video");
      assert.equal(body.video.url, `data:video/mp4;base64,${film.toString("base64")}`);
      assert.match(body.prompt, /"K & P"/);
      return Response.json({ request_id: "req_1" });
    }
    if (String(url).endsWith("/v1/videos/req_1")) return Response.json({ status: "done", video: { url: "https://vidgen.x.ai/out.mp4" }, usage: { cost_in_usd_ticks: 2400000000 } });
    if (String(url) === "https://vidgen.x.ai/out.mp4") return new Response("video");
    throw new Error(`unexpected ${url}`);
  });
  const q = await (await call("quote", { letters: "K & P" })).json();
  assert.equal((await call("edit", { token: q.token })).status, 400); // not confirmed
  const started = await (await call("edit", { token: q.token, confirmed: true })).json();
  assert.equal(started.state, "pending"); assert.equal("requestId" in started, false);
  await call("edit", { token: q.token, confirmed: true }); // a repeat must not send a second paid request
  assert.equal(calls.filter(([u]) => u.endsWith("/edits")).length, 1);
  const done = await (await call("status", { token: q.token })).json();
  assert.equal(done.state, "done"); assert.equal(done.actualCostUsd, 0.24);
  assert.equal(await (await call("media", { token: q.token })).text(), "video");
});

test("a rejected edit is reported and not retried", async () => {
  let posts = 0;
  const { call } = setup(async () => { posts++; return Response.json({ error: "no" }, { status: 402 }); });
  const q = await (await call("quote", { letters: "A&M" })).json();
  const job = await (await call("edit", { token: q.token, confirmed: true })).json();
  assert.equal(job.state, "failed"); assert.match(job.error, /credits/);
  await call("edit", { token: q.token, confirmed: true });
  assert.equal(posts, 1);
});
