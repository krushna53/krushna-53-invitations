// Extra illustrated designs for Haldi, Mehndi and Sangeet.
// Every colour comes from the palette, so each design recolours with its colourways.
import { alpha, darken, lighten, mix } from "./color";
import { type Ctx, H, W, bananaLeaf, bulb, glow, goldGradient, hangPoints, leaf, lotus, mandala, marigold, paisley, rng, sparkle } from "./draw-kit";
import type { Palette } from "./invite-design";
import { type Scene, diya, leafGreen, mg1, mg2, vGradient } from "./scenes";

const lighter = (ctx: Ctx, fn: () => void) => {
  const prev = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = "lighter";
  fn();
  ctx.globalCompositeOperation = prev;
};

/** Soft watercolour blob made of overlapping translucent circles. */
function splash(ctx: Ctx, x: number, y: number, r: number, color: string, seed: number, a = 0.18) {
  const rr = rng(seed);
  for (let i = 0; i < 26; i++) {
    const ang = rr() * Math.PI * 2, d = rr() * r * 0.7, s = r * (0.25 + rr() * 0.45);
    ctx.fillStyle = alpha(color, a * (0.5 + rr() * 0.5));
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(ang) * d, y + Math.sin(ang) * d, s, s * (0.7 + rr() * 0.5), rr() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < 18; i++) {
    const ang = rr() * Math.PI * 2, d = r * (0.8 + rr() * 0.6);
    ctx.fillStyle = alpha(color, a * 1.6);
    ctx.beginPath();
    ctx.arc(x + Math.cos(ang) * d, y + Math.sin(ang) * d, 3 + rr() * 9, 0, Math.PI * 2);
    ctx.fill();
  }
}

function brassBowl(ctx: Ctx, p: Palette, x: number, y: number, w: number, fill: string) {
  const gold = mix(p.accent, "#d4a03a", 0.6);
  ctx.fillStyle = goldGradient(ctx, x - w, 0, x + w, 0, gold);
  ctx.beginPath(); ctx.ellipse(x, y, w, w * 0.5, 0, 0, Math.PI); ctx.fill();
  ctx.fillStyle = fill;
  ctx.beginPath(); ctx.ellipse(x, y, w, w * 0.22, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = lighten(gold, 0.3); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(x, y, w, w * 0.22, 0, 0, Math.PI * 2); ctx.stroke();
}

function kalash(ctx: Ctx, p: Palette, x: number, y: number, s: number) {
  const gold = mix(p.accent, "#d4a03a", 0.55);
  // mango leaves + coconut
  const green = leafGreen(p);
  for (let i = 0; i < 7; i++) leaf(ctx, x, y - 150 * s, 90 * s, 22 * s, -Math.PI / 2 + (i - 3) * 0.32, i % 2 ? green : darken(green, 0.15));
  const cg = ctx.createRadialGradient(x - 15 * s, y - 190 * s, 5, x, y - 170 * s, 55 * s);
  cg.addColorStop(0, "#a0673a"); cg.addColorStop(1, "#5a3518");
  ctx.fillStyle = cg;
  ctx.beginPath(); ctx.ellipse(x, y - 172 * s, 46 * s, 56 * s, 0, 0, Math.PI * 2); ctx.fill();
  // pot
  ctx.fillStyle = goldGradient(ctx, x - 90 * s, 0, x + 90 * s, 0, gold);
  ctx.beginPath();
  ctx.moveTo(x - 40 * s, y - 130 * s);
  ctx.lineTo(x + 40 * s, y - 130 * s);
  ctx.quadraticCurveTo(x + 50 * s, y - 100 * s, x + 85 * s, y - 60 * s);
  ctx.quadraticCurveTo(x + 115 * s, y, x + 60 * s, y + 40 * s);
  ctx.lineTo(x - 60 * s, y + 40 * s);
  ctx.quadraticCurveTo(x - 115 * s, y, x - 85 * s, y - 60 * s);
  ctx.quadraticCurveTo(x - 50 * s, y - 100 * s, x - 40 * s, y - 130 * s);
  ctx.fill();
  ctx.strokeStyle = alpha(p.flower, 0.9); ctx.lineWidth = 6 * s;
  ctx.beginPath(); ctx.ellipse(x, y - 40 * s, 92 * s, 16 * s, 0, 0.15, Math.PI - 0.15); ctx.stroke();
  lotus(ctx, x, y - 6 * s, 26 * s, mix(p.flower, "#c81e2b", 0.5));
}

// ───────────────────── HALDI ─────────────────────
export const haldiTurmeric: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, lighten(p.sky, 0.55)], [1, lighten(p.sky, 0.15)]]);
    splash(ctx, 140, 360, 380, p.deep, 3, 0.2);
    splash(ctx, 960, 1600, 420, p.deep, 5, 0.22);
    splash(ctx, 900, 300, 200, p.flower, 8, 0.14);
    splash(ctx, 150, 1700, 220, p.flower, 9, 0.16);
    const r = rng(4);
    for (let i = 0; i < 60; i++) { ctx.fillStyle = alpha(p.deep, 0.25 + r() * 0.3); ctx.beginPath(); ctx.arc(r() * W, r() * H, 2 + r() * 4, 0, Math.PI * 2); ctx.fill(); }
    brassBowl(ctx, p, 210, 1790, 150, mix("#f6c21a", p.deep, 0.2));
    brassBowl(ctx, p, 410, 1840, 90, mix(p.flower, "#ffffff", 0.1));
    for (let i = 0; i < 6; i++) marigold(ctx, 360 + i * 22, 1832 + (i % 2) * 6, 14, i % 2 ? mg1(p) : mg2(p), i);
    for (let i = 0; i < 5; i++) leaf(ctx, 60 + i * 40, 1700 - i * 10, 110, 28, -0.6 - i * 0.18, leafGreen(p));
  },
  live(ctx, p, t) {
    // mango-leaf toran
    const pts = hangPoints(-20, 40, W + 20, 40, 70 + Math.sin(t) * 4, 54);
    ctx.strokeStyle = alpha(darken(p.accent, 0.2), 0.9); ctx.lineWidth = 3;
    ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y))); ctx.stroke();
    pts.forEach((q, i) => {
      const sw = Math.sin(t * 1.4 + i) * 0.08;
      if (i % 2) leaf(ctx, q.x, q.y, 92, 26, Math.PI / 2 + sw, i % 4 === 1 ? leafGreen(p) : darken(leafGreen(p), 0.15));
      else { marigold(ctx, q.x, q.y + 14, 18, mg1(p), i); marigold(ctx, q.x, q.y + 46, 15, mg2(p), i + 1); }
    });
    const r = rng(17);
    for (let i = 0; i < 26; i++) {
      const x = r() * W, sp = 20 + r() * 30, y = ((r() * H - t * sp) % H + H) % H;
      ctx.fillStyle = alpha(p.deep, 0.35 + 0.25 * Math.sin(t * 2 + i));
      ctx.beginPath(); ctx.arc(x + Math.sin(t + i) * 12, y, 3 + r() * 4, 0, Math.PI * 2); ctx.fill();
    }
  },
};

