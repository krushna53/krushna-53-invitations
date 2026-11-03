"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import AiReelCost from "@/components/AiReelCost";
import AiReelEditor from "@/components/AiReelEditor";
import { AI_CEREMONIES, weddingVideoPrompt } from "@/lib/ai-wedding-prompt.mjs";
import GenerationCostDialog from "@/components/GenerationCostDialog";
import { AI_VIDEO_MODELS, estimateAiVideo, usd } from "@/lib/ai-video-pricing.mjs";

const fileData = (file) => new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(r.result); r.onerror = () => reject(new Error("Could not read this photo.")); r.readAsDataURL(file); });
async function digest(file) { return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", await file.arrayBuffer())), (n) => n.toString(16).padStart(2, "0")).join(""); }
export default function AiVideoSetup({ renderEditor, editorProps = {} }) {
  const [photo, setPhoto] = useState(null), [preview, setPreview] = useState("");
  const [model, setModel] = useState(AI_VIDEO_MODELS[0].id), [resolution, setResolution] = useState("720p"), [seconds, setSeconds] = useState(15);
  const [style, setStyle] = useState("Marathi wedding"), [ceremony, setCeremony] = useState("journey-opening");
  const [promptDraft, setPromptDraft] = useState(null);
  const promptKey = `${style}:${ceremony}:${seconds}`;
  const defaultPrompt = useMemo(() => weddingVideoPrompt(style, ceremony, seconds), [style, ceremony, seconds]);
  const promptText = promptDraft?.key === promptKey ? promptDraft.text : defaultPrompt;
  const [clips, setClips] = useState([]);
  const [accessCode, setAccessCode] = useState(""), [config, setConfig] = useState(null);
  const [error, setError] = useState(""), [quote, setQuote] = useState(null), [busy, setBusy] = useState(false);
  const [job, setJob] = useState(null), [token, setToken] = useState(""), [polling, setPolling] = useState(false);
  const [refreshingCharge, setRefreshingCharge] = useState(false), [chargeMessage, setChargeMessage] = useState("");
  const chargeLock = useRef(false);
  useEffect(() => { setChargeMessage(""); }, [token]);
  const [workspaceStarted,setWorkspaceStarted] = useState(false);
  const photoInput=useRef(null);
  useEffect(() => { if (workspaceStarted) try { sessionStorage.setItem("everymoment-ai-clips", JSON.stringify(clips.filter(c => c.videoUrl.startsWith("https://")))); } catch {} }, [clips,workspaceStarted]);
  useEffect(() => { if (job?.state === "done" && job.videoUrl) setClips(list => { const clip = { videoUrl: job.videoUrl, ceremony: job.ceremony, token, seconds: job.seconds, actualCostUsd: job.actualCostUsd }; return list.some(c => c.videoUrl === job.videoUrl) ? list.map(c => c.videoUrl === job.videoUrl ? {...c,...clip,actualCostUsd:Number.isFinite(job.actualCostUsd)?job.actualCostUsd:c.actualCostUsd} : c) : [...list,clip]; }); }, [job, token]);
  const lock = useRef(false), version = useRef(0);
  const estimate = useMemo(() => estimateAiVideo({ model, resolution, seconds }), [model, resolution, seconds]);
  const accessReady = config?.ready && (config.accessRequired === false || Boolean(accessCode));
  const active = busy || job?.state === "pending" || job?.state === "starting";
  useEffect(() => { let alive = true; fetch("/api/ai-video/config").then((r) => r.json()).then((v) => alive && setConfig(v)).catch(() => alive && setConfig({ ready: false, message: "Could not reach the generation server. Restart local dev or check the deployed function." }));
    return () => { alive = false; version.current++; };
  }, []);
  useEffect(() => { if (!photo) { setPreview(""); return; } const url = URL.createObjectURL(photo); setPreview(url); return () => URL.revokeObjectURL(url); }, [photo]);
  useEffect(() => { setQuote(null); version.current++; }, [model, resolution, seconds, style, ceremony, promptText, accessCode]);
  async function api(action, body, signal) {
    const response = await fetch(`/api/ai-video/${action}`, { method: "POST", headers: { "content-type": "application/json", "x-ai-access-code": accessCode }, body: JSON.stringify(body), signal });
    const data = await response.json(); if (!response.ok) throw new Error(data.error || "Request failed. No automatic paid retry was made."); return data;
  }
  async function loadClip(clip) {
    if (clip.videoUrl.startsWith("blob:")) return (await fetch(clip.videoUrl)).blob();
    if (!clip.token || !accessReady) throw new Error("Enter your generation access code to load this clip, or upload the saved MP4.");
    const response = await fetch("/api/ai-video/media", { method: "POST", headers: { "content-type": "application/json", "x-ai-access-code": accessCode }, body: JSON.stringify({ token: clip.token }) });
    if (!response.ok) { const data = await response.json(); throw new Error(data.error || "Could not load the video. Upload the saved MP4."); }
    return response.blob();
  }
  function saveJob(next, nextToken = token) { setJob(next); try { sessionStorage.setItem("everymoment-ai-job", JSON.stringify({ job: next, token: nextToken })); } catch { /* keep tab state */ } }
  const attemptedCharges = useRef(new Set());
  const [refreshingReelCost, setRefreshingReelCost] = useState(false);
  async function refreshReelCost() {
    if (!accessReady || refreshingReelCost) return;
    setRefreshingReelCost(true); setChargeMessage("");
    try {
      const tokens = [...new Set(clips.filter(c => c.token && !Number.isFinite(c.actualCostUsd)).map(c => c.token))];
      const results = await Promise.allSettled(tokens.map(async clipToken => ({clipToken, next:await api("status",{token:clipToken},AbortSignal.timeout(20000))})));
      const updated = results.filter(r => r.status === "fulfilled").map(r => r.value);
      setClips(list => list.map(c => { const result=updated.find(r=>r.clipToken===c.token); return result ? {...c,seconds:result.next.seconds ?? c.seconds,actualCostUsd:result.next.actualCostUsd ?? c.actualCostUsd} : c; }));
      const current=updated.find(r=>r.clipToken===token); if(current)saveJob({...job,...current.next});
      if(results.some(r=>r.status === "rejected"))setChargeMessage("Some clip charges could not be refreshed. Confirmed charges are retained; retry when the server is reachable.");
    } finally {setRefreshingReelCost(false);}
  }
  const pendingCostTokens = clips.filter(c=>c.token && !Number.isFinite(c.actualCostUsd)).map(c=>c.token).join("|");
  useEffect(() => { if(!accessReady || !pendingCostTokens) return; const key=accessCode+pendingCostTokens;if(attemptedCharges.current.has(key))return;attemptedCharges.current.add(key);void refreshReelCost(); },[accessCode,pendingCostTokens,accessReady]); // eslint-disable-line react-hooks/exhaustive-deps
  async function refreshCharge() {
    if (chargeLock.current || !token) return;
    setError(""); setChargeMessage("");
    if (Number.isFinite(job?.actualCostUsd)) { setChargeMessage("The actual charge reported by xAI is already shown below."); return; }
    if (!accessReady) { setChargeMessage("Enter your generation access code above, then refresh the actual charge."); return; }
    chargeLock.current = true; setRefreshingCharge(true);
    try {
      const next = await api("status", { token }, AbortSignal.timeout(20000));
      saveJob({ ...job, ...next });
      setChargeMessage(Number.isFinite(next.actualCostUsd) ? "Actual charge updated from xAI. No new generation was started." : "xAI has not returned the actual charge yet. Your video is ready; check xAI Console Usage or refresh later.");
    } catch (e) {
      const reason = e instanceof TypeError || e.name === "TimeoutError" ? "Could not reach the server to refresh billing. Check that the local server is running and your connection is available." : e.message;
      setChargeMessage(`${reason} Your completed video is unchanged. Refresh actual charge again later; this does not start another paid generation.`);
    } finally { chargeLock.current = false; setRefreshingCharge(false); }
  }
  useEffect(() => {
    if (!polling || !token || !accessReady) return;
    let cancelled = false, timer; const controller = new AbortController();
    async function check() {
      try { const next = await api("status", { token }, controller.signal); if (cancelled) return; saveJob(next);
        if (next.state === "pending") timer = setTimeout(check, 5000);
        else { setPolling(false); if (next.error) setError(next.error); }
      } catch (e) { if (!cancelled) { setPolling(false); setError(e.message + " Use Check progress to resume this job."); } }
    }
    check(); return () => { cancelled = true; clearTimeout(timer); controller.abort(); };
  }, [polling, token, accessCode, accessReady]); // eslint-disable-line react-hooks/exhaustive-deps
  async function review(file = photo) {
    if (!file || active) return;
    const current = ++version.current; setError(""); setBusy(true);
    try {
      const base = { ...estimate, style, ceremony };
      if (!accessReady) { setQuote(base); return; }
      const next = await api("quote", { model, resolution, seconds, style, ceremony, customPrompt: promptText, promptMode: "replace", photoHash: await digest(file) });
      if (current === version.current) setQuote(next);
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  function removePhoto(){if(active)return;version.current++;setPhoto(null);setQuote(null);setError("");setPromptDraft(null);if(photoInput.current)photoInput.current.value="";}
  function changePhoto(event) {
    const file = event.target.files?.[0]; if (!file) return;
    version.current++; setQuote(null); setError("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 3000000) { setError("Choose a JPG, PNG or WebP photo under 3 MB."); event.target.value = ""; setPhoto(null); return; }
    setWorkspaceStarted(true);setPhoto(file);
  }
  async function generate(confirmedQuote) {
    if (lock.current || !confirmedQuote.token || !photo) return;
    lock.current = true; setBusy(true); setError(""); setToken(confirmedQuote.token);
    saveJob({ state: "starting", estimatedCents: confirmedQuote.totalCents }, confirmedQuote.token);
    try { const next = await api("generate", { token: confirmedQuote.token, confirmed: true, image: await fileData(photo) }); saveJob(next, confirmedQuote.token); setQuote(null); if (next.state === "pending") setPolling(true); if (next.error) setError(next.error); }
    catch (e) { setQuote(null); setError(e.message + " Check this job’s progress before attempting another generation."); }
    finally { lock.current = false; setBusy(false); }
  }
  function resetJob() { setJob(null); setToken(""); setPolling(false); setError(""); try { sessionStorage.removeItem("everymoment-ai-job"); } catch {} }
  return <section className="ai-video-setup">
    <p className="ai-connection-note">{config?.message || "Checking generation setup…"}</p>
    <p className="hint">Up to 15 seconds per request. For a 30-second film generate Opening and Finale separately, then preview and download the full reel. Your photo is sent to xAI only after you confirm. Faces and motion may vary; image-to-video can begin with your uploaded image.</p>
    <form onSubmit={(e) => { e.preventDefault(); void review(); }}>
      {config?.accessRequired !== false && <><label>Generation access code<input type="password" autoComplete="off" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} disabled={busy} /></label>
      <p className="hint small">Provided by the site owner to authorise use of their API credits. This is not your xAI API key.</p></>}
      <label>Couple photo<input ref={photoInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={changePhoto} disabled={active} /></label>
      <p className="hint small">JPG, PNG or WebP · Under 3 MB · Uploading does not start paid generation.</p>
      {preview && <div className="ai-upload-wrap"><img className="ai-upload-preview" src={preview} alt="Uploaded couple photo preview" /><button type="button" className="ai-remove-photo" aria-label="Remove uploaded photo" disabled={active} onClick={removePhoto}>×</button></div>}
      <fieldset disabled={active} className="ai-settings"><legend className="sr-only">Video settings</legend><div className="ai-video-fields">
        <label>Wedding style<select value={style} onChange={(e) => setStyle(e.target.value)}>{["Marathi wedding", "Bengali wedding", "Marwari wedding"].map((s) => <option key={s}>{s}</option>)}</select></label>
        <label>Ceremony<select value={ceremony} onChange={(e) => setCeremony(e.target.value)}>{AI_CEREMONIES.map((s) => <option key={s} value={s}>{s === "journey-opening" ? "Film part 1 · Mandir, Mehendi, Haldi" : s === "journey-finale" ? "Film part 2 · Sangeet, Wedding, Reception" : s[0].toUpperCase() + s.slice(1)}</option>)}</select></label>
        <label>Video model<select value={model} onChange={(e) => setModel(e.target.value)}>{AI_VIDEO_MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}</select></label>
        <label>Resolution<select value={resolution} onChange={(e) => setResolution(e.target.value)}>{["480p", "720p"].map((s) => <option key={s}>{s}</option>)}</select></label>
        <label>Duration<select value={seconds} onChange={(e) => setSeconds(Number(e.target.value))}>{[5,10,15].map((s) => <option key={s} value={s}>{s} seconds</option>)}</select></label>
      </div>{photo && <div className="ai-editable-prompt"><label>Animation prompt · editable<textarea rows={9} maxLength={6000} value={promptText} onChange={e => setPromptDraft({key:promptKey,text:e.target.value})} /></label><button type="button" onClick={() => setPromptDraft(null)}>Reset to default prompt</button><p className="hint small">Edit the default prompt to change outfits, setting, animation or camera movement. Changing culture, ceremony or duration loads its matching default. Keep names, dates and venue in the reel form so they remain editable. Changes apply to the next generation.</p></div>}</fieldset>
      <p className="ai-estimate">Estimated credit deduction: <strong>{usd(estimate.totalCents)}</strong></p>
      <p className="hint small">USD estimate from configured rates, not your live balance. Actual billing is in xAI Console. Extra generations each cost more.</p>
      <button type="submit" className="primary" disabled={!photo || !promptText.trim() || active}>{busy ? "Please wait…" : job ? "Review regeneration cost" : "Review generation cost"}</button>
    </form>
    {error && <p role="alert" className="error">{error}</p>}
    {job && <section className="ai-job-result" aria-label="Video generation result">
      <p role="status">{job.state === "done" ? "Video ready" : job.state === "pending" ? "Generating your video. This may take several minutes." : job.state === "starting" ? "Submission in progress. Check progress if it was interrupted; do not submit again." : "Generation stopped. Review the message before starting again."}</p>
      {Number.isFinite(job.actualCostUsd) ? <p><strong>Actual charge for this {job.seconds || 15}-second clip: {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 6 }).format(job.actualCostUsd)}</strong><br /><small>Reported by xAI for this request. This is not your remaining account balance.</small></p> : Number.isFinite(job.estimatedCents) && <p>Estimated cost of this request: {usd(job.estimatedCents)}. Actual charge has not been returned by xAI; check Usage in xAI Console.</p>}
      {job.videoUrl && <>{!renderEditor && <video controls muted playsInline src={job.videoUrl} className="ai-generated-video" />}<p><a href={job.videoUrl} target="_blank" rel="noopener noreferrer">Open / save generated MP4 →</a></p><p className="hint small">Save your clip while the provider link is available. Edit names, dates and venues in the reel form. Your video appears in the phone preview.</p></>}
      {chargeMessage && <p role="status" className="hint">{chargeMessage}</p>}
      {token && job.state === "done" && !Number.isFinite(job.actualCostUsd) && <button type="button" disabled={refreshingCharge} onClick={refreshCharge}>{refreshingCharge ? "Checking actual charge…" : "Refresh actual charge"}</button>}
      {token && !polling && ["pending", "starting"].includes(job.state) && <button type="button" onClick={() => { setError(""); setPolling(true); }}>Check progress</button>}
      {!["pending", "starting"].includes(job.state) && <button type="button" onClick={resetJob}>Start another clip</button>}
    </section>}
    <AiReelCost clips={clips} />
    {clips.some(c=>c.token && !Number.isFinite(c.actualCostUsd)) && <button type="button" disabled={!accessReady || refreshingReelCost} onClick={refreshReelCost}>{refreshingReelCost ? "Checking reel charges…" : "Refresh full reel actual cost"}</button>}
    <section className="ai-clip-import"><label>Use a saved generated video<input type="file" accept="video/mp4,video/webm" multiple disabled={active} onChange={e => { const added = Array.from(e.target.files || []).filter(f => f.type.startsWith("video/")).map(f => ({ videoUrl: URL.createObjectURL(f), ceremony })); setWorkspaceStarted(true);setClips(list => [...list, ...added]); e.target.value = ""; }} /></label><p className="hint small">Already generated a clip? Upload its saved MP4 to edit it without using more API credits. Select the matching ceremony or film part above before uploading.</p></section>
    {(clips.length > 0 || renderEditor) && (renderEditor ? renderEditor(<AiReelEditor {...editorProps} compact loadClip={loadClip} accessCode={config?.accessRequired === false ? "local" : accessCode} clips={clips} onRemove={i => setClips(list => list.filter((_,j) => i !== j))} />) : <AiReelEditor loadClip={loadClip} accessCode={accessCode} clips={clips} onRemove={i => setClips(list => list.filter((_,j) => i !== j))} />)}
    <GenerationCostDialog quote={quote} generationAvailable={!!quote?.token && !!config?.ready} busy={busy} onCancel={() => setQuote(null)} onConfirm={generate} />
  </section>;
}
