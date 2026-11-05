// Grok writes the couple's letters on the envelope film's wax seal. The film itself stays ours:
// the browser cuts a close-up of the seal from the film's first frame, Grok's image editing
// (POST /v1/images/edits) re-letters that close-up, and the page lays the new seal face over the film,
// following the seal frame by frame. Image editing changes text far more reliably than editing the moving film.
// Same safety model as the reel AI: the server signs a cost quote, nothing goes to xAI until that quote is
// confirmed, the paid request is never retried automatically, and the API key never leaves the server.
// Endpoints (under /api/envelope-video/): GET config, POST quote | seal.
import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";

const FILM_LETTERS = "R&Z"; // what the film's seal shows today
const MODEL = "grok-imagine-image-2.0";
// $0.04 per image for grok-imagine-image-2.0 (xAI models page, checked 5 November 2026); image edits are
// billed for the input and the output image, so the estimate counts both.
export const estimateSealCents = () => 8;

/** Letters for the seal, e.g. "A & M": up to 9 letters, digits, "&", "." or spaces. */
export function sealLetters(value) {
  const text = String(value ?? "").normalize("NFC").replace(/\s+/g, " ").trim();
  if (!/^[\p{L}\p{N}&. ]{1,9}$/u.test(text)) throw new Error("Use up to 9 letters for the seal, for example A & M.");
  return text;
}

/** "T & S" → "the letter T, then an ampersand (&), then the letter S" so the model reads each character */
const spell = (letters) => [...letters.replace(/\s+/g, "")].map((ch) => (ch === "&" ? "an ampersand (&)" : ch === "." ? "a dot" : `the letter ${ch}`)).join(", then ");

export function sealPrompt(letters) {
  return `Close-up photo of a round dark red wax seal stamped with the gold monogram "${FILM_LETTERS}". Edit only the monogram: `
    + `completely remove "${FILM_LETTERS}" (no part of the R or the Z may remain) and engrave the new gold monogram "${letters}" — ${spell(letters)} — `
    + "reading left to right, centred on the seal and as large as the old monogram, in the same elegant gold calligraphy, pressed into the wax the same way. "
    + "Keep everything else exactly the same: the wax seal's shape, scalloped edge, pressed ring, colour, texture, lighting and shadows, "
    + "the cream paper around it, the camera angle and the framing. Do not add any other text.";
}

const reply = (status, data) => Response.json(data, { status, headers: { "cache-control": "no-store" } });
const hash = (value) => createHash("sha256").update(value).digest("hex");
const equal = (a, b) => { const x = Buffer.from(a || ""), y = Buffer.from(b || ""); return x.length === y.length && timingSafeEqual(x, y); };
const sign = (payload, secret) => { const body = Buffer.from(JSON.stringify(payload)).toString("base64url"); return `${body}.${createHmac("sha256", secret).update(body).digest("base64url")}`; };
function verify(token, secret, now) {
  if (typeof token !== "string" || token.length > 8000) throw new Error("Invalid confirmation. Try again.");
  const [body, signature, extra] = token.split(".");
  if (extra || !signature || !equal(signature, createHmac("sha256", secret).update(body).digest("base64url"))) throw new Error("Invalid confirmation. Try again.");
  const data = JSON.parse(Buffer.from(body, "base64url").toString());
  if (!/^[a-f0-9-]{36}$/.test(data.id) || !Number.isFinite(data.expires)) throw new Error("Invalid confirmation. Try again.");
  return data;
}
const providerCostUsd = (result) => { const ticks = Number(result?.usage?.cost_in_usd_ticks); return result?.usage?.cost_in_usd_ticks != null && Number.isSafeInteger(ticks) && ticks >= 0 ? ticks / 1e10 : null; };

/** the seal close-up sent by the browser: a JPEG or PNG data URL under 3 MB */
function closeUp(data) {
  const match = typeof data === "string" && data.match(/^data:image\/(jpeg|png);base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!match) throw new Error("The seal picture is missing.");
  const bytes = Buffer.from(match[2], "base64");
  const ok = match[1] === "jpeg" ? bytes[0] === 255 && bytes[1] === 216 : bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (!ok || bytes.length > 3000000) throw new Error("The seal picture is not a valid image under 3 MB.");
  return data;
}

