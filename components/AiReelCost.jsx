import { reelCost } from "@/lib/ai-reel-cost.mjs";
const money = value => new Intl.NumberFormat("en-US", {style:"currency",currency:"USD",maximumFractionDigits:6}).format(value);
export default function AiReelCost({ clips, seconds }) {
  if (!clips.length) return null;
  const cost = reelCost(clips);
  const duration = Math.round(seconds || cost.seconds);
  return <section className="ai-reel-cost" aria-label="Full reel actual cost">
    <strong>{cost.complete ? `Actual cost for ${duration ? `${duration}-second` : "this"} reel: ${money(cost.actualUsd)}` : `Full reel actual cost: ${cost.unavailable ? "unavailable for imported files" : "awaiting xAI billing"}`}</strong>
    {!cost.complete && <p className="hint small">Confirmed charges so far: {money(cost.actualUsd)}. {cost.pending > 0 && `${cost.pending} clip charge(s) pending. `}{cost.unavailable > 0 && "Imported MP4s have no linked API billing record."} This is not a complete actual total.</p>}
    <p className="hint small">{clips.length} clip{clips.length === 1 ? "" : "s"} included. Editing, combining and downloading do not add an API generation charge.</p>
    {clips.map((clip,i) => <p className="hint small" key={`${clip.videoUrl}:${i}`}>Clip {i+1}{clip.seconds ? ` · ${clip.seconds}s` : ""}: {Number.isFinite(clip.actualCostUsd) ? money(clip.actualCostUsd) : clip.token ? "Actual charge pending" : "Original generation charge unavailable"}</p>)}
  </section>;
}
