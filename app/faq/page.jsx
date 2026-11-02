import { SiteFooter, SiteHeader } from "@/components/ui";
import { FAQS } from "@/lib/faq-content";

export default function FAQPage() {
  return <main className="studio"><SiteHeader active="/faq" />
    <section className="hero trust-hero"><p className="eyebrow">FAQs · HELP &amp; TRUST</p><h1>Good to know, <em>before you begin.</em></h1><p>How the invitation studio works, what you can download, and where to get help.</p></section>
    <section className="trust-content" aria-label="Frequently asked questions">
      {FAQS.map(({ q, a }) => <details className="trust-card faq-item" name="invitation-faq" key={q}><summary><h2>{q}</h2><span aria-hidden="true">+</span></summary><p>{a}</p></details>)}
      <div className="trust-contact"><h2>Still have a question?</h2><p>Contact EveryMoment for help, current pricing or a custom wedding website quote.</p><a className="primary" href="https://everymoment.in/contact" target="_blank" rel="noreferrer">Contact EveryMoment ↗</a></div>
    </section>
    <SiteFooter />
  </main>;
}
