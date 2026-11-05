// Re-letters the wax seal in our envelope film with Grok's video editing (POST /v1/videos/edits).
// The film itself stays ours: only the seal's letters change. Same safety model as the reel AI:
// the server signs a cost quote, nothing is sent to xAI until that quote is confirmed, the paid POST is
// never retried automatically, and the API key never leaves the server.
// Endpoints (under /api/envelope-video/): GET config, POST quote | edit | status | media.
import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const ENVELOPE_FILM_PATH = "/invite-art/sacred/envelope-light-burst.mp4";
const FILM_LETTERS = "R&Z"; // what the film's seal shows today
const FILM_SECONDS = 4.79;
const MODEL = "grok-imagine-video"; // the only xAI video model that edits an existing video
// $0.050 per second for grok-imagine-video (xAI models page, checked 5 November 2026).
// xAI does not say whether edits bill the input or the output length; both are this film's length.
const CENTS_PER_SECOND = 5;
export const estimateEnvelopeCents = () => Math.ceil(CENTS_PER_SECOND * FILM_SECONDS);

/** Letters for the seal, e.g. "A & M": up to 9 letters, digits, "&", "." or spaces. */
export function sealLetters(value) {
  const text = String(value ?? "").normalize("NFC").replace(/\s+/g, " ").trim();
  if (!/^[\p{L}\p{N}&. ]{1,9}$/u.test(text)) throw new Error("Use up to 9 letters for the seal, for example A & M.");
  return text;
}

export function envelopePrompt(letters) {
  return `Edit only the engraved letters on the round dark red wax seal: replace the gold monogram "${FILM_LETTERS}" with the gold monogram "${letters}". `
    + `Write "${letters}" in the same elegant gold calligraphy, at the same size and position, pressed into the wax the same way, and keep it on the seal in every frame, `
    + "moving, tilting, glowing and fading exactly as the seal does. Keep everything else identical to the source video: the cream envelope, the embossed flowers, "
    + "the wax seal's shape and colour, the warm glow, the light leaking from the flaps, the light burst, the flap opening, the timing, the framing and the camera. "
    + "Do not add any other text.";
}

const reply = (status, data) => Response.json(data, { status, headers: { "cache-control": "no-store" } });
const hash = (value) => createHash("sha256").update(value).digest("hex");
const equal = (a, b) => { const x = Buffer.from(a || ""), y = Buffer.from(b || ""); return x.length === y.length && timingSafeEqual(x, y); };
const sign = (payload, secret) => { const body = Buffer.from(JSON.stringify(payload)).toString("base64url"); return `${body}.${createHmac("sha256", secret).update(body).digest("base64url")}`; };
function verify(token, secret, now) {
  if (typeof token !== "string" || token.length > 8000) throw new Error("Invalid confirmation. Review the cost again.");
  const [body, signature, extra] = token.split(".");
  if (extra || !signature || !equal(signature, createHmac("sha256", secret).update(body).digest("base64url"))) throw new Error("Invalid confirmation. Review the cost again.");
  const data = JSON.parse(Buffer.from(body, "base64url").toString());
  if (!/^[a-f0-9-]{36}$/.test(data.id) || !Number.isFinite(data.expires) || now > data.expires + 86400000) throw new Error("This session has expired. Review the cost again.");
  return data;
}
const providerCostUsd = (result) => { const ticks = Number(result?.usage?.cost_in_usd_ticks); return result?.usage?.cost_in_usd_ticks != null && Number.isSafeInteger(ticks) && ticks >= 0 ? ticks / 1e10 : null; };
const xaiVideo = (href) => { const u = new URL(href); return u.protocol === "https:" && ["x.ai", "grok.com"].some((h) => u.hostname === h || u.hostname.endsWith(`.${h}`)) ? u.href : null; };
const visible = ({ requestId, ...job }) => job;

/**
 * store: { get, set, claim } — claim must be atomic (writes only if the key is new).
 * loadFilm(origin): the envelope film's bytes; by default it is fetched from the site itself.
 */
