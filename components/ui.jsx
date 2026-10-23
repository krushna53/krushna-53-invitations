"use client";
import { useEffect, useState } from "react";
export function Segmented({ value, options, onChange, label }) {
    return (<div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((o) => (<button type="button" key={o.id} role="radio" aria-checked={value === o.id} className={value === o.id ? "on" : ""} onClick={() => onChange(o.id)}>{o.label}</button>))}
    </div>);
}
export function download(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
}
const NAV = [
    { href: "/", label: "Home" },
    { href: "/templates", label: "Card templates" },
    { href: "/reels", label: "Reels" },
    { href: "/create", label: "Create my own" },
];
export function BrandLogo({ size = 28 }) {
    return (<span className="brand-logo">
      <img className="brand-mark" src="/everymoment-icon.svg" width={size} height={size} alt=""/>
      <span className="brand-wordmark">EveryMoment</span>
    </span>);
}
export function SiteHeader({ active }) {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (!open)
            return;
        const close = (e) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", close);
        return () => window.removeEventListener("keydown", close);
    }, [open]);
    return (<header className={`studio-top${open ? " menu-open" : ""}`}>
      <a className="brand" href="/" aria-label="EveryMoment Wedding home"><BrandLogo /><small>Wedding</small></a>
      <button type="button" className="menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((o) => !o)}>
        <span /><span /><span />
      </button>
      <nav id="site-nav" className="site-nav" aria-label="Main">
        {NAV.map((n) => (<a key={n.href} href={n.href} className={active === n.href ? "on" : ""} onClick={() => setOpen(false)}>{n.label}</a>))}
      </nav>
    </header>);
}
const FOOTER_COLUMNS = [
    { title: "Cards", links: [{ href: "/templates", label: "Card templates" }, { href: "/create", label: "Create my own card" }, { href: "/templates?event=wedding", label: "Wedding cards" }] },
    { title: "Video", links: [{ href: "/reels", label: "Video reels" }, { href: "/reels/create", label: "Make a reel" }] },
    { title: "Contact", links: [{ href: "https://everymoment.in/contact", label: "Contact us" }] },
    { title: "EveryMoment", links: [{ href: "https://everymoment.in/", label: "everymoment.in" }] },
];
export function SiteFooter() {
    return (<footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <a href="/" aria-label="EveryMoment Wedding home"><BrandLogo size={30}/></a>
          <p>Wedding cards and video invites for every ceremony, ready to share on WhatsApp.</p>
        </div>
        {FOOTER_COLUMNS.map((col) => (<div key={col.title} className="site-footer-col">
            <h3>{col.title}</h3>
            {col.links.map((l) => (<a key={l.href} href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>{l.label}</a>))}
          </div>))}
      </div>
      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} EveryMoment. All rights reserved.</span>
        <span>Made with ♥ for your celebration</span>
      </div>
    </footer>);
}
export const DRAFT_KEY = "krushna53-invite-draft-v2";
/** Names/date typed anywhere in the studio are reused on the other pages. */
export function readSavedDetails() {
    try {
        const raw = localStorage.getItem(DRAFT_KEY);
        const details = raw ? (JSON.parse(raw).details ?? null) : null;
        // couple photo uploads were removed from cards: never bring an old photo back
        return details ? { ...details, couplePhoto: undefined } : null;
    }
    catch {
        return null;
    }
}
/** Colour-option dots for a design (each dot previews deep / highlight / flower / gold). */
export function ColorwayDots({ colorways, value, onChange, size = "md" }) {
    return (<div className={`cw-dots ${size}`} role="radiogroup" aria-label="Colour options">
      {colorways.map((c, i) => (<button type="button" key={c.name} role="radio" aria-checked={value === i} title={c.name} aria-label={c.name} className={value === i ? "on" : ""} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(i); }}>
          <i style={{ background: `conic-gradient(${c.palette.deep} 0 50%, ${c.palette.flower} 50% 75%, ${c.palette.accent} 75% 88%, ${c.palette.sky} 88%)` }}/>
          {size === "lg" && <span>{c.name}</span>}
        </button>))}
    </div>);
}
