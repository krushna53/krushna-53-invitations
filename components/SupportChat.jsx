"use client";

import { WHATSAPP_URL } from "@/lib/contact";

function WhatsAppIcon() {
    return <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a9.8 9.8 0 0 0-8.4 14.9L2.5 21.5l4.8-1.1A9.8 9.8 0 1 0 12 2Zm0 17.8a8 8 0 0 1-4.1-1.2l-.3-.2-2.8.7.8-2.7-.2-.3A8 8 0 1 1 12 19.8Zm4.4-5.9c-.2-.1-1.3-.6-1.5-.7s-.4-.1-.5.1-.6.7-.7.8-.3.2-.5.1a6.4 6.4 0 0 1-1.9-1.2 7.2 7.2 0 0 1-1.3-1.7c-.1-.2 0-.3.1-.5l.3-.3c.1-.1.2-.2.2-.4s0-.3-.1-.4l-.7-1.6c-.2-.4-.4-.3-.5-.3h-.4c-.2 0-.4.1-.6.3s-.8.8-.8 2 .8 2.2 1 2.5a9.1 9.1 0 0 0 3.5 3.2c.5.2.9.4 1.2.5.5.2 1 .2 1.4.1.4-.1 1.3-.5 1.5-1s.2-.9.1-1-.2-.2-.4-.3Z" /></svg>;
}

export default function SupportChat() {
    return <div className="support-chat"><a className="support-chat-launcher" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Chat with EveryMoment on WhatsApp"><WhatsAppIcon /></a></div>;
}
