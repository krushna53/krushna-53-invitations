// Mocked checks for the seal re-lettering service. No real xAI request is made.
import test from "node:test";
import assert from "node:assert/strict";
import { serveEnvelopeVideo, sealLetters, estimateSealCents } from "../lib/envelope-video-service.mjs";

const code = "test-owner-access-code-12345";
const jpeg = `data:image/jpeg;base64,${Buffer.from([255, 216, 255, 224, 1, 2, 3]).toString("base64")}`;
function setup(fetcher) {
  const data = new Map();
  const deps = { apiKey: "fake-key-for-tests", accessCode: code, now: 1000000,
    fetcher: fetcher || (() => { throw new Error("Unexpected provider request"); }),
    store: { get: async (k) => data.get(k), set: async (k, v) => data.set(k, v), claim: async (k, v) => { if (data.has(k)) return false; data.set(k, v); return true; } } };
  const call = (action, body, headers = {}) => serveEnvelopeVideo(new Request(`https://test.example/api/envelope-video/${action}`, { method: "POST", headers: { "content-type": "application/json", "x-ai-access-code": code, origin: "https://test.example", ...headers }, body: JSON.stringify(body) }), deps);
  return { deps, call };
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
  const q = await (await call("quote", { letters: "T & S" })).json();
  assert.ok(q.token); assert.equal(q.totalCents, estimateSealCents());
  assert.match(q.prompt, /"T & S"/); assert.match(q.prompt, /the letter T, then an ampersand \(&\), then the letter S/);
  assert.equal(JSON.stringify(q).includes("fake-key"), false);
});

test("needs the access code and the site's own origin", async () => {
  const { call } = setup();
  assert.equal((await call("quote", { letters: "A&M" }, { "x-ai-access-code": "wrong" })).status, 403);
  assert.equal((await call("quote", { letters: "A&M" }, { origin: "https://other.example" })).status, 403);
});

test("seal sends the close-up once with the confirmed prompt and returns Grok's picture", async () => {
  let posts = 0;
  const { call } = setup(async (url, init) => {
    posts++;
    assert.equal(String(url), "https://api.x.ai/v1/images/edits");
    const body = JSON.parse(init.body);
    assert.equal(body.model, "grok-imagine-image-2.0"); assert.equal(body.image.url, jpeg); assert.match(body.prompt, /"K & P"/);
    return Response.json({ data: [{ b64_json: "AAAA", mime_type: "image/jpeg" }], usage: { cost_in_usd_ticks: 800000000 } });
  });
  const q = await (await call("quote", { letters: "K & P" })).json();
  assert.equal((await call("seal", { token: q.token, image: jpeg })).status, 400); // not confirmed
  const job = await (await call("seal", { token: q.token, confirmed: true, image: jpeg })).json();
  assert.equal(job.state, "done"); assert.equal(job.image, "data:image/jpeg;base64,AAAA"); assert.equal(job.actualCostUsd, 0.08);
  const again = await (await call("seal", { token: q.token, confirmed: true, image: jpeg })).json(); // a repeat is not paid twice
  assert.equal(again.image, job.image); assert.equal(posts, 1);
});

test("a rejected request is reported and not retried; bad pictures never reach xAI", async () => {
  let posts = 0;
  const { call } = setup(async () => { posts++; return Response.json({ error: "no" }, { status: 402 }); });
  const q = await (await call("quote", { letters: "A&M" })).json();
  assert.equal((await call("seal", { token: q.token, confirmed: true, image: "data:image/gif;base64,AAAA" })).status, 400);
  assert.equal(posts, 0);
  const job = await (await call("seal", { token: q.token, confirmed: true, image: jpeg })).json();
  assert.equal(job.state, "failed"); assert.match(job.error, /credits/);
  await call("seal", { token: q.token, confirmed: true, image: jpeg });
  assert.equal(posts, 1);
});
