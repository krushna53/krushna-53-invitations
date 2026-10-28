import { PLANS } from "@/lib/plans";
export default function PlanNav({ tier, reels = false }) {
    return <nav className="plan-nav" aria-label="Invitation collections">
      <a href={reels ? "/reels" : "/templates"} aria-current={!tier ? "page" : undefined}>All collections</a>
      {PLANS.filter((p) => !reels || p.id !== "basic").map((p) => <a key={p.id} href={`${reels ? "/reels" : "/templates"}?tier=${p.id}`} aria-current={tier === p.id ? "page" : undefined}>{p.name}</a>)}
      {tier && tier !== "basic" && <a href={`${reels ? "/templates" : "/reels"}?tier=${tier}`}>{reels ? "View cards" : tier === "pro" ? "View wedding journeys" : "View reels"} →</a>}
    </nav>;
}