function rangoli(ctx: Ctx, p: Palette, x: number, y: number, R: number, rot: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  const rings: [number, number, string][] = [[1, 24, p.flower], [0.78, 18, p.accent], [0.58, 14, lighten(p.sky, 0.3)], [0.4, 10, mix(p.flower, "#ffffff", 0.35)], [0.22, 8, p.accent]];
  rings.forEach(([k, n, c], ri) => {
    const rr = R * k;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + (ri % 2 ? Math.PI / n : 0);
      ctx.save();
      ctx.rotate(a);
      ctx.fillStyle = c;
      ctx.beginPath();
      const pl = R * 0.2 * (1 - ri * 0.1);
      ctx.moveTo(0, -rr + pl);
      ctx.quadraticCurveTo(pl * 0.55, -rr + pl * 0.3, 0, -rr - pl * 0.35);
      ctx.quadraticCurveTo(-pl * 0.55, -rr + pl * 0.3, 0, -rr + pl);
      ctx.fill();
      ctx.fillStyle = alpha("#ffffff", 0.75);
      ctx.beginPath(); ctx.arc(0, -rr - pl * 0.55, 4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    ctx.strokeStyle = alpha("#ffffff", 0.55); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, rr - R * 0.1, 0, Math.PI * 2); ctx.stroke();
  });
  ctx.fillStyle = p.accent;
  ctx.beginPath(); ctx.arc(0, 0, R * 0.1, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

export const haldiRangoli: Scene = {
  still(ctx, p) {
    const g = ctx.createRadialGradient(540, 1000, 80, 540, 1000, 1200);
    g.addColorStop(0, lighten(p.deep, 0.25)); g.addColorStop(1, darken(p.deep, 0.25));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // dotted kolam grid
    ctx.fillStyle = alpha("#ffffff", 0.12);
    for (let y = 40; y < H; y += 60) for (let x = (y / 60) % 2 ? 30 : 60; x < W; x += 60) { ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill(); }
    // side marigold columns
    for (const x of [36, W - 36]) for (let y = 0; y < H; y += 30) marigold(ctx, x, y, 16, (y / 30) % 2 ? mg1(p) : mg2(p), y);
  },
  live(ctx, p, t) {
    rangoli(ctx, p, 540, 40, 380, t * 0.08);
    rangoli(ctx, p, 540, H - 30, 380, -t * 0.08);
    for (let i = 0; i < 6; i++) {
      const a = Math.PI + 0.35 + (i / 5) * (Math.PI - 0.7);
      diya(ctx, p, 540 + Math.cos(a) * 470, H - 30 + Math.sin(a) * 470, 0.9, t, i);
    }
  },
};

export const haldiKalash: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, lighten(p.sky, 0.4)], [0.6, p.sky], [1, mix(p.sky, p.deep, 0.5)]]);
    glow(ctx, 540, 900, 700, "#ffffff", 0.5);
    const green = mix("#3f8a2c", p.deep, 0.12);
    // banana-leaf arch, built from leaves along both sides and over the top
    const cx = 540, halfW = 430, top = 330, spring = top + halfW, bottom = 1800;
    const pts: { x: number; y: number; a: number }[] = [];
    for (let y = bottom; y > spring; y -= 70) { pts.push({ x: cx - halfW, y, a: -Math.PI / 2 - 0.5 }); pts.push({ x: cx + halfW, y, a: -Math.PI / 2 + 0.5 }); }
    for (let i = 0; i <= 14; i++) { const a = Math.PI + (i / 14) * Math.PI; pts.push({ x: cx + Math.cos(a) * halfW, y: spring + Math.sin(a) * halfW, a: a + Math.PI / 2 }); }
    pts.forEach((q, i) => bananaLeaf(ctx, q.x, q.y, 240, q.a + (i % 2 ? 0.25 : -0.25), i % 3 ? green : darken(green, 0.15), i % 2 ? 1 : -1));
    // marigold line on the inner edge
    for (let y = bottom; y > spring; y -= 26) { marigold(ctx, cx - halfW + 40, y, 15, (y / 26) % 2 ? mg1(p) : mg2(p), y); marigold(ctx, cx + halfW - 40, y, 15, (y / 26) % 2 ? mg2(p) : mg1(p), y); }
    for (let i = 0; i <= 50; i++) { const a = Math.PI + (i / 50) * Math.PI; marigold(ctx, cx + Math.cos(a) * (halfW - 40), spring + Math.sin(a) * (halfW - 40), 15, i % 2 ? mg1(p) : mg2(p), i); }
    vGradient(ctx, [[0, mix(p.flower, p.deep, 0.4)], [1, darken(p.deep, 0.3)]], 1800, H);
    kalash(ctx, p, 150, 1760, 1);
    kalash(ctx, p, 930, 1760, 1);
  },
  live(ctx, p, t) {
    for (const [x, ph] of [[300, 1], [780, 2]] as const) diya(ctx, p, x, 1860, 1, t, ph);
    const r = rng(3);
    for (let i = 0; i < 12; i++) sparkle(ctx, 140 + r() * 800, 300 + r() * 1400, 10 + r() * 8, "#fff8e0", Math.max(0, Math.sin(t * 1.8 + i * 1.3)));
  },
};

