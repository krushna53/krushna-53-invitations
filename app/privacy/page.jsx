import { SiteFooter, SiteHeader } from "@/components/ui";

export const metadata = { title: "Privacy Policy | EveryMoment Wedding" };

export default function PrivacyPage() {
  return <main className="studio"><SiteHeader />
    <section className="hero trust-hero"><p className="eyebrow">YOUR INFORMATION</p><h1>Privacy <em>policy.</em></h1><p>What this invitation studio stores and how you can make choices about the information you add.</p></section>
    <article className="trust-content trust-legal">
      <p><strong>Last updated: October 28, 2026</strong></p>
      <h2>Information you enter</h2><p>Names, dates, venue details, design choices and other content you add are used to create your invitation. The studio saves a draft in your browser so you can continue working on the same device. This browser-saved draft is not a customer account and may be removed by clearing this site’s browser storage.</p>
      <h2>Guest links and uploads</h2><p>When you create a guest link, the invitation information is encoded into the link. Images you upload for sharing may be sent to the site’s hosting storage so guests can view them. Anyone with the link may be able to view and forward that invitation. Do not include information you do not want link recipients to see.</p>
      <h2>Downloads and external services</h2><p>Card and video exports are generated in your browser. Sharing through WhatsApp or visiting the EveryMoment contact site takes you to a third-party service, which has its own privacy practices. This studio does not provide RSVP collection or guest-response management.</p>
      <h2>Retention and your choices</h2><p>Locally saved drafts remain in your browser until you clear them. Shared-image retention depends on the hosting service. You can avoid creating a guest link if you only want to download a file. For privacy questions or requests about hosted content, contact EveryMoment and include the relevant guest link.</p>
      <h2>Contact</h2><p>For privacy questions, contact the EveryMoment team at <a href="https://everymoment.in/contact" target="_blank" rel="noreferrer">everymoment.in/contact</a>.</p>
    </article><SiteFooter />
  </main>;
}
