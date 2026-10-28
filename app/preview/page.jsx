"use client";
import { useEffect, useState } from "react";
import InviteCanvas from "@/components/InviteCanvas";
import ReelCanvas from "@/components/ReelCanvas";
import { reelDuration } from "@/lib/reels";
import { lighten } from "@/lib/color";
import { EVENT_PRESETS, designForEvent, formatInviteDate } from "@/lib/invite-design";
import { generateMusic } from "@/lib/music";
import { decodeShare } from "@/lib/share";
import { ContactBand, WhatsAppLink } from "@/components/ui";
function fromLegacy(raw) {
    try {
        const old = JSON.parse(raw);
        if (!old?.data?.brideName || !old.template?.colors)
            return null;
        const kind = old.data.eventType === "Reception" ? "reception" : "wedding";
        const c = old.template.colors;
        const design = { ...designForEvent(kind), palette: { deep: c.paper, sky: lighten(c.paper, 0.35), accent: c.accent, flower: c.line, text: c.ink } };
        const details = { ...old.data, title: old.data.eventType, hostLine: EVENT_PRESETS[kind].hostLine };
        return { v: 2, mode: old.mode, design, details };
    }
    catch {
        return null;
    }
}
export default function GuestInvitation() {
    const [payload, setPayload] = useState(null);
    const [opened, setOpened] = useState(false);
    const [restartKey, setRestartKey] = useState(0);
    const [music, setMusic] = useState(null);
    const [muted, setMuted] = useState(false);
    useEffect(() => {
        (async () => {
            const hash = new URLSearchParams(window.location.hash.slice(1)).get("i");
            if (hash)
                return setPayload((await decodeShare(hash)) ?? "missing");
            const legacy = new URLSearchParams(window.location.search).get("invite");
            setPayload(legacy ? fromLegacy(legacy) ?? "missing" : "missing");
        })();
    }, []);
    useEffect(() => {
        if (!payload || payload === "missing" || payload.mode !== "video" || payload.music === "none")
            return;
        const seconds = payload.reel ? reelDuration(payload.reel.kind, payload.reel.events.length, payload.reel.photos.length) : undefined;
        generateMusic(payload.music ?? "calm", seconds).then(setMusic).catch(() => setMusic(null));
    }, [payload]);
    if (payload === null)
        return <main className="guest"><p className="guest-loading">Preparing your invitation…</p></main>;
    if (payload === "missing")
        return <main className="guest"><div className="guest-missing"><h1>This invitation link looks incomplete</h1><p>Please ask the hosts to send the link again.</p><a href="/">Create your own invitation</a></div></main>;
    const { design, details, mode } = payload;
    const title = `${details.title} · ${details.brideName} & ${details.groomName}`;
    return (<main className="guest" style={{ "--g-deep": design.palette.deep, "--g-accent": design.palette.accent }}>
      <title>{title}</title>
      <div className="guest-contact"><WhatsAppLink /></div>
      <div className="guest-stage">
        {payload.reel ? (<ReelCanvas kind={payload.reel.kind} design={design} details={details} events={payload.reel.events} photoSrcs={payload.reel.photos} playing={opened} restartKey={restartKey} music={music} muted={muted} loop={false} className="invite-canvas"/>) : (<InviteCanvas design={design} details={details} mode={mode} playing={mode === "video" && opened} restartKey={restartKey} music={music} muted={muted} loop={false} className="invite-canvas"/>)}
        {mode === "video" && !opened && (<button type="button" className="guest-open" onClick={() => { setOpened(true); setRestartKey((k) => k + 1); }}>
            <span className="seal">✦</span>
            <b>You&rsquo;re invited</b>
            <small>Tap to open · sound on</small>
          </button>)}
      </div>
      <div className="guest-actions">
        {mode === "video" && opened && <button type="button" onClick={() => setRestartKey((k) => k + 1)}>↻ Play again</button>}
        {mode === "video" && opened && <button type="button" onClick={() => { setMuted((m) => !m); setRestartKey((k) => k + 1); }}>{muted ? "🔇 Sound off" : "🔊 Sound on"}</button>}
        {details.venue && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${details.venue}, ${details.city}`)}`} target="_blank" rel="noreferrer">📍 Directions</a>}
      </div>
      <p className="guest-caption">{formatInviteDate(details.date)} · {details.venue}</p>
      <ContactBand />
      <footer className="guest-footer">Made with <a href="/"><img src="/everymoment-icon.svg" width="14" height="14" alt=""/>EveryMoment</a></footer>
    </main>);
}
