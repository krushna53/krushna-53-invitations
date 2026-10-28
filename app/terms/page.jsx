import { SiteFooter, SiteHeader } from "@/components/ui";

export const metadata = { title: "Terms of Use | EveryMoment Wedding" };

export default function TermsPage() {
  return <main className="studio"><SiteHeader />
    <section className="hero trust-hero"><p className="eyebrow">USING THE STUDIO</p><h1>Terms of <em>use.</em></h1><p>A straightforward guide to using EveryMoment Wedding’s invitation tools.</p></section>
    <article className="trust-content trust-legal">
      <p><strong>Last updated: October 28, 2026</strong></p>
      <h2>The invitation studio</h2><p>The studio provides browser-based tools to customise wedding and event cards, animated invitations and video reels. You can export supported formats or create a guest link. Keep a copy of downloaded files that you want to retain; browser drafts and generated links are not a substitute for your own backup.</p>
      <h2>Your content and permissions</h2><p>You are responsible for the names, event details, images, artwork and music you provide. Upload or share only content you have permission to use. Make sure you are comfortable with anyone who receives a guest link being able to view and forward the invitation.</p>
      <h2>Availability and support</h2><p>Browser and device support can affect previews, downloads and video exports. The studio may change as features are improved. If something does not work, contact EveryMoment with a description of the issue. No paid package, custom website price, delivery schedule or designer revision allowance is promised by this studio unless separately agreed with EveryMoment.</p>
      <h2>Custom wedding websites</h2><p>Custom wedding websites are not currently offered or priced in this invitation studio. Contact EveryMoment to discuss availability, scope, price and any applicable terms before proceeding.</p>
      <h2>Contact</h2><p>Questions about these terms? Contact the EveryMoment team at <a href="https://everymoment.in/contact" target="_blank" rel="noreferrer">everymoment.in/contact</a>.</p>
    </article><SiteFooter />
  </main>;
}
