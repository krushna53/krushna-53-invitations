import { alpha, mix } from "./color";
import { type Ctx, H, W } from "./draw-kit";
import { EVENT_ORDER, EVENT_PRESETS, type Composition, type EventKind, type FontPair, type FrameStyle, type IntroStyle, type Palette, type ParticleStyle, type TextBackdrop, type TextLayout } from "./invite-design";
import { type DesignDef, type Tradition } from "./designs";
import { SCENES, type Scene } from "./scenes";
import { bengaliAlpona, christianChurch, goanSunset, gujaratiBandhani, keralaKasavu, marathiPaithani, muslimNikah, punjabiPhulkari, rajasthaniThar, southMuhurtham } from "./scenes-regional";
import type { CardTemplate } from "./templates";

export const REGIONAL_CULTURES: { id: Tradition; label: string; motif: string; palette: Palette }[] = [
  { id: "Bengali", label: "Bengali", motif: "alpona", palette: { deep: "#751b27", sky: "#fff1df", accent: "#d2ad62", flower: "#c94355", text: "#421923" } },
  { id: "Rajasthani", label: "Marwari · Rajasthani", motif: "jharokha", palette: { deep: "#5d2143", sky: "#f8e5d1", accent: "#d8af63", flower: "#d65a5a", text: "#401b30" } },
  { id: "Punjabi & Sikh", label: "Punjabi · Sikh", motif: "phulkari", palette: { deep: "#782433", sky: "#ffe9ce", accent: "#e2b94e", flower: "#e86b8d", text: "#471622" } },
  { id: "Gujarati", label: "Gujarati", motif: "bandhani", palette: { deep: "#523174", sky: "#f5e8ff", accent: "#edbd4b", flower: "#ec528a", text: "#311944" } },
  { id: "Marathi", label: "Marathi", motif: "peacock", palette: { deep: "#4c236c", sky: "#f3e6ff", accent: "#d9b15d", flower: "#289470", text: "#301846" } },
  { id: "South Indian", label: "South Indian", motif: "temple", palette: { deep: "#7a3021", sky: "#fff2d7", accent: "#d5a63f", flower: "#bd3652", text: "#4d2117" } },
  { id: "Kerala", label: "Kerala", motif: "kasavu", palette: { deep: "#24523c", sky: "#fff8df", accent: "#c8a347", flower: "#d37a56", text: "#1f382d" } },
  { id: "Muslim", label: "Muslim · Nikah", motif: "arabesque", palette: { deep: "#103e39", sky: "#f6f0df", accent: "#d4b76b", flower: "#d9889a", text: "#18312d" } },
  { id: "Christian", label: "Christian", motif: "rose-window", palette: { deep: "#24375d", sky: "#f2f4fb", accent: "#c4a45b", flower: "#bd6681", text: "#202b47" } },
  { id: "Goan", label: "Goan", motif: "coastal", palette: { deep: "#1d4f64", sky: "#f3fbf7", accent: "#d5b66b", flower: "#e88170", text: "#1d3945" } },
];

const CULTURE_SCENES: Record<string, Scene> = {
  Bengali: bengaliAlpona, Rajasthani: rajasthaniThar, "Punjabi & Sikh": punjabiPhulkari,
  Gujarati: gujaratiBandhani, Marathi: marathiPaithani, "South Indian": southMuhurtham,
  Kerala: keralaKasavu, Muslim: muslimNikah, Christian: christianChurch, Goan: goanSunset,
};

const VARIANTS: { name: string; composition: Composition; fonts: FontPair; frame: FrameStyle; backdrop: TextBackdrop; intro: IntroStyle; particles: ParticleStyle; layout: TextLayout }[] = [
  { name: "Heritage Illustrated", composition: "grand", fonts: "heritage", frame: "none", backdrop: "none", intro: "curtain", particles: "marigold", layout: "center" },
  { name: "Ceremony Garden", composition: "weds", fonts: "luxe", frame: "floral-corners", backdrop: "glass", intro: "bloom", particles: "petals", layout: "center" },
  { name: "Folk Art Portrait", composition: "monogram", fonts: "classic", frame: "double-border", backdrop: "paper", intro: "petal-burst", particles: "confetti", layout: "center" },
  { name: "Evening Procession", composition: "dateblock", fonts: "editorial", frame: "jharokha", backdrop: "none", intro: "curtain", particles: "sparkles", layout: "center" },
  { name: "Contemporary Heirloom", composition: "classic", fonts: "romantic", frame: "arch", backdrop: "glow", intro: "bloom", particles: "bokeh", layout: "center" },
];

const VARIANT_PALETTES: Palette[] = [
  { deep: "#000000", sky: "#000000", accent: "#000000", flower: "#000000", text: "#000000" },
  { deep: "#f4ead9", sky: "#fffaf0", accent: "#a87b39", flower: "#c86b62", text: "#38251e" },
  { deep: "#a82942", sky: "#f4bc73", accent: "#f6d779", flower: "#f16c69", text: "#fff5df" },
  { deep: "#101b32", sky: "#273e5a", accent: "#d9b66f", flower: "#c46c78", text: "#fff8e8" },
  { deep: "#dfe9e0", sky: "#fbf8ec", accent: "#8e7650", flower: "#bd776b", text: "#273b35" },
];

