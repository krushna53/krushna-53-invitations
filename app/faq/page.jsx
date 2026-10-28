import { SiteFooter, SiteHeader } from "@/components/ui";

const FAQS = [
  { q: "How do I create an invitation?", a: "Choose a card template or start with Create my own. Add your names, ceremony details and venue, then customise the design and preview it. Download a still card as PNG or PDF, or make an animated invitation and download it as an MP4. You can also create a guest link and share it." },
  { q: "What is included?", a: "Card designs include editable event details and design options, with PNG and PDF downloads. Animated invitations include a 16-second video with browser-generated music and an MP4 download. Video reels have their own templates and MP4 export. Guest links are available for cards and videos. Package or paid service inclusions should be confirmed with EveryMoment before ordering." },
  { q: "What are the prices for invitations and wedding websites?", a: "Prices and paid package details are not currently listed on this invitation studio. For current pricing, availability and a quote for a custom wedding website, contact the EveryMoment team through everymoment.in/contact before ordering." },
  { q: "How do I receive my invitation?", a: "This is a self-service studio: export the finished card or video from your browser, or create a guest link to share. Digital files are generated when you export; there is no physical shipping. Website delivery expectations must be agreed as part of the custom quote." },
  { q: "Can I make changes or request revisions?", a: "You can edit the invitation in the studio before exporting it, and make another export after changing it. The site does not currently promise a number of complimentary designer revisions. If you need hands-on help, contact EveryMoment to ask what support is available." },
  { q: "What if I need help?", a: "Use the Contact us link to reach EveryMoment. Include the page you were using, your browser and a short description of the problem. Avoid sending private event or guest information unless it is needed to resolve your request." },
  { q: "Can I upload my own music or artwork?", a: "Some creation flows let you add your own artwork or music. Only upload material you have permission to use and share. Built-in music is generated in your browser." },
];

export default function FAQPage() {
  return <main className="studio"><SiteHeader />
    <section className="hero trust-hero"><p className="eyebrow">HELP &amp; TRUST</p><h1>Good to know, <em>before you begin.</em></h1><p>How the invitation studio works, what you can download, and where to get help.</p></section>
    <section className="trust-content" aria-label="Frequently asked questions">
      {FAQS.map(({ q, a }) => <article className="trust-card" key={q}><h2>{q}</h2><p>{a}</p></article>)}
      <div className="trust-contact"><h2>Still have a question?</h2><p>Contact EveryMoment for help, current pricing or a custom wedding website quote.</p><a className="primary" href="https://everymoment.in/contact" target="_blank" rel="noreferrer">Contact EveryMoment ↗</a></div>
    </section>
    <SiteFooter />
  </main>;
}
