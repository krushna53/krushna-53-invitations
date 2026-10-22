// Reel templates: multi-shot 9:16 videos built on the same scenes and card renderer.
// Every reel is generated automatically from the couple's details (and photos / event list).
import { alpha, darken, isLight, lighten, luminance, mix } from "./color";
import { type Ctx, H, W, clamp01, easeInOut, easeOut, glow, goldGradient, lotus, progress, rng, roundRect, sparkle } from "./draw-kit";
import {
  EVENT_ORDER, EVENT_PRESETS, FONT_PAIRS, formatInviteDate, formatInviteTime, type EventKind, type IntroStyle, type InviteDesign,
  type InviteDetails, type Palette, type ParticleStyle,
} from "./invite-design";
import { InviteRenderer } from "./renderer";
import { artReady } from "./painted";
import { DESIGNS, designFromDef, designOf, designsFor, findDesign, traditionOf } from "./designs";
import { type Scene } from "./scenes";

type Img = HTMLImageElement | HTMLCanvasElement | ImageBitmap;

export type ReelKind = "classic" | "envelope" | "doors" | "savedate" | "scroll" | "journey" | "photos" | "cinematic";
export type ReelEvent = { kind: EventKind; date: string; time: string; venue: string };

export const REEL_KINDS: Record<ReelKind, { label: string; blurb: string; needs?: "photos" | "events" }> = {
  classic: { label: "Classic reveal", blurb: "The invitation card comes alive: opening, frame, gold title, then every detail." },
  envelope: { label: "Envelope opening", blurb: "A sealed envelope opens and the card glides out to fill the screen." },
  doors: { label: "Palace doors", blurb: "Carved palace doors swing open in a burst of light to reveal the invitation." },
  scroll: { label: "Royal scroll", blurb: "A parchment scroll unrolls over the scene and the wording writes itself in." },
  savedate: { label: "Save the date", blurb: "Big date tiles flip in, then your names, then the full invitation." },
  journey: { label: "Wedding journey", blurb: "One reel for every function: Haldi, Mehndi, Sangeet, Wedding, Reception.", needs: "events" },
  photos: { label: "Photo story", blurb: "Your photos as a cinematic slideshow, ending on the invitation.", needs: "photos" },
  cinematic: { label: "Cinematic trailer", blurb: "Movie-trailer titles, light leaks and a big name reveal." },
};

export type ReelTemplate = {
  id: string;
  name: string;
  kind: ReelKind;
  event: EventKind;
  /** Design id from lib/designs.ts and which of its colourways to start with. */
  design: string;
  colorway: number;
  intro?: IntroStyle;
  particles?: ParticleStyle;
  journey?: EventKind[];
};

/** For every ceremony: 7 reels, each pairing a different design with a different animation. */
const PER_EVENT: { kind: ReelKind; d: number; cw: number }[] = [
  { kind: "classic", d: 1, cw: 0 },
  { kind: "envelope", d: 0, cw: 1 },
  { kind: "doors", d: 2, cw: 0 },
  { kind: "savedate", d: 3, cw: 0 },
  { kind: "scroll", d: 1, cw: 2 },
  { kind: "cinematic", d: 2, cw: 1 },
  { kind: "photos", d: 3, cw: 2 },
];
const INTRO_CYCLE: IntroStyle[] = ["petal-burst", "curtain", "bloom"];

export const REEL_TEMPLATES: ReelTemplate[] = [
  ...EVENT_ORDER.flatMap((event, ei) =>
    PER_EVENT.map(({ kind, d, cw }) => {
      const def = designsFor(event)[d];
      return {
        id: `${event}-${kind}`,
        name: `${REEL_KINDS[kind].label} · ${def.name}`,
        kind, event, design: def.id, colorway: cw,
        intro: kind === "classic" ? INTRO_CYCLE[ei % INTRO_CYCLE.length] : undefined,
      } satisfies ReelTemplate;
    }),
  ),
  // Ceremony specific reels use the general designs in the public picker.
  ...DESIGNS.filter((d) => d.wording && !d.tradition).map((def, i) => {
    const kinds: ReelKind[] = ["doors", "scroll", "envelope", "classic", "cinematic", "savedate"];
    const kind = kinds[i % kinds.length];
    return { id: `${def.id}-${kind}`, name: `${REEL_KINDS[kind].label} · ${def.name}`, kind, event: def.event, design: def.id, colorway: 0, intro: kind === "classic" ? INTRO_CYCLE[i % 3] : undefined } satisfies ReelTemplate;
  }),
  // premium artwork designs, each with its own animation
  ...([["noir-foil", "doors"], ["ruby-engraving", "scroll"], ["ivory-botanical", "savedate"], ["royal-mandala", "cinematic"], ["pastel-garden", "envelope"], ["celestial-night", "classic"], ["tropical-haldi", "photos"]] as [string, ReelKind][]).map(([id, kind], i) => {
    const def = findDesign(id)!;
    return { id: `${id}-${kind}`, name: `${REEL_KINDS[kind].label} · ${def.name}`, kind, event: def.event, design: id, colorway: i % 2, intro: kind === "classic" ? "bloom" : undefined } satisfies ReelTemplate;
  }),
  { id: "wedding-journey", name: "The Wedding Journey", kind: "journey", event: "wedding", design: "noir-foil", colorway: 1, journey: ["haldi", "mehndi", "sangeet", "wedding", "reception"] },
  { id: "pre-wedding-trail", name: "Pre-wedding Trail", kind: "journey", event: "sangeet", design: "sangeet-disco", colorway: 0, journey: ["haldi", "mehndi", "sangeet"] },
];

export const reelTradition = (r: ReelTemplate) => { const d = findDesign(r.design); return d ? traditionOf(d) : "Pan-Indian"; };