/** store: { get, set, claim } — claim must be atomic (writes only if the key is new). */
export async function serveEnvelopeVideo(request, { store, apiKey = "", accessCode = "", allowLocalAccess = false, fetcher = fetch, now = Date.now() }) {
  const url = new URL(request.url);
  const action = url.pathname.replace(/\/$/, "").split("/").pop();
  const localAccess = allowLocalAccess && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  const ready = Boolean(apiKey && (localAccess || accessCode.length >= 16));
  if (request.method === "GET" && action === "config") {
    return reply(200, { ready, accessRequired: !localAccess, estimatedCents: estimateSealCents(), message: ready ? "Grok can write your letters on the seal." : !apiKey ? "The xAI API key is missing on the server." : "Add a private generation access code of at least 16 characters on the server." });
  }
  if (request.method !== "POST" || !["quote", "seal"].includes(action)) return reply(405, { error: "Unsupported request." });
  if (!ready) return reply(503, { error: "Grok is not configured on this server yet." });
  const origin = request.headers.get("origin");
  if ((origin && origin !== url.origin) || (localAccess && origin !== url.origin)) return reply(403, { error: "This request must come from the invitation site." });
  if (!localAccess && !equal(request.headers.get("x-ai-access-code"), accessCode)) return reply(403, { error: "Enter the generation access code provided by the site owner." });
  const secret = hash(`envelope-seal:${apiKey}:${accessCode}`);
  try {
    const text = await request.text();
    if (text.length > 4200000) throw new Error("Request is too large.");
    const body = JSON.parse(text || "{}");

    if (action === "quote") {
      const letters = sealLetters(body.letters);
      const quote = { id: randomUUID(), letters, prompt: sealPrompt(letters), model: MODEL, totalCents: estimateSealCents(), expires: now + 600000 };
      return reply(200, { ...quote, token: sign(quote, secret) });
    }

    // seal: the confirmed request — one paid image edit, never repeated for the same confirmation
    const q = verify(body.token, secret, now);
    if (body.confirmed !== true) return reply(400, { error: "Confirm before Grok writes the letters." });
    const key = `seal-${q.id}`;
    const existing = await store.get(key);
    if (existing) return reply(200, existing);
    if (now > q.expires) return reply(409, { error: "This request expired. Press Submit again." });
    const image = closeUp(body.image);
    let job = { state: "starting", letters: q.letters, estimatedCents: q.totalCents, created: now };
    if (!await store.claim(key, job)) return reply(202, await store.get(key) || job);
    // Never retry this POST automatically: an interrupted response may still be billed.
    try {
      const upstream = await fetcher("https://api.x.ai/v1/images/edits", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
        body: JSON.stringify({ model: MODEL, prompt: q.prompt, image: { url: image, type: "image_url" }, response_format: "b64_json" }),
        signal: AbortSignal.timeout(120000),
      });
      const result = await upstream.json().catch(() => ({}));
      const cost = providerCostUsd(result);
      if (cost !== null) job = { ...job, actualCostUsd: cost };
      const out = result?.data?.[0];
      if (!upstream.ok) job = { ...job, state: "failed", error: upstream.status === 402 || upstream.status === 429 ? "xAI credits or usage limit reached. Check xAI billing before trying again." : "xAI rejected the request. Check API permissions, model access and billing. It was not retried." };
      else if (typeof out?.b64_json === "string" && /^[A-Za-z0-9+/]+={0,2}$/.test(out.b64_json)) job = { ...job, state: "done", image: `data:${/^image\/(png|jpeg|webp)$/.test(out.mime_type) ? out.mime_type : "image/jpeg"};base64,${out.b64_json}` };
      else job = { ...job, state: "unknown", error: "xAI's reply had no picture. Check xAI usage before trying again." };
    } catch {
      job = { ...job, state: "unknown", error: "The connection was interrupted after sending. It may be billed; check xAI usage. It will not be retried." };
    }
    await store.set(key, job);
    return reply(job.state === "done" ? 200 : 202, job);
  } catch (error) {
    return reply(400, { error: error instanceof SyntaxError ? "Invalid request data." : error.message || "Could not process this request." });
  }
}
