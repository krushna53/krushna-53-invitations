"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { defaultJourney, findReelTemplate, reelDesign } from "@/lib/reels";

const ReelCanvas = dynamic(() => import("@/components/ReelCanvas"), {
  ssr: false,
  loading: () => <div className="full-journey-demo-loading" aria-label="Loading wedding journey" />,
});

export default function WeddingJourneyLiveDemo() {
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const template = findReelTemplate("wedding-journey");
  const details = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 75);
    return {
      brideName: "Aarohi",
      groomName: "Reyansh",
      date: date.toISOString().slice(0, 10),
      time: "16:30",
      venue: "The Gulmohar Palace",
      city: "Jaipur",
      title: "Our Wedding Journey",
      hostLine: "Together with their families",
      message: "Join us for every special moment.",
      blessing: "With love and joy",
    };
  }, []);
  const design = useMemo(() => ({
    ...reelDesign(template, 1),
    palette: { deep: "#1e1b4b", sky: "#5548a8", accent: "#eecb7b", flower: "#ff6b57", text: "#fff8ea" },
  }), [template]);
  const events = useMemo(
    () => defaultJourney(template.journey, details.date, details.venue),
    [template.journey, details.date, details.venue]
  );

  return <main className="full-journey-demo">
    <ReelCanvas kind="journey" design={design} details={details} events={events} photoSrcs={[]} playing={opened} muted loop className="invite-canvas full-screen-journey-canvas" />
    {!opened && <button type="button" className={`journey-demo-opening${opening ? " is-opening" : ""}`} onClick={() => setOpening(true)} onAnimationEnd={(event) => { if (event.animationName === "journey-cover-open") setOpened(true); }} aria-label="Tap to open the wedding journey">
      <span className="journey-demo-plaque">
        <span className="journey-demo-plaque-ornament" aria-hidden="true">✧</span>
        <span className="journey-demo-plaque-kicker">AAROHI &amp; REYANSH</span>
        <span className="journey-demo-plaque-rule" aria-hidden="true" />
        <span className="journey-demo-plaque-title">Tap to open</span>
        <span className="journey-demo-plaque-rule" aria-hidden="true" />
        <span className="journey-demo-plaque-date">A WEDDING JOURNEY</span>
        <span className="journey-demo-plaque-hint">HALDI · MEHNDI · SANGEET · WEDDING · RECEPTION</span>
      </span>
    </button>}
    <a className="full-journey-demo-close" href="/" aria-label="Close demo and return home">×</a>
  </main>;
}
