"use client";
import { useEffect, useState } from "react";
import HomeFinder from "@/components/HomeFinder";
import StartCards from "@/components/StartCards";
import { SiteFooter, SiteHeader, readSavedDetails } from "@/components/ui";
import { DEMO_DETAILS } from "@/lib/invite-design";
export default function Home() {
    const [details, setDetails] = useState(DEMO_DETAILS);
    useEffect(() => { const d = readSavedDetails(); if (d?.brideName)
        setDetails(d); }, []);
    return (<main className="studio">
      <SiteHeader active="/"/>
      <section className="hero home-hero">
        <h1>Every ceremony, <em>beautifully invited.</em></h1>
        <p className="hero-question">How would you like to invite your guests?</p>
        <p className="hero-tagline"><span>Video reels · Cards</span><span>Wedding &amp; event invitations</span></p>
      </section>

      <HomeFinder details={details}/>

      <StartCards />
      <SiteFooter />
    </main>);
}
