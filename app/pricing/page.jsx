import PlanCards from "@/components/PlanCards";
import { SiteHeader, SiteFooter, WhatsAppLink } from "@/components/ui";
export default function PricingPage() {
    return <main className="studio"><SiteHeader active="/pricing" />
      <section className="hero compact"><p className="eyebrow">BASIC · PREMIUM · PRO</p><h1>An invitation for <em>every celebration.</em></h1><p>Explore simple cards, animated invitations and complete wedding journeys. Choose a collection to see its matching designs.</p></section>
      <PlanCards detailed />
      <section className="pricing-customise" aria-labelledby="pricing-customise-title">
        <div>
          <p className="eyebrow">MAKE IT YOURS</p>
          <h2 id="pricing-customise-title">Want a <em>custom invitation?</em></h2>
          <p>Tell us your ceremony, preferred style and ideas. EveryMoment will help you choose or customise the right invitation.</p>
        </div>
        <WhatsAppLink>Connect on WhatsApp</WhatsAppLink>
      </section>
      <SiteFooter /></main>;
}
