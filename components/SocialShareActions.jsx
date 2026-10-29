"use client";
import { useState } from "react";

function WhatsAppIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a9.8 9.8 0 0 0-8.4 14.9L2.5 21.5l4.8-1.1A9.8 9.8 0 1 0 12 2Zm0 17.8a8 8 0 0 1-4.1-1.2l-.3-.2-2.8.7.8-2.7-.2-.3A8 8 0 1 1 12 19.8Zm4.4-5.9c-.2-.1-1.3-.6-1.5-.7s-.4-.1-.5.1-.6.7-.7.8-.3.2-.5.1a6.4 6.4 0 0 1-1.9-1.2 7.2 7.2 0 0 1-1.3-1.7c-.1-.2 0-.3.1-.5l.3-.3c.1-.1.2-.2.2-.4s0-.3-.1-.4l-.7-1.6c-.2-.4-.4-.3-.5-.3h-.4c-.2 0-.4.1-.6.3s-.8.8-.8 2 .8 2.2 1 2.5a9.1 9.1 0 0 0 3.5 3.2c.5.2.9.4 1.2.5.5.2 1 .2 1.4.1.4-.1 1.3-.5 1.5-1s.2-.9.1-1-.2-.2-.4-.3Z" /></svg>; }
function InstagramIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.6" r=".8" fill="currentColor" stroke="none" /></svg>; }
function FacebookIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V4a22 22 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4.1v2H8v3h2.6v8h3.1Z" /></svg>; }


export default function SocialShareActions({ url, title, type = "invitation", createLink }) {
    const [open, setOpen] = useState(false);
    const [feedback, setFeedback] = useState("");
    async function shareTo(platform) {
        setFeedback("");
        const destination = window.open(platform === "Instagram" ? "https://www.instagram.com/direct/inbox/" : "about:blank", "_blank");
        if (destination) destination.opener = null;
        try {
            const link = url || await createLink();
            if (!link) { if (platform !== "Instagram") destination?.close(); return; }
            const message = link;
            if (platform === "Instagram") {
                try { await navigator.clipboard.writeText(message); setFeedback("Invitation link copied. Paste it in your Instagram message."); }
                catch { setFeedback("Copy the invitation link below and paste it in Instagram."); }
                if (!destination) window.location.assign("https://www.instagram.com/direct/inbox/");
            } else {
                const target = platform === "WhatsApp" ? "https://wa.me/?text=" + encodeURIComponent(message) : "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(link);
                if (destination) destination.location.replace(target);
                else window.location.assign(target);
            }
        } catch {
            if (platform !== "Instagram") destination?.close();
            setFeedback("Could not open sharing. Please try again.");
        }
    }
    async function copyLink() {
        try { await navigator.clipboard.writeText(url); setFeedback("Guest link copied."); }
        catch { setFeedback("Select and copy the guest link below."); }
    }
    return <section className="share" aria-label={"Share this " + type}>
      <button type="button" className="share-toggle whatsapp-share" aria-expanded={open} onClick={() => setOpen(true)}>Share</button>
      {open && <div className="share-social" aria-label="Share options">
        <button type="button" className="share-platform whatsapp-share" onClick={() => shareTo("WhatsApp")} aria-label="Share on WhatsApp"><WhatsAppIcon /><span>WhatsApp</span></button>
        <button type="button" className="share-platform instagram-share" onClick={() => shareTo("Instagram")} aria-label="Share on Instagram"><InstagramIcon /><span>Instagram</span></button>
        <button type="button" className="share-platform facebook-share" onClick={() => shareTo("Facebook")} aria-label="Share on Facebook"><FacebookIcon /><span>Facebook</span></button>
      </div>}
      {feedback && <p className="hint small share-feedback" role="status">{feedback}</p>}
      {url && <div className="guest-link-result">
        <a className="guest-link-anchor" aria-label="Guest link" href={url} target="_blank" rel="noreferrer">{url}</a>
        <div className="two-buttons"><button type="button" onClick={copyLink}>Copy guest link</button><a href={url} target="_blank" rel="noreferrer">Open invitation ↗</a></div>
      </div>}
    </section>;
}