// ───────────────────── MEHNDI ─────────────────────
function hennaBand(ctx: Ctx, p: Palette, y: number, flip: number) {
  ctx.save();
  ctx.translate(0, y);
  ctx.scale(1, flip);
  ctx.strokeStyle = p.accent;
  ctx.fillStyle = p.accent;
  ctx.lineWidth = 2.5;
  for (let x = -60; x < W + 120; x += 180) {
    ctx.save();
    ctx.beginPath(); ctx.arc(x, 0, 120, 0, Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, 0, 96, 0, Math.PI); ctx.stroke();
    for (let i = 0; i < 9; i++) {
      const a = (i / 8) * Math.PI;
      ctx.beginPath(); ctx.arc(x + Math.cos(a) * 108, Math.sin(a) * 108, 5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    mandala(ctx, x, 0, 70, p.accent, 0.9);
    paisley(ctx, x + 90, 150, 34, Math.PI * 0.85, p.accent, 0.9);
  }
  for (let x = 0; x < W; x += 16) { ctx.beginPath(); ctx.arc(x, 210, 3, 0, Math.PI * 2); ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(0, 230); ctx.lineTo(W, 230); ctx.stroke();
  ctx.restore();
}

export const mehndiLace: Scene = {
  still(ctx, p) {
    const g = ctx.createRadialGradient(540, 960, 80, 540, 960, 1150);
    g.addColorStop(0, mix(p.deep, p.sky, 0.35)); g.addColorStop(1, darken(p.deep, 0.3));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // faint henna texture
    const r = rng(6);
    for (let i = 0; i < 14; i++) paisley(ctx, r() * W, 450 + r() * 1000, 30 + r() * 30, r() * 6, p.accent, 0.08);
    hennaBand(ctx, p, 0, 1);
    hennaBand(ctx, p, H, -1);
    // side vines
    for (const x of [70, W - 70]) {
      ctx.strokeStyle = p.accent; ctx.lineWidth = 3;
      ctx.beginPath();
      for (let y = 260; y < H - 260; y += 4) { const xx = x + Math.sin(y / 60) * 18; if (y === 260) ctx.moveTo(xx, y); else ctx.lineTo(xx, y); }
      ctx.stroke();
      for (let y = 300; y < H - 300; y += 60) {
        const xx = x + Math.sin(y / 60) * 18;
        leaf(ctx, xx, y, 46, 14, (y / 60) % 2 ? -0.6 : Math.PI + 0.6, p.accent);
      }
    }
  },
  live(ctx, p, t) {
    const r = rng(12);
    for (let i = 0; i < 24; i++) sparkle(ctx, r() * W, r() * H, 6 + r() * 8, lighten(p.accent, 0.5), Math.max(0, Math.sin(t * 1.5 + i)) * 0.8);
  },
};

function feather(ctx: Ctx, p: Palette, len: number) {
  ctx.strokeStyle = lighten(p.accent, 0.2); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -len); ctx.stroke();
  ctx.strokeStyle = alpha(mix(p.flower, "#3f9a5a", 0.5), 0.75); ctx.lineWidth = 1.5;
  for (let i = 0; i < len * 0.75; i += 7) {
    const w = Math.min(60, i * 0.25 + 10);
    ctx.beginPath(); ctx.moveTo(0, -i); ctx.quadraticCurveTo(-w, -i - 20, -w * 1.2, -i - 40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -i); ctx.quadraticCurveTo(w, -i - 20, w * 1.2, -i - 40); ctx.stroke();
  }
  const ey = -len + 40;
  ctx.fillStyle = mix(p.flower, "#2f9a5a", 0.4);
  ctx.beginPath(); ctx.ellipse(0, ey, 48, 64, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = p.accent;
  ctx.beginPath(); ctx.ellipse(0, ey + 6, 34, 46, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = mix(p.sky, "#1d6fa8", 0.5);
  ctx.beginPath(); ctx.ellipse(0, ey + 10, 24, 32, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = darken(p.deep, 0.5);
  ctx.beginPath(); ctx.ellipse(0, ey + 14, 12, 16, 0, 0, Math.PI * 2); ctx.fill();
}

export const mehndiPeacock: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, darken(p.deep, 0.15)], [0.55, p.deep], [1, mix(p.deep, p.sky, 0.4)]]);
    glow(ctx, 540, 1000, 650, lighten(p.sky, 0.3), 0.35);
    // lotus pond
    vGradient(ctx, [[0, alpha(mix(p.sky, "#1d6fa8", 0.4), 0.0)], [0.3, alpha(mix(p.sky, "#1d6fa8", 0.4), 0.7)], [1, darken(p.deep, 0.3)]], 1580, H);
    for (let i = 0; i < 6; i++) { ctx.strokeStyle = alpha("#ffffff", 0.18); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(540, 1760 + i * 18, 300 + i * 70, 20 + i * 4, 0, 0, Math.PI * 2); ctx.stroke(); }
    const lily = (x: number, y: number, s: number) => {
      ctx.fillStyle = leafGreen(p);
      ctx.beginPath(); ctx.ellipse(x, y + 18 * s, 90 * s, 26 * s, 0, 0.3, Math.PI * 2 - 0.1); ctx.lineTo(x, y + 18 * s); ctx.fill();
      for (let i = 0; i < 7; i++) {
        const a = -Math.PI / 2 + (i - 3) * 0.38;
        ctx.save(); ctx.translate(x, y); ctx.rotate(a + Math.PI / 2);
        const g2 = ctx.createLinearGradient(0, 0, 0, -70 * s);
        g2.addColorStop(0, lighten(p.flower, 0.5)); g2.addColorStop(1, p.flower);
        ctx.fillStyle = g2;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(26 * s, -40 * s, 0, -78 * s); ctx.quadraticCurveTo(-26 * s, -40 * s, 0, 0); ctx.fill();
        ctx.restore();
      }
    };
    lily(220, 1770, 1.1); lily(860, 1800, 1.2); lily(560, 1860, 0.8);
  },
  live(ctx, p, t) {
    for (const [cx, dir] of [[-40, 1], [W + 40, -1]] as const) {
      for (let i = 0; i < 9; i++) {
        ctx.save();
        ctx.translate(cx, -40);
        ctx.rotate(Math.PI - dir * (0.25 + i * 0.13) + Math.sin(t * 0.8 + i) * 0.02);
        feather(ctx, p, 420 + (i % 3) * 70);
        ctx.restore();
      }
    }
    lighter(ctx, () => { for (const x of [220, 860, 560]) glow(ctx, x, 1740, 120, lighten(p.flower, 0.4), 0.2 + 0.1 * Math.sin(t * 2 + x)); });
  },
};

