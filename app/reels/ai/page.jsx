"use client";
import { SiteFooter, SiteHeader } from "@/components/ui";
import AiVideoSetup from "@/components/AiVideoSetup";
export default function AiVideoPage() {
  return <main className="studio"><SiteHeader active="/reels" />
    <section className="hero compact"><p className="eyebrow">AI WEDDING VIDEO</p><h1>Your photo, <em>in motion.</em></h1><p>Choose your video settings and review the estimated cost before any paid generation.</p></section>
    <AiVideoSetup />
    <SiteFooter />
  </main>;
}
