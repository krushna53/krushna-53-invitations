"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SiteFooter, SiteHeader, readSavedDetails } from "@/components/ui";
import HomeWeddingWebsitePromo from "@/components/HomeWeddingWebsitePromo";
import { DEMO_DETAILS } from "@/lib/invite-design";

const HomeFinder = dynamic(() => import("@/components/HomeFinder"), {
  ssr: false,
  loading: () => <section className="finder finder-loading" aria-label="Loading invitation designs"><div className="finder-inner"><h2>Find your <em>perfect design</em></h2><div className="finder-loading-card" /></div></section>,
});

export default function CreateMyInvitationPage() {
  const [details, setDetails] = useState(DEMO_DETAILS);
  useEffect(() => {
    const saved = readSavedDetails();
    if (saved?.brideName) setDetails(saved);
  }, []);

  return <main className="studio">
    <SiteHeader active="/create-my-invitation" />
    <section className="hero home-hero">
      <h1>Create My <em>Invitation.</em></h1>
      <p className="hero-question">How would you like to invite your guests?</p>
      <p className="hero-tagline"><span>Video reels · Cards</span><span>Wedding &amp; event invitations</span></p>
    </section>
    <HomeFinder details={details} />
    <HomeWeddingWebsitePromo />
    <SiteFooter />
  </main>;
}
