"use client";
import { useEffect, useRef } from "react";
import { usd } from "@/lib/ai-video-pricing.mjs";

export default function GenerationCostDialog({ quote, onCancel, onConfirm, generationAvailable = false, busy = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (quote && !dialog.open) dialog.showModal();
    if (!quote && dialog.open) dialog.close();
    return () => { if (dialog.open) dialog.close(); };
  }, [quote]);
  return <dialog ref={ref} className="ai-cost-dialog" aria-labelledby="ai-cost-title" aria-describedby="ai-cost-explanation" onCancel={(event) => { event.preventDefault(); if (!busy) onCancel(); }}>
    {quote && <>
      <p className="eyebrow">REVIEW BEFORE GENERATING</p>
      <h2 id="ai-cost-title">Generate this video?</h2>
      <p className="ai-cost-total">{usd(quote.totalCents)} <small>estimated API cost</small></p>
      <p>{quote.label} · {quote.seconds} seconds · {quote.resolution} · One photo</p>
      <p>{quote.style} · {quote.ceremony}</p>
      <dl className="ai-cost-breakdown"><div><dt>Video generation</dt><dd>{usd(quote.outputCents)}</dd></div><div><dt>Input photo</dt><dd>{usd(quote.inputCents)}</dd></div></dl>
      <p id="ai-cost-explanation">Confirming sends this photo to xAI and starts one paid clip. Uploading alone does not start generation. Every regeneration requires a fresh confirmation. Taxes, currency conversion and extra image-generation steps are excluded.</p>
      <p className="hint small">This is an estimate of the site owner’s API bill, not a payment collected from you. Rates checked 2 November 2026. <a href="https://docs.x.ai/developers/pricing" target="_blank" rel="noopener noreferrer">View provider pricing</a>.</p>
      {!generationAvailable && <p className="ai-connection-note" role="status">Generation is unavailable for this estimate. Complete server setup and enter your generation access code, then review the cost again. No paid request has been made.</p>}
      <div className="ai-cost-actions"><button type="button" autoFocus disabled={busy} onClick={onCancel}>Cancel</button><button type="button" className="primary" disabled={!generationAvailable || busy} onClick={() => onConfirm?.(quote)}>{busy ? "Starting…" : "Confirm and generate"}</button></div>
    </>}
  </dialog>;
}
