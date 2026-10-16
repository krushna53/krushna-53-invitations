"use client";

import { useEffect, useState } from "react";
import { formatInvitationDate, type InvitationData, type InvitationTemplate } from "@/lib/invitation-templates";

type SharedPayload = { data: InvitationData; template: InvitationTemplate; mode: "card" | "video" };
const fallback: SharedPayload = {
  data: { brideName: "Aarohi", groomName: "Reyansh", eventType: "Wedding & Reception", date: "2026-12-20", time: "16:30", venue: "The Gulmohar Palace", city: "Jaipur, Rajasthan", message: "Together with our families, we invite you to celebrate the beginning of our forever." },
  template: { id: "rajwada", name: "Rajwada Jharokha", mood: "Palace romance", colors: { paper: "#f4e5c9", ink: "#512d31", accent: "#b17a39", line: "#c59a5c" }, motif: "❧", animation: "curtain" }, mode: "video",
};

export default function SharedInvitationPreview() {
  const [payload, setPayload] = useState<SharedPayload | null>(null);
  const [playing, setPlaying] = useState(false);
  const [key, setKey] = useState(0);
  useEffect(() => {
    try {
      const raw = new URLSearchParams(window.location.search).get("invite");
      if (raw) {
        const parsed = JSON.parse(raw) as SharedPayload;
        if (parsed?.data?.brideName && parsed?.template?.colors?.paper) setPayload(parsed);
        else setPayload(fallback);
      } else setPayload(fallback);
    } catch { setPayload(fallback); }
  }, []);

  useEffect(() => {
    if (!payload || payload.mode !== "video") return;
    setPlaying(false);
    setKey((current) => current + 1);
    const timer = window.setTimeout(() => setPlaying(true), 180);
    return () => window.clearTimeout(timer);
  }, [payload]);

  function replay() { setPlaying(false); setKey((current) => current + 1); window.setTimeout(() => setPlaying(true), 80); }
  if (!payload) return <main className="shared-preview-page"><span className="shared-loading">Preparing your invitation…</span></main>;
  const { data, template } = payload;
  return <main className="shared-preview-page">
    <header className="shared-preview-header"><span className="shared-wordmark">✧ KRUSHNA 53</span><span>AN INVITATION FOR YOU</span></header>
    <div className="shared-stage-wrap">
      <p className="shared-overline">A CELEBRATION OF LOVE</p>
      {payload.mode === "card" ? <article className={`invitation-art shared-card art-${template.animation}`} style={{ "--paper": template.colors.paper, "--ink": template.colors.ink, "--accent": template.colors.accent, "--line": template.colors.line } as React.CSSProperties}><div className="art-frame"><span className="art-motif motif-top">{template.motif}</span><p className="art-overline">TOGETHER WITH OUR FAMILIES</p><p className="art-invite">joyfully invite you to celebrate</p><h3>{data.brideName}<i>&</i>{data.groomName}</h3><span className="art-divider">✦</span><p className="art-type">{data.eventType.toUpperCase()}</p><p className="art-date">{formatInvitationDate(data.date)}</p><p className="art-time">{data.time}</p><p className="art-venue">{data.venue}<small>{data.city}</small></p><p className="art-message">{data.message}</p><span className="art-motif motif-bottom">{template.motif}</span></div></article> : <div key={key} className={`video-stage shared-video-stage animation-${template.animation} ${playing ? "is-playing" : ""}`}>
        <div className="scene-backdrop" /><div className="scene-particles" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ "--particle": i, left: `${(i * 79 + 8) % 100}%`, top: `${(i * 53 + 13) % 100}%` } as React.CSSProperties}>{i % 3 === 0 ? template.motif : "✦"}</i>)}</div>
        <div className="video-curtain left" /><div className="video-curtain right" /><div className="story-envelope"><span>{template.motif}</span></div>
        <div className="video-card" style={{ "--paper": template.colors.paper, "--ink": template.colors.ink, "--accent": template.colors.accent } as React.CSSProperties}>
          <span>TOGETHER WITH OUR FAMILIES</span><h3>{data.brideName}<i>&</i>{data.groomName}</h3><b>{formatInvitationDate(data.date)}</b><small>{data.eventType.toUpperCase()} · {data.time}</small><p>{data.venue}<i>{data.city}</i></p><em>{data.message}</em>
        </div>
        <span className="story-chapter chapter-names">A NEW CHAPTER</span><span className="story-chapter chapter-date">THE DAY WE SAY “I DO”</span><span className="story-chapter chapter-venue">COME CELEBRATE WITH US</span><span className="video-hint">A LITTLE STORY, JUST FOR YOU</span>
      </div>}
      {payload.mode === "video" && <button className="shared-replay-button" onClick={replay}>↻ &nbsp; PLAY THE INVITATION AGAIN</button>}
      <p className="shared-template-caption">Designed with {template.name}</p>
    </div>
    <footer className="shared-preview-footer"><span>Made with love, shared with you.</span></footer>
  </main>;
}


