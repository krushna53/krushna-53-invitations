// Painted designs: hand-painted style artwork (static images in /public/art) with
// a soft wash behind the text and gentle living light on top.
import { alpha } from "./color";
import { type Ctx, H, W, rng, sparkle, glow } from "./draw-kit";
import type { Palette } from "./invite-design";
import type { Scene } from "./scenes";

const arts = new Map<string, HTMLImageElement>();
const pending = new Map<string, Promise<void>>();

/** Load a painted artwork once (called before any render, from ensureFonts). */
export function loadArt(src: string): Promise<void> {
  if (arts.has(src)) return Promise.resolve();
  if (typeof Image === "undefined") return Promise.resolve();
  if (!pending.has(src)) {
    pending.set(src, new Promise<void>((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => { arts.set(src, img); resolve(); };
      img.onerror = () => resolve();
      img.src = src;
    }));
  }
  return pending.get(src)!;
}
export const artReady = (src: string) => arts.has(src);

export type PaintedOpts = {
  /** Image in /public/art. */
  src: string;
  /** Is the empty sky at the top light (dark text) or dark (light text)? */
  sky: "light" | "dark";
  /** How far down (px of 1920) the soft wash behind the text reaches. */
  wash?: number;
  /** Where little lamps / lights glow in the picture (x, y in 1080×1920). */
  lights?: [number, number][];
  /** Light colour for the glows. */
  glowColor?: string;
};

function cover(ctx: Ctx, img: HTMLImageElement) {
  const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const w = img.naturalWidth * s, h = img.naturalHeight * s;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
}

export function paintedScene(o: PaintedOpts): Scene {
  const wash = o.wash ?? 1150;
  return {
    still(ctx, p: Palette) {
      const img = arts.get(o.src);
      if (img) cover(ctx, img);
      else {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, p.sky); g.addColorStop(1, p.deep);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
      // soft wash so the lettering always reads, fading into the painting
      const c = o.sky === "light" ? p.sky : p.deep;
      const g = ctx.createLinearGradient(0, 0, 0, wash);
      g.addColorStop(0, alpha(c, 0.82));
      g.addColorStop(0.45, alpha(c, 0.62));
      g.addColorStop(0.8, alpha(c, 0.22));
      g.addColorStop(1, alpha(c, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, wash);
    },
    live(ctx, p, t) {
      const prev = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = "lighter";
      const gc = o.glowColor ?? "#ffb347";
      (o.lights ?? []).forEach(([x, y], i) => glow(ctx, x, y, 90, gc, 0.22 + 0.12 * Math.sin(t * 3.1 + i * 1.7) + 0.05 * Math.sin(t * 7.3 + i)));
      // drifting golden motes rising through the picture
      const r = rng(31);
      for (let i = 0; i < 26; i++) {
        const x0 = r() * W, sp = 18 + r() * 30, ph = r() * 1000;
        const y = H - ((t * sp + ph) % (H * 0.7));
        const x = x0 + Math.sin(t * 0.6 + i) * 18;
        const a = 0.25 + 0.35 * Math.max(0, Math.sin(t * 1.3 + i * 2.1));
        ctx.fillStyle = alpha("#fff3c4", a);
        ctx.beginPath(); ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = prev;
      // a few twinkles in the sky
      const s = rng(7);
      for (let i = 0; i < 8; i++) sparkle(ctx, 80 + s() * (W - 160), 60 + s() * 420, 9 + s() * 8, o.sky === "dark" ? "#ffffff" : alpha(p.accent, 0.9), Math.max(0, Math.sin(t * 1.4 + i * 1.9)) * 0.8);
    },
  };
}