export const findReelTemplate = (id: string | null | undefined) => REEL_TEMPLATES.find((r) => r.id === id);

export function reelDesign(tpl: ReelTemplate, colorway = tpl.colorway): InviteDesign {
  const def = findDesign(tpl.design) ?? designsFor(tpl.event)[0];
  const d = designFromDef(def, colorway);
  return { ...d, intro: tpl.intro ?? d.intro, particles: tpl.particles ?? d.particles };
}

/** Sensible default dates for each function, counted from the wedding date. */
export function defaultJourney(kinds: EventKind[], weddingDate: string, venue: string): ReelEvent[] {
  const offsets: Record<EventKind, [number, string]> = {
    haldi: [-2, "10:00"], mehndi: [-1, "16:00"], sangeet: [-1, "20:00"], engagement: [-30, "18:00"], wedding: [0, "16:30"], reception: [1, "19:30"],
  };
  const base = new Date((weddingDate || "2026-12-20") + "T12:00:00");
  return kinds.map((kind) => {
    const d = new Date(base);
    d.setDate(d.getDate() + offsets[kind][0]);
    return { kind, date: d.toISOString().slice(0, 10), time: offsets[kind][1], venue };
  });
}

export type ReelInput = {
  kind: ReelKind;
  design: InviteDesign;
  details: InviteDetails;
  events: ReelEvent[];
  photos: Img[];
  art?: Img | null;
  photo?: Img | null;
};

const PHOTO_SECONDS = 3.2;
const SHOT_SECONDS = 4.2;
const CAPTIONS = ["How it all began", "Every moment with you", "Two hearts, one dream", "Our favourite adventure", "Forever starts now", "Together, always"];

export function reelDuration(kind: ReelKind, nEvents: number, nPhotos: number) {
  switch (kind) {
    case "classic": return 16;
    case "envelope": return 16;
    case "doors": return 16;
    case "scroll": return 15;
    case "savedate": return 18;
    case "cinematic": return 19;
    case "journey": return 3 + Math.max(1, nEvents) * SHOT_SECONDS + 4.5;
    case "photos": return 2.6 + Math.max(3, nPhotos) * PHOTO_SECONDS + 9.6;
  }
}

/** Gold that reads well on dark overlays, even when a palette's "gold" is a deep brown. */
const brightGold = (accent: string) => (luminance(accent) < 0.22 ? mix(accent, "#f5c451", 0.75) : accent);
const shade = (p: Palette) => (isLight(p.deep) ? mix(p.flower, "#2a0d05", 0.72) : darken(p.deep, 0.75));

function makeCanvas(w = W, h = H) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

export class ReelRenderer {
  private ctx: CanvasRenderingContext2D;
  private card: InviteRenderer;
  private cardCanvas: HTMLCanvasElement;
  private input: ReelInput | null = null;
  private sceneCache = new Map<string, HTMLCanvasElement>();

  constructor(public canvas: HTMLCanvasElement) {
    canvas.width = W;
    canvas.height = H;
    this.ctx = canvas.getContext("2d")!;
    this.cardCanvas = makeCanvas();
    this.card = new InviteRenderer(this.cardCanvas);
  }

  setInput(input: ReelInput) {
    this.input = input;
    this.card.setInput({ design: input.design, details: input.details, art: input.art, photo: input.photo });
  }

  get duration() {
    const i = this.input;
    return i ? reelDuration(i.kind, i.events.length, i.photos.length) : 16;
  }

  /** A representative moment for gallery thumbnails. */
  get posterTime() {
    switch (this.input?.kind) {
      case "envelope": return 4.3;
      case "doors": return 2.2;
      case "scroll": return 7.5;
      case "savedate": return 6.6;
      case "journey": return 3 + SHOT_SECONDS + 2.6;
      case "photos": return 2.3;
      case "cinematic": return 7.8;
      default: return 13;
    }
  }

  // ───────── helpers ─────────
  private fonts() { return FONT_PAIRS[this.input!.design.fonts]; }

  private scene(id: string, sc: Scene, pal: Palette) {
    const art = findDesign(id)?.art;
    const key = `${id}|${JSON.stringify(pal)}|${art ? artReady(art) : ""}`;
    let c = this.sceneCache.get(key);
    if (!c) {
      c = makeCanvas();
      sc.still(c.getContext("2d")!, pal);
      this.sceneCache.set(key, c);
      if (this.sceneCache.size > 12) this.sceneCache.delete(this.sceneCache.keys().next().value!);
    }
    return c;
  }

  /** Draw the design's illustrated scene (the couple's chosen design, or another ceremony's first design). */
  private drawScene(d: Pick<InviteDesign, "event" | "scene">, pal: Palette, t: number, zoom: number) {
    const ctx = this.ctx;
    const def = designOf(d);
    ctx.save();
    ctx.translate(W / 2, H * 0.45);
    ctx.scale(zoom, zoom);
    ctx.translate(-W / 2, -H * 0.45);
    ctx.drawImage(this.scene(def.id, def.scene, pal), 0, 0);
    def.scene.live(ctx, pal, t);
    ctx.restore();
  }

  private drawCover(img: Img, zoom: number, panX: number) {
    const ctx = this.ctx;
    const iw = (img as HTMLImageElement).naturalWidth || img.width;
    const ih = (img as HTMLImageElement).naturalHeight || img.height;
    const s = Math.max(W / iw, H / ih) * zoom;
    ctx.drawImage(img, W / 2 - (iw * s) / 2 + panX, H / 2 - (ih * s) / 2, iw * s, ih * s);
  }

