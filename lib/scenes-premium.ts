// Premium designs: denser, more detailed artwork with depth and layered light.
import { alpha, darken, lighten, mix } from "./color";
import { type Ctx, H, W, bananaLeaf, bulb, glow, goldGradient, hangPoints, leaf, lotus, marigold, rng, rose, sparkle } from "./draw-kit";
import type { Palette } from "./invite-design";
import { type Scene, leafGreen, mg1, mg2, vGradient } from "./scenes";

const lighter = (ctx: Ctx, fn: () => void) => {
  const prev = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = "lighter";
  fn();
  ctx.globalCompositeOperation = prev;
};

const cache = new Map<string, HTMLCanvasElement>();
function cached(key: string, w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  let c = cache.get(key);
  if (!c) {
    c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d")!);
    cache.set(key, c);
    if (cache.size > 40) cache.delete(cache.keys().next().value!);
  }
  return c;
}

// ───────────────────── ROYAL MANDALA ─────────────────────
function bigMandala(c: CanvasRenderingContext2D, R: number, accent: string) {
  const cx = R, cy = R;
  c.strokeStyle = goldGradient(c, 0, 0, R * 2, R * 2, accent);
  c.fillStyle = goldGradient(c, 0, 0, R * 2, R * 2, accent);
  const ring = (r: number, n: number, petal: number, kind: number) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      c.save(); c.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r); c.rotate(a + Math.PI / 2);
      c.beginPath();
      if (kind === 0) { c.moveTo(0, 0); c.bezierCurveTo(petal * 0.5, -petal * 0.4, petal * 0.35, -petal, 0, -petal * 1.15); c.bezierCurveTo(-petal * 0.35, -petal, -petal * 0.5, -petal * 0.4, 0, 0); c.stroke(); c.beginPath(); c.moveTo(0, -petal * 0.15); c.lineTo(0, -petal * 0.8); c.stroke(); }
      else if (kind === 1) { c.arc(0, -petal * 0.5, petal * 0.5, Math.PI, 0); c.stroke(); c.beginPath(); c.arc(0, -petal * 0.5, 3, 0, Math.PI * 2); c.fill(); }
      else { c.moveTo(-petal * 0.3, 0); c.lineTo(0, -petal); c.lineTo(petal * 0.3, 0); c.closePath(); c.stroke(); }
      c.restore();
    }
    c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke();
  };
  c.lineWidth = 2.2;
  ring(R * 0.95, 64, R * 0.05, 2);
  ring(R * 0.86, 40, R * 0.09, 0);
  ring(R * 0.72, 32, R * 0.07, 1);
  ring(R * 0.62, 24, R * 0.11, 0);
  ring(R * 0.48, 48, R * 0.04, 2);
  ring(R * 0.4, 16, R * 0.12, 0);
  ring(R * 0.26, 12, R * 0.07, 1);
  for (let i = 0; i < 120; i++) { const a = (i / 120) * Math.PI * 2; c.beginPath(); c.arc(cx + Math.cos(a) * R * 0.79, cy + Math.sin(a) * R * 0.79, 2.4, 0, Math.PI * 2); c.fill(); }
  for (let i = 0; i < 72; i++) { const a = (i / 72) * Math.PI * 2; c.beginPath(); c.arc(cx + Math.cos(a) * R * 0.55, cy + Math.sin(a) * R * 0.55, 2, 0, Math.PI * 2); c.fill(); }
}

export const royalMandala: Scene = {
  still(ctx, p) {
    const g = ctx.createRadialGradient(540, 960, 60, 540, 960, 1250);
    g.addColorStop(0, lighten(p.deep, 0.18)); g.addColorStop(0.55, p.deep); g.addColorStop(1, darken(p.deep, 0.5));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // velvet folds
    for (let i = 0; i < 9; i++) { const x = (i / 9) * W; const fg = ctx.createLinearGradient(x, 0, x + W / 9, 0); fg.addColorStop(0, alpha("#000000", 0.0)); fg.addColorStop(0.5, alpha("#000000", 0.12)); fg.addColorStop(1, alpha("#000000", 0)); ctx.fillStyle = fg; ctx.fillRect(x, 0, W / 9, H); }
    for (const [x, y] of [[0, 0], [W, 0], [0, H], [W, H]] as const) {
      const m = cached(`mq-${p.accent}`, 520, 520, (c) => bigMandala(c, 260, p.accent));
      ctx.save(); ctx.globalAlpha = 0.85; ctx.drawImage(m, x - 260, y - 260); ctx.restore();
    }
    // gold border with beads
    ctx.strokeStyle = goldGradient(ctx, 0, 0, W, H, p.accent); ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, W - 80, H - 80);
    ctx.fillStyle = goldGradient(ctx, 0, 0, W, H, p.accent);
    for (let x = 60; x < W - 40; x += 28) { ctx.beginPath(); ctx.arc(x, 40, 4, 0, Math.PI * 2); ctx.arc(x, H - 40, 4, 0, Math.PI * 2); ctx.fill(); }
  },
  live(ctx, p, t) {
    const m = cached(`m-${p.accent}`, 1200, 1200, (c) => bigMandala(c, 600, p.accent));
    ctx.save();
    ctx.translate(540, 960); ctx.rotate(t * 0.03);
    ctx.globalAlpha = 0.32;
    ctx.drawImage(m, -600, -600);
    ctx.restore();
    lighter(ctx, () => glow(ctx, 540, 960, 520, lighten(p.accent, 0.3), 0.12 + 0.04 * Math.sin(t)));
    const r = rng(5);
    for (let i = 0; i < 20; i++) { const a = r() * Math.PI * 2, d = 200 + r() * 360; sparkle(ctx, 540 + Math.cos(a) * d, 960 + Math.sin(a) * d * 1.4, 10 + r() * 10, lighten(p.accent, 0.5), Math.max(0, Math.sin(t * 1.5 + i))); }
  },
};

