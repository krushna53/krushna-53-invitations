import { PLANS, PLAN_PRICES, STARTING_PRICES } from "@/lib/plans";
export default function PlanCards({ detailed = false }) {
    if (detailed) return <section className="plan-section" aria-labelledby="plans-title">
      <h2 id="plans-title">Choose your <em>invitation collection</em></h2>
      <p className="plan-intro">From a beautiful card to your complete wedding journey.</p>
      <div className="plan-grid">{PLANS.map((plan) => <a key={plan.id} className={`plan-card plan-${plan.id}`} href={`/templates?tier=${plan.id}`}>
        <span className="plan-name">{plan.name}</span><h3>{plan.tagline}</h3><p>{plan.description}</p>
        <div className="plan-prices">{PLAN_PRICES[plan.id].map((item) => <div key={item.label}><span>{item.label}</span><strong>{item.price}</strong></div>)}</div>
        <ul>{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
        <span className="choice-cta">{plan.cta} →</span>
      </a>)}</div>
    </section>;
    return <section className="collection-links" aria-labelledby="collections-title">
      <h2 id="collections-title">Explore by collection</h2>
      <nav aria-label="Collections and starting prices">{PLANS.map((plan) => <a key={plan.id} href={`/templates?tier=${plan.id}`}><strong>{plan.name}</strong><span>Starting from ₹{STARTING_PRICES[plan.id].toLocaleString("en-IN")}</span><span aria-hidden="true">→</span></a>)}</nav>
      <p>Starting prices depend on the design and format. Final requirements and any extra charges are confirmed before ordering.</p>
    </section>;
}