function paintMotif(ctx: Ctx, motif: string, p: Palette, variant: number, y: number) {
  const gold = p.accent;
  ctx.save();
  ctx.lineWidth = variant % 2 ? 2 : 3;
  ctx.strokeStyle = alpha(gold, 0.8);
  ctx.fillStyle = alpha(p.flower, 0.74);
  // Quiet regional ornament sits at the card edges so the invitation text stays clear.
  for (const sx of [1, -1]) {
    ctx.save(); ctx.translate(sx === 1 ? 52 : W - 52, y); ctx.scale(sx, y < 960 ? 1 : -1);
    if (motif === "alpona" || motif === "rose-window") {
      for (let i = 0; i < 4; i++) {
        ctx.beginPath(); ctx.ellipse(0, 0, 24 + i * 12, 64 + i * 12, 0, 0, Math.PI * 2); ctx.stroke();
        for (let a = 0; a < 8; a++) { ctx.beginPath(); ctx.ellipse(Math.cos(a * Math.PI / 4) * 44, Math.sin(a * Math.PI / 4) * 44, 9, 20, a * Math.PI / 4, 0, Math.PI * 2); ctx.stroke(); }
      }
    } else if (motif === "phulkari" || motif === "bandhani" || motif === "peacock") {
      for (let row = 0; row < 5; row++) for (let col = 0; col < 3; col++) {
        const x = col * 23 + (row % 2) * 11, y = row * 34;
        ctx.beginPath();
        if (motif === "bandhani") ctx.arc(x, y, col % 2 ? 3 : 5, 0, Math.PI * 2);
        else { ctx.moveTo(x, y - 10); ctx.lineTo(x + 9, y); ctx.lineTo(x, y + 10); ctx.lineTo(x - 9, y); ctx.closePath(); }
        ctx.stroke(); if (motif === "peacock") { ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill(); }
      }
    } else if (motif === "jharokha" || motif === "temple" || motif === "arabesque") {
      ctx.beginPath(); ctx.moveTo(-4, 150); ctx.lineTo(-4, 46); ctx.arc(42, 46, 46, Math.PI, 0); ctx.lineTo(88, 150); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(12, 150); ctx.lineTo(12, 58); ctx.arc(42, 58, 30, Math.PI, 0); ctx.lineTo(72, 150); ctx.stroke();
      for (let y = 8; y < 164; y += 30) { ctx.beginPath(); ctx.arc(42, y, 5, 0, Math.PI * 2); ctx.fill(); }
    } else {
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(0, i * 34); ctx.bezierCurveTo(26, i * 34 - 28, 45, i * 34 + 28, 80, i * 34); ctx.stroke(); }
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(12 + i * 19, 12 + i * 34, 5, 0, Math.PI * 2); ctx.fill(); }
    }
    ctx.restore();
  }
  ctx.restore();
}