function lanternShape(ctx: Ctx, p: Palette, x: number, y: number, s: number, kind: number, color: string, t: number) {
  ctx.strokeStyle = alpha(p.accent, 0.9); ctx.lineWidth = 2;
  const f = 0.85 + 0.15 * Math.sin(t * 6 + x);
  lighter(ctx, () => glow(ctx, x, y, 150 * s * f, "#ffb347", 0.35));
  ctx.fillStyle = goldGradient(ctx, x - 30 * s, 0, x + 30 * s, 0, p.accent);
  ctx.fillRect(x - 20 * s, y - 70 * s, 40 * s, 12 * s);
  ctx.beginPath(); ctx.moveTo(x, y - 82 * s); ctx.lineTo(x - 10 * s, y - 70 * s); ctx.lineTo(x + 10 * s, y - 70 * s); ctx.fill();
  const g = ctx.createRadialGradient(x, y, 4, x, y, 60 * s);
  g.addColorStop(0, "#fff2c0"); g.addColorStop(0.5, color); g.addColorStop(1, darken(color, 0.4));
  ctx.fillStyle = g;
  ctx.beginPath();
  if (kind === 0) { ctx.moveTo(x, y - 58 * s); ctx.lineTo(x + 40 * s, y); ctx.lineTo(x, y + 62 * s); ctx.lineTo(x - 40 * s, y); }
  else if (kind === 1) ctx.ellipse(x, y, 38 * s, 56 * s, 0, 0, Math.PI * 2);
  else { ctx.moveTo(x - 30 * s, y - 56 * s); ctx.lineTo(x + 30 * s, y - 56 * s); ctx.quadraticCurveTo(x + 48 * s, y, x + 30 * s, y + 56 * s); ctx.lineTo(x - 30 * s, y + 56 * s); ctx.quadraticCurveTo(x - 48 * s, y, x - 30 * s, y - 56 * s); }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = alpha(p.accent, 0.6);
  for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(x + i * 12 * s, y - 50 * s); ctx.lineTo(x + i * 12 * s, y + 50 * s); ctx.stroke(); }
  ctx.fillStyle = goldGradient(ctx, x - 30 * s, 0, x + 30 * s, 0, p.accent);
  ctx.fillRect(x - 16 * s, y + 56 * s, 32 * s, 10 * s);
  ctx.beginPath(); ctx.moveTo(x - 6 * s, y + 66 * s); ctx.lineTo(x + 6 * s, y + 66 * s); ctx.lineTo(x, y + 96 * s); ctx.fill();
}