  private radialBg(pal: Palette) {
    const ctx = this.ctx;
    const g = ctx.createRadialGradient(W / 2, H * 0.45, 60, W / 2, H * 0.5, H * 0.75);
    if (isLight(pal.deep)) {
      g.addColorStop(0, mix(shade(pal), pal.flower, 0.35));
      g.addColorStop(1, darken(shade(pal), 0.35));
    } else {
      g.addColorStop(0, mix(pal.deep, pal.sky, 0.35));
      g.addColorStop(1, darken(pal.deep, 0.4));
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  private sparkles(t: number, seed: number, color: string, count = 30) {
    const r = rng(seed);
    for (let i = 0; i < count; i++) {
      const x = r() * W, y = r() * H, ph = r() * 6, sz = 6 + r() * 12;
      sparkle(this.ctx, x, (y - t * 14 + H) % H, sz, color, Math.max(0, Math.sin(t * 1.4 + ph)) * 0.8);
    }
  }

  private fit(font: (s: number) => string, text: string, size: number, min: number, maxW: number) {
    let s = size;
    this.ctx.font = font(s);
    while (s > min && this.ctx.measureText(text).width > maxW) { s -= 3; this.ctx.font = font(s); }
    return s;
  }

  private caps(text: string, y: number, size: number, color: string, spacing: number, a = 1, reveal = 1) {
    const ctx = this.ctx;
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha *= a;
    ctx.font = `500 ${size}px ${this.fonts().caps}`;
    ctx.fillStyle = color;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    const chars = [...text];
    const widths = chars.map((c) => ctx.measureText(c).width);
    let total = widths.reduce((s, w) => s + w, 0) + spacing * (chars.length - 1);
    let sp = spacing;
    if (total > W - 120) { sp = Math.max(0, spacing - (total - (W - 120)) / chars.length); total = widths.reduce((s, w) => s + w, 0) + sp * (chars.length - 1); }
    let x = W / 2 - total / 2;
    const shown = Math.ceil(chars.length * reveal);
    chars.forEach((c, i) => {
      if (i < shown) {
        const local = clamp01(chars.length * reveal - i);
        ctx.globalAlpha = a * local;
        ctx.fillText(c, x, y);
      }
      x += widths[i] + sp;
    });
    ctx.restore();
  }

  private gold(text: string, y: number, font: string, accent: string, a = 1, wipe = 1, lightText = true) {
    const ctx = this.ctx;
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha *= a;
    ctx.font = font;
    ctx.textAlign = "center";
    const m = ctx.measureText(text);
    const hgt = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
    const g = ctx.createLinearGradient(0, y - hgt, 0, y + 10);
    if (lightText) { g.addColorStop(0, lighten(accent, 0.55)); g.addColorStop(0.55, accent); g.addColorStop(1, lighten(accent, 0.2)); }
    else { g.addColorStop(0, lighten(accent, 0.1)); g.addColorStop(1, darken(accent, 0.3)); }
    if (wipe < 1) {
      ctx.beginPath();
      ctx.rect(W / 2 - m.width / 2 - 40, y - hgt - 60, (m.width + 80) * wipe, hgt + 140);
      ctx.clip();
    }
    ctx.shadowColor = alpha("#000000", 0.45);
    ctx.shadowBlur = 18;
    ctx.fillStyle = g;
    ctx.fillText(text, W / 2, y);
    ctx.restore();
    if (wipe > 0 && wipe < 1) sparkle(ctx, W / 2 - m.width / 2 + m.width * wipe, y - hgt / 2, 26, "#fffbe8", 1);
  }

  private plain(text: string, y: number, font: string, color: string, a = 1) {
    const ctx = this.ctx;
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha *= a;
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.fillStyle = color;
    ctx.shadowColor = alpha("#000000", 0.5);
    ctx.shadowBlur = 14;
    ctx.fillText(text, W / 2, y);
    ctx.restore();
  }

  private names() {
    const d = this.input!.details;
    return `${d.brideName || "Bride"} & ${d.groomName || "Groom"}`;
  }

  private drawCard(localT: number, scale = 1, cx = W / 2, cy = H / 2, a = 1) {
    const ctx = this.ctx;
    this.card.draw(Math.max(0, localT), { skipIntro: true, skipOutro: true });
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha *= a;
    if (scale >= 0.999) ctx.drawImage(this.cardCanvas, 0, 0);
    else {
      const w = W * scale, h = H * scale;
      ctx.shadowColor = alpha("#000000", 0.45);
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 18;
      roundRect(ctx, cx - w / 2, cy - h / 2, w, h, 26 * scale + 6);
      ctx.fillStyle = "#000";
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.save();
      roundRect(ctx, cx - w / 2, cy - h / 2, w, h, 26 * scale + 6);
      ctx.clip();
      ctx.drawImage(this.cardCanvas, cx - w / 2, cy - h / 2, w, h);
      ctx.restore();
    }
    ctx.restore();
  }

  // ───────── reels ─────────
  private envelope(t: number) {
    const ctx = this.ctx;
    const pal = this.input!.design.palette;
    const grow = easeInOut(progress(t, 4.6, 1.6));
    const cardLocal = t - 4.2;
    if (grow >= 1) { this.drawCard(cardLocal); return; }

    this.radialBg(pal);
    this.sparkles(t, 7, lighten(pal.accent, 0.5));
    const appear = easeOut(progress(t, 0.2, 1.0));
    const ew = 820, eh = 560;
    const ecx = W / 2, ecy = 1180 + (1 - appear) * 300 + grow * 900;
    const x0 = ecx - ew / 2, y0 = ecy - eh / 2;
    const body = mix(pal.flower, pal.deep, 0.4);
    const envA = appear * (1 - grow);

    ctx.save();
    ctx.globalAlpha = envA;
    // back of envelope
    ctx.fillStyle = darken(body, 0.35);
    roundRect(ctx, x0, y0, ew, eh, 18);
    ctx.fill();
    ctx.restore();

    const flapP = easeInOut(progress(t, 2.0, 1.0));
    const f = 1 - 2 * flapP;
    const drawFlap = () => {
      ctx.save();
      ctx.globalAlpha = envA;
      ctx.fillStyle = f > 0 ? darken(body, 0.08) : darken(body, 0.25);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x0 + ew, y0);
      ctx.lineTo(ecx, y0 + f * eh * 0.58);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = alpha(pal.accent, 0.8);
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    };
    if (f < 0) drawFlap();

    // card rising out of the envelope
    const rise = easeInOut(progress(t, 3.0, 1.6));
    if (rise > 0) {
      const s = 0.4 + 0.6 * grow;
      const startY = ecy + 40;
      const risenY = ecy - 560;
      const cy = startY + (risenY - startY) * rise + (H / 2 - risenY) * grow;
      this.drawCard(cardLocal, s, W / 2, cy, 1);
    }

    // front pocket
    ctx.save();
    ctx.globalAlpha = envA;
    const g = ctx.createLinearGradient(0, y0, 0, y0 + eh);
    g.addColorStop(0, lighten(body, 0.08));
    g.addColorStop(1, darken(body, 0.15));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x0, y0 + 40);
    ctx.lineTo(ecx, y0 + eh * 0.56);
    ctx.lineTo(x0 + ew, y0 + 40);
    ctx.lineTo(x0 + ew, y0 + eh - 18);
    ctx.quadraticCurveTo(x0 + ew, y0 + eh, x0 + ew - 18, y0 + eh);
    ctx.lineTo(x0 + 18, y0 + eh);
    ctx.quadraticCurveTo(x0, y0 + eh, x0, y0 + eh - 18);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = alpha(pal.accent, 0.85);
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.strokeStyle = alpha(pal.accent, 0.4);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x0 + 22, y0 + eh * 0.62, ew - 44, eh * 0.38 - 22);
    // little lettering on the envelope
    ctx.font = `400 64px ${this.fonts().script}`;
    ctx.textAlign = "center";
    ctx.fillStyle = lighten(pal.accent, 0.3);
    ctx.fillText(this.names(), ecx, y0 + eh * 0.86);
    ctx.restore();
    if (f >= 0) drawFlap();