// ───────────────────── PICHWAI LOTUS ─────────────────────
function lotusLeaf(ctx: Ctx, x: number, y: number, r: number, color: string) {
  const g = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, 4, x, y, r);
  g.addColorStop(0, lighten(color, 0.25)); g.addColorStop(1, darken(color, 0.2));
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(x, y, r, 0.15, Math.PI * 2 - 0.15); ctx.lineTo(x, y); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = alpha(lighten(color, 0.45), 0.7); ctx.lineWidth = 1.5;
  for (let i = 0; i < 12; i++) { const a = 0.2 + (i / 12) * (Math.PI * 2 - 0.4); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92); ctx.stroke(); }
}

function lotusBloom(ctx: Ctx, x: number, y: number, s: number, color: string) {
  for (let layer = 0; layer < 3; layer++) {
    const n = 7 - layer, spread = 1.5 - layer * 0.35, len = (70 - layer * 14) * s;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i - (n - 1) / 2) * (spread / (n - 1));
      ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI / 2);
      const g = ctx.createLinearGradient(0, 0, 0, -len);
      g.addColorStop(0, lighten(color, 0.55)); g.addColorStop(0.7, color); g.addColorStop(1, darken(color, 0.15));
      ctx.fillStyle = g; ctx.strokeStyle = alpha(darken(color, 0.35), 0.6); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(len * 0.38, -len * 0.55, 0, -len); ctx.quadraticCurveTo(-len * 0.38, -len * 0.55, 0, 0); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
  }
}

export const pichwaiLotus: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, darken(p.deep, 0.15)], [1, darken(p.deep, 0.4)]]);
    const r = rng(9);
    const green = mix("#2f7a4a", p.deep, 0.25);
    // dense lotus pond in Pichwai rows (left/right columns and bottom)
    for (let row = 0; row < 14; row++) for (let col = 0; col < 7; col++) {
      const x = col * 170 + (row % 2) * 85 - 20 + (r() - 0.5) * 20;
      const y = 200 + row * 130 + (r() - 0.5) * 20;
      const inCentre = x > 200 && x < 880 && y > 380 && y < 1560;
      if (inCentre) continue;
      lotusLeaf(ctx, x, y, 66 + r() * 16, r() > 0.5 ? green : darken(green, 0.15));
      if (r() > 0.55) lotusBloom(ctx, x + (r() - 0.5) * 60, y - 30, 0.75 + r() * 0.3, mix(p.flower, "#ffffff", r() * 0.2));
      else if (r() > 0.6) { ctx.fillStyle = p.flower; ctx.beginPath(); ctx.ellipse(x + 30, y - 40, 14, 28, 0.3, 0, Math.PI * 2); ctx.fill(); }
    }
    // centre panel framing
    ctx.strokeStyle = goldGradient(ctx, 0, 0, W, 0, p.accent); ctx.lineWidth = 4;
    ctx.strokeRect(210, 390, 660, 1160);
    ctx.lineWidth = 1.5; ctx.strokeRect(224, 404, 632, 1132);
    // top border: hanging flower strings and scallop
    ctx.fillStyle = darken(p.deep, 0.45); ctx.fillRect(0, 0, W, 120);
    for (let x = 0; x < W; x += 60) { ctx.fillStyle = p.accent; ctx.beginPath(); ctx.arc(x + 30, 120, 30, 0, Math.PI); ctx.fill(); }
    for (let x = 30; x < W; x += 60) for (let k = 0; k < 4; k++) { ctx.fillStyle = k % 2 ? "#ffffff" : p.flower; ctx.beginPath(); ctx.arc(x, 160 + k * 16, 6, 0, Math.PI * 2); ctx.fill(); }
  },
  live(ctx, p, t) {
    ctx.strokeStyle = alpha(lighten(p.sky, 0.4), 0.18); ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) { const y = 1640 + i * 40; ctx.beginPath(); for (let x = 0; x <= W; x += 20) { const yy = y + Math.sin(x / 50 + t + i) * 5; if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); } ctx.stroke(); }
    const r = rng(4);
    for (let i = 0; i < 16; i++) lighter(ctx, () => glow(ctx, r() * W, 200 + r() * 1600, 50, lighten(p.flower, 0.4), 0.12 * (1 + Math.sin(t * 1.5 + i))));
  },
};

