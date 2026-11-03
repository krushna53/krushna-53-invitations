"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { defaultJourney, findReelTemplate, reelDesign } from "@/lib/reels";

const ReelCanvas = dynamic(() => import("@/components/ReelCanvas"), {
  ssr: false,
  loading: () => <div className="home-demo-canvas-loading" aria-label="Loading live journey demo" />,
});

export default function HomeJourneyDemo() {
  const [playing, setPlaying] = useState(true);
  const [restartKey, setRestartKey] = useState(0);
  const details = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 75);
    const weddingDate = date.toISOString().slice(0, 10);
    return {
      brideName: "Aarohi",
      groomName: "Reyansh",
      date: weddingDate,
      time: "16:30",
      venue: "The Gulmohar Palace",
      city: "Jaipur",
      title: "Our Wedding Journey",
      hostLine: "Together with their families",
      message: "Join us for every special moment.",
      blessing: "With love and joy",
    };
  }, []);
  const template = findReelTemplate("wedding-journey");
  const design = useMemo(() => ({
    ...reelDesign(template, 1),
    palette: { deep: "#1e1b4b", sky: "#5548a8", accent: "#eecb7b", flower: "#ff6b57", text: "#fff8ea" },
  }), [template]);
  const events = useMemo(() => defaultJourney(template.journey, details.date, details.venue), [template.journey, details.date, details.venue]);

  return <section className="home-live-demo" id="live-demo" aria-labelledby="home-live-demo-title">
    <div className="home-live-demo-inner">
      <div className="home-live-demo-copy">
        <p className="eyebrow">A LIVE PREVIEW</p>
        <h2 id="home-live-demo-title">One wedding. <em>Every moment.</em></h2>
        <p>See a sample journey through Haldi, Mehndi, Sangeet, the Wedding and Reception. Your own event details and chosen design bring every scene to life.</p>
        <div className="home-journey-tags" aria-label="Demo celebrations">
          {events.map((event) => <span key={event.kind}>{event.kind}</span>)}
        </div>
        <div className="home-live-demo-actions">
          <button type="button" className="home-demo-control" onClick={() => { if (playing) setPlaying(false); else { setPlaying(true); setRestartKey((key) => key + 1); } }}>{playing ? "Ⅱ Pause demo" : "▶ Play demo"}</button>
          <a className="home-demo-link" href="/reels/create?reel=wedding-journey">Make a wedding journey →</a>
        </div>
        <small className="home-demo-note">Sample names and event details shown for demonstration.</small>
      </div>
      <div className="home-demo-phone" aria-label="Animated wedding journey preview">
        <ReelCanvas kind="journey" design={design} details={details} events={events} photoSrcs={[]} playing={playing} restartKey={restartKey} muted loop className="invite-canvas" />
      </div>
    </div>
  </section>;
}
