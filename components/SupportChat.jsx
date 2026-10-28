"use client";
import { useEffect, useRef, useState } from "react";
import { WhatsAppLink } from "@/components/ui";
import { WHATSAPP_URL } from "@/lib/contact";

function ChatIcon() {
    return <><svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z" /></svg><span className="support-chat-status" aria-hidden="true" /></>;
}
export default function SupportChat() {
    const [open, setOpen] = useState(false);
    const launcher = useRef(null);
    const panel = useRef(null);
    const closeButton = useRef(null);
    const close = () => { setOpen(false); launcher.current?.focus(); };
    useEffect(() => {
        if (!open) return;
        closeButton.current?.focus();
        const dismiss = (event) => {
            if (event.key === "Escape") { setOpen(false); launcher.current?.focus(); }
        };
        const outside = (event) => {
            if (!panel.current?.contains(event.target) && !launcher.current?.contains(event.target)) setOpen(false);
        };
        const mobile = window.matchMedia("(max-width: 600px)");
        const resized = () => { if (mobile.matches) setOpen(false); };
        mobile.addEventListener("change", resized);
        document.addEventListener("keydown", dismiss);
        document.addEventListener("pointerdown", outside);
        return () => {
            mobile.removeEventListener("change", resized);
            document.removeEventListener("keydown", dismiss);
            document.removeEventListener("pointerdown", outside);
        };
    }, [open]);
    return <div className="support-chat">
      {open && <section ref={panel} id="support-chat-panel" className="support-chat-panel" role="dialog" aria-modal="false" aria-labelledby="support-chat-title">
        <header className="support-chat-header">
          <span className="support-chat-avatar" aria-hidden="true">K</span>
          <div><h2 id="support-chat-title">Krushna Web Works</h2><p><span />Online</p></div>
          <button ref={closeButton} type="button" className="support-chat-close" onClick={close} aria-label="Close chat">×</button>
        </header>
        <div className="support-chat-body">
          <p>Have a question or run into an issue? We’re happy to help.</p>
          <WhatsAppLink className="support-chat-whatsapp">Chat on WhatsApp</WhatsAppLink>
        </div>
      </section>}
      <button ref={launcher} type="button" className="support-chat-launcher support-chat-desktop" aria-label={open ? "Close chat" : "Chat with us"} aria-expanded={open} aria-controls="support-chat-panel" onClick={() => open ? close() : setOpen(true)}><ChatIcon /></button>
      <a className="support-chat-launcher support-chat-mobile" href={WHATSAPP_URL} aria-label="Chat with us on WhatsApp"><ChatIcon /></a>
    </div>;
}