// ───────────────────── MUGHAL GARDEN ─────────────────────
function cypress(ctx: Ctx, x: number, base: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(x, base - h); ctx.bezierCurveTo(x + h * 0.16, base - h * 0.6, x + h * 0.12, base - h * 0.1, x, base); ctx.bezierCurveTo(x - h * 0.12, base - h * 0.1, x - h * 0.16, base - h * 0.6, x, base - h); ctx.fill();
  ctx.strokeStyle = alpha(lighten(color, 0.3), 0.5); ctx.lineWidth = 1.5;
  for (let i = 1; i < 8; i++) { const y = base - (i / 8) * h; ctx.beginPath(); ctx.moveTo(x - h * 0.08, y); ctx.quadraticCurveTo(x, y - 10, x + h * 0.08, y); ctx.stroke(); }
}

export const mughalGarden: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, lighten(p.sky, 0.35)], [1, mix(p.sky, p.deep, 0.15)]]);
    // floral border (Mughal red flowers on cream)
    const r = rng(3);
    for (let i = 0; i < 2; i++) { ctx.strokeStyle = p.flower; ctx.lineWidth = 3; ctx.strokeRect(30 + i * 60, 30 + i * 60, W - 60 - i * 120, H - 60 - i * 120); }
    const bloom = (x: number, y: number, s: number) => { for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2; ctx.fillStyle = p.flower; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * 7 * s, y + Math.sin(a) * 7 * s, 7 * s, 4 * s, a, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = p.accent; ctx.beginPath(); ctx.arc(x, y, 3 * s, 0, Math.PI * 2); ctx.fill(); };
    for (let x = 75; x < W - 60; x += 46) { bloom(x, 60, 1.3); bloom(x, H - 60, 1.3); leaf(ctx, x + 22, 60, 18, 6, 0.4, leafGreen(p)); leaf(ctx, x + 22, H - 60, 18, 6, -0.4, leafGreen(p)); }
    for (let y = 105; y < H - 60; y += 46) { bloom(60, y, 1.3); bloom(W - 60, y, 1.3); }
    // charbagh water channel in perspective
    ctx.fillStyle = mix(p.sky, "#9ecbe0", 0.5);
    ctx.beginPath(); ctx.moveTo(500, 1300); ctx.lineTo(580, 1300); ctx.lineTo(700, 1830); ctx.lineTo(380, 1830); ctx.fill();
    ctx.strokeStyle = p.accent; ctx.lineWidth = 3; ctx.stroke();
    // grand arch gateway
    ctx.strokeStyle = goldGradient(ctx, 200, 0, 880, 0, p.accent); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(200, 1300); ctx.lineTo(200, 620); ctx.bezierCurveTo(200, 400, 420, 330, 540, 260); ctx.bezierCurveTo(660, 330, 880, 400, 880, 620); ctx.lineTo(880, 1300); ctx.stroke();
    ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(222, 1300); ctx.lineTo(222, 630); ctx.bezierCurveTo(222, 420, 430, 360, 540, 294); ctx.bezierCurveTo(650, 360, 858, 420, 858, 630); ctx.lineTo(858, 1300); ctx.stroke();
    cypress(ctx, 150, 1700, 520, darken(leafGreen(p), 0.15));
    cypress(ctx, 930, 1700, 520, darken(leafGreen(p), 0.15));
    cypress(ctx, 290, 1760, 320, leafGreen(p));
    cypress(ctx, 790, 1760, 320, leafGreen(p));
    for (const [x, s] of [[200, 9], [880, 7]] as const) for (let i = 0; i < 9; i++) { leaf(ctx, x + (r() - 0.5) * 160, 1760 + (r() - 0.5) * 60, 50, 16, r() * 6, leafGreen(p)); rose(ctx, x + (r() - 0.5) * 160, 1760 + (r() - 0.5) * 60, 22 + r() * 12, i % 2 ? p.flower : lighten(p.flower, 0.4), s + i); }
  },
  live(ctx, p, t) {
    // fountain jets in the channel
    for (const [x, y] of [[540, 1420], [540, 1620]] as const) {
      for (let i = 0; i < 7; i++) {
        const a = -Math.PI / 2 + (i - 3) * 0.25, h = 90 + 20 * Math.sin(t * 4 + i);
        ctx.strokeStyle = alpha("#ffffff", 0.55); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.cos(a) * h * 0.6, y + Math.sin(a) * h, x + Math.cos(a) * h, y - 10); ctx.stroke();
      }
    }
    const r = rng(2);
    for (let i = 0; i < 12; i++) sparkle(ctx, 240 + r() * 600, 320 + r() * 1000, 10, p.accent, Math.max(0, Math.sin(t * 1.6 + i)) * 0.8);
  },
};