function regionalScene(event: EventKind, culture: (typeof REGIONAL_CULTURES)[number], variant: number): Scene {
  const cultural = CULTURE_SCENES[culture.id];
  const ceremony = SCENES[event];
  const base = variant === 1 || variant === 3 ? ceremony : cultural;
  return {
    still(ctx, palette) {
      base.still(ctx, palette);
      ctx.save();
      if (variant === 0) {
        paintMotif(ctx, culture.motif, palette, variant, 210); paintMotif(ctx, culture.motif, palette, variant, 1710);
      } else if (variant === 1) {
        ctx.fillStyle = alpha(palette.sky, 0.16); ctx.fillRect(115, 260, W - 230, 1380);
        ctx.strokeStyle = alpha(palette.accent, 0.85); ctx.lineWidth = 5; ctx.strokeRect(62, 90, W - 124, H - 180);
        paintMotif(ctx, culture.motif, palette, variant, 250); paintMotif(ctx, culture.motif, palette, variant, 1660);
      } else if (variant === 2) {
        ctx.strokeStyle = alpha(palette.accent, 0.9); ctx.lineWidth = 6; ctx.strokeRect(40, 44, W - 80, H - 88);
        ctx.lineWidth = 2; ctx.strokeRect(64, 68, W - 128, H - 136);
        paintMotif(ctx, culture.motif, palette, variant, 390); paintMotif(ctx, culture.motif, palette, variant, 1530);
        ctx.save(); ctx.globalAlpha = 0.28; ctx.translate(W / 2, H / 2); ctx.scale(2.1, 2.1); paintMotif(ctx, culture.motif, palette, variant, 0); ctx.restore();
      } else if (variant === 3) {
        ctx.fillStyle = alpha(palette.deep, 0.32); ctx.fillRect(70, 220, W - 140, 1450);
        ctx.strokeStyle = alpha(palette.accent, 0.9); ctx.lineWidth = 3; ctx.strokeRect(28, 30, W - 56, H - 60);
        paintMotif(ctx, culture.motif, palette, variant, 270); paintMotif(ctx, culture.motif, palette, variant, 1640);
      } else {
        ctx.fillStyle = alpha(palette.sky, 0.46); ctx.fillRect(88, 245, W - 176, 1430);
        ctx.strokeStyle = alpha(palette.accent, 0.82); ctx.lineWidth = 2; ctx.strokeRect(48, 54, W - 96, H - 108);
        paintMotif(ctx, culture.motif, palette, variant, 300); paintMotif(ctx, culture.motif, palette, variant, 1600);
      }
      ctx.restore();
    },
    live(ctx, palette, t) {
      base.live(ctx, palette, t);
      ctx.save();
      if (variant === 1) {
        ctx.globalAlpha = 0.15 + Math.max(0, Math.sin(t * 1.3)) * 0.16; ctx.fillStyle = palette.accent;
        const x = ((t * 95) % (W + 260)) - 130; ctx.fillRect(x, 180, 3, H - 360);
      } else if (variant === 2) {
        for (let i = 0; i < 8; i++) { const x = 150 + ((i * 137 + Math.sin(t + i) * 28) % (W - 300)); const y = ((i * 241 - t * 80) % (H + 100) + H + 100) % (H + 100); ctx.globalAlpha = 0.65; ctx.fillStyle = i % 2 ? palette.flower : palette.accent; ctx.beginPath(); ctx.arc(x, y, 5 + i % 4, 0, Math.PI * 2); ctx.fill(); }
      } else if (variant === 3) {
        ctx.globalAlpha = 0.22 + Math.max(0, Math.sin(t * 1.8)) * 0.2; ctx.strokeStyle = palette.accent; ctx.lineWidth = 3; ctx.strokeRect(26, 28, W - 52, H - 56);
      } else if (variant === 4) {
        ctx.globalAlpha = 0.55; ctx.fillStyle = palette.flower;
        for (let i = 0; i < 6; i++) { const x = 90 + i * 180 + Math.sin(t * 0.8 + i) * 20; const y = 260 + ((i * 310 - t * 46) % 1300 + 1300) % 1300; ctx.beginPath(); ctx.ellipse(x, y, 7, 13, t + i, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.restore();
    },
  };
}

function colorsFor(base: Palette, variant: number) {
  const signatureTheme = VARIANT_PALETTES[variant];
  const signatureAmount = [0, 0.78, 0.62, 0.72, 0.7][variant];
  const signature: Palette = variant === 0 ? { ...base } : {
    deep: mix(base.deep, signatureTheme.deep, signatureAmount), sky: mix(base.sky, signatureTheme.sky, signatureAmount),
    accent: mix(base.accent, signatureTheme.accent, 0.55), flower: mix(base.flower, signatureTheme.flower, 0.58), text: mix(base.text, signatureTheme.text, signatureAmount),
  };
  return [
    { name: ["Regional signature", "Ivory paper", "Festival jewel", "Midnight gold", "Sage editorial"][variant], palette: signature },
    ...VARIANT_PALETTES.slice(1).map((theme, index) => {
      const amount = index === 0 ? 0.78 : index === 1 ? 0.62 : index === 2 ? 0.72 : 0.7;
      return { name: ["Ivory paper", "Festival jewel", "Midnight gold", "Sage editorial"][index], palette: { deep: mix(signature.deep, theme.deep, amount), sky: mix(signature.sky, theme.sky, amount), accent: mix(signature.accent, theme.accent, 0.55), flower: mix(signature.flower, theme.flower, 0.58), text: mix(signature.text, theme.text, amount) } };
    }),
  ];
}

export function makeRegionalTemplates(): CardTemplate[] {
  return REGIONAL_CULTURES.flatMap((culture) => EVENT_ORDER.flatMap((event) => VARIANTS.map((variant, index) => {
    const id = `regional-${culture.id.toLowerCase().replace(/[^a-z]+/g, "-")}-${event}-${index + 1}`;
    const def: DesignDef = {
      id, event, name: `${culture.label} · ${variant.name}`, blurb: `${variant.name}: a distinct ${culture.label} illustration, its own ceremony artwork, typography and motion treatment.`,
      scene: regionalScene(event, culture, index), colorways: colorsFor(culture.palette, index),
      frame: variant.frame, backdrop: variant.backdrop, fonts: variant.fonts, particles: variant.particles,
      intro: variant.intro, layout: variant.layout, composition: variant.composition,
      tradition: culture.id, blessing: false,
    };
    return { id, name: def.name, event, style: index === 2 ? "Modern" : index === 1 ? "Floral" : "Royal", blurb: def.blurb, tradition: culture.id, regionLabel: culture.label, def, regional: true } satisfies CardTemplate;
  })));
}
