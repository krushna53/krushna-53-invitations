import PlanCards from "@/components/PlanCards";
import PricingCustomise from "@/components/PricingCustomise";
import { SiteHeader, SiteFooter } from "@/components/ui";
export default function PricingPage() {
    return <main className="studio"><SiteHeader active="/pricing" />
      <section className="hero compact"><p className="eyebrow">BASIC · PREMIUM · PRO</p><h1>An invitation for <em>every celebration.</em></h1><p>Explore simple cards, animated invitations and complete wedding journeys. Choose a collection to see its matching designs.</p></section>
      <PlanCards detailed />
      <PricingCustomise />
      <SiteFooter /></main>;
}
