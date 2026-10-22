"use client";

export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button type="button" key={o.id} role="radio" aria-checked={value === o.id} className={value === o.id ? "on" : ""} onClick={() => onChange(o.id)}>{o.label}</button>
      ))}
    </div>
  );
}

export function download(blob: Blob, name: string) {
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

export function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="studio-top">
      <a className="brand" href="/"><span>✧</span> KRUSHNA 53</a>
      <nav className="site-nav" aria-label="Main">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} className={active === n.href ? "on" : ""}>{n.label}</a>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return <footer className="studio-footer"><span>KRUSHNA 53</span><small>ORIGINAL DESIGNS · MADE TO BE YOURS</small></footer>;
}

export const DRAFT_KEY = "krushna53-invite-draft-v2";

/** Names/date typed anywhere in the studio are reused on the other pages. */
export function readSavedDetails<T>(): T | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    const details = raw ? ((JSON.parse(raw) as { details?: T }).details ?? null) : null;
    // couple photo uploads were removed from cards: never bring an old photo back
    return details ? ({ ...details, couplePhoto: undefined } as T) : null;
  } catch {
    return null;
  }
}

type Swatch = { name: string; palette: { deep: string; sky: string; accent: string; flower: string } };

/** Colour-option dots for a design (each dot previews deep / highlight / flower / gold). */
export function ColorwayDots({ colorways, value, onChange, size = "md" }: { colorways: Swatch[]; value: number; onChange: (i: number) => void; size?: "md" | "lg" }) {
  return (
    <div className={`cw-dots ${size}`} role="radiogroup" aria-label="Colour options">
      {colorways.map((c, i) => (
        <button
          type="button"
          key={c.name}
          role="radio"
          aria-checked={value === i}
          title={c.name}
          aria-label={c.name}
          className={value === i ? "on" : ""}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(i); }}
        >
          <i style={{ background: `conic-gradient(${c.palette.deep} 0 50%, ${c.palette.flower} 50% 75%, ${c.palette.accent} 75% 88%, ${c.palette.sky} 88%)` }} />
          {size === "lg" && <span>{c.name}</span>}
        </button>
      ))}
    </div>
  );
}