// ───────────────────── ROYAL BARAAT (ELEPHANTS) ─────────────────────
function elephant(ctx: Ctx, p: Palette, x: number, y: number, s: number, t: number, howdah: boolean, flip = 1) {
  const step = Math.sin(t * 2.4 + x) * 6;
  ctx.save(); ctx.translate(x, y + Math.abs(step) * 0.3); ctx.scale(s * flip, s);
  const body = mix("#9a8a9a", p.deep, 0.25);
  ctx.fillStyle = body;
  // legs
  for (const [lx, ph] of [[-70, 0], [-30, 1], [40, 1], [80, 0]] as const) { const sw = (ph ? step : -step) * 0.6; ctx.fillRect(lx - 14 + sw, 20, 30, 110); }
  ctx.beginPath(); ctx.ellipse(0, 0, 120, 78, 0, 0, Math.PI * 2); ctx.fill();
  // head + trunk + ear
  ctx.beginPath(); ctx.ellipse(118, -40, 56, 60, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(150, -10); ctx.quadraticCurveTo(190, 40, 172, 120 + Math.sin(t * 2) * 6); ctx.lineTo(152, 118); ctx.quadraticCurveTo(160, 50, 120, 10); ctx.fill();
  ctx.fillStyle = darken(body, 0.2); ctx.beginPath(); ctx.ellipse(92, -30, 34, 48, -0.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fff6e0"; ctx.beginPath(); ctx.moveTo(150, 10); ctx.quadraticCurveTo(178, 26, 190, 10); ctx.lineTo(178, 22); ctx.fill();
  // caparison blanket
  const gold = goldGradient(ctx, -110, 0, 110, 0, p.accent);
  ctx.fillStyle = p.flower;
  ctx.beginPath(); ctx.moveTo(-90, -60); ctx.lineTo(70, -60); ctx.lineTo(80, 50); ctx.quadraticCurveTo(-5, 80, -95, 50); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = gold; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = gold;
  for (let i = -80; i <= 70; i += 22) { ctx.beginPath(); ctx.arc(i, 58 + Math.sin(i) * 3, 6, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(i - 1.5, 62, 3, 16); }
  lotus(ctx, -10, 10, 30, p.accent);
  // head ornament
  ctx.fillStyle = gold; ctx.beginPath(); ctx.moveTo(100, -96); ctx.lineTo(150, -90); ctx.lineTo(160, -10); ctx.lineTo(130, 10); ctx.closePath(); ctx.fill();
  ctx.fillStyle = p.flower; ctx.beginPath(); ctx.arc(140, -50, 10, 0, Math.PI * 2); ctx.fill();
  if (howdah) {
    ctx.fillStyle = gold;
    ctx.fillRect(-60, -120, 110, 60);
    ctx.beginPath(); ctx.moveTo(-70, -120); ctx.quadraticCurveTo(-5, -230, 60, -120); ctx.fill();
    ctx.fillStyle = p.flower; ctx.fillRect(-46, -110, 82, 40);
    ctx.fillStyle = gold; ctx.beginPath(); ctx.moveTo(-8, -230); ctx.lineTo(-2, -260); ctx.lineTo(4, -230); ctx.fill();
  }
  ctx.restore();
}

export const royalBaraat: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, darken(p.deep, 0.3)], [0.55, p.deep], [0.8, mix(p.flower, "#ffb347", 0.45)], [1, mix(p.deep, "#3a1a0a", 0.4)]]);
    const r = rng(6);
    for (let i = 0; i < 100; i++) { ctx.fillStyle = alpha("#fff4dc", 0.2 + r() * 0.5); ctx.beginPath(); ctx.arc(r() * W, r() * 900, r() * 2 + 0.4, 0, Math.PI * 2); ctx.fill(); }
    // palace silhouette far behind
    ctx.fillStyle = alpha(darken(p.deep, 0.5), 0.8);
    ctx.fillRect(0, 1380, W, 200);
    for (const [x, w, h] of [[120, 160, 180], [360, 220, 260], [620, 180, 220], [880, 200, 200]] as const) { ctx.fillRect(x - w / 2, 1380 - h + 60, w, h); ctx.beginPath(); ctx.ellipse(x, 1380 - h + 60, w * 0.4, 50, 0, Math.PI, 0); ctx.fill(); }
    vGradient(ctx, [[0, mix(p.deep, "#7a4a1a", 0.3)], [1, darken(p.deep, 0.5)]], 1560, H);
  },
  live(ctx, p, t) {
    // marigold toran
    for (let x = 20; x < W; x += 60) for (let y = 0; y < 100 + ((x / 60) % 2) * 60; y += 24) marigold(ctx, x, y + 10, 13, (y / 24) % 2 ? mg1(p) : mg2(p), x + y);
    // lanterns
    for (const [x, y] of [[150, 420], [930, 420], [300, 300], [780, 300]] as const) {
      const sw = Math.sin(t + x) * 6;
      ctx.strokeStyle = alpha(p.accent, 0.6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + sw, y - 40); ctx.stroke();
      lighter(ctx, () => glow(ctx, x + sw, y, 120, "#ffb347", 0.35));
      ctx.fillStyle = mix("#ffcf6b", p.flower, 0.3); ctx.beginPath(); ctx.ellipse(x + sw, y, 22, 32, 0, 0, Math.PI * 2); ctx.fill();
    }
    const walk = (t * 20) % 60;
    elephant(ctx, p, 120 + walk * 0.3, 1650, 0.95, t, false);
    elephant(ctx, p, 950 + walk * 0.3, 1650, 0.95, t + 2, false);
    elephant(ctx, p, 500 + walk * 0.3, 1690, 1.3, t + 1, true);
    for (let i = 0; i < 6; i++) { const x = 60 + i * 190; lighter(ctx, () => glow(ctx, x, 1880, 60, "#ffb347", 0.3)); }
  },
};