export async function serveEnvelopeVideo(request, { store, apiKey = "", accessCode = "", allowLocalAccess = false, fetcher = fetch, now = Date.now(), loadFilm }) {
  const url = new URL(request.url);
  const action = url.pathname.replace(/\/$/, "").split("/").pop();
  const localAccess = allowLocalAccess && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  const ready = Boolean(apiKey && (localAccess || accessCode.length >= 16));
  if (request.method === "GET" && action === "config") {
    return reply(200, { ready, accessRequired: !localAccess, estimatedCents: estimateEnvelopeCents(), message: ready ? "Review the cost before Grok re-letters the seal." : !apiKey ? "The xAI API key is missing on the server." : "Add a private generation access code of at least 16 characters on the server." });
  }
  if (request.method !== "POST" || !["quote", "edit", "status", "media"].includes(action)) return reply(405, { error: "Unsupported request." });
  if (!ready) return reply(503, { error: "Grok is not configured on this server yet." });
  const origin = request.headers.get("origin");
  if ((origin && origin !== url.origin) || (localAccess && origin !== url.origin)) return reply(403, { error: "This request must come from the invitation site." });
  if (!localAccess && !equal(request.headers.get("x-ai-access-code"), accessCode)) return reply(403, { error: "Enter the generation access code provided by the site owner." });
  const secret = hash(`envelope:${apiKey}:${accessCode}`);
  try {
    const text = await request.text();
    if (text.length > 16000) throw new Error("Request is too large.");
    const body = JSON.parse(text || "{}");

    if (action === "quote") {
      const letters = sealLetters(body.letters);
      const quote = { id: randomUUID(), letters, prompt: envelopePrompt(letters), model: MODEL, seconds: FILM_SECONDS, totalCents: estimateEnvelopeCents(), expires: now + 600000 };
      return reply(200, { ...quote, token: sign(quote, secret) });
    }

    const q = verify(body.token, secret, now);
    const key = `envelope-${q.id}`;
    let job = await store.get(key);

    if (action === "edit") {
      if (body.confirmed !== true) return reply(400, { error: "Confirm the displayed cost before Grok edits the film." });
      if (job) return reply(200, visible(job));
      if (now > q.expires) return reply(409, { error: "The cost confirmation expired. Review the cost again." });
      job = { state: "starting", letters: q.letters, estimatedCents: q.totalCents, created: now };
      if (!await store.claim(key, job)) return reply(202, visible(await store.get(key) || job));
      // Never retry this POST automatically: an interrupted response may still be billed.
      try {
        const film = loadFilm ? await loadFilm(url.origin) : Buffer.from(await (await fetcher(new URL(ENVELOPE_FILM_PATH, url.origin), { signal: AbortSignal.timeout(20000) })).arrayBuffer());
        if (!film?.length) throw new Error("film");
        const upstream = await fetcher("https://api.x.ai/v1/videos/edits", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
          body: JSON.stringify({ model: MODEL, prompt: q.prompt, video: { url: `data:video/mp4;base64,${Buffer.from(film).toString("base64")}` } }),
          signal: AbortSignal.timeout(60000),
        });
        const result = await upstream.json().catch(() => ({}));
        const cost = providerCostUsd(result);
        if (cost !== null) job = { ...job, actualCostUsd: cost };
        if (!upstream.ok) job = { ...job, state: "failed", error: upstream.status === 402 || upstream.status === 429 ? "xAI credits or usage limit reached. Check xAI billing before trying again." : "xAI rejected the edit. Check API permissions, model access and billing. It was not retried." };
        else if (typeof result.request_id === "string" && /^[A-Za-z0-9_-]{1,150}$/.test(result.request_id)) job = { ...job, state: "pending", requestId: result.request_id };
        else job = { ...job, state: "unknown", error: "xAI's reply was incomplete. Check xAI usage before trying again." };
      } catch (error) {
        job = { ...job, state: error.message === "film" ? "failed" : "unknown", error: error.message === "film" ? "The envelope film could not be read on the server. Nothing was sent to xAI." : "The connection was interrupted after sending. The edit may be billed; check xAI usage. It will not be retried." };
      }
      await store.set(key, job);
      return reply(202, visible(job));
    }

    if (!job) return reply(404, { error: "No edit was started for this confirmation." });
    if (action === "media") {
      if (job.state !== "done" || !job.videoUrl) return reply(409, { error: "The film is not ready yet." });
      const upstream = await fetcher(job.videoUrl, { redirect: "error", signal: AbortSignal.timeout(60000) });
      if (!upstream.ok) return reply(502, { error: "Grok's video link is no longer available." });
      return new Response(upstream.body, { headers: { "content-type": "video/mp4", "cache-control": "no-store" } });
    }
    // status
    if ((job.state === "pending" || (job.state === "done" && job.actualCostUsd == null)) && job.requestId) {
      const upstream = await fetcher(`https://api.x.ai/v1/videos/${encodeURIComponent(job.requestId)}`, { headers: { Authorization: `Bearer ${apiKey}` }, signal: AbortSignal.timeout(15000) });
      if (!upstream.ok) return reply(503, { error: "Could not check progress. Try again; do not start another edit." });
      const result = await upstream.json();
      const cost = providerCostUsd(result);
      if (cost !== null) job = { ...job, actualCostUsd: cost };
      if (result.status === "done") {
        const videoUrl = xaiVideo(result.video?.url);
        if (!videoUrl) throw new Error("Unexpected video link from xAI.");
        job = { ...job, state: "done", videoUrl };
      } else if (result.status === "failed" || result.status === "expired") {
        job = { ...job, state: "failed", error: "Grok could not finish the edit. Check xAI usage for any charge before trying again." };
      }
      await store.set(key, job);
    }
    return reply(200, visible(job));
  } catch (error) {
    return reply(400, { error: error instanceof SyntaxError ? "Invalid request data." : error.message || "Could not process this request." });
  }
}
