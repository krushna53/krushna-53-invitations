"use client";
import { useEffect, useRef, useState } from "react";
import { usd } from "@/lib/ai-video-pricing.mjs";
import s from "./create.module.css";

const SAVED_JOB = "everymoment-envelope-job";
const SAVED_CODE = "everymoment-ai-access-code";

/**
 * The seal's words and a Submit button. The words are painted on the seal right away; Submit has Grok
 * write them into our envelope film itself (xAI video editing) — the film stays ours, only the letters change.
 * Talks to /api/envelope-video/*: the server signs a cost quote and the API key never reaches the browser.
 * On a public site the server also wants the owner's access code; it is asked once and kept in this browser.
 * value: the re-lettered film (a blob URL for this tab) or "". words / onWords: the seal's words (form field).
 */
export default function EnvelopeAiField({ label, value, onChange, words, onWords, monogram }) {
  const [config, setConfig] = useState(null);
  const [code, setCode] = useState("");
  const [askCode, setAskCode] = useState(false);
  const [job, setJob] = useState(null);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const lock = useRef(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/envelope-video/config").then((r) => r.json()).then((v) => alive && setConfig(v))
      .catch(() => alive && setConfig({ ready: false, message: "Could not reach the Grok service. Restart npm run dev, or check the deployed function." }));
    try {
      setCode(localStorage.getItem(SAVED_CODE) || "");
      const saved = JSON.parse(sessionStorage.getItem(SAVED_JOB) || "null");
      if (saved?.token) { setToken(saved.token); setJob(saved.job); }
    } catch { /* nothing saved */ }
    return () => { alive = false; };
  }, []);

  const api = async (action, body, signal) => {
    const r = await fetch(`/api/envelope-video/${action}`, { method: "POST", headers: { "content-type": "application/json", "x-ai-access-code": code }, body: JSON.stringify(body), signal });
    if (r.status === 403 && config?.accessRequired) { setAskCode(true); throw new Error("Enter the owner code to continue."); }
    if (action === "media") { if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "The film could not be downloaded."); return r.blob(); }
    const data = await r.json().catch(() => ({}));
    if (!r.ok && r.status !== 202) throw new Error(data.error || "The request failed.");
    return data;
  };
  const remember = (next, nextToken) => { setJob(next); try { sessionStorage.setItem(SAVED_JOB, JSON.stringify({ job: next, token: nextToken })); } catch { /* tab only */ } };

  // Submit: price the edit and start it in one go (the price is shown next to the button beforehand)
  const submit = async () => {
    if (lock.current) return;
    if (config?.accessRequired && code.length < 16) { setAskCode(true); return; }
    lock.current = true; setError(""); setBusy("Sending the film to Grok…"); onChange("");
    try {
      const quote = await api("quote", { letters: monogram });
      setToken(quote.token);
      const next = await api("edit", { token: quote.token, confirmed: true });
      remember(next, quote.token);
      if (next.error) setError(next.error);
      try { if (code) localStorage.setItem(SAVED_CODE, code); } catch { /* not kept */ }
      setAskCode(false);
    } catch (e) { setError(e.message); } finally { setBusy(""); lock.current = false; }
  };
  const load = async () => {
    setError(""); setBusy("Loading the film…");
    try { onChange(URL.createObjectURL(await api("media", { token }))); } catch (e) { setError(e.message); } finally { setBusy(""); }
  };

  // follow the edit until the film is ready, then load it into the invitation
  useEffect(() => {
    if (!token || !job || !["pending", "starting"].includes(job.state)) return undefined;
    let stop = false, timer = 0;
    const check = async () => {
      try {
        const next = await api("status", { token }, AbortSignal.timeout(20000));
        if (stop) return;
        remember(next, token);
        if (["pending", "starting"].includes(next.state)) timer = window.setTimeout(check, 5000);
      } catch (e) { if (!stop) setError(`${e.message} Use “Check progress” to try again.`); }
    };
    timer = window.setTimeout(check, 4000);
    return () => { stop = true; window.clearTimeout(timer); };
  }, [token, job?.state]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (job?.state === "done" && token && !value) load(); }, [job?.state]); // eslint-disable-line react-hooks/exhaustive-deps

  const running = job && ["pending", "starting"].includes(job.state);
  const ready = config?.ready;
  return <div className={s.imageField}>
    <label className={s.label}><span>{label}</span>
      <input className={s.input} value={words} maxLength={9} placeholder={monogram} onChange={(e) => onWords(e.target.value)} />
    </label>
    <p className={s.hint}>Leave it empty to use the first letters of the names.</p>
    {askCode && <input className={s.input} type="password" autoComplete="off" placeholder="Owner code (asked once on the live site)" value={code} onChange={(e) => setCode(e.target.value)} />}
    <button type="button" className={s.submitBtn} disabled={!ready || !!busy || running} onClick={submit}>{running ? "Grok is working…" : "Submit"}</button>
    {ready && !running && <p className={s.hint}>Grok writes {monogram} into the envelope film{config.estimatedCents ? ` (about ${usd(config.estimatedCents)} of credits)` : ""}.</p>}
    {config && !ready && <p className={s.error}>{config.message}</p>}
    {running && <p className={s.hint} role="status">Grok is writing {job.letters} on the seal. This can take a few minutes; keep this tab open.</p>}
    {value && <>
      <video className={s.thumb} src={value} muted controls playsInline />
      <div className={s.row}>
        <a className={s.linkBtn} href={value} download={`envelope-${(job?.letters || monogram).replace(/\W+/g, "")}.mp4`}>Save the MP4</a>
        <button type="button" className={s.linkBtn} onClick={() => onChange("")}>Use painted letters instead</button>
        {Number.isFinite(job?.actualCostUsd) && <span className={s.hint}>Charged: ${job.actualCostUsd.toFixed(2)}</span>}
      </div>
    </>}
    {job?.state === "done" && token && !value && <button type="button" className={s.linkBtn} disabled={!!busy} onClick={load}>Use Grok&apos;s film</button>}
    {token && job?.state === "unknown" && <button type="button" className={s.linkBtn} onClick={() => remember({ ...job, state: "pending" }, token)}>Check progress</button>}
    {busy && <p className={s.hint} role="status">{busy}</p>}
    {(error || job?.error) && <p className={s.error}>{error || job.error}</p>}
  </div>;
}