// ───────────────────── JHAROKHA BLOOM ─────────────────────
export const jharokhaBloom: Scene = {
  still(ctx, p) {
    const stone = mix(p.sky, "#e8c9a0", 0.35);
    vGradient(ctx, [[0, lighten(stone, 0.1)], [1, darken(stone, 0.15)]]);
    // carved texture
    ctx.strokeStyle = alpha(darken(stone, 0.25), 0.35); ctx.lineWidth = 1.5;
    for (let y = 30; y < H; y += 60) for (let x = (y / 60) % 2 ? 30 : 0; x < W; x += 60) { ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - 18, y); ctx.lineTo(x + 18, y); ctx.moveTo(x, y - 18); ctx.lineTo(x, y + 18); ctx.stroke(); }
    // window opening with sunset sky
    const x0 = 150, x1 = 930, top = 230, bottom = 1560;
    const path = () => {
      ctx.beginPath(); ctx.moveTo(x0, bottom); ctx.lineTo(x0, 560);
      const lobes = 7, cx = 540, cy = 560, rx = (x1 - x0) / 2, ry = 560 - top;
      for (let i = 0; i < lobes; i++) { const a1 = Math.PI + (i / lobes) * Math.PI, a2 = Math.PI + ((i + 1) / lobes) * Math.PI, am = (a1 + a2) / 2; ctx.quadraticCurveTo(cx + Math.cos(am) * rx * 1.13, cy + Math.sin(am) * ry * 1.13, cx + Math.cos(a2) * rx, cy + Math.sin(a2) * ry); }
      ctx.lineTo(x1, bottom); ctx.closePath();
    };
    ctx.save(); ctx.shadowColor = alpha("#000000", 0.45); ctx.shadowBlur = 40; path(); ctx.fillStyle = "#000"; ctx.fill(); ctx.restore();
    ctx.save(); path(); ctx.clip();
    vGradient(ctx, [[0, p.deep], [0.55, mix(p.deep, p.flower, 0.55)], [0.8, mix(p.flower, "#ffd27a", 0.5)], [1, mix("#ffd27a", p.sky, 0.3)]], top, bottom);
    glow(ctx, 540, 1350, 380, "#fff1b8", 0.55);
    ctx.fillStyle = alpha(darken(p.deep, 0.5), 0.85);
    ctx.beginPath(); ctx.moveTo(x0, 1420); for (let x = x0; x <= x1; x += 30) ctx.lineTo(x, 1420 - Math.abs(Math.sin(x / 70)) * 70); ctx.lineTo(x1, bottom); ctx.lineTo(x0, bottom); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = goldGradient(ctx, x0, 0, x1, 0, p.accent); ctx.lineWidth = 10; path(); ctx.stroke();
    ctx.lineWidth = 3; ctx.save(); ctx.translate(540, 900); ctx.scale(0.96, 0.98); ctx.translate(-540, -900); path(); ctx.stroke(); ctx.restore();
    // jali side panels
    for (const xs of [40, W - 110]) {
      ctx.fillStyle = darken(stone, 0.1); ctx.fillRect(xs, 600, 70, 900);
      ctx.strokeStyle = alpha(darken(stone, 0.45), 0.8); ctx.lineWidth = 2;
      for (let y = 620; y < 1490; y += 30) for (let x = xs + 10; x < xs + 70; x += 30) { ctx.beginPath(); ctx.moveTo(x + 15, y); ctx.lineTo(x + 30, y + 15); ctx.lineTo(x + 15, y + 30); ctx.lineTo(x, y + 15); ctx.closePath(); ctx.stroke(); }
    }
    // sill with flower pots
    ctx.fillStyle = darken(stone, 0.2); ctx.fillRect(110, 1560, 860, 50);
    ctx.fillStyle = goldGradient(ctx, 110, 0, 970, 0, p.accent); ctx.fillRect(110, 1556, 860, 6);
    const r = rng(8);
    for (const x of [200, 540, 880]) {
      ctx.fillStyle = mix("#b0603a", p.deep, 0.2); ctx.beginPath(); ctx.moveTo(x - 60, 1560); ctx.lineTo(x + 60, 1560); ctx.lineTo(x + 44, 1500); ctx.lineTo(x - 44, 1500); ctx.fill();
      for (let i = 0; i < 10; i++) { leaf(ctx, x + (r() - 0.5) * 120, 1480 + (r() - 0.5) * 40, 40, 13, r() * 6, leafGreen(p)); rose(ctx, x + (r() - 0.5) * 110, 1470 + (r() - 0.5) * 40, 16 + r() * 10, i % 2 ? p.flower : lighten(p.flower, 0.45), i); }
    }
    vGradient(ctx, [[0, darken(stone, 0.25)], [1, darken(stone, 0.4)]], 1610, H);
  },
  live(ctx, p, t) {
    // draped garlands across the window top and hanging strings
    for (let k = 0; k < 2; k++) {
      const pts = hangPoints(160, 540 + k * 40, 920, 540 + k * 40, 90 + Math.sin(t + k) * 6, 22);
      pts.forEach((q, i) => rose(ctx, q.x, q.y, 11, (i + k) % 2 ? p.flower : "#fffaf2", i));
    }
    for (const x of [175, 905]) for (let y = 250; y < 1500; y += 22) marigold(ctx, x + Math.sin(t + y / 80) * 3, y, 11, (y / 22) % 2 ? mg1(p) : mg2(p), y);
    const r = rng(1);
    for (let i = 0; i < 12; i++) sparkle(ctx, 220 + r() * 640, 300 + r() * 1000, 10, "#fff8e0", Math.max(0, Math.sin(t * 1.7 + i)) * 0.8);
  },
};