    // wax seal
    const sealP = progress(t, 1.6, 0.6);
    if (sealP < 1) {
      ctx.save();
      ctx.globalAlpha = envA * (1 - sealP);
      const sc = 1 + sealP * 0.6;
      const sy = y0 + eh * 0.58;
      ctx.translate(ecx, sy);
      ctx.scale(sc, sc);
      const sg = ctx.createRadialGradient(-12, -12, 4, 0, 0, 62);
      sg.addColorStop(0, lighten(darken(pal.flower, 0.25), 0.25));
      sg.addColorStop(1, darken(pal.flower, 0.5));
      ctx.fillStyle = sg;
      ctx.beginPath();
      for (let i = 0; i <= 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        const rr = 60 + (i % 2 ? 4 : -2);
        if (i === 0) ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); else ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      ctx.fill();
      lotus(ctx, 0, 14, 30, lighten(pal.accent, 0.3));
      ctx.restore();
    }
    if (t > 1.6 && t < 2.6) for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2, d = (t - 1.6) * 260;
      sparkle(ctx, ecx + Math.cos(a) * d, y0 + eh * 0.58 + Math.sin(a) * d, 18, "#fffbe8", 1 - (t - 1.6));
    }
  }

  private saveDate(t: number) {
    const ctx = this.ctx;
    const { design, details } = this.input!;
    const pal = design.palette;
    const out = easeInOut(progress(t, 8.0, 1.0));
    if (out > 0) this.drawCard(t - 8.0 + 1.0, 1, W / 2, H / 2, out);
    if (out >= 1) return;

    ctx.save();
    ctx.globalAlpha = 1 - out;
    const z = 1.1 - 0.08 * easeOut(t / 8) + out * 0.06;
    this.drawScene(design, pal, t, z);
    ctx.fillStyle = alpha(isLight(pal.deep) ? shade(pal) : darken(pal.deep, 0.5), 0.66 * easeOut(progress(t, 0, 1)) + 0.1);
    ctx.fillRect(0, 0, W, H);
    this.sparkles(t, 3, lighten(pal.accent, 0.5), 24);

    const acc = lighten(brightGold(pal.accent), 0.35);
    this.caps("SAVE THE DATE", 560, 58, acc, 14, 1, easeOut(progress(t, 0.6, 1.4)));
    const lp = easeOut(progress(t, 1.8, 0.6));
    ctx.strokeStyle = goldGradient(ctx, 300, 0, 780, 0, pal.accent);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 220 * lp, 615); ctx.lineTo(W / 2 + 220 * lp, 615);
    ctx.stroke();

    const d = new Date((details.date || "2026-12-20") + "T12:00:00");
    const valid = !Number.isNaN(d.getTime());
    const tiles = valid
      ? [
          { top: d.toLocaleDateString("en-IN", { weekday: "long" }).toUpperCase(), big: String(d.getDate()).padStart(2, "0"), font: `600 170px ${this.fonts().serif}` },
          { top: "MONTH", big: d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(), font: `500 104px ${this.fonts().caps}` },
          { top: "YEAR", big: String(d.getFullYear()), font: `600 112px ${this.fonts().serif}` },
        ]
      : [{ top: "", big: "—", font: `600 150px ${this.fonts().serif}` }];
    const tw = 280, th = 320, gap = 26;
    const startX = W / 2 - (tiles.length * tw + (tiles.length - 1) * gap) / 2;
    tiles.forEach((tile, i) => {
      const p = easeOut(progress(t, 2.3 + i * 0.45, 0.7));
      if (p <= 0) return;
      const x = startX + i * (tw + gap), y = 720;
      ctx.save();
      ctx.translate(x + tw / 2, y + th / 2);
      ctx.scale(1, p);
      ctx.globalAlpha = (1 - out) * p;
      roundRect(ctx, -tw / 2, -th / 2, tw, th, 24);
      ctx.fillStyle = alpha(darken(pal.deep, 0.55), 0.6);
      ctx.fill();
      ctx.strokeStyle = goldGradient(ctx, -tw / 2, 0, tw / 2, 0, pal.accent);
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.textAlign = "center";
      ctx.fillStyle = acc;
      ctx.font = `500 26px ${this.fonts().caps}`;
      ctx.fillText(tile.top, 0, -th / 2 + 54);
      ctx.fillStyle = "#fffaf0";
      ctx.font = tile.font;
      ctx.shadowColor = alpha("#000", 0.4);
      ctx.shadowBlur = 12;
      ctx.fillText(tile.big, 0, 62);
      ctx.restore();
      if (p > 0.9 && p < 1) sparkle(ctx, x + tw - 20, y + 20, 22, "#fffbe8", 1);
    });

    const nameFont = (s: number) => `400 ${s}px ${this.fonts().script}`;
    const ns = this.fit(nameFont, this.names(), 150, 80, 940);
    this.gold(this.names(), 1280, nameFont(ns), brightGold(pal.accent), 1, easeInOut(progress(t, 4.3, 1.4)));
    const verb = design.event === "wedding" ? "are getting married" : design.event === "engagement" ? "are getting engaged" : `invite you to the ${EVENT_PRESETS[design.event].title}`;
    this.plain(verb, 1370, `italic 500 46px ${this.fonts().serif}`, "#fff6e8", easeOut(progress(t, 5.3, 0.9)));
    const where = [details.city, formatInviteTime(details.time)].filter(Boolean).join(" · ").toUpperCase();
    this.caps(where, 1450, 28, acc, 6, easeOut(progress(t, 6.0, 0.9)));
    ctx.restore();
  }

  private journey(t: number) {
    const ctx = this.ctx;
    const { design, details, events } = this.input!;
    const pal = design.palette;
    const list = events.length ? events : [{ kind: design.event, date: details.date, time: details.time, venue: details.venue }];
    const endStart = 3 + list.length * SHOT_SECONDS;

    // intro
    if (t < 3.6) {
      this.radialBg(pal);
      this.sparkles(t, 11, lighten(pal.accent, 0.5), 26);
      const acc = lighten(brightGold(pal.accent), 0.35);
      lotus(ctx, W / 2, 660, 40, alpha(pal.accent, easeOut(progress(t, 0.1, 0.8))));
      this.caps("THE WEDDING OF", 780, 40, acc, 12, 1, easeOut(progress(t, 0.3, 1.0)));
      const nf = (s: number) => `400 ${s}px ${this.fonts().script}`;
      this.gold(this.names(), 940, nf(this.fit(nf, this.names(), 150, 80, 940)), brightGold(pal.accent), 1, easeInOut(progress(t, 0.8, 1.4)));
      this.caps(`${list.length} CELEBRATIONS · ONE LOVE STORY`, 1040, 26, "#fff3e0", 6, easeOut(progress(t, 1.8, 0.8)));
    }

    list.forEach((ev, i) => {
      const s = 3 + i * SHOT_SECONDS;
      if (t < s || t > s + SHOT_SECONDS + 0.7) return;
      const fadeIn = easeOut(progress(t, s, 0.6));
      const ep = EVENT_PRESETS[ev.kind];
      const same = ev.kind === design.event;
      const edef = same ? designOf(design) : designsFor(ev.kind)[0];
      const epal = same ? pal : edef.colorways[0].palette;
      const u = (t - s) / SHOT_SECONDS;
      ctx.save();
      ctx.globalAlpha = fadeIn;
      this.drawScene({ event: ev.kind, scene: edef.id }, epal, t, 1.12 - 0.1 * easeOut(u));
      const gr = ctx.createLinearGradient(0, 1050, 0, H);
      const sh = shade(epal);
      gr.addColorStop(0, alpha(sh, 0));
      gr.addColorStop(0.35, alpha(sh, 0.8));
      gr.addColorStop(1, alpha(darken(sh, 0.2), 0.94));
      ctx.fillStyle = gr;
      ctx.fillRect(0, 1050, W, H - 1050);
      const acc = lighten(brightGold(epal.accent), 0.4);
      this.caps(`${String(i + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}`, 1250, 26, acc, 8, easeOut(progress(t, s + 0.3, 0.6)));
      const tf = (sz: number) => `400 ${sz}px ${FONT_PAIRS[design.fonts].script}`;
      this.gold(ep.title, 1400, tf(this.fit(tf, ep.title, 150, 90, 900)), brightGold(epal.accent), 1, easeInOut(progress(t, s + 0.5, 1.0)));
      this.caps(formatInviteDate(ev.date).toUpperCase(), 1490, 30, "#fff6e6", 5, easeOut(progress(t, s + 1.1, 0.7)));
      const line = [formatInviteTime(ev.time), ev.venue].filter(Boolean).join(" · ");
      const lf = (sz: number) => `italic 500 ${sz}px ${this.fonts().serif}`;
      this.plain(line, 1560, lf(this.fit(lf, line, 42, 28, 920)), "#fff6e6", easeOut(progress(t, s + 1.4, 0.7)));
      ctx.restore();
    });

    // closing
    if (t >= endStart) {
      const p = easeOut(progress(t, endStart, 0.7));
      ctx.save();
      ctx.globalAlpha = p;
      this.radialBg(pal);
      this.sparkles(t, 19, lighten(pal.accent, 0.5), 30);
      const nf = (s: number) => `400 ${s}px ${this.fonts().script}`;
      this.gold(this.names(), 860, nf(this.fit(nf, this.names(), 150, 80, 940)), brightGold(pal.accent), 1, easeInOut(progress(t, endStart + 0.3, 1.2)));
      this.plain("can't wait to celebrate with you", 960, `italic 500 48px ${this.fonts().serif}`, "#fff6e8", easeOut(progress(t, endStart + 1.2, 0.8)));
      const tag = `#${(details.brideName || "").replace(/\s+/g, "")}Weds${(details.groomName || "").replace(/\s+/g, "")}`;
      this.caps(tag.toUpperCase(), 1060, 30, lighten(brightGold(pal.accent), 0.35), 4, easeOut(progress(t, endStart + 1.8, 0.8)));
      ctx.restore();
    }
  }

  private photosReel(t: number) {
    const ctx = this.ctx;
    const { design, photos } = this.input!;
    const pal = design.palette;
    const list: Img[] = photos.length ? photos : designsFor(design.event).slice(1, 4).map((d) => this.scene(d.id, d.scene, d.colorways[0].palette));
    const n = Math.max(3, list.length);
    const cardStart = 2.6 + n * PHOTO_SECONDS;

    if (t < 3.2) {
      this.radialBg(pal);
      this.sparkles(t, 23, lighten(pal.accent, 0.5), 24);
      this.caps("OUR STORY", 820, 50, lighten(brightGold(pal.accent), 0.35), 16, 1, easeOut(progress(t, 0.2, 1.0)));
      const nf = (s: number) => `400 ${s}px ${this.fonts().script}`;
      this.gold(this.names(), 980, nf(this.fit(nf, this.names(), 140, 80, 940)), brightGold(pal.accent), 1, easeInOut(progress(t, 0.7, 1.2)));
      this.plain("a love story in pictures", 1070, `italic 500 44px ${this.fonts().serif}`, "#fff6e8", easeOut(progress(t, 1.4, 0.8)));
    }

    for (let i = 0; i < n; i++) {
      const s = 2.6 + i * PHOTO_SECONDS;
      if (t < s || t > s + PHOTO_SECONDS + 0.7) continue;
      const img = list[i % list.length];
      const fadeIn = easeOut(progress(t, s, 0.7));
      const u = (t - s) / (PHOTO_SECONDS + 0.7);
      ctx.save();
      ctx.globalAlpha = fadeIn;
      this.drawCover(img, 1.04 + 0.1 * u, (i % 2 ? -1 : 1) * (u - 0.5) * 60);
      const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.72);
      v.addColorStop(0, alpha("#000", 0)); v.addColorStop(1, alpha("#000", 0.5));
      ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
      const gr = ctx.createLinearGradient(0, 1350, 0, H);
      gr.addColorStop(0, alpha("#000", 0)); gr.addColorStop(1, alpha(shade(pal), 0.88));
      ctx.fillStyle = gr; ctx.fillRect(0, 1350, W, H - 1350);
      ctx.strokeStyle = alpha(lighten(pal.accent, 0.3), 0.9);
      ctx.lineWidth = 3; ctx.strokeRect(40, 40, W - 80, H - 80);
      ctx.lineWidth = 1.5; ctx.strokeRect(54, 54, W - 108, H - 108);
      const cap = CAPTIONS[i % CAPTIONS.length];
      this.gold(cap, 1680, `400 96px ${this.fonts().script}`, brightGold(pal.accent), 1, easeInOut(progress(t, s + 0.5, 1.0)));
      ctx.restore();
    }

    if (t >= cardStart) {
      const p = easeOut(progress(t, cardStart, 0.8));
      this.drawCard(t - cardStart + 1.0, 1, W / 2, H / 2, p);
    }
  }

  private cinematic(t: number) {
    const ctx = this.ctx;
    const { design, details } = this.input!;
    const pal = design.palette;
    const cardStart = 9.2;
    if (t >= cardStart + 0.5) { this.drawCard(t - cardStart + 1.0); }
    else {
      ctx.fillStyle = "#050304";
      ctx.fillRect(0, 0, W, H);
      const sceneA = 0.5 * easeOut(progress(t, 4.6, 2.0));
      if (sceneA > 0) {
        ctx.save();
        ctx.globalAlpha = sceneA;
        this.drawScene(design, pal, t, 1.25 - 0.12 * easeOut(progress(t, 4.6, 4.6)));
        ctx.restore();
      }
      // light leaks
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      glow(ctx, -200 + t * 120, 500 + Math.sin(t) * 100, 700, "#ff9a3c", 0.18);
      glow(ctx, W + 200 - t * 90, 1400, 600, lighten(pal.accent, 0.2), 0.16);
      ctx.restore();
      const acc = lighten(brightGold(pal.accent), 0.4);
      const d = new Date((details.date || "") + "T12:00:00");
      const month = Number.isNaN(d.getTime()) ? "THIS SEASON" : `THIS ${d.toLocaleDateString("en-IN", { month: "long" }).toUpperCase()}`;
      const l1 = easeOut(progress(t, 0.6, 0.8)) * (1 - easeOut(progress(t, 2.4, 0.6)));
      ctx.save(); ctx.translate(W / 2, 960); const z1 = 1 + 0.06 * progress(t, 0.6, 2.4); ctx.scale(z1, z1); ctx.translate(-W / 2, -960);
      this.caps(month, 975, 66, "#fff4e2", 18, l1);
      ctx.restore();
      const l2 = easeOut(progress(t, 3.0, 0.8)) * (1 - easeOut(progress(t, 5.0, 0.6)));
      const l3 = easeOut(progress(t, 3.6, 0.8)) * (1 - easeOut(progress(t, 5.0, 0.6)));
      this.caps("TWO FAMILIES", 900, 60, "#fff4e2", 16, l2);
      this.caps("ONE CELEBRATION", 1000, 60, acc, 16, l3);
      const np = easeOut(progress(t, 5.6, 1.6));
      if (np > 0) {
        ctx.save();
        ctx.translate(W / 2, 940);
        const z = 1.3 - 0.3 * np;
        ctx.scale(z, z);
        ctx.translate(-W / 2, -940);
        const nf = (s: number) => `400 ${s}px ${this.fonts().script}`;
        this.gold(this.names(), 990, nf(this.fit(nf, this.names(), 160, 80, 900)), brightGold(pal.accent), np);
        ctx.restore();
        this.caps(details.title.toUpperCase(), 1100, 32, "#fff4e2", 10, easeOut(progress(t, 7.4, 0.8)));
        if (t > 7.0 && t < 8.2) sparkle(ctx, 140 + (t - 7) * 700, 930, 34, "#fffbe8", 1);
      }
      const bars = 170 * (1 - easeInOut(progress(t, 8.6, 0.8)));
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, bars);
      ctx.fillRect(0, H - bars, W, bars);
      // film grain-ish flicker
      const r = rng(Math.floor(t * 24));
      ctx.fillStyle = alpha("#ffffff", 0.025);
      for (let i = 0; i < 60; i++) ctx.fillRect(r() * W, r() * H, 2, 2);
    }
    if (t > cardStart - 0.2 && t < cardStart + 0.9) {
      if (t < cardStart + 0.5) this.drawCard(t - cardStart + 1.0, 1, W / 2, H / 2, easeOut(progress(t, cardStart - 0.1, 0.6)));
      const f = 1 - Math.abs((t - (cardStart + 0.25)) / 0.6);
      if (f > 0) { ctx.fillStyle = alpha("#fff8ec", clamp01(f) * 0.85); ctx.fillRect(0, 0, W, H); }
    }
  }

  private doors(t: number) {
    const ctx = this.ctx;
    const pal = this.input!.design.palette;
    const open = easeInOut(progress(t, 1.5, 1.9));
    const cardLocal = t - 1.4;
    this.drawCard(cardLocal);
    if (open >= 1) return;
    // light spilling through the opening
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    glow(ctx, W / 2, H / 2, 300 + open * 900, "#fff1c8", 0.55 * Math.sin(open * Math.PI));
    ctx.restore();
    const wood = mix(isLight(pal.deep) ? shade(pal) : pal.deep, "#3a1a0a", 0.35);
    const gold = brightGold(pal.accent);
    for (const side of [0, 1]) {
      ctx.save();
      ctx.translate(side ? W : 0, 0);
      ctx.scale((side ? -1 : 1) * (1 - open * 0.94), 1);
      const dw = W / 2;
      const g = ctx.createLinearGradient(0, 0, dw, 0);
      g.addColorStop(0, darken(wood, 0.25)); g.addColorStop(0.5, wood); g.addColorStop(1, lighten(wood, 0.08));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, dw + 2, H);
      ctx.strokeStyle = goldGradient(ctx, 0, 0, dw, 0, gold);
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, dw - 60, H - 60);
      // two carved arch panels
      for (const [y0, h] of [[90, 900], [1040, 790]] as const) {
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(80, y0 + h); ctx.lineTo(80, y0 + 190);
        ctx.quadraticCurveTo(80, y0, dw / 2, y0 + 40);
        ctx.quadraticCurveTo(dw - 80, y0, dw - 80, y0 + 190);
        ctx.lineTo(dw - 80, y0 + h); ctx.closePath(); ctx.stroke();
        lotus(ctx, dw / 2, y0 + h / 2 + 60, 60, alpha(gold, 0.85));
      }
      ctx.fillStyle = gold;
      for (let y = 70; y < H - 40; y += 120) for (const x of [55, dw - 55]) { ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill(); }
      // ring handle
      ctx.lineWidth = 7;
      ctx.beginPath(); ctx.arc(dw - 70, 1000, 34, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = alpha("#000000", open * 0.55);
      ctx.fillRect(0, 0, dw + 2, H);
      ctx.restore();
    }
    // monogram seal across the seam before opening
    const sealA = 1 - easeOut(progress(t, 1.0, 0.6));
    const fadeIn = easeOut(progress(t, 0, 0.7));
    if (sealA > 0) {
      ctx.save();
      ctx.globalAlpha = sealA * fadeIn;
      const d = this.input!.details;
      ctx.fillStyle = darken(wood, 0.3);
      ctx.beginPath(); ctx.arc(W / 2, 1000, 120, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = goldGradient(ctx, W / 2 - 120, 0, W / 2 + 120, 0, gold); ctx.lineWidth = 6; ctx.stroke();
      ctx.font = `400 96px ${this.fonts().script}`;
      ctx.textAlign = "center";
      ctx.fillStyle = gold;
      ctx.fillText(`${(d.brideName || "A")[0]}${(d.groomName || "R")[0]}`, W / 2, 1030);
      ctx.restore();
    }
    if (fadeIn < 1) { ctx.fillStyle = alpha("#000000", 1 - fadeIn); ctx.fillRect(0, 0, W, H); }
  }

  private scroll(t: number) {
    const ctx = this.ctx;
    const { design, details } = this.input!;
    const pal = design.palette;
    this.drawScene(design, pal, t, 1.08 - 0.06 * easeOut(t / 15));
    ctx.fillStyle = alpha(isLight(pal.deep) ? shade(pal) : darken(pal.deep, 0.5), 0.5);
    ctx.fillRect(0, 0, W, H);
    const un = easeInOut(progress(t, 0.6, 2.2));
    const cy = 980, half = 650 * un + 20, x0 = 160, pw = W - 320;
    const paper = mix("#fbf1dc", pal.sky, 0.06);
    ctx.save();
    ctx.shadowColor = alpha("#000000", 0.45); ctx.shadowBlur = 40;
    const pg = ctx.createLinearGradient(x0, 0, x0 + pw, 0);
    pg.addColorStop(0, darken(paper, 0.1)); pg.addColorStop(0.5, paper); pg.addColorStop(1, darken(paper, 0.1));
    ctx.fillStyle = pg;
    ctx.fillRect(x0, cy - half, pw, half * 2);
    ctx.restore();
    ctx.save();
    ctx.beginPath(); ctx.rect(x0, cy - half, pw, half * 2); ctx.clip();
    const goldDark = luminance(pal.accent) > 0.45 ? darken(pal.accent, 0.5) : pal.accent;
    ctx.strokeStyle = alpha(goldDark, 0.7); ctx.lineWidth = 2;
    ctx.strokeRect(x0 + 26, cy - 610, pw - 52, 1220);
    const ink = mix(darken(isLight(pal.deep) ? pal.text : pal.deep, 0.35), "#3b2416", 0.5);
    const f = this.fonts();
    const line = (txt: string, y: number, font: string, color: string, start: number, maxW = pw - 120) => {
      const a = easeOut(progress(t, start, 0.8));
      if (a <= 0 || !txt) return;
      ctx.save();
      ctx.globalAlpha = a;
      let size = Number(/(\d+)px/.exec(font)?.[1] ?? 40);
      ctx.font = font;
      while (ctx.measureText(txt).width > maxW && size > 18) { size -= 2; ctx.font = font.replace(/\d+px/, `${size}px`); }
      ctx.textAlign = "center";
      ctx.fillStyle = color;
      ctx.fillText(txt, W / 2, y + (1 - a) * 20);
      ctx.restore();
    };
    lotus(ctx, W / 2, cy - 540, 34, alpha(goldDark, easeOut(progress(t, 2.4, 0.8))));
    line(details.hostLine.toUpperCase(), cy - 430, `500 26px ${f.caps}`, ink, 2.8);
    line(details.title, cy - 300, `400 130px ${f.script}`, goldDark, 3.4);
    const dv = easeOut(progress(t, 4.2, 0.8));
    ctx.strokeStyle = alpha(goldDark, dv); ctx.beginPath(); ctx.moveTo(W / 2 - 200 * dv, cy - 230); ctx.lineTo(W / 2 + 200 * dv, cy - 230); ctx.stroke();
    line(this.names(), cy - 120, `600 84px ${f.serif}`, ink, 4.6);
    line(formatInviteDate(details.date).toUpperCase(), cy - 20, `500 32px ${f.caps}`, goldDark, 5.8);
    line(formatInviteTime(details.time), cy + 40, `italic 500 40px ${f.serif}`, ink, 6.2);
    line(details.venue, cy + 150, `600 54px ${f.serif}`, ink, 7.0);
    line(details.city.toUpperCase(), cy + 205, `500 26px ${f.caps}`, goldDark, 7.4);
    // message, wrapped
    ctx.font = `italic 500 36px ${f.serif}`;
    const words = details.message.split(/\s+/).filter(Boolean);
    const rows: string[] = [];
    let cur = "";
    for (const w of words) { const n = cur ? `${cur} ${w}` : w; if (ctx.measureText(n).width > pw - 160 && cur) { rows.push(cur); cur = w; } else cur = n; }
    if (cur) rows.push(cur);
    rows.slice(0, 3).forEach((r, i) => line(r, cy + 320 + i * 48, `italic 500 36px ${f.serif}`, ink, 8.4 + i * 0.3));
    ctx.restore();
    // rollers
    for (const y of [cy - half, cy + half]) {
      const rg = ctx.createLinearGradient(0, y - 26, 0, y + 26);
      rg.addColorStop(0, darken(paper, 0.3)); rg.addColorStop(0.5, lighten(paper, 0.4)); rg.addColorStop(1, darken(paper, 0.4));
      ctx.fillStyle = rg;
      roundRect(ctx, x0 - 40, y - 26, pw + 80, 52, 26); ctx.fill();
      ctx.fillStyle = goldGradient(ctx, 0, 0, 60, 0, brightGold(pal.accent));
      for (const ex of [x0 - 70, x0 + pw + 40]) { roundRect(ctx, ex, y - 20, 30, 40, 10); ctx.fill(); ctx.beginPath(); ctx.arc(ex + (ex < x0 ? -6 : 36), y, 12, 0, Math.PI * 2); ctx.fill(); }
    }
    if (un >= 1) this.sparkles(t, 41, lighten(brightGold(pal.accent), 0.4), 18);
  }

  draw(t: number) {
    if (!this.input) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.clearRect(0, 0, W, H);
    switch (this.input.kind) {
      case "classic": this.card.draw(t); ctx.drawImage(this.cardCanvas, 0, 0); break;
      case "envelope": this.envelope(t); break;
      case "doors": this.doors(t); break;
      case "scroll": this.scroll(t); break;
      case "savedate": this.saveDate(t); break;
      case "journey": this.journey(t); break;
      case "photos": this.photosReel(t); break;
      case "cinematic": this.cinematic(t); break;
    }
    if (this.input.kind !== "classic") {
      const out = progress(t, this.duration - 0.6, 0.6);
      if (out > 0) { ctx.fillStyle = alpha(darken(this.input.design.palette.deep, 0.6), out * 0.5); ctx.fillRect(0, 0, W, H); }
    }
    ctx.restore();
  }
}

export type { Ctx };