export const mehndiLanterns: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, darken(p.deep, 0.35)], [0.6, p.deep], [1, mix(p.deep, p.flower, 0.25)]]);
    const r = rng(2);
    for (let i = 0; i < 90; i++) { ctx.fillStyle = alpha("#fff3d0", 0.2 + r() * 0.4); ctx.beginPath(); ctx.arc(r() * W, r() * 900, r() * 2 + 0.5, 0, Math.PI * 2); ctx.fill(); }
    // floor with rug
    vGradient(ctx, [[0, mix(p.deep, p.flower, 0.35)], [1, darken(p.deep, 0.4)]], 1700, H);
    ctx.strokeStyle = alpha(p.accent, 0.6); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(180, 1740); ctx.lineTo(900, 1740); ctx.lineTo(1000, H); ctx.lineTo(80, H); ctx.closePath(); ctx.stroke();
    for (let x = 200; x < 900; x += 40) { ctx.fillStyle = alpha(p.accent, 0.5); ctx.beginPath(); ctx.arc(x, 1760, 5, 0, Math.PI * 2); ctx.fill(); }
    // potted plants
    for (const x of [90, W - 90]) {
      for (let i = 0; i < 8; i++) leaf(ctx, x, 1640, 150, 34, -Math.PI / 2 + (i - 3.5) * 0.3, i % 2 ? leafGreen(p) : darken(leafGreen(p), 0.2));
      ctx.fillStyle = goldGradient(ctx, x - 60, 0, x + 60, 0, p.accent);
      ctx.beginPath(); ctx.moveTo(x - 70, 1640); ctx.lineTo(x + 70, 1640); ctx.lineTo(x + 50, 1760); ctx.lineTo(x - 50, 1760); ctx.fill();
    }
  },
  live(ctx, p, t) {
    const strands: [number, number, number, number, number][] = [[-40, 90, 1120, 110, 160], [-40, 260, 1120, 230, 120]];
    strands.forEach(([x1, y1, x2, y2, sag], si) => {
      const pts = hangPoints(x1, y1, x2, y2, sag, 44);
      ctx.strokeStyle = alpha(p.accent, 0.5); ctx.lineWidth = 2;
      ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y))); ctx.stroke();
      pts.forEach((q, i) => bulb(ctx, q.x, q.y + 5, 4, "#ffd88a", 0.5 + 0.5 * Math.sin(t * 3 + i + si)));
    });
    const colors = [p.flower, mix(p.flower, "#ff9a3c", 0.5), lighten(p.sky, 0.2), p.accent, mix(p.flower, "#7a3cff", 0.4)];
    const L: [number, number, number, number][] = [[110, 320, 1, 0], [260, 470, 0.9, 1], [400, 330, 0.8, 2], [680, 330, 0.8, 0], [820, 470, 0.9, 2], [970, 320, 1, 1], [540, 230, 0.7, 1], [180, 620, 0.7, 2], [900, 620, 0.7, 0]];
    L.forEach(([x, y, s, k], i) => {
      const sw = Math.sin(t * 1.1 + i) * 8;
      ctx.strokeStyle = alpha(p.accent, 0.7); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + sw, y - 82 * s); ctx.stroke();
      lanternShape(ctx, p, x + sw, y, s, k, colors[i % colors.length], t);
    });
    for (const x of [300, 780]) lanternShape(ctx, p, x, 1690, 0.7, 2, colors[0], t);
  },
};

