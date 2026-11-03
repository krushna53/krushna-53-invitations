import { WhatsAppLink } from "@/components/ui";

export default function PricingCustomise() {
  return <section className="pricing-customise" aria-labelledby="pricing-customise-title">
    <div>
      <p className="eyebrow">MAKE IT YOURS</p>
      <h2 id="pricing-customise-title">Want a <em>custom invitation?</em></h2>
      <p>Tell us your ceremony, preferred style and ideas. EveryMoment will help you choose or customise the right invitation.</p>
    </div>
    <WhatsAppLink>Connect on WhatsApp</WhatsAppLink>
  </section>;
}
