"use client";
import { useEffect, useRef, useState } from "react";
import { usd } from "@/lib/ai-video-pricing.mjs";
import { ENVELOPE_VIDEO } from "@/lib/sacred-garden";
import { LIGHT_BURST_SEAL } from "@/lib/envelope-seal-track";
import { sealCloseUp } from "@/components/invite-sections/garden/SgEnvelope";
import s from "./create.module.css";

const SAVED_CODE = "everymoment-ai-access-code";

/** Close-up of the seal from the first frame of our envelope film, as a JPEG data URL. */
async function filmSealCloseUp() {
  const v = document.createElement("video");
  v.muted = true; v.playsInline = true; v.preload = "auto"; v.src = ENVELOPE_VIDEO;
  await new Promise((ok, fail) => { v.onloadeddata = ok; v.onerror = () => fail(new Error("The envelope film could not be loaded.")); });
  await new Promise((ok) => { v.onseeked = ok; v.currentTime = 0.04; });
  return sealCloseUp(v, LIGHT_BURST_SEAL).toDataURL("image/jpeg", 0.92);
}

/**
 * The seal's words and a Submit button. The words are painted on the seal right away; Submit has Grok
 * re-letter a close-up of our film's seal, and that seal face is laid over the film, following the seal.
 * The film itself stays ours. Talks to /api/envelope-video/*; the API key never reaches the browser.
 * On a public site the server also wants the owner's access code; it is asked once and kept in this browser.
 * value: Grok's seal close-up (data URL) or "". words / onWords: the seal's words (form field).
 */
export default function EnvelopeAiField({ label, value, onChange, words, onWords, monogram }) {
  const [config, setConfig] = useState(null);
  const [code, setCode] = useState("");
  const [askCode, setAskCode] = useState(false);
  const [made, setMade] = useState(null); // { letters, actualCostUsd }
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const lock = useRef(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/envelope-video/config").then((r) => r.json()).then((v) => alive && setConfig(v))
      .catch(() => alive && setConfig({ ready: false, message: "Could not reach the Grok service. Restart npm run dev, or check the deployed function." }));
    try { setCode(localStorage.getItem(SAVED_CODE) || ""); } catch { /* not kept */ }
    return () => { alive = false; };
  }, []);

  const api = async (action, body) => {
    const r = await fetch(`/api/envelope-video/${action}`, { method: "POST", headers: { "content-type": "application/json", "x-ai-access-code": code }, body: JSON.stringify(body) });
    const data = await r.json().catch(() => ({}));
    if (r.status === 403 && config?.accessRequired) { setAskCode(true); throw new Error("Enter the owner code to continue."); }
    if (!r.ok && r.status !== 202) throw new Error(data.error || "The request failed.");
    return data;
  };

  // Submit: one paid image edit (its price is shown next to the button beforehand)
  const submit = async () => {
    if (lock.current) return;
    if (config?.accessRequired && code.length < 16) { setAskCode(true); return; }
    lock.current = true; setError("");
    try {
      setBusy("Taking a close-up of the seal…");
      const image = await filmSealCloseUp();
      setBusy(`Grok is writing ${monogram} on the seal…`);
      const quote = await api("quote", { letters: monogram });
      const job = await api("seal", { token: quote.token, confirmed: true, image });
      try { if (code) localStorage.setItem(SAVED_CODE, code); } catch { /* not kept */ }
      setAskCode(false);
      if (job.state === "done" && job.image) { onChange(job.image); setMade({ letters: job.letters, actualCostUsd: job.actualCostUsd }); }
      else setError(job.error || "Grok did not return a seal. Check xAI usage before trying again.");
    } catch (e) { setError(e.message); } finally { setBusy(""); lock.current = false; }
  };

  const ready = config?.ready;
  return <div className={s.imageField}>
    <label className={s.label}><span>{label}</span>
      <input className={s.input} value={words} maxLength={9} placeholder={monogram} onChange={(e) => onWords(e.target.value)} />
    </label>
    <p className={s.hint}>Leave it empty to use the first letters of the names.</p>
    {askCode && <input className={s.input} type="password" autoComplete="off" placeholder="Owner code (asked once on the live site)" value={code} onChange={(e) => setCode(e.target.value)} />}
    <button type="button" className={s.submitBtn} disabled={!ready || !!busy} onClick={submit}>{busy ? "Working…" : "Submit"}</button>
    {ready && !busy && <p className={s.hint}>Grok writes {monogram} on the envelope&apos;s wax seal{config.estimatedCents ? ` (about ${usd(config.estimatedCents)} of credits)` : ""}.</p>}
    {config && !ready && <p className={s.error}>{config.message}</p>}
    {value && <div className={s.sealMade}>
      <img className={s.sealPreview} src={value} alt={`Grok's seal with ${made?.letters || monogram}`} />
      <div>
        <p className={s.hint}>Grok&apos;s seal{made?.letters ? ` with ${made.letters}` : ""} now follows the seal in our envelope film. Use “Preview the envelope” above to watch it.</p>
        <div className={s.row}>
          <button type="button" className={s.linkBtn} onClick={() => { onChange(""); setMade(null); }}>Use painted letters instead</button>
          {Number.isFinite(made?.actualCostUsd) && <span className={s.hint}>Charged: ${made.actualCostUsd.toFixed(2)}</span>}
        </div>
      </div>
    </div>}
    {busy && <p className={s.hint} role="status">{busy}</p>}
    {error && <p className={s.error}>{error}</p>}
  </div>;
}