// ───────────────────── CELESTIAL LOVE ─────────────────────
export const celestialNight: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, darken(p.deep, 0.4)], [0.6, p.deep], [1, mix(p.deep, p.sky, 0.4)]]);
    const r = rng(3);
    for (let i = 0; i < 260; i++) { ctx.fillStyle = alpha("#ffffff", 0.15 + r() * 0.6); ctx.beginPath(); ctx.arc(r() * W, r() * H, r() * 1.8 + 0.3, 0, Math.PI * 2); ctx.fill(); }
    // milky way haze
    ctx.save(); ctx.translate(540, 900); ctx.rotate(-0.5);
    const mw = ctx.createLinearGradient(0, -220, 0, 220); mw.addColorStop(0, alpha(p.sky, 0)); mw.addColorStop(0.5, alpha(lighten(p.sky, 0.4), 0.18)); mw.addColorStop(1, alpha(p.sky, 0));
    ctx.fillStyle = mw; ctx.fillRect(-1200, -220, 2400, 440); ctx.restore();
    // moon phases arc
    const gold = p.accent;
    for (let i = 0; i < 9; i++) {
      const a = Math.PI + 0.25 + (i / 8) * (Math.PI - 0.5);
      const x = 540 + Math.cos(a) * 400, y = 470 + Math.sin(a) * 260, rr = i === 4 ? 46 : 26;
      ctx.fillStyle = mix("#fff6d8", gold, 0.25); ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.fill();
      const ph = (i - 4) / 4;
      if (i !== 4) { ctx.fillStyle = darken(p.deep, 0.3); ctx.beginPath(); ctx.arc(x + ph * rr * 1.2, y, rr * 0.98, 0, Math.PI * 2); ctx.fill(); }
    }
    // gold ring around the text
    ctx.strokeStyle = goldGradient(ctx, 0, 0, W, 0, gold); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.ellipse(540, 1080, 450, 620, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(540, 1080, 432, 600, 0, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(540 + Math.cos(a) * 450, 1080 + Math.sin(a) * 620, 6, 0, Math.PI * 2); ctx.fill(); }
    // clouds
    for (const [x, y, s] of [[120, 1820, 1.2], [420, 1870, 1], [760, 1840, 1.3], [1000, 1880, 1]] as const) { ctx.fillStyle = alpha(lighten(p.sky, 0.3), 0.35); for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(x + (k - 2) * 50 * s, y - Math.sin(k) * 30 * s, 60 * s, 0, Math.PI * 2); ctx.fill(); } }
  },
  live(ctx, p, t) {
    const cons: [number, number][][] = [[[130, 760], [210, 700], [280, 740], [330, 690]], [[780, 700], [860, 760], [930, 720], [960, 800]], [[160, 1500], [240, 1450], [300, 1520]], [[800, 1480], [880, 1430], [950, 1500]]];
    ctx.strokeStyle = alpha(lighten(p.accent, 0.3), 0.55); ctx.lineWidth = 1.5;
    cons.forEach((c) => { ctx.beginPath(); c.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); c.forEach(([x, y], i) => sparkle(ctx, x, y, 12, "#ffffff", 0.6 + 0.4 * Math.sin(t * 2 + i + x))); });
    const u = (t * 0.25) % 1;
    if (u < 0.4) { const k = u / 0.4; const sx = 900 - k * 600, sy = 200 + k * 260; const g = ctx.createLinearGradient(sx, sy, sx + 160, sy - 70); g.addColorStop(0, alpha("#ffffff", 0.9 * (1 - k))); g.addColorStop(1, alpha("#ffffff", 0)); ctx.strokeStyle = g; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + 160, sy - 70); ctx.stroke(); }
  },
};