// ───────────────────── SANGEET ─────────────────────
export const sangeetDisco: Scene = {
  still(ctx, p) {
    const g = ctx.createRadialGradient(540, 300, 50, 540, 700, 1500);
    g.addColorStop(0, mix(p.deep, p.sky, 0.5)); g.addColorStop(1, darken(p.deep, 0.35));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  },
  live(ctx, p, t) {
    const colors = [p.flower, p.accent, lighten(p.sky, 0.3), mix(p.flower, "#2fd4ff", 0.5)];
    // rays
    lighter(ctx, () => {
      for (let i = 0; i < 10; i++) {
        const a = Math.PI * 0.2 + (i / 9) * Math.PI * 0.6 + Math.sin(t * 0.6 + i) * 0.12;
        ctx.save(); ctx.translate(540, 300); ctx.rotate(a - Math.PI / 2);
        const gr = ctx.createLinearGradient(0, 0, 1700, 0);
        gr.addColorStop(0, alpha(colors[i % 4], 0.3)); gr.addColorStop(1, alpha(colors[i % 4], 0));
        ctx.fillStyle = gr;
        ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(1700, -90); ctx.lineTo(1700, 90); ctx.lineTo(0, 6); ctx.fill();
        ctx.restore();
      }
    });
    // mirror ball
    ctx.strokeStyle = alpha("#ffffff", 0.6); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(540, 0); ctx.lineTo(540, 160); ctx.stroke();
    const R = 140, cx = 540, cy = 300;
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = "#6d6a78"; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    const tile = 22;
    for (let y = -R; y < R; y += tile) {
      const rowW = Math.sqrt(Math.max(0, R * R - (y + tile / 2) ** 2));
      const n = Math.max(1, Math.floor((rowW * 2) / tile));
      for (let i = 0; i < n; i++) {
        const x = -rowW + (i + 0.5) * ((rowW * 2) / n);
        const shine = 0.5 + 0.5 * Math.sin(t * 3 + i * 1.7 + y * 0.3);
        ctx.fillStyle = mix("#8c8a99", "#ffffff", shine * 0.8);
        ctx.fillRect(cx + x - tile / 2 + 1, cy + y + 1, (rowW * 2) / n - 2, tile - 2);
      }
    }
    const sh = ctx.createRadialGradient(cx - 50, cy - 60, 10, cx, cy, R);
    sh.addColorStop(0, alpha("#ffffff", 0.4)); sh.addColorStop(1, alpha("#000000", 0.45));
    ctx.fillStyle = sh; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    ctx.restore();
    for (let i = 0; i < 5; i++) sparkle(ctx, cx + Math.cos(t * 2 + i * 1.3) * R * 0.8, cy + Math.sin(t * 1.4 + i) * R * 0.8, 20, "#ffffff", Math.max(0, Math.sin(t * 4 + i * 2)));
    // dance floor in perspective
    const top = 1560, rows = 6;
    for (let r = 0; r < rows; r++) {
      const y1 = top + Math.pow(r / rows, 1.4) * (H - top), y2 = top + Math.pow((r + 1) / rows, 1.4) * (H - top);
      const w1 = 500 + r * 120, w2 = 500 + (r + 1) * 120;
      const cols = 7;
      for (let c = 0; c < cols; c++) {
        const on = (c + r + Math.floor(t * 4)) % 3 === 0;
        const x1a = 540 - w1 + (c / cols) * w1 * 2, x1b = 540 - w1 + ((c + 1) / cols) * w1 * 2;
        const x2a = 540 - w2 + (c / cols) * w2 * 2, x2b = 540 - w2 + ((c + 1) / cols) * w2 * 2;
        ctx.fillStyle = on ? alpha(colors[(c + r) % 4], 0.85) : alpha(darken(p.deep, 0.4), 0.9);
        ctx.beginPath(); ctx.moveTo(x1a + 2, y1 + 2); ctx.lineTo(x1b - 2, y1 + 2); ctx.lineTo(x2b - 2, y2 - 2); ctx.lineTo(x2a + 2, y2 - 2); ctx.closePath(); ctx.fill();
      }
    }
  },
};

