import { FAQS } from "@/lib/faq-content";

export default function HomeFAQ() {
  return <section className="home-faq" id="faq" aria-labelledby="home-faq-title">
    <div className="home-section-heading">
      <p className="eyebrow">HELP &amp; TRUST</p>
      <h2 id="home-faq-title">Good to know, <em>before you begin.</em></h2>
      <p>Answers about creating, downloading and getting help with your invitations.</p>
    </div>
    <div className="trust-content" aria-label="Frequently asked questions">
      {FAQS.map(({ q, a }) => <details className="trust-card faq-item" name="homepage-faq" key={q}>
        <summary><h2>{q}</h2><span aria-hidden="true">+</span></summary>
        <p>{a}</p>
      </details>)}
      <div className="home-faq-more"><a href="/faq">Read all FAQs →</a></div>
    </div>
  </section>;
}