// ───────────────────── TROPICAL MEHNDI ─────────────────────
function monstera(ctx: Ctx, x: number, y: number, s: number, ang: number, color: string) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  const g = ctx.createLinearGradient(-100, 0, 100, 0); g.addColorStop(0, darken(color, 0.15)); g.addColorStop(1, lighten(color, 0.15));
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-130, -30, -140, -220, 0, -260); ctx.bezierCurveTo(140, -220, 130, -30, 0, 0); ctx.fill();
  ctx.globalCompositeOperation = "destination-out";
  for (let i = 0; i < 5; i++) { const yy = -40 - i * 44; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * (70 - Math.abs(i - 2) * 6), yy, 32, 9, sd * 0.4, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(sd * 34, yy - 10, 7, 0, Math.PI * 2); ctx.fill(); } }
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = lighten(color, 0.3); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -240); ctx.stroke();
  ctx.restore();
}

function hibiscus(ctx: Ctx, x: number, y: number, s: number, color: string, rot: number) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  for (let i = 0; i < 5; i++) {
    ctx.save(); ctx.rotate((i / 5) * Math.PI * 2);
    const g = ctx.createRadialGradient(0, -10 * s, 2, 0, -24 * s, 30 * s); g.addColorStop(0, darken(color, 0.35)); g.addColorStop(0.4, color); g.addColorStop(1, lighten(color, 0.2));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(26 * s, -14 * s, 26 * s, -46 * s, 0, -50 * s); ctx.bezierCurveTo(-26 * s, -46 * s, -26 * s, -14 * s, 0, 0); ctx.fill();
    ctx.restore();
  }
  ctx.strokeStyle = "#ffe08a"; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(18 * s, -34 * s); ctx.stroke();
  ctx.restore();
}

export const tropicalMehndi: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, lighten(p.sky, 0.2)], [1, mix(p.sky, p.deep, 0.3)]]);
    glow(ctx, 540, 960, 600, "#ffffff", 0.4);
    const r = rng(12);
    const greens = [mix("#2e7d4a", p.deep, 0.15), mix("#3f9a55", p.deep, 0.1), mix("#1f5c3a", p.deep, 0.2)];
    const edge: [number, number, number][] = [];
    for (let i = 0; i < 16; i++) edge.push([r() * W, -40 + r() * 60, Math.PI + (r() - 0.5) * 1.6]);
    for (let i = 0; i < 16; i++) edge.push([r() * W, H + 40 - r() * 60, (r() - 0.5) * 1.6]);
    for (let i = 0; i < 10; i++) edge.push([-40 + r() * 40, r() * H, Math.PI / 2 + (r() - 0.5) * 1.2]);
    for (let i = 0; i < 10; i++) edge.push([W + 40 - r() * 40, r() * H, -Math.PI / 2 + (r() - 0.5) * 1.2]);
    edge.forEach(([x, y, a], i) => {
      if (i % 3 === 0) bananaLeaf(ctx, x, y, 260 + r() * 120, a - Math.PI / 2, greens[i % 3], i % 2 ? 1 : -1);
      else monstera(ctx, x, y, 0.8 + r() * 0.5, a, greens[i % 3]);
    });
    for (let i = 0; i < 16; i++) {
      const side = i % 4;
      const x = side === 0 ? r() * W : side === 1 ? r() * W : side === 2 ? 60 + r() * 80 : W - 60 - r() * 80;
      const y = side === 0 ? 80 + r() * 140 : side === 1 ? H - 80 - r() * 140 : 300 + r() * 1300;
      hibiscus(ctx, x, y, 0.9 + r() * 0.5, i % 3 ? p.flower : p.accent, r() * 6);
    }
    for (let i = 0; i < 14; i++) marigold(ctx, r() * W, i % 2 ? 60 + r() * 120 : H - 60 - r() * 120, 16, i % 2 ? mg1(p) : mg2(p), i);
  },
  live(ctx, p, t) {
    const r = rng(9);
    for (let i = 0; i < 18; i++) lighter(ctx, () => glow(ctx, r() * W, r() * H, 26, "#fff2b0", 0.4 * Math.max(0, Math.sin(t * 1.4 + i))));
    void p;
  },
};

