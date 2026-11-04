"use client";
import { useT } from "./i18n";
import InviteCard from "./InviteCard";
import HeroSection from "./HeroSection";
import WelcomeSection from "./WelcomeSection";
import CountdownSection from "./CountdownSection";
import ProgramTimelineSection from "./ProgramTimelineSection";
import VenueSection from "./VenueSection";
import TextSection from "./TextSection";
import RsvpSection from "./RsvpSection";
import ClosingSection, { BrandFooter } from "./ClosingSection";

/**
 * The envelope-style invitation: names inside a carved garden arch, then a short, airy flow —
 * welcome, countdown, schedule, location, dress code, gifts, a wax-seal RSVP and a closing photo.
 * `d` has the shape of lib/demo-invitation.js.
 */
export default function GardenInvitation({ d, active = true, classicLink = false }) {
  const t = useT();
  const couple = `${d.groom} & ${d.bride}`;
  const gifts = d.guestInfo.find((item) => item.icon === "gift")?.text;
  const dress = [d.dressCode.women, d.dressCode.men].filter(Boolean).join(" ");
  const brand = { name: "EveryMoment", logo: "/everymoment-icon.svg", href: "/", ctaLabel: t("ctaWebsite"), ctaHref: "/wedding-websites" };
  const caption = classicLink ? <>{t("classicLink")} <a href="/wedding-websites/demo">{t("classicLinkCta")}</a></> : undefined;

  return <InviteCard
    variant="garden"
    hero={<HeroSection groom={d.groom} bride={d.bride} message={t("weddingDay")} dateLabel={d.dateLabel} art="/invite-art/garden-arch.svg" active={active} nextId="welcome" scrollLabel={t("scrollDown")} />}
    footer={<BrandFooter brand={brand} />}
    caption={caption}>
    <WelcomeSection id="welcome" eyebrow={d.blessing ?? ""} title={t("twoHearts")} message={d.welcome.message} />
    <CountdownSection eyebrow="" title={t("celebrationBegins")} labels={[t("days"), t("hours"), t("minutes"), t("seconds")]} date={d.date} tone="light" />
    <ProgramTimelineSection eyebrow="" title={t("schedule")} items={d.program} traveler />
    <VenueSection eyebrow="" title={t("location")} label="" {...d.venue} />
    <TextSection id="dress-code" title={t("dressCode")} text={dress} />
    <TextSection id="gifts" title={t("giftPref")} text={gifts} />
    <RsvpSection eyebrow="" title={t("confirmAttend")} subtitle={t("confirmSub")} events={d.rsvp.events} deadline={d.rsvp.deadline} coupleNames={couple} sealed />
    <ClosingSection thanks={t("hopeSee")} names={couple} photo={d.closing.image} tone="light" />
  </InviteCard>;
}
