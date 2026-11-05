"use client";
import { useEffect, useRef, useState } from "react";
import { usd } from "@/lib/ai-video-pricing.mjs";
import s from "./create.module.css";

const SAVED_JOB = "everymoment-envelope-job";

/**
 * Keeps our envelope film and has Grok change only the letters on its wax seal (xAI video editing).
 * Talks to /api/envelope-video/*: the server signs a cost quote, nothing goes to xAI until that cost is
 * confirmed, and the API key never reaches the browser.
 * value: the re-lettered film (a blob URL for this tab) or "" for the design's film with painted letters.
 */
export default function EnvelopeAiField({ value, onChange, monogram }) {
  const [config, setConfig] = useState(null);
  const [code, setCode] = useState("");
  const [quote, setQuote] = useState(null);
  const [job, setJob] = useState(null);
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const lock = useRef(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/envelope-video/config").then((r) => r.json()).then((v) => alive && setConfig(v))
      .catch(() => alive && setConfig({ ready: false, message: "Could not reach the Grok service. Restart npm run dev, or check the deployed function." }));
    try { const saved = JSON.parse(sessionStorage.getItem(SAVED_JOB) || "null"); if (saved?.token) { setToken(saved.token); setJob(saved.job); } } catch { /* nothing saved */ }
    return () => { alive = false; };
  }, []);
  // new letters need a new quote
  useEffect(() => { setQuote(null); }, [monogram]);

  const api = async (action, body, signal) => {
    const r = await fetch(`/api/envelope-video/${action}`, { method: "POST", headers: { "content-type": "application/json", "x-ai-access-code": code }, body: JSON.stringify(body), signal });
    if (action === "media") { if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "The film could not be downloaded."); return r.blob(); }
    const data = await r.json().catch(() => ({}));
    if (!r.ok && r.status !== 202) throw new Error(data.error || "The request failed.");
    return data;
  };
  const remember = (next, nextToken) => { setJob(next); try { sessionStorage.setItem(SAVED_JOB, JSON.stringify({ job: next, token: nextToken })); } catch { /* tab only */ } };

  const review = async () => {
    setError(""); setBusy("Asking for the cost…");
    try { setQuote(await api("quote", { letters: monogram })); } catch (e) { setError(e.message); } finally { setBusy(""); }
  };
  const edit = async () => {
    if (lock.current || !quote?.token) return;
    lock.current = true; setError(""); setBusy("Sending the film to Grok…"); setToken(quote.token); onChange("");
    try {
      const next = await api("edit", { token: quote.token, confirmed: true });
      remember(next, quote.token); setQuote(null);
      if (next.error) setError(next.error);
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

  if (!config) return <p className={s.hint}>Checking the Grok service…</p>;
  const running = job && ["pending", "starting"].includes(job.state);
  const madeFor = job?.letters;
  return <div className={s.imageField}>
    {value
      ? <><video className={s.thumb} src={value} muted controls playsInline /><p className={s.hint}>Our envelope film, with Grok&apos;s {madeFor || monogram} on the seal.</p></>
      : <p className={s.hint}>Our envelope film, with {monogram} painted on the seal on screen.</p>}
    {!config.ready && <p className={s.error}>{config.message}</p>}
    {config.ready && config.accessRequired && <input className={s.input} type="password" autoComplete="off" placeholder="Generation access code" value={code} onChange={(e) => setCode(e.target.value)} />}
    {config.ready && !quote && !running && <div className={s.row}>
      <button type="button" className={s.fileBtn} disabled={!!busy || (config.accessRequired && code.length < 16)} onClick={review}>Change the seal letters with Grok</button>
      {value && <button type="button" className={s.linkBtn} onClick={() => onChange("")}>Use painted letters instead</button>}
    </div>}
    {quote && <div className={s.aiQuote}>
      <p>Grok will keep our film and change only the seal&apos;s letters to <b>{quote.letters}</b>.</p>
      <p><b>Estimated cost: {usd(quote.totalCents)}</b> (about {Math.round(quote.seconds)} seconds of {quote.model}). The film is sent to Grok only after you confirm.</p>
      <div className={s.row}>
        <button type="button" className={s.fileBtn} disabled={!!busy} onClick={edit}>Confirm and change the letters</button>
        <button type="button" className={s.linkBtn} onClick={() => setQuote(null)}>Cancel</button>
      </div>
    </div>}
    {running && <p className={s.hint} role="status">Grok is changing the letters to {madeFor}. This can take a few minutes; keep this tab open.</p>}
    {job?.state === "done" && token && <div className={s.row}>
      {!value && <button type="button" className={s.fileBtn} disabled={!!busy} onClick={load}>Use Grok&apos;s film</button>}
      {value && <a className={s.linkBtn} href={value} download={`envelope-${(madeFor || monogram).replace(/\W+/g, "")}.mp4`}>Save the MP4</a>}
      {Number.isFinite(job.actualCostUsd) && <span className={s.hint}>Charged: ${job.actualCostUsd.toFixed(2)}</span>}
    </div>}
    {token && job?.state === "unknown" && <button type="button" className={s.linkBtn} onClick={() => remember({ ...job, state: "pending" }, token)}>Check progress</button>}
    {busy && <p className={s.hint} role="status">{busy}</p>}
    {(error || job?.error) && <p className={s.error}>{error || job.error}</p>}
  </div>;
}
