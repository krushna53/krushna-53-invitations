"use client";
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
export function SiteHeader({ active }) {
    return (<header className="studio-top">
      <a className="brand" href="/" aria-label="EveryMoment Studio home"><img className="brand-mark" src="/everymoment-icon.png" width="26" height="26" alt=""/><span className="brand-wordmark">EveryMoment</span><small>Studio</small></a>
      <nav className="site-nav" aria-label="Main">
        {NAV.map((n) => (<a key={n.href} href={n.href} className={active === n.href ? "on" : ""}>{n.label}</a>))}
      </nav>
    </header>);
}
export function SiteFooter() {
    return <footer className="studio-footer"><span className="brand-wordmark"><img className="brand-mark footer-brand-mark" src="/everymoment-icon.png" width="22" height="22" alt=""/>EveryMoment</span><small>Made with EveryMoment</small></footer>;
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