function note(ctx: Ctx, x: number, y: number, s: number, color: string, double: boolean) {
  ctx.fillStyle = color; ctx.strokeStyle = color; ctx.lineWidth = 5 * s;
  ctx.beginPath(); ctx.ellipse(x, y, 18 * s, 13 * s, -0.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + 16 * s, y - 4 * s); ctx.lineTo(x + 16 * s, y - 80 * s); ctx.stroke();
  if (double) {
    ctx.beginPath(); ctx.ellipse(x + 60 * s, y - 12 * s, 18 * s, 13 * s, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + 76 * s, y - 16 * s); ctx.lineTo(x + 76 * s, y - 92 * s); ctx.stroke();
    ctx.lineWidth = 12 * s; ctx.beginPath(); ctx.moveTo(x + 16 * s, y - 80 * s); ctx.lineTo(x + 76 * s, y - 92 * s); ctx.stroke();
  } else { ctx.beginPath(); ctx.moveTo(x + 16 * s, y - 80 * s); ctx.quadraticCurveTo(x + 50 * s, y - 60 * s, x + 40 * s, y - 30 * s); ctx.stroke(); }
}

function dhol(ctx: Ctx, p: Palette, x: number, y: number, s: number, angle: number) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
  const w = 260 * s, h = 170 * s;
  const body = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
  body.addColorStop(0, lighten(p.flower, 0.2)); body.addColorStop(0.5, p.flower); body.addColorStop(1, darken(p.flower, 0.35));
  ctx.fillStyle = body;
  ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.quadraticCurveTo(0, -h / 2 - 25 * s, w / 2, -h / 2); ctx.lineTo(w / 2, h / 2); ctx.quadraticCurveTo(0, h / 2 + 25 * s, -w / 2, h / 2); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = lighten(p.accent, 0.3); ctx.lineWidth = 3 * s;
  ctx.beginPath();
  for (let i = 0; i <= 8; i++) { const xx = -w / 2 + (i / 8) * w; ctx.lineTo(xx, i % 2 ? h / 2 - 10 * s : -h / 2 + 10 * s); }
  ctx.stroke();
  for (const sx of [-1, 1]) {
    ctx.fillStyle = mix("#f3e2c2", p.sky, 0.1);
    ctx.beginPath(); ctx.ellipse(sx * w / 2, 0, 24 * s, h / 2 + 4 * s, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = goldGradient(ctx, -10, 0, 10, 0, p.accent); ctx.lineWidth = 7 * s; ctx.stroke();
  }
  ctx.restore();
}

