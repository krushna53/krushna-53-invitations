"use client";

import { useEffect, useMemo, useState } from "react";
import { formatInvitationDate, invitationTemplates, type InvitationData, type InvitationTemplate } from "@/lib/invitation-templates";

type OutputMode = "card" | "video";
const initial: InvitationData = {
  brideName: "Aarohi", groomName: "Reyansh", eventType: "Wedding & Reception", date: "2026-12-20", time: "16:30",
  venue: "The Gulmohar Palace", city: "Jaipur, Rajasthan", message: "Together with our families, we invite you to celebrate the beginning of our forever.",
};
const STORAGE_KEY = "vow-and-vine-custom-templates";

function InvitationNames({ data }: { data: InvitationData }) {
  return <h3>{data.brideName || "Bride’s name"}<i>&</i>{data.groomName || "Groom’s name"}</h3>;
}

function makeShareUrl(data: InvitationData, template: InvitationTemplate, mode: OutputMode) {
  const payload = JSON.stringify({ data, template, mode });
  const query = new URLSearchParams({ invite: payload }).toString();
  return `${window.location.origin}/preview?${query}`;
}

function downloadInvitationPdf(data: InvitationData, template: InvitationTemplate) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1680;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width: w, height: h } = canvas;
  const hex = (value: string) => /^#[\da-f]{6}$/i.test(value) ? value : "#c9aa7c";
  const paper = hex(template.colors.paper);
  const ink = hex(template.colors.ink);
  const accent = hex(template.colors.accent);
  const line = hex(template.colors.line);
  ctx.fillStyle = paper; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = line; ctx.lineWidth = 3; ctx.strokeRect(42, 42, w - 84, h - 84);
  ctx.lineWidth = 1.5; ctx.strokeRect(61, 61, w - 122, h - 122);

  const star = (x: number, y: number, radius: number) => {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = accent; ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = -Math.PI / 2 + i * Math.PI / 4;
      const r = i % 2 === 0 ? radius : radius * 0.28;
      const px = Math.cos(angle) * r; const py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.fill(); ctx.restore();
  };
  star(w / 2, 150, 16);

  const centered = (text: string, y: number, font: string, color = ink) => {
    ctx.font = font; ctx.fillStyle = color; ctx.textAlign = "center"; ctx.fillText(text, w / 2, y, w - 180);
  };
  centered("TOGETHER WITH OUR FAMILIES", 245, "600 23px Arial", accent);
  centered("joyfully invite you to celebrate", 340, "italic 34px 'Palatino Linotype', Georgia, serif", "#84715c");
  centered(data.brideName || "Bride’s name", 505, "italic 66px 'Palatino Linotype', Georgia, serif");
  centered("&", 590, "italic 42px 'Brush Script MT', cursive", accent);
  centered(data.groomName || "Groom’s name", 675, "italic 66px 'Palatino Linotype', Georgia, serif");
  star(w / 2, 745, 10);
  centered(data.eventType.toUpperCase(), 835, "600 28px Arial", accent);
  centered(formatInvitationDate(data.date), 925, "44px 'Palatino Linotype', Georgia, serif");
  centered(data.time || "Time", 990, "30px Arial", "#8d795e");
  centered(data.venue || "Venue", 1090, "42px 'Palatino Linotype', Georgia, serif");
  centered(data.city || "City", 1150, "28px Arial", "#867a66");

  ctx.font = "italic 29px 'Palatino Linotype', Georgia, serif"; ctx.fillStyle = "#796c5e"; ctx.textAlign = "center";
  const words = (data.message || "").split(/\s+/); const lines: string[] = []; let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > 760 && current) { lines.push(current); current = word; }
    else current = candidate;
  }
  if (current) lines.push(current);
  lines.slice(0, 4).forEach((text, index) => ctx.fillText(text, w / 2, 1280 + index * 42));
  star(w / 2, h - 112, 13);

  const jpeg = atob(canvas.toDataURL("image/jpeg", 0.96).split(",")[1]);
  const imageBytes = new Uint8Array(jpeg.length);
  for (let i = 0; i < jpeg.length; i++) imageBytes[i] = jpeg.charCodeAt(i);
  const encoder = new TextEncoder();
  const parts: Uint8Array[] = [encoder.encode("%PDF-1.4\n")];
  const offsets = [0]; let length = parts[0].length;
  const addObject = (id: number, content: Uint8Array[]) => {
    offsets[id] = length;
    const chunk = [encoder.encode(`${id} 0 obj\n`), ...content, encoder.encode("\nendobj\n")];
    parts.push(...chunk); length += chunk.reduce((sum, item) => sum + item.length, 0);
  };
  addObject(1, [encoder.encode("<< /Type /Catalog /Pages 2 0 R >>")]);
  addObject(2, [encoder.encode("<< /Type /Pages /Kids [3 0 R] /Count 1 >>")]);
  addObject(3, [encoder.encode("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 360 504] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>")]);
  const content = encoder.encode("q\n360 0 0 504 0 0 cm\n/Im0 Do\nQ");
  addObject(4, [encoder.encode(`<< /Length ${content.length} >>\nstream\n`), content, encoder.encode("\nendstream")]);
  addObject(5, [encoder.encode(`<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`), imageBytes, encoder.encode("\nendstream")]);
  const xrefOffset = length;
  const xref = [`xref\n0 6\n0000000000 65535 f \n`, ...offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)].join("");
  parts.push(encoder.encode(`${xref}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`));
  const blob = new Blob(parts.map((part) => part.buffer as ArrayBuffer), { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = `${(data.brideName || "wedding").trim()}-${(data.groomName || "invitation").trim()}-invitation.pdf`.replace(/[^\w-]+/g, "-");
  link.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function InvitationBuilder() {
  const [data, setData] = useState<InvitationData>(initial);
  const [customTemplates, setCustomTemplates] = useState<InvitationTemplate[]>([]);
  const [templateId, setTemplateId] = useState("rajwada");
  const [output, setOutput] = useState<OutputMode>("card");
  const [created, setCreated] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [showTemplateMaker, setShowTemplateMaker] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateMotif, setNewTemplateMotif] = useState("❀");
  const [newAnimation, setNewAnimation] = useState<InvitationTemplate["animation"]>("petals");
  const [newPaper, setNewPaper] = useState("#f4e8d8");
  const [newInk, setNewInk] = useState("#49373a");
  const [newAccent, setNewAccent] = useState("#b47765");
  const templates = useMemo(() => [...invitationTemplates, ...customTemplates], [customTemplates]);
  const template = templates.find((item) => item.id === templateId) ?? invitationTemplates[0];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCustomTemplates(JSON.parse(saved) as InvitationTemplate[]);
    } catch { /* Ignore malformed local drafts and keep the built-in designs available. */ }
  }, []);

  function update<K extends keyof InvitationData>(key: K, value: InvitationData[K]) {
    setData((current) => ({ ...current, [key]: value }));
    setCreated(false); setShareUrl(""); setPlaying(false);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreated(true); setCopied(false);
    const url = makeShareUrl(data, template, output);
    setShareUrl(url);
    if (output === "video") { setPlaying(false); setPlayKey((key) => key + 1); window.setTimeout(() => setPlaying(true), 80); }
    window.setTimeout(() => document.getElementById("generated-preview")?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
  }

  function chooseTemplate(id: string) {
    setTemplateId(id); setCreated(false); setShareUrl(""); setPlaying(false); setPlayKey((key) => key + 1);
  }

  function addCustomTemplate() {
    const cleanName = newTemplateName.trim();
    if (!cleanName) return;
    const custom: InvitationTemplate = {
      id: `custom-${Date.now()}`, name: cleanName, mood: "Your palette · custom motion",
      colors: { paper: newPaper, ink: newInk, accent: newAccent, line: newAccent }, motif: newTemplateMotif, animation: newAnimation,
    };
    const next = [...customTemplates, custom];
    setCustomTemplates(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setTemplateId(custom.id); setShowTemplateMaker(false); setNewTemplateName(""); setCreated(false); setShareUrl("");
  }

  async function copyShareLink() {
    if (!shareUrl) return;
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); }
    catch { window.prompt("Copy your invitation link:", shareUrl); }
  }

  function playPreview() {
    setPlaying(false);
    setPlayKey((key) => key + 1);
    window.setTimeout(() => setPlaying(true), 80);
  }

  return (
    <main className="builder-page">
      <header className="builder-topbar"><a className="builder-brand" href="#top"><span>✧</span> KRUSHNA 53</a><span className="builder-top-note">YOUR DAY, BEAUTIFULLY TOLD</span><a className="builder-top-link" href="#templates">Explore the studio ↓</a></header>
      <section className="builder-hero" id="top"><div className="builder-eyebrow"><span /> A LITTLE STUDIO FOR YOUR BIG DAY</div><h1>Make an invitation<br /><em>that feels like you.</em></h1><p>Choose an original design, add your story, and make a keepsake card or a cinematic invitation reveal.</p></section>

      <div className="builder-layout">
        <form className="builder-form" onSubmit={submit}>
          <section className="builder-step" id="templates">
            <div className="builder-step-head"><span className="step-index">01</span><div><small>START WITH A FEELING</small><h2>Choose your design</h2></div></div>
            <div className="template-grid">{templates.map((item) => <button type="button" key={item.id} className={`template-choice ${templateId === item.id ? "is-selected" : ""}`} onClick={() => chooseTemplate(item.id)} aria-pressed={templateId === item.id}>
              <span className={`template-swatch swatch-${item.id}`} style={{ "--sw-paper": item.colors.paper, "--sw-ink": item.colors.ink, "--sw-accent": item.colors.accent } as React.CSSProperties}><i>{item.motif}</i><b>A <small>&</small> R</b><em>THE WEDDING DAY</em></span><span className="template-info"><b>{item.name}</b><small>{item.mood}</small></span><span className="template-selected">{templateId === item.id ? "✓" : ""}</span>
            </button>)}</div>
            <button type="button" className="template-maker-toggle" onClick={() => setShowTemplateMaker((value) => !value)}>{showTemplateMaker ? "− Close template maker" : "＋ Make your own template"}</button>
            {showTemplateMaker && <div className="template-maker">
              <label>DESIGN NAME<input required maxLength={26} value={newTemplateName} onChange={(e) => setNewTemplateName(e.target.value)} placeholder="e.g. Monsoon Mehfil" /></label>
              <label>ORNAMENT<select value={newTemplateMotif} onChange={(e) => setNewTemplateMotif(e.target.value)}><option>❀</option><option>✦</option><option>❧</option><option>♡</option><option>✺</option><option>☾</option></select></label>
              <label className="template-motion-field">MOTION<select value={newAnimation} onChange={(e) => setNewAnimation(e.target.value as InvitationTemplate["animation"])}><option value="curtain">Palace curtains</option><option value="petals">Falling petals</option><option value="moonlight">Moonlit reveal</option><option value="envelope">Opening letter</option><option value="saffron">Saffron drape</option></select></label>
              <div className="palette-fields"><label>PAPER<input type="color" value={newPaper} onChange={(e) => setNewPaper(e.target.value)} /></label><label>INK<input type="color" value={newInk} onChange={(e) => setNewInk(e.target.value)} /></label><label>ACCENT<input type="color" value={newAccent} onChange={(e) => setNewAccent(e.target.value)} /></label></div>
              <button className="add-template-button" type="button" onClick={addCustomTemplate}>SAVE MY DESIGN <span>✦</span></button><small>Saved in this browser and included in your invitation share link.</small>
            </div>}
          </section>

          <section className="builder-step"><div className="builder-step-head"><span className="step-index">02</span><div><small>THE PEOPLE & THE PLAN</small><h2>Tell your story</h2></div></div>
            <div className="builder-fields two-fields"><label>BRIDE’S NAME<input required maxLength={40} value={data.brideName} onChange={(e) => update("brideName", e.target.value)} placeholder="e.g. Aarohi" /></label><label>GROOM’S NAME<input required maxLength={40} value={data.groomName} onChange={(e) => update("groomName", e.target.value)} placeholder="e.g. Reyansh" /></label></div>
            <label className="builder-field">WHAT ARE YOU CELEBRATING?<select value={data.eventType} onChange={(e) => update("eventType", e.target.value as InvitationData["eventType"])}><option>Wedding & Reception</option><option>Wedding</option><option>Reception</option></select></label>
            <div className="builder-fields two-fields"><label>DATE<input required type="date" value={data.date} onChange={(e) => update("date", e.target.value)} /></label><label>START TIME<input required type="time" value={data.time} onChange={(e) => update("time", e.target.value)} /></label></div>
            <div className="builder-fields two-fields"><label>VENUE<input required maxLength={80} value={data.venue} onChange={(e) => update("venue", e.target.value)} placeholder="Venue name" /></label><label>CITY<input required maxLength={60} value={data.city} onChange={(e) => update("city", e.target.value)} placeholder="City, region" /></label></div>
            <label className="builder-field">A NOTE FOR YOUR GUESTS<textarea rows={3} maxLength={180} value={data.message} onChange={(e) => update("message", e.target.value)} /></label>
          </section>

          <section className="builder-step output-step"><div className="builder-step-head"><span className="step-index">03</span><div><small>HOW WILL YOU SHARE IT?</small><h2>Choose your keepsake</h2></div></div>
            <div className="output-choices"><button type="button" onClick={() => { setOutput("card"); setCreated(false); setShareUrl(""); setPlaying(false); }} className={output === "card" ? "output-choice active" : "output-choice"} aria-pressed={output === "card"}><span className="output-icon">▤</span><b>Invitation card</b><small>Print-ready design and a guest link</small></button><button type="button" onClick={() => { setOutput("video"); setCreated(false); setShareUrl(""); setPlaying(false); }} className={output === "video" ? "output-choice active" : "output-choice"} aria-pressed={output === "video"}><span className="output-icon">✧</span><b>Animated story</b><small>Template-led reveal with a shareable link</small></button></div>
            <button type="submit" className="create-button">CREATE MY {output === "card" ? "INVITATION CARD" : "ANIMATED STORY"}<span>↗</span></button><p className="builder-submit-note">Create a link your guests can open on their phone.</p>
          </section>
        </form>

        <aside className="builder-preview-column"><div className="preview-sticky">{output === "video" && <div className="preview-caption"><div><span>LIVE PREVIEW · {template.name.toUpperCase()}</span><h2>Your story in motion</h2></div><span className="live-dot" /></div>}
          <div id="generated-preview" className={`invitation-preview-shell ${output === "video" && playing ? "is-playing" : ""}`}>
            {output === "card" ? <article className={`invitation-art art-${template.animation}`} style={{ "--paper": template.colors.paper, "--ink": template.colors.ink, "--accent": template.colors.accent, "--line": template.colors.line } as React.CSSProperties}><div className="art-frame"><span className="art-motif motif-top">{template.motif}</span><p className="art-overline">TOGETHER WITH OUR FAMILIES</p><p className="art-invite">joyfully invite you to celebrate</p><InvitationNames data={data} /><span className="art-divider">✦</span><p className="art-type">{data.eventType.toUpperCase()}</p><p className="art-date">{formatInvitationDate(data.date)}</p><p className="art-time">{data.time || "Time"}</p><p className="art-venue">{data.venue || "Venue"}<small>{data.city || "City"}</small></p><p className="art-message">{data.message}</p><span className="art-motif motif-bottom">{template.motif}</span></div></article>
              : <div key={`${template.id}-${playKey}`} className={`video-stage animation-${template.animation}`}><div className="scene-backdrop" /><div className="scene-particles" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ "--particle": i, left: `${(i * 79 + 8) % 100}%`, top: `${(i * 53 + 13) % 100}%` } as React.CSSProperties}>{i % 3 === 0 ? template.motif : "✦"}</i>)}</div><div className="video-curtain left" /><div className="video-curtain right" /><div className="story-envelope"><span>{template.motif}</span></div><div className="video-card" style={{ "--paper": template.colors.paper, "--ink": template.colors.ink, "--accent": template.colors.accent } as React.CSSProperties}><span>TOGETHER WITH OUR FAMILIES</span><InvitationNames data={data} /><b>{formatInvitationDate(data.date)}</b><small>{data.eventType.toUpperCase()} · {data.time}</small><p>{data.venue || "Venue"}<i>{data.city || "City"}</i></p><em>{data.message}</em></div><span className="story-chapter chapter-names">A NEW CHAPTER</span><span className="story-chapter chapter-date">THE DAY WE SAY “I DO”</span><span className="story-chapter chapter-venue">COME CELEBRATE WITH US</span><span className="video-hint">{playing ? "A LITTLE STORY, JUST FOR YOU" : "YOUR ANIMATION PREVIEW"}</span></div>}
          </div>
          <div className="preview-actions">{output === "card" ? <button type="button" onClick={() => downloadInvitationPdf(data, template)}>↓  DOWNLOAD INVITATION PDF</button> : <button type="button" onClick={playPreview}>{playing ? "↻  REPLAY STORY" : "▶  PLAY STORY PREVIEW"}</button>}</div>
          {created && shareUrl && <div className="share-link-box"><div><b>Your guest link is ready</b><small>Anyone with this link can open the invitation.</small></div><button type="button" onClick={copyShareLink}>{copied ? "COPIED ✓" : "COPY LINK ↗"}</button><label className="share-url-label">SHARE URL<input readOnly value={shareUrl} onClick={(event) => event.currentTarget.select()} /></label><a href={shareUrl} target="_blank" rel="noreferrer">OPEN GUEST INVITATION ↗</a></div>}
        </div></aside>
      </div>
      <footer className="builder-footer"><span>KRUSHNA 53</span><small>ORIGINAL DESIGNS · MADE TO BE YOURS</small><a href="#top">Back to the studio ↑</a></footer>
    </main>
  );
}