// ───────────────────── PASTEL GARDEN ─────────────────────
function peony(ctx: Ctx, x: number, y: number, r: number, color: string, seed: number) {
  const rr = rng(seed);
  for (let layer = 0; layer < 4; layer++) {
    const n = 9 - layer, rad = r * (1 - layer * 0.2);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + layer * 0.4 + rr() * 0.2;
      const g = ctx.createRadialGradient(x, y, 2, x + Math.cos(a) * rad * 0.5, y + Math.sin(a) * rad * 0.5, rad * 0.7);
      g.addColorStop(0, darken(color, 0.12 - layer * 0.03)); g.addColorStop(1, lighten(color, 0.25 + layer * 0.08));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * rad * 0.45, y + Math.sin(a) * rad * 0.45, rad * 0.55, rad * 0.4, a, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.fillStyle = lighten(color, 0.5); ctx.beginPath(); ctx.arc(x, y, r * 0.18, 0, Math.PI * 2); ctx.fill();
}

function eucalyptus(ctx: Ctx, x: number, y: number, len: number, ang: number, color: string) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.strokeStyle = darken(color, 0.2); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(len * 0.5, -20, len, 0); ctx.stroke();
  for (let i = 1; i < 8; i++) { const u = i / 8; ctx.fillStyle = alpha(color, 0.9); ctx.beginPath(); ctx.ellipse(len * u, -10 * Math.sin(u * Math.PI) + (i % 2 ? -14 : 14), 13 - u * 4, 10 - u * 3, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}

export const pastelGarden: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, lighten(p.sky, 0.4)], [1, lighten(p.sky, 0.1)]]);
    const r = rng(15);
    for (let i = 0; i < 26; i++) { ctx.fillStyle = alpha(i % 2 ? p.flower : p.deep, 0.07); ctx.beginPath(); ctx.ellipse(r() * W, r() * H, 140 + r() * 180, 100 + r() * 120, r() * 3, 0, Math.PI * 2); ctx.fill(); }
    // hexagon gold frame
    ctx.strokeStyle = goldGradient(ctx, 0, 0, W, H, p.accent); ctx.lineWidth = 4;
    const hex = (rx: number, ry: number) => { ctx.beginPath(); for (let i = 0; i <= 6; i++) { const a = -Math.PI / 2 + (i / 6) * Math.PI * 2; const x = 540 + Math.cos(a) * rx, y = 1000 + Math.sin(a) * ry; if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.stroke(); };
    hex(470, 720); ctx.lineWidth = 1.5; hex(450, 694);
    const sage = mix("#8fae94", p.deep, 0.15);
    const clusters: [number, number, number][] = [[130, 260, 1.2], [930, 1700, 1.3], [940, 300, 0.8], [140, 1720, 0.85]];
    clusters.forEach(([cx, cy, s], ci) => {
      for (let i = 0; i < 14; i++) eucalyptus(ctx, cx, cy, (160 + r() * 140) * s, r() * Math.PI * 2, i % 2 ? sage : lighten(sage, 0.2));
      const cols = [p.flower, lighten(p.flower, 0.35), mix(p.flower, "#ffffff", 0.6), mix(p.deep, p.flower, 0.4)];
      for (let i = 0; i < 6; i++) peony(ctx, cx + (r() - 0.5) * 220 * s, cy + (r() - 0.5) * 200 * s, (46 + r() * 26) * s, cols[(i + ci) % 4], i + ci * 10);
      for (let i = 0; i < 10; i++) { ctx.fillStyle = lighten(p.flower, 0.6); ctx.beginPath(); ctx.arc(cx + (r() - 0.5) * 320 * s, cy + (r() - 0.5) * 300 * s, 6, 0, Math.PI * 2); ctx.fill(); }
    });
  },
  live(ctx, p, t) {
    const r = rng(2);
    for (let i = 0; i < 10; i++) sparkle(ctx, 200 + r() * 680, 400 + r() * 1200, 12, lighten(p.accent, 0.4), Math.max(0, Math.sin(t * 1.5 + i * 1.3)));
    void bulb;
  },
};