export const sangeetDhol: Scene = {
  still(ctx, p) {
    const g = ctx.createRadialGradient(540, 950, 80, 540, 950, 1250);
    g.addColorStop(0, mix(p.deep, p.sky, 0.45)); g.addColorStop(1, darken(p.deep, 0.35));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = alpha(p.accent, 0.12); ctx.lineWidth = 2;
    for (let i = 0; i < 9; i++) { ctx.beginPath(); for (let x = 0; x <= W; x += 10) { const y = 260 + i * 16 + Math.sin(x / 70 + i) * 26; if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.stroke(); }
    // bunting
    const pts = hangPoints(-20, 30, W + 20, 30, 90, 60);
    pts.forEach((q, i) => { ctx.fillStyle = [p.flower, p.accent, lighten(p.sky, 0.3), mix(p.flower, "#2fd4ff", 0.4)][i % 4]; ctx.beginPath(); ctx.moveTo(q.x - 24, q.y); ctx.lineTo(q.x + 24, q.y); ctx.lineTo(q.x, q.y + 52); ctx.fill(); });
    dhol(ctx, p, 170, 1720, 1.1, -0.35);
    dhol(ctx, p, 910, 1720, 1.1, 0.35);
    // tabla pair
    for (const [x, w] of [[470, 70], [600, 90]] as const) {
      ctx.fillStyle = goldGradient(ctx, x - w, 0, x + w, 0, p.accent);
      ctx.beginPath(); ctx.moveTo(x - w, 1760); ctx.quadraticCurveTo(x - w * 1.2, 1860, x - w * 0.6, 1880); ctx.lineTo(x + w * 0.6, 1880); ctx.quadraticCurveTo(x + w * 1.2, 1860, x + w, 1760); ctx.fill();
      ctx.fillStyle = "#2a1a12"; ctx.beginPath(); ctx.ellipse(x, 1760, w, w * 0.22, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f2e6cc"; ctx.beginPath(); ctx.ellipse(x, 1760, w * 0.8, w * 0.16, 0, 0, Math.PI * 2); ctx.fill();
    }
  },
  live(ctx, p, t) {
    const beat = (t * 2) % 1;
    lighter(ctx, () => {
      for (const x of [170, 910]) for (let k = 0; k < 3; k++) {
        const rr = 120 + ((beat + k / 3) % 1) * 260;
        ctx.strokeStyle = alpha(lighten(p.accent, 0.4), 0.35 * (1 - ((beat + k / 3) % 1)));
        ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, 1700, rr, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      }
    });
    const r = rng(8);
    for (let i = 0; i < 14; i++) {
      const x = r() * W, sp = 40 + r() * 50, y = ((r() * H - t * sp) % H + H) % H;
      ctx.save(); ctx.globalAlpha *= 0.55 + 0.3 * Math.sin(t + i);
      note(ctx, x + Math.sin(t + i) * 20, y, 0.6 + r() * 0.5, i % 2 ? lighten(p.accent, 0.3) : lighten(p.flower, 0.3), i % 3 === 0);
      ctx.restore();
    }
  },
};

export const sangeetNeon: Scene = {
  still(ctx, p) {
    ctx.fillStyle = darken(p.deep, 0.55); ctx.fillRect(0, 0, W, H);
    // brick wall
    ctx.strokeStyle = alpha(lighten(p.deep, 0.25), 0.35); ctx.lineWidth = 2;
    for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); for (let x = (y / 60) % 2 ? 0 : 60; x < W; x += 120) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 60); ctx.stroke(); } }
    const v = ctx.createRadialGradient(540, 960, 200, 540, 960, 1200);
    v.addColorStop(0, alpha(mix(p.deep, p.sky, 0.3), 0.3)); v.addColorStop(1, alpha("#000000", 0.6));
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    vGradient(ctx, [[0, alpha("#000000", 0.3)], [1, alpha("#000000", 0.85)]], 1650, H);
  },
  live(ctx, p, t) {
    const neon = (draw: () => void, color: string, on: number) => {
      ctx.save();
      ctx.strokeStyle = color; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.shadowColor = color; ctx.shadowBlur = 30 * on;
      ctx.globalAlpha *= 0.35 + 0.65 * on;
      ctx.lineWidth = 9; draw();
      ctx.shadowBlur = 0; ctx.strokeStyle = mix(color, "#ffffff", 0.6); ctx.lineWidth = 3; draw();
      ctx.restore();
    };
    const flick = (k: number) => (Math.sin(t * 23 + k) > 0.96 ? 0.3 : 1);
    const c1 = lighten(p.flower, 0.2), c2 = lighten(p.accent, 0.2), c3 = lighten(p.sky, 0.4);
    neon(() => { ctx.beginPath(); ctx.moveTo(150, 1640); ctx.lineTo(150, 700); ctx.arc(540, 700, 390, Math.PI, 0); ctx.lineTo(930, 1640); ctx.stroke(); }, c1, flick(1));
    neon(() => { ctx.beginPath(); ctx.moveTo(185, 1640); ctx.lineTo(185, 700); ctx.arc(540, 700, 355, Math.PI, 0); ctx.lineTo(895, 1640); ctx.stroke(); }, c2, flick(2));
    const star = (x: number, y: number, r: number) => { ctx.beginPath(); for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + (i / 10) * Math.PI * 2; const rr = i % 2 ? r * 0.45 : r; if (i === 0) ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); else ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.stroke(); };
    neon(() => star(130, 200, 50), c3, 0.6 + 0.4 * Math.sin(t * 3));
    neon(() => star(950, 160, 40), c1, 0.6 + 0.4 * Math.sin(t * 3 + 2));
    neon(() => star(900, 420, 28), c2, 0.6 + 0.4 * Math.sin(t * 3 + 4));
    neon(() => { ctx.beginPath(); ctx.ellipse(220, 420, 22, 16, -0.4, 0, Math.PI * 2); ctx.moveTo(240, 414); ctx.lineTo(240, 330); ctx.lineTo(300, 318); ctx.lineTo(300, 400); ctx.stroke(); ctx.beginPath(); ctx.ellipse(280, 406, 22, 16, -0.4, 0, Math.PI * 2); ctx.stroke(); }, c3, flick(5));
    // floor reflection
    ctx.save(); ctx.globalAlpha = 0.25;
    neon(() => { ctx.beginPath(); ctx.moveTo(150, 1660); ctx.lineTo(150, 1900); ctx.moveTo(930, 1660); ctx.lineTo(930, 1900); ctx.stroke(); }, c1, 1);
    ctx.restore();
  },
};

