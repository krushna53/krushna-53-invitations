"use client";
import { useEffect, useState } from "react";
import Thumb, { cardThumbJob, photoFingerprint, reelThumbJob } from "@/components/Thumb";
import { SiteFooter, SiteHeader, readSavedDetails } from "@/components/ui";
import { DEMO_DETAILS } from "@/lib/invite-design";
import { REEL_KINDS, REEL_TEMPLATES } from "@/lib/reels";
import { CARD_TEMPLATES, templateDesign } from "@/lib/templates";
import { REGIONAL_CULTURES } from "@/lib/regional-templates";
const PREMIUM = ["noir-foil", "ruby-engraving", "ivory-botanical", "celestial-night", "pastel-garden", "royal-mandala"];
const FEATURED_CARDS = ["noir-foil", "ruby-engraving", "ivory-botanical", "haldi-rangoli", "mehndi-peacock", "sangeet-disco"];
export default function Home() {
    const [details, setDetails] = useState(DEMO_DETAILS);
    useEffect(() => { const d = readSavedDetails(); if (d?.brideName)
        setDetails(d); }, []);
    const cards = FEATURED_CARDS.map((id) => CARD_TEMPLATES.find((t) => t.id === id)).filter(Boolean);
    const regional = REGIONAL_CULTURES.map((culture) => CARD_TEMPLATES.find((t) => t.regional && t.event === "wedding" && t.tradition === culture.id)).filter((t) => !!t);
    const photoKey = photoFingerprint(details.couplePhoto);
    const reels = Object.keys(REEL_KINDS).map((k) => REEL_TEMPLATES.find((r) => r.kind === k)).filter((r) => !!r).slice(0, 6);
    return (<main className="studio">
      <SiteHeader active="/"/>
      <section className="hero home-hero">
        <h1>Every ceremony, <em>beautifully invited.</em></h1>
        <p className="hero-question">How would you like to invite your guests?</p>
        <p className="hero-tagline"><span>Video reels · Cards</span><span>Wedding &amp; event invitations</span></p>
      </section>

      <section className="choice-grid" aria-label="Choose how to start">
        <a className="choice-card" href="/create">
          <span className="choice-heading"><span className="choice-icon">✎</span><b>Create my own</b></span>
          <p>Start with a ceremony scene, pick your colours and frame, then choose an animated or a simple card.</p>
          <span className="choice-cta">Start designing →</span>
        </a>
        <a className="choice-card featured" href="/templates">
          <span className="choice-heading"><span className="choice-icon">▤</span><b>Pick a card template</b></span>
          <p>{CARD_TEMPLATES.length} illustrated designs for every ceremony, with premium artwork and colour options.</p>
          <span className="choice-cta">Browse templates →</span>
        </a>
        <a className="choice-card" href="/reels">
          <span className="choice-heading"><span className="choice-icon">▶</span><b>Make a video reel</b></span>
          <p>{REEL_TEMPLATES.length} reel templates in {Object.keys(REEL_KINDS).length} animation styles: palace doors, royal scroll, envelope, save the date, photo story and more. We build it from your details.</p>
          <span className="choice-cta">See reels →</span>
        </a>
      </section>

      <section className="home-row">
        <div className="row-head"><h2>✦ Regional styles</h2><a href="/templates">Choose a ceremony, then a culture and design →</a></div>
        <div className="mini-grid">
          {regional.map((t) => (<a key={t.id} className="mini-card" href={`/templates?event=wedding&culture=${encodeURIComponent(t.tradition)}`}>
              <Thumb cacheKey={`card:${t.id}:0:${photoKey}:${details.brideName}:${details.groomName}:${details.date}`} make={cardThumbJob(templateDesign(t), details)} alt={t.name}/>
              <span className="badge">{t.regionLabel}</span>
              <b>{t.name}</b>
            </a>))}
        </div>
      </section>

      <section className="home-row">
        <div className="row-head"><h2>New designs</h2><a href="/templates">Explore foil, ruby and botanical card styles →</a></div>
        <div className="mini-grid">
          {PREMIUM.map((id) => CARD_TEMPLATES.find((t) => t.id === id)).filter((t) => !!t).map((t) => (<a key={t.id} className="mini-card" href={`/create?template=${t.id}`}>
              <Thumb cacheKey={`card:${t.id}:0:${photoKey}:${details.brideName}:${details.groomName}:${details.date}`} make={cardThumbJob(templateDesign(t), details)} alt={t.name}/>
              <span className="badge">New</span>
              <b>{t.name}</b>
            </a>))}
        </div>
      </section>

      <section className="home-row">
        <div className="row-head"><h2>Popular card templates</h2><a href="/templates">View all →</a></div>
        <div className="mini-grid">
          {cards.map((t) => (<a key={t.id} className="mini-card" href={`/create?template=${t.id}`}>
              <Thumb cacheKey={`card:${t.id}:0:${photoKey}:${details.brideName}:${details.groomName}:${details.date}`} make={cardThumbJob(templateDesign(t), details)} alt={t.name}/>
              <b>{t.name}</b>
            </a>))}
        </div>
      </section>

      <section className="home-row">
        <div className="row-head"><h2>Reel styles</h2><a href="/reels">View all →</a></div>
        <div className="mini-grid">
          {reels.map((r) => (<a key={r.id} className="mini-card" href={`/reels/create?reel=${r.id}`}>
              <Thumb cacheKey={`reel:${r.id}:${details.brideName}:${details.groomName}:${details.date}`} make={reelThumbJob(r, details)} alt={r.name}/>
              <span className="badge">▶ {REEL_KINDS[r.kind].label}</span>
              <b>{r.name}</b>
            </a>))}
        </div>
      </section>
      <SiteFooter />
    </main>);
}
