// Regional & cultural designs: motifs drawn from each tradition, all palette-driven.
import { alpha, darken, lighten, mix } from "./color";
import { type Ctx, H, W, bananaLeaf, bulb, glow, goldGradient, hangPoints, leaf, lotus, marigold, rng, rose, sparkle } from "./draw-kit";
import type { Palette } from "./invite-design";
import { type Scene, diya, leafGreen, mg1, mg2, vGradient } from "./scenes";

const lighter = (ctx: Ctx, fn: () => void) => {
  const prev = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = "lighter";
  fn();
  ctx.globalCompositeOperation = prev;
};

function thoranam(ctx: Ctx, p: Palette, y: number, t: number) {
  const pts = hangPoints(-20, y, W + 20, y, 60 + Math.sin(t) * 4, 54);
  ctx.strokeStyle = alpha(darken(p.accent, 0.2), 0.9); ctx.lineWidth = 3;
  ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y))); ctx.stroke();
  pts.forEach((q, i) => {
    const sw = Math.sin(t * 1.4 + i) * 0.08;
    if (i % 2) leaf(ctx, q.x, q.y, 88, 26, Math.PI / 2 + sw, i % 4 === 1 ? leafGreen(p) : darken(leafGreen(p), 0.15));
    else { marigold(ctx, q.x, q.y + 14, 17, mg1(p), i); marigold(ctx, q.x, q.y + 44, 14, mg2(p), i + 1); }
  });
}

function flame(ctx: Ctx, x: number, y: number, s: number, t: number, seed: number) {
  const f = 0.85 + 0.15 * Math.sin(t * 12 + seed) * Math.sin(t * 7 + seed * 2);
  lighter(ctx, () => glow(ctx, x, y - 14 * s, 90 * s * f, "#ffb347", 0.35));
  const g = ctx.createRadialGradient(x, y - 10 * s, 1, x, y - 14 * s, 18 * s);
  g.addColorStop(0, "#fffbe0"); g.addColorStop(0.5, "#ffd34d"); g.addColorStop(1, alpha("#ff7a1a", 0));
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(x - 7 * s, y); ctx.quadraticCurveTo(x + Math.sin(t * 9 + seed) * 3 * s, y - 40 * s * f, x + 7 * s, y); ctx.fill();
}

function palm(ctx: Ctx, x: number, base: number, h: number, lean: number, color: string, t = 0) {
  ctx.strokeStyle = color; ctx.lineWidth = 16; ctx.lineCap = "round";
  const tx = x + lean, ty = base - h;
  ctx.beginPath(); ctx.moveTo(x, base); ctx.quadraticCurveTo(x + lean * 0.2, base - h * 0.6, tx, ty); ctx.stroke();
  for (let i = 0; i < 9; i++) {
    const a = -Math.PI / 2 + (i - 4) * 0.42 + Math.sin(t * 0.8 + i) * 0.04;
    ctx.save(); ctx.translate(tx, ty); ctx.rotate(a);
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(110, -40, 230, 30); ctx.quadraticCurveTo(110, -10, 0, 0); ctx.fill();
    ctx.restore();
  }
}

// ───────────────────── SOUTH INDIAN ─────────────────────
export function gopuram(ctx: Ctx, x: number, base: number, w: number, h: number, color: string, gold: string) {
  const tiers = 7;
  ctx.fillStyle = color;
  for (let i = 0; i < tiers; i++) {
    const y1 = base - (i / tiers) * h, y2 = base - ((i + 1) / tiers) * h;
    const w1 = w * (1 - i * 0.1), w2 = w * (1 - (i + 1) * 0.1);
    ctx.beginPath(); ctx.moveTo(x - w1 / 2, y1); ctx.lineTo(x - w2 / 2, y2 + 6); ctx.lineTo(x + w2 / 2, y2 + 6); ctx.lineTo(x + w1 / 2, y1); ctx.fill();
    ctx.strokeStyle = alpha(gold, 0.6); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - w2 / 2, y2 + 6); ctx.lineTo(x + w2 / 2, y2 + 6); ctx.stroke();
    for (let k = -2; k <= 2; k++) { ctx.fillStyle = alpha(gold, 0.35); ctx.fillRect(x + k * w2 * 0.16 - 4, y2 + 14, 8, (y1 - y2) * 0.6); ctx.fillStyle = color; }
  }
  const topW = w * (1 - tiers * 0.1);
  ctx.beginPath(); ctx.ellipse(x, base - h, topW * 0.65, 34, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = gold;
  for (const dx of [-0.35, 0, 0.35]) { ctx.beginPath(); ctx.moveTo(x + dx * topW - 6, base - h - 20); ctx.lineTo(x + dx * topW, base - h - 56); ctx.lineTo(x + dx * topW + 6, base - h - 20); ctx.fill(); }
}

function kuthuvilakku(ctx: Ctx, p: Palette, x: number, base: number, s: number) {
  const gold = mix(p.accent, "#d4a03a", 0.5);
  ctx.fillStyle = goldGradient(ctx, x - 60 * s, 0, x + 60 * s, 0, gold);
  ctx.beginPath(); ctx.ellipse(x, base, 70 * s, 18 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(x - 8 * s, base - 260 * s, 16 * s, 260 * s);
  for (const y of [base - 90 * s, base - 180 * s]) { ctx.beginPath(); ctx.ellipse(x, y, 22 * s, 9 * s, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.beginPath(); ctx.ellipse(x, base - 262 * s, 64 * s, 16 * s, 0, 0, Math.PI); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 10 * s, base - 270 * s); ctx.lineTo(x, base - 330 * s); ctx.lineTo(x + 10 * s, base - 270 * s); ctx.fill();
}

export const southMuhurtham: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, lighten(p.sky, 0.35)], [0.55, p.sky], [1, mix(p.sky, p.deep, 0.55)]]);
    glow(ctx, 540, 900, 650, "#ffffff", 0.45);
    gopuram(ctx, 130, 1720, 300, 860, alpha(darken(p.deep, 0.15), 0.9), p.accent);
    gopuram(ctx, 950, 1720, 300, 860, alpha(darken(p.deep, 0.15), 0.9), p.accent);
    // banana trees at the edges
    for (const [x, flip] of [[20, 1], [W - 20, -1]] as const) {
      ctx.fillStyle = mix("#7a8f3a", p.deep, 0.2); ctx.fillRect(x - 14, 1300, 28, 520);
      for (let i = 0; i < 6; i++) bananaLeaf(ctx, x, 1320, 300, -Math.PI / 2 + (i - 2.5) * 0.45 * flip, mix("#3f8a2c", p.deep, 0.1), flip);
    }
    // floor with kolam
    vGradient(ctx, [[0, mix(p.deep, "#7a3b1a", 0.3)], [1, darken(p.deep, 0.35)]], 1720, H);
    ctx.strokeStyle = alpha("#ffffff", 0.85); ctx.lineWidth = 3; ctx.fillStyle = alpha("#ffffff", 0.9);
    for (let i = -3; i <= 3; i++) for (let j = 0; j < 3; j++) {
      const x = 540 + i * 70 + (j % 2) * 35, y = 1770 + j * 50;
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x, y, 30, 20, Math.PI / 4, 0, Math.PI * 2); ctx.stroke();
    }
    kuthuvilakku(ctx, p, 300, 1750, 1);
    kuthuvilakku(ctx, p, 780, 1750, 1);
    // jasmine strings
    for (const x of [270, 330, 750, 810]) for (let y = 0; y < 420 + (x % 3) * 40; y += 14) { ctx.fillStyle = "#fffdf6"; ctx.beginPath(); ctx.arc(x + Math.sin(y / 30) * 3, y, 6, 0, Math.PI * 2); ctx.fill(); }
  },
  live(ctx, p, t) {
    thoranam(ctx, p, 30, t);
    for (const x of [300, 780]) for (const dx of [-50, 0, 50]) flame(ctx, x + dx, 1478, 1, t, x + dx);
  },
};

// ───────────────────── KERALA ─────────────────────
function kasavuBand(ctx: Ctx, p: Palette, y: number, h: number) {
  ctx.fillStyle = goldGradient(ctx, 0, y, W, y, mix(p.accent, "#e0b54a", 0.4));
  ctx.fillRect(0, y, W, h);
  ctx.fillStyle = p.deep;
  ctx.fillRect(0, y + h * 0.18, W, h * 0.08);
  ctx.fillRect(0, y + h * 0.74, W, h * 0.08);
  ctx.fillStyle = alpha(lighten(p.accent, 0.5), 0.6);
  for (let x = 10; x < W; x += 34) { ctx.beginPath(); ctx.moveTo(x, y + h * 0.5 - 10); ctx.lineTo(x + 10, y + h * 0.5); ctx.lineTo(x, y + h * 0.5 + 10); ctx.lineTo(x - 10, y + h * 0.5); ctx.fill(); }
}

export const keralaKasavu: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, lighten(p.sky, 0.4)], [1, p.sky]]);
    kasavuBand(ctx, p, 0, 120);
    for (const x of [0, W - 46]) { ctx.fillStyle = goldGradient(ctx, x, 0, x + 46, 0, mix(p.accent, "#e0b54a", 0.4)); ctx.fillRect(x, 120, 46, 1300); ctx.fillStyle = p.deep; ctx.fillRect(x + 18, 120, 8, 1300); }
    // backwaters
    const wy = 1500;
    vGradient(ctx, [[0, mix(p.sky, "#f6c27a", 0.4)], [1, mix(p.sky, p.deep, 0.25)]], 1240, wy);
    vGradient(ctx, [[0, mix(p.deep, "#3c8d9a", 0.4)], [1, darken(p.deep, 0.35)]], wy, H);
    const green = darken(p.deep, 0.2);
    ctx.fillStyle = green;
    ctx.beginPath(); ctx.moveTo(0, wy); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, wy - 30 - Math.sin(x / 90) * 20); ctx.lineTo(W, wy); ctx.fill();
    palm(ctx, 60, wy + 20, 300, 40, green);
    palm(ctx, 170, wy + 10, 220, 30, darken(green, 0.15));
    palm(ctx, 1020, wy + 20, 310, -50, green);
    palm(ctx, 910, wy + 10, 210, -30, darken(green, 0.15));
    // houseboat
    ctx.fillStyle = darken(p.deep, 0.45);
    ctx.beginPath(); ctx.moveTo(380, wy + 70); ctx.quadraticCurveTo(540, wy + 120, 720, wy + 60); ctx.lineTo(700, wy + 40); ctx.lineTo(400, wy + 40); ctx.fill();
    ctx.fillStyle = mix("#c9a26b", p.deep, 0.3);
    ctx.beginPath(); ctx.moveTo(420, wy + 40); ctx.quadraticCurveTo(550, wy - 40, 680, wy + 40); ctx.fill();
    kasavuBand(ctx, p, H - 90, 90);
  },
  live(ctx, p, t) {
    ctx.strokeStyle = alpha("#ffffff", 0.25); ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
      const y = 1560 + i * 30, off = Math.sin(t + i) * 30;
      ctx.beginPath(); ctx.moveTo(200 + off + i * 10, y); ctx.lineTo(420 + off + i * 10, y); ctx.moveTo(600 - off, y + 10); ctx.lineTo(820 - off, y + 10); ctx.stroke();
    }
    // nilavilakku at the top centre
    const gold = mix(p.accent, "#d4a03a", 0.5);
    ctx.fillStyle = goldGradient(ctx, 480, 0, 600, 0, gold);
    ctx.beginPath(); ctx.ellipse(540, 270, 60, 14, 0, 0, Math.PI); ctx.fill();
    ctx.fillRect(534, 270, 12, 60);
    ctx.beginPath(); ctx.ellipse(540, 330, 34, 8, 0, 0, Math.PI * 2); ctx.fill();
    for (const dx of [-40, 0, 40]) flame(ctx, 540 + dx, 262, 0.9, t, dx);
    for (const x of [140, 940]) for (let y = 130; y < 520; y += 14) { ctx.fillStyle = "#fffdf6"; ctx.beginPath(); ctx.arc(x + Math.sin(y / 30 + t) * 4, y, 6, 0, Math.PI * 2); ctx.fill(); }
  },
};

// ───────────────────── BENGALI ─────────────────────
function alponaRing(ctx: Ctx, x: number, y: number, R: number, color: string) {
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 4;
  for (const k of [1, 0.78, 0.55, 0.32]) {
    const r = R * k;
    const n = Math.round(10 + k * 14);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      ctx.save(); ctx.translate(x + Math.cos(a) * r, y + Math.sin(a) * r); ctx.rotate(a + Math.PI / 2);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(R * 0.09, -R * 0.08, R * 0.05, -R * 0.2, 0, -R * 0.22); ctx.bezierCurveTo(-R * 0.05, -R * 0.2, -R * 0.09, -R * 0.08, 0, 0); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -R * 0.27, 4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    ctx.beginPath(); ctx.arc(x, y, r - R * 0.04, 0, Math.PI * 2); ctx.stroke();
  }
  lotus(ctx, x, y + R * 0.08, R * 0.2, color);
}

function fish(ctx: Ctx, x: number, y: number, s: number, flip: number, color: string, fill: string) {
  ctx.save(); ctx.translate(x, y); ctx.scale(flip * s, s);
  ctx.fillStyle = fill; ctx.strokeStyle = color; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-90, 0); ctx.quadraticCurveTo(0, -60, 90, 0); ctx.quadraticCurveTo(0, 60, -90, 0); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(85, 0); ctx.lineTo(130, -36); ctx.lineTo(120, 0); ctx.lineTo(130, 36); ctx.closePath(); ctx.fill(); ctx.stroke();
  for (let i = -50; i < 70; i += 20) { ctx.beginPath(); ctx.arc(i, 0, 14, -Math.PI / 2, Math.PI / 2); ctx.stroke(); }
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(-60, -8, 6, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function shankha(ctx: Ctx, x: number, y: number, s: number, ang: number, color: string) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  const g = ctx.createLinearGradient(-60, 0, 60, 0); g.addColorStop(0, "#fffaf0"); g.addColorStop(1, "#e7dcc8");
  ctx.fillStyle = g; ctx.strokeStyle = color; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-80, 0); ctx.quadraticCurveTo(-40, -55, 30, -40); ctx.quadraticCurveTo(80, -20, 90, 0); ctx.quadraticCurveTo(60, 30, 0, 40); ctx.quadraticCurveTo(-50, 40, -80, 0); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(20 - i * 18, -4, 20 - i * 3, -1.2, 1.2); ctx.stroke(); }
  ctx.restore();
}

export const bengaliAlpona: Scene = {
  still(ctx, p) {
    const g = ctx.createRadialGradient(540, 960, 80, 540, 960, 1200);
    g.addColorStop(0, lighten(p.deep, 0.12)); g.addColorStop(1, darken(p.deep, 0.3));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const white = mix("#fffaf0", p.sky, 0.1);
    alponaRing(ctx, 540, -40, 420, white);
    alponaRing(ctx, 540, H + 40, 420, white);
    // side borders: dotted vines
    ctx.strokeStyle = white; ctx.fillStyle = white; ctx.lineWidth = 3;
    for (const x of [56, W - 56]) {
      ctx.beginPath(); for (let y = 380; y < H - 380; y += 6) { const xx = x + Math.sin(y / 50) * 16; if (y === 380) ctx.moveTo(xx, y); else ctx.lineTo(xx, y); } ctx.stroke();
      for (let y = 400; y < H - 400; y += 50) { const xx = x + Math.sin(y / 50) * 16; ctx.beginPath(); ctx.arc(xx + (y % 100 ? 16 : -16), y, 6, 0, Math.PI * 2); ctx.fill(); }
    }
    fish(ctx, 180, 470, 0.8, 1, white, alpha(p.accent, 0.9));
    fish(ctx, 900, 470, 0.8, -1, white, alpha(p.accent, 0.9));
    shankha(ctx, 200, 1500, 0.9, -0.3, p.accent);
    shankha(ctx, 880, 1500, 0.9, Math.PI + 0.3, p.accent);
  },
  live(ctx, p, t) {
    const r = rng(7);
    for (let i = 0; i < 18; i++) sparkle(ctx, r() * W, 400 + r() * 1100, 8 + r() * 8, lighten(p.accent, 0.5), Math.max(0, Math.sin(t * 1.6 + i)) * 0.8);
  },
};

// ───────────────────── MARATHI ─────────────────────
function paithaniPeacock(ctx: Ctx, x: number, y: number, s: number, flip: number, gold: string, body: string) {
  ctx.save(); ctx.translate(x, y); ctx.scale(flip * s, s);
  ctx.fillStyle = gold;
  for (let i = 0; i < 7; i++) { const a = -Math.PI + 0.25 + i * 0.3; ctx.beginPath(); ctx.ellipse(Math.cos(a) * 70 - 40, Math.sin(a) * 70, 22, 12, a, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = body;
  ctx.beginPath(); ctx.ellipse(10, 10, 46, 30, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(40, 0); ctx.quadraticCurveTo(70, -40, 60, -80); ctx.lineTo(48, -78); ctx.quadraticCurveTo(52, -40, 26, -6); ctx.fill();
  ctx.beginPath(); ctx.arc(56, -84, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = gold; ctx.beginPath(); ctx.moveTo(66, -86); ctx.lineTo(84, -80); ctx.lineTo(66, -78); ctx.fill();
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(52 + i * 5, -96); ctx.lineTo(48 + i * 7, -114); ctx.lineWidth = 2; ctx.strokeStyle = gold; ctx.stroke(); }
  ctx.restore();
}

export const marathiPaithani: Scene = {
  still(ctx, p) {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, darken(p.deep, 0.2)); g.addColorStop(0.5, lighten(p.deep, 0.12)); g.addColorStop(1, darken(p.deep, 0.25));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const gold = mix(p.accent, "#e0b54a", 0.35);
    // pallu border at the bottom
    const by = 1560;
    ctx.fillStyle = goldGradient(ctx, 0, 0, W, 0, gold); ctx.fillRect(0, by, W, H - by);
    ctx.fillStyle = p.flower; ctx.fillRect(0, by + 18, W, 12); ctx.fillRect(0, H - 40, W, 12);
    for (let i = 0; i < 4; i++) paithaniPeacock(ctx, 140 + i * 270, by + 220, 1.05, i % 2 ? -1 : 1, darken(gold, 0.35), p.flower);
    for (let x = 0; x < W; x += 60) lotus(ctx, x + 30, by + 70, 18, darken(gold, 0.35));
    // top border with mango (paisley) motifs
    ctx.fillStyle = goldGradient(ctx, 0, 0, W, 0, gold); ctx.fillRect(0, 0, W, 150);
    ctx.fillStyle = p.flower; ctx.fillRect(0, 130, W, 10);
    for (let x = 30; x < W; x += 90) {
      ctx.save(); ctx.translate(x, 70); ctx.rotate(0.4);
      ctx.fillStyle = darken(gold, 0.35);
      ctx.beginPath(); ctx.moveTo(0, -36); ctx.bezierCurveTo(30, -30, 30, 26, 0, 30); ctx.bezierCurveTo(-26, 30, -26, 0, 0, -6); ctx.bezierCurveTo(10, -14, 6, -30, 0, -36); ctx.fill();
      ctx.restore();
    }
    // zari side stripes
    for (const x of [40, W - 52]) { ctx.fillStyle = alpha(gold, 0.85); ctx.fillRect(x, 150, 12, by - 150); ctx.fillRect(x + 22, 150, 4, by - 150); }
  },
  live(ctx, p, t) {
    // silk sheen
    const sx = ((t * 220) % (W + 900)) - 450;
    lighter(ctx, () => {
      const g = ctx.createLinearGradient(sx - 220, 0, sx + 220, 400);
      g.addColorStop(0, alpha("#ffffff", 0)); g.addColorStop(0.5, alpha("#ffffff", 0.07)); g.addColorStop(1, alpha("#ffffff", 0));
      ctx.fillStyle = g; ctx.fillRect(0, 150, W, 1410);
    });
    // akshata (rice) shower
    const r = rng(11);
    for (let i = 0; i < 40; i++) {
      const x = r() * W, sp = 80 + r() * 90, y = ((r() * H + t * sp) % 1450) + 150;
      ctx.save(); ctx.translate(x + Math.sin(t + i) * 10, y); ctx.rotate(r() * 6 + t);
      ctx.fillStyle = i % 4 ? "#fff6dc" : mix("#ffd23a", p.flower, 0.3);
      ctx.beginPath(); ctx.ellipse(0, 0, 5, 2.4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  },
};

// ───────────────────── GUJARATI ─────────────────────
function garbo(ctx: Ctx, p: Palette, x: number, y: number, s: number, t: number) {
  lighter(ctx, () => glow(ctx, x, y, 200 * s * (0.9 + 0.1 * Math.sin(t * 7 + x)), "#ffb347", 0.4));
  const g = ctx.createRadialGradient(x - 20 * s, y - 20 * s, 10, x, y, 90 * s);
  g.addColorStop(0, lighten(p.flower, 0.2)); g.addColorStop(1, darken(p.flower, 0.4));
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.ellipse(x, y, 80 * s, 72 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = darken(p.flower, 0.3); ctx.fillRect(x - 34 * s, y - 92 * s, 68 * s, 24 * s);
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2, rr = (i % 2 ? 40 : 58) * s;
    ctx.fillStyle = alpha("#ffe39a", 0.6 + 0.4 * Math.sin(t * 6 + i));
    ctx.beginPath(); ctx.arc(x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.85, 6 * s, 0, Math.PI * 2); ctx.fill();
  }
  flame(ctx, x, y - 92 * s, 0.9 * s, t, x);
}

function mirrorRow(ctx: Ctx, p: Palette, y: number, t: number) {
  for (let x = 30; x < W; x += 60) {
    ctx.strokeStyle = p.accent; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI * 2); ctx.stroke();
    const m = ctx.createRadialGradient(x - 5, y - 5, 2, x, y, 16);
    m.addColorStop(0, "#ffffff"); m.addColorStop(1, "#9aa3ad");
    ctx.fillStyle = m; ctx.beginPath(); ctx.arc(x, y, 15, 0, Math.PI * 2); ctx.fill();
    if (Math.sin(t * 3 + x) > 0.9) sparkle(ctx, x + 4, y - 4, 14, "#ffffff", 1);
    ctx.fillStyle = p.flower; for (const dx of [-30, 30]) { ctx.beginPath(); ctx.moveTo(x + dx / 2, y - 26); ctx.lineTo(x + dx / 2 + 6, y - 18); ctx.lineTo(x + dx / 2, y - 10); ctx.lineTo(x + dx / 2 - 6, y - 18); ctx.fill(); }
  }
}

export const gujaratiBandhani: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, p.deep], [1, darken(p.deep, 0.25)]]);
    // bandhani dots in diamond clusters
    const dot = (x: number, y: number, c: string) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill(); };
    for (let y = 0; y < H; y += 72) for (let x = (y / 72) % 2 ? 36 : 0; x < W; x += 72) {
      const c = alpha((x + y) % 144 ? p.sky : p.accent, 0.55);
      dot(x, y - 10, c); dot(x - 10, y, c); dot(x + 10, y, c); dot(x, y + 10, c);
    }
    const v = ctx.createRadialGradient(540, 980, 200, 540, 980, 900);
    v.addColorStop(0, alpha(darken(p.deep, 0.3), 0.8)); v.addColorStop(1, alpha(darken(p.deep, 0.3), 0));
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    // embroidered bands
    for (const y of [0, H - 150]) { ctx.fillStyle = darken(p.deep, 0.35); ctx.fillRect(0, y, W, 150); }
    // dandiya sticks
    for (const [x, a] of [[160, -0.5], [920, 0.5]] as const) for (const k of [-1, 1]) {
      ctx.save(); ctx.translate(x, 1520); ctx.rotate(a + k * 0.45);
      const g = ctx.createLinearGradient(-8, 0, 8, 0); g.addColorStop(0, darken(p.accent, 0.2)); g.addColorStop(1, lighten(p.accent, 0.3));
      ctx.fillStyle = g; ctx.fillRect(-8, -150, 16, 300);
      ctx.fillStyle = p.flower; for (let i = -120; i < 140; i += 40) ctx.fillRect(-8, i, 16, 10);
      ctx.restore();
    }
  },
  live(ctx, p, t) {
    mirrorRow(ctx, p, 60, t);
    mirrorRow(ctx, p, 120, t + 1);
    mirrorRow(ctx, p, H - 120, t + 2);
    mirrorRow(ctx, p, H - 60, t + 3);
    garbo(ctx, p, 160, 1720, 0.9, t);
    garbo(ctx, p, 920, 1720, 0.9, t + 1);
    for (let i = 0; i < 3; i++) {
      const pts = hangPoints(-20, 160 + i * 6, W + 20, 160 + i * 6, 70 + i * 30, 48);
      pts.forEach((q, k) => { ctx.fillStyle = [p.flower, p.accent, p.sky, "#2fb87a"][(k + i) % 4]; ctx.beginPath(); ctx.moveTo(q.x - 18, q.y); ctx.lineTo(q.x + 18, q.y); ctx.lineTo(q.x, q.y + 34); ctx.fill(); });
    }
  },
};

// ───────────────────── RAJASTHANI ─────────────────────
export const rajasthaniThar: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, mix(p.deep, "#3a1a3a", 0.3)], [0.45, p.deep], [0.62, mix(p.flower, "#ffb347", 0.4)], [0.75, mix("#ffd27a", p.sky, 0.3)]]);
    glow(ctx, 540, 1150, 300, "#fff1b8", 0.7);
    ctx.fillStyle = "#fff4cc"; ctx.beginPath(); ctx.arc(540, 1150, 90, 0, Math.PI * 2); ctx.fill();
    // fort on the hill
    const fort = darken(mix(p.deep, "#7a3b1a", 0.5), 0.3);
    ctx.fillStyle = fort;
    ctx.beginPath(); ctx.moveTo(0, 1330); ctx.quadraticCurveTo(300, 1180, 540, 1210); ctx.quadraticCurveTo(800, 1180, W, 1320); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
    ctx.fillRect(250, 1050, 580, 170);
    for (let x = 250; x < 830; x += 30) ctx.fillRect(x, 1035, 18, 18);
    for (const x of [250, 420, 660, 830]) { ctx.fillRect(x - 40, 960, 80, 260); ctx.beginPath(); ctx.ellipse(x, 960, 46, 40, 0, Math.PI, 0); ctx.fill(); }
    ctx.fillStyle = alpha("#ffcf6b", 0.8);
    for (let i = 0; i < 12; i++) ctx.fillRect(280 + i * 45, 1110, 12, 20);
    // dunes
    const dune = (y: number, c: string, amp: number, ph: number) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, y + Math.sin(x / 180 + ph) * amp); ctx.lineTo(W, H); ctx.fill(); };
    dune(1450, mix("#e3a857", p.deep, 0.2), 40, 0);
    dune(1600, mix("#d08a3a", p.deep, 0.25), 50, 2);
    dune(1760, mix("#b8702c", p.deep, 0.3), 40, 4);
    // camels
    const camel = (x: number, y: number, s: number) => {
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = darken(p.deep, 0.55);
      ctx.beginPath(); ctx.ellipse(0, 0, 60, 26, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(-10, -22, 26, 22, 0, Math.PI, 0); ctx.fill();
      ctx.fillRect(-50, 10, 10, 60); ctx.fillRect(-20, 10, 10, 60); ctx.fillRect(20, 10, 10, 60); ctx.fillRect(44, 10, 10, 60);
      ctx.beginPath(); ctx.moveTo(50, -6); ctx.quadraticCurveTo(80, -50, 96, -54); ctx.lineTo(104, -42); ctx.quadraticCurveTo(84, -40, 64, 6); ctx.fill();
      ctx.restore();
    };
    camel(200, 1640, 1); camel(330, 1660, 0.8);
  },
  live(ctx, p, t) {
    // leheriya band and mirror bunting
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, W, 110); ctx.clip();
    const cols = [p.flower, p.accent, lighten(p.sky, 0.2), "#2fb87a"];
    for (let i = -20; i < 60; i++) { ctx.strokeStyle = cols[(i + 40) % 4]; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(i * 24, 0); ctx.lineTo(i * 24 + 110, 110); ctx.stroke(); }
    ctx.restore();
    ctx.fillStyle = goldGradient(ctx, 0, 0, W, 0, p.accent); ctx.fillRect(0, 106, W, 8);
    const pts = hangPoints(-20, 114, W + 20, 114, 80 + Math.sin(t) * 5, 60);
    pts.forEach((q, i) => {
      ctx.fillStyle = cols[i % 4]; ctx.beginPath(); ctx.moveTo(q.x - 26, q.y); ctx.lineTo(q.x + 26, q.y); ctx.lineTo(q.x, q.y + 60); ctx.fill();
      ctx.fillStyle = "#e9eef2"; ctx.beginPath(); ctx.arc(q.x, q.y + 20, 7, 0, Math.PI * 2); ctx.fill();
      if (Math.sin(t * 3 + i) > 0.92) sparkle(ctx, q.x, q.y + 20, 14, "#ffffff", 1);
    });
  },
};

// ───────────────────── PUNJABI / SIKH ─────────────────────
function phulkariBand(ctx: Ctx, p: Palette, y: number, h: number) {
  ctx.fillStyle = darken(p.deep, 0.3); ctx.fillRect(0, y, W, h);
  const cols = [p.accent, p.flower, lighten(p.sky, 0.3), "#ff7a1a"];
  const s = h * 0.42;
  for (let x = 0, i = 0; x < W + s; x += s * 1.1, i++) {
    const cx = x, cy = y + h / 2;
    for (let k = 4; k >= 1; k--) {
      ctx.fillStyle = cols[(i + k) % cols.length];
      const r = (s / 2) * (k / 4);
      ctx.beginPath(); ctx.moveTo(cx, cy - r * 1.6); ctx.lineTo(cx + r, cy); ctx.lineTo(cx, cy + r * 1.6); ctx.lineTo(cx - r, cy); ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = alpha("#ffffff", 0.35); ctx.lineWidth = 1;
    for (let k = -3; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(cx - s / 2, cy + k * 6); ctx.lineTo(cx + s / 2, cy + k * 6); ctx.stroke(); }
  }
}

export const punjabiPhulkari: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, lighten(p.deep, 0.1)], [1, darken(p.deep, 0.2)]]);
    glow(ctx, 540, 950, 650, lighten(p.sky, 0.3), 0.35);
    phulkariBand(ctx, p, 0, 230);
    // mustard fields
    vGradient(ctx, [[0, mix("#5f8f2c", p.deep, 0.15)], [1, darken(mix("#5f8f2c", p.deep, 0.15), 0.3)]], 1560, H);
    const r = rng(5);
    for (let i = 0; i < 260; i++) {
      const x = r() * W, y = 1540 + r() * 380;
      ctx.strokeStyle = alpha("#3d6b1e", 0.8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y + 30); ctx.lineTo(x, y); ctx.stroke();
      ctx.fillStyle = r() > 0.2 ? "#f6d117" : "#ffe766"; ctx.beginPath(); ctx.arc(x, y, 5 + r() * 4, 0, Math.PI * 2); ctx.fill();
    }
    // carved haveli doorway arch
    ctx.strokeStyle = goldGradient(ctx, 160, 0, 920, 0, p.accent); ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(150, 1560); ctx.lineTo(150, 680); ctx.bezierCurveTo(150, 420, 400, 330, 540, 290); ctx.bezierCurveTo(680, 330, 930, 420, 930, 680); ctx.lineTo(930, 1560); ctx.stroke();
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(176, 1560); ctx.lineTo(176, 690); ctx.bezierCurveTo(176, 450, 410, 365, 540, 326); ctx.bezierCurveTo(670, 365, 904, 450, 904, 690); ctx.lineTo(904, 1560); ctx.stroke();
  },
  live(ctx, p, t) {
    const r = rng(9);
    for (let i = 0; i < 20; i++) sparkle(ctx, 170 + r() * 740, 330 + r() * 1200, 8 + r() * 8, lighten(p.accent, 0.5), Math.max(0, Math.sin(t * 1.6 + i)) * 0.8);
    for (let i = 0; i < 7; i++) { const x = 150 + i * 130; diya(ctx, p, x, 1530 + Math.sin(i) * 10, 0.7, t, i); }
  },
};

// ───────────────────── MUSLIM: NIKAH & WALIMA ─────────────────────
function starTile(ctx: Ctx, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; const rr = i % 2 ? r * 0.62 : r; if (i === 0) ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); else ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  ctx.closePath();
}

export function ogeeArch(ctx: Ctx, x0: number, x1: number, top: number, bottom: number) {
  const cx = (x0 + x1) / 2, w = x1 - x0;
  ctx.beginPath();
  ctx.moveTo(x0, bottom); ctx.lineTo(x0, top + w * 0.55);
  ctx.bezierCurveTo(x0, top + w * 0.15, cx - w * 0.15, top + w * 0.12, cx, top);
  ctx.bezierCurveTo(cx + w * 0.15, top + w * 0.12, x1, top + w * 0.15, x1, top + w * 0.55);
  ctx.lineTo(x1, bottom);
}

export function fanoos(ctx: Ctx, p: Palette, x: number, y: number, s: number, t: number) {
  const f = 0.88 + 0.12 * Math.sin(t * 5 + x);
  lighter(ctx, () => glow(ctx, x, y, 170 * s * f, "#ffcf6b", 0.32));
  const gold = goldGradient(ctx, x - 40 * s, 0, x + 40 * s, 0, p.accent);
  ctx.fillStyle = gold;
  ctx.beginPath(); ctx.moveTo(x, y - 110 * s); ctx.lineTo(x - 30 * s, y - 60 * s); ctx.lineTo(x + 30 * s, y - 60 * s); ctx.fill();
  const g = ctx.createRadialGradient(x, y, 4, x, y, 50 * s); g.addColorStop(0, "#fff4c8"); g.addColorStop(1, mix(p.flower, "#ffb347", 0.4));
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(x - 30 * s, y - 60 * s); ctx.lineTo(x + 30 * s, y - 60 * s); ctx.lineTo(x + 42 * s, y + 10 * s); ctx.lineTo(x + 20 * s, y + 60 * s); ctx.lineTo(x - 20 * s, y + 60 * s); ctx.lineTo(x - 42 * s, y + 10 * s); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = gold; ctx.lineWidth = 3 * s; ctx.stroke();
  for (const dx of [-14, 0, 14]) { ctx.beginPath(); ctx.moveTo(x + dx * s, y - 60 * s); ctx.lineTo(x + dx * 1.3 * s, y + 60 * s); ctx.stroke(); }
  ctx.fillStyle = gold; ctx.beginPath(); ctx.moveTo(x - 20 * s, y + 60 * s); ctx.lineTo(x + 20 * s, y + 60 * s); ctx.lineTo(x, y + 96 * s); ctx.fill();
}

export const muslimNikah: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, darken(p.deep, 0.35)], [0.6, p.deep], [1, darken(p.deep, 0.3)]]);
    ctx.strokeStyle = alpha(p.accent, 0.13); ctx.lineWidth = 2;
    for (let y = 0; y < H + 90; y += 120) for (let x = (y / 120) % 2 ? 60 : 0; x < W + 60; x += 120) { starTile(ctx, x, y, 44); ctx.stroke(); }
    glow(ctx, 540, 1000, 600, lighten(p.sky, 0.3), 0.3);
    // nested ogee arches
    ctx.strokeStyle = goldGradient(ctx, 0, 0, W, 0, p.accent);
    ctx.lineWidth = 6; ogeeArch(ctx, 110, 970, 220, 1800); ctx.stroke();
    ctx.lineWidth = 2; ogeeArch(ctx, 134, 946, 252, 1800); ctx.stroke();
    // domes & minarets silhouette
    const sil = darken(p.deep, 0.55);
    ctx.fillStyle = sil;
    ctx.fillRect(0, 1700, W, 220);
    ctx.beginPath(); ctx.moveTo(380, 1700); ctx.bezierCurveTo(380, 1560, 470, 1520, 540, 1470); ctx.bezierCurveTo(610, 1520, 700, 1560, 700, 1700); ctx.fill();
    ctx.fillRect(536, 1420, 8, 60);
    for (const x of [300, 780]) { ctx.fillRect(x - 14, 1460, 28, 260); ctx.beginPath(); ctx.moveTo(x - 18, 1460); ctx.lineTo(x, 1410); ctx.lineTo(x + 18, 1460); ctx.fill(); }
    for (const x of [200, 880]) { ctx.beginPath(); ctx.moveTo(x - 90, 1700); ctx.bezierCurveTo(x - 90, 1620, x - 30, 1600, x, 1580); ctx.bezierCurveTo(x + 30, 1600, x + 90, 1620, x + 90, 1700); ctx.fill(); }
  },
  live(ctx, p, t) {
    // crescent moon and stars
    ctx.fillStyle = "#fff6d8";
    ctx.beginPath(); ctx.arc(540, 380, 60, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = darken(p.deep, 0.3);
    ctx.beginPath(); ctx.arc(565, 362, 54, 0, Math.PI * 2); ctx.fill();
    const r = rng(4);
    for (let i = 0; i < 26; i++) sparkle(ctx, 160 + r() * 760, 300 + r() * 420, 6 + r() * 8, "#fff6d8", Math.max(0, Math.sin(t * 1.4 + i)) * 0.9);
    for (const [x, y, s] of [[60, 380, 0.8], [1020, 380, 0.8], [200, 260, 0.6], [880, 260, 0.6]] as const) {
      const sw = Math.sin(t * 1.1 + x) * 6;
      ctx.strokeStyle = alpha(p.accent, 0.7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + sw, y - 110 * s); ctx.stroke();
      fanoos(ctx, p, x + sw, y, s, t);
    }
  },
};

export const muslimWalima: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, lighten(p.sky, 0.3)], [1, mix(p.sky, p.deep, 0.25)]]);
    const gold = p.accent;
    // interlaced star bands
    for (const y of [70, H - 70]) {
      ctx.fillStyle = alpha(p.deep, 0.18); ctx.fillRect(0, y - 70, W, 140);
      ctx.strokeStyle = gold; ctx.lineWidth = 2.5;
      for (let x = 0; x < W + 90; x += 90) { starTile(ctx, x, y, 38); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(0, y - 66); ctx.lineTo(W, y - 66); ctx.moveTo(0, y + 66); ctx.lineTo(W, y + 66); ctx.stroke();
    }
    ctx.strokeStyle = goldGradient(ctx, 0, 0, W, 0, gold); ctx.lineWidth = 4;
    ogeeArch(ctx, 150, 930, 260, 1700); ctx.stroke();
    ctx.lineWidth = 1.5; ogeeArch(ctx, 172, 908, 290, 1700); ctx.stroke();
    // roses at the arch base
    const r = rng(3);
    for (const x of [160, 920]) for (let i = 0; i < 9; i++) {
      leaf(ctx, x + (r() - 0.5) * 120, 1690 + (r() - 0.5) * 80, 60, 18, r() * 6, leafGreen(p));
      rose(ctx, x + (r() - 0.5) * 120, 1690 + (r() - 0.5) * 70, 24 + r() * 16, i % 2 ? p.flower : lighten(p.flower, 0.45), r() * 6);
    }
  },
  live(ctx, p, t) {
    const r = rng(8);
    for (let i = 0; i < 12; i++) sparkle(ctx, 180 + r() * 720, 320 + r() * 1300, 10, p.accent, Math.max(0, Math.sin(t * 1.6 + i)) * 0.9);
  },
};

// ───────────────────── CHRISTIAN ─────────────────────
function roseWindow(ctx: Ctx, p: Palette, x: number, y: number, R: number) {
  const cols = [p.flower, lighten(p.sky, 0.2), p.accent, mix(p.flower, "#4a7dd6", 0.5), mix(p.sky, "#2fb87a", 0.4)];
  for (let i = 0; i < 16; i++) {
    const a1 = (i / 16) * Math.PI * 2, a2 = ((i + 1) / 16) * Math.PI * 2;
    for (let k = 0; k < 3; k++) {
      const r1 = R * (0.3 + k * 0.23), r2 = R * (0.3 + (k + 1) * 0.23);
      ctx.fillStyle = alpha(cols[(i + k) % cols.length], 0.85);
      ctx.beginPath(); ctx.arc(x, y, r2, a1, a2); ctx.arc(x, y, r1, a2, a1, true); ctx.closePath(); ctx.fill();
    }
  }
  ctx.fillStyle = alpha(lighten(p.sky, 0.6), 0.95); ctx.beginPath(); ctx.arc(x, y, R * 0.3, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = darken(p.deep, 0.4); ctx.lineWidth = 4;
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * R * 0.3, y + Math.sin(a) * R * 0.3); ctx.lineTo(x + Math.cos(a) * R, y + Math.sin(a) * R); ctx.stroke(); }
  for (const k of [0.3, 0.53, 0.76, 1]) { ctx.beginPath(); ctx.arc(x, y, R * k, 0, Math.PI * 2); ctx.stroke(); }
  ctx.strokeStyle = goldGradient(ctx, x - R, 0, x + R, 0, p.accent); ctx.lineWidth = 10;
  ctx.beginPath(); ctx.arc(x, y, R + 8, 0, Math.PI * 2); ctx.stroke();
}

function lily(ctx: Ctx, x: number, y: number, s: number, ang: number) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  for (let i = 0; i < 6; i++) {
    ctx.save(); ctx.rotate((i / 6) * Math.PI * 2);
    const g = ctx.createLinearGradient(0, 0, 0, -60); g.addColorStop(0, "#f2efe2"); g.addColorStop(1, "#ffffff");
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(18, -30, 0, -62); ctx.quadraticCurveTo(-18, -30, 0, 0); ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = "#e3b23c"; for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; ctx.beginPath(); ctx.arc(Math.cos(a) * 12, Math.sin(a) * 12, 3, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}

function dove(ctx: Ctx, x: number, y: number, s: number, flap: number) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath(); ctx.ellipse(0, 0, 40, 16, -0.1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(36, -10, 12, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-10, -4); ctx.quadraticCurveTo(-20, -60 * flap, 20, -70 * flap); ctx.quadraticCurveTo(10, -30 * flap, 14, -4); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-36, 0); ctx.lineTo(-64, -12); ctx.lineTo(-60, 10); ctx.fill();
  ctx.restore();
}

export const christianChurch: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, lighten(p.sky, 0.35)], [1, mix(p.sky, p.deep, 0.35)]]);
    // gothic window pairs at the sides
    for (const x of [90, 990]) {
      ctx.fillStyle = alpha(mix(p.sky, p.flower, 0.3), 0.5);
      ogeeArch(ctx, x - 50, x + 50, 520, 1250); ctx.fill();
      ctx.strokeStyle = goldGradient(ctx, x - 60, 0, x + 60, 0, p.accent); ctx.lineWidth = 5; ogeeArch(ctx, x - 50, x + 50, 520, 1250); ctx.stroke();
      ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, 580); ctx.lineTo(x, 1250); ctx.stroke();
    }
    roseWindow(ctx, p, 540, 290, 190);
    // lilies and greenery bouquets
    const r = rng(6);
    for (const [x, dir] of [[110, 1], [970, -1]] as const) {
      for (let i = 0; i < 14; i++) leaf(ctx, x, 1880, 160 + r() * 120, 26, -Math.PI / 2 + dir * (r() * 0.9 - 0.2), leafGreen(p));
      for (let i = 0; i < 6; i++) lily(ctx, x + dir * (r() * 200), 1600 + r() * 260, 0.9 + r() * 0.4, r() * 6);
      for (let i = 0; i < 6; i++) rose(ctx, x + dir * (r() * 220), 1700 + r() * 200, 22 + r() * 12, lighten(p.flower, 0.3), r() * 6);
    }
  },
  live(ctx, p, t) {
    lighter(ctx, () => {
      for (let i = 0; i < 4; i++) {
        ctx.save(); ctx.translate(540, 290); ctx.rotate(Math.PI / 2 + (i - 1.5) * 0.18 + Math.sin(t * 0.4) * 0.03);
        const g = ctx.createLinearGradient(0, 0, 1600, 0);
        g.addColorStop(0, alpha(lighten(p.sky, 0.5), 0.18)); g.addColorStop(1, alpha(lighten(p.sky, 0.5), 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(1600, -120); ctx.lineTo(1600, 120); ctx.lineTo(0, 20); ctx.fill();
        ctx.restore();
      }
    });
    for (let i = 0; i < 2; i++) {
      const u = ((t * 0.06 + i * 0.5) % 1);
      dove(ctx, -100 + u * (W + 200), 560 + i * 70 + Math.sin(t * 2 + i) * 10, 0.8, 0.6 + 0.4 * Math.sin(t * 8 + i));
    }
  },
};

// ───────────────────── BIHARI / MAITHILI (MADHUBANI) ─────────────────────
export const madhubaniKohbar: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, mix("#f6ead2", p.sky, 0.3)], [1, mix("#ecd9b4", p.sky, 0.3)]]);
    const ink = darken(p.deep, 0.35);
    // double border with hatching and triangles
    ctx.strokeStyle = ink; ctx.lineWidth = 5;
    ctx.strokeRect(30, 30, W - 60, H - 60); ctx.strokeRect(84, 84, W - 168, H - 168);
    ctx.lineWidth = 2;
    for (let i = 0; i < (W - 60) / 18; i++) { const x = 30 + i * 18; ctx.beginPath(); ctx.moveTo(x, 30); ctx.lineTo(x + 18, 84); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, H - 30); ctx.lineTo(x + 18, H - 84); ctx.stroke(); }
    for (let i = 0; i < (H - 168) / 18; i++) { const y = 84 + i * 18; ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(84, y + 18); ctx.stroke(); ctx.beginPath(); ctx.moveTo(W - 30, y); ctx.lineTo(W - 84, y + 18); ctx.stroke(); }
    // sun at the top
    ctx.fillStyle = p.accent; ctx.beginPath(); ctx.arc(540, 250, 80, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = ink; ctx.lineWidth = 3; ctx.stroke();
    for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; ctx.fillStyle = i % 2 ? p.flower : p.accent; ctx.beginPath(); ctx.moveTo(540 + Math.cos(a - 0.1) * 86, 250 + Math.sin(a - 0.1) * 86); ctx.lineTo(540 + Math.cos(a) * 130, 250 + Math.sin(a) * 130); ctx.lineTo(540 + Math.cos(a + 0.1) * 86, 250 + Math.sin(a + 0.1) * 86); ctx.fill(); ctx.stroke(); }
    ctx.fillStyle = ink; for (const dx of [-26, 26]) { ctx.beginPath(); ctx.ellipse(540 + dx, 238, 12, 7, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.beginPath(); ctx.arc(540, 268, 22, 0.2, Math.PI - 0.2); ctx.stroke();
    // fish pair
    for (const [x, flip] of [[230, 1], [850, -1]] as const) {
      ctx.save(); ctx.translate(x, 300); ctx.scale(flip, 1); ctx.rotate(-0.3);
      ctx.fillStyle = p.flower; ctx.strokeStyle = ink; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-100, 0); ctx.quadraticCurveTo(0, -70, 100, 0); ctx.quadraticCurveTo(0, 70, -100, 0); ctx.fill(); ctx.stroke();
      ctx.fillStyle = p.accent; ctx.beginPath(); ctx.moveTo(95, 0); ctx.lineTo(145, -40); ctx.lineTo(145, 40); ctx.closePath(); ctx.fill(); ctx.stroke();
      for (let i = -60; i <= 60; i += 24) { ctx.beginPath(); ctx.moveTo(i, -40 + Math.abs(i) * 0.3); ctx.lineTo(i, 40 - Math.abs(i) * 0.3); ctx.stroke(); }
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-66, -8, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
    // peacocks at the bottom corners
    for (const [x, flip] of [[230, 1], [850, -1]] as const) {
      ctx.save(); ctx.translate(x, 1660); ctx.scale(flip, 1);
      ctx.strokeStyle = ink; ctx.lineWidth = 3;
      for (let i = 0; i < 7; i++) { const a = Math.PI + 0.3 + i * 0.3; ctx.fillStyle = i % 2 ? p.sky : p.accent; ctx.beginPath(); ctx.ellipse(-60 + Math.cos(a) * 110, Math.sin(a) * 110, 40, 18, a, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
      ctx.fillStyle = mix("#1d6fa8", p.deep, 0.3);
      ctx.beginPath(); ctx.ellipse(0, 0, 70, 44, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(50, -20); ctx.quadraticCurveTo(90, -80, 70, -130); ctx.lineTo(56, -126); ctx.quadraticCurveTo(70, -80, 30, -30); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(64, -136, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      for (let i = -40; i <= 40; i += 20) { ctx.beginPath(); ctx.arc(i, 0, 10, 0, Math.PI * 2); ctx.stroke(); }
      ctx.restore();
    }
    // vine of leaves across the bottom
    ctx.strokeStyle = ink; ctx.lineWidth = 3;
    ctx.beginPath(); for (let x = 360; x < 720; x += 6) { const y = 1800 + Math.sin(x / 30) * 14; if (x === 360) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.stroke();
  },
  live(ctx, p, t) {
    const r = rng(14);
    for (let i = 0; i < 8; i++) sparkle(ctx, 160 + r() * 760, 500 + r() * 1000, 10, p.accent, Math.max(0, Math.sin(t * 1.5 + i)) * 0.7);
  },
};

// ───────────────────── BANARAS ─────────────────────
export const banarasGhats: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, darken(p.deep, 0.2)], [0.4, p.deep], [0.6, mix(p.flower, "#ffb347", 0.5)], [0.66, mix("#ffd27a", p.sky, 0.3)]]);
    glow(ctx, 540, 1200, 260, "#fff1b8", 0.6);
    // temple spires along the ghat
    const sil = darken(mix(p.deep, "#4a2a1a", 0.4), 0.35);
    ctx.fillStyle = sil;
    const spire = (x: number, base: number, w: number, h: number) => { ctx.beginPath(); ctx.moveTo(x - w / 2, base); ctx.bezierCurveTo(x - w / 2, base - h * 0.6, x - w * 0.1, base - h * 0.9, x, base - h); ctx.bezierCurveTo(x + w * 0.1, base - h * 0.9, x + w / 2, base - h * 0.6, x + w / 2, base); ctx.fill(); ctx.fillRect(x - 3, base - h - 30, 6, 30); };
    ctx.fillRect(0, 1180, W, 120);
    [[80, 160, 220], [230, 120, 160], [360, 180, 300], [540, 140, 200], [700, 200, 340], [860, 130, 190], [1000, 150, 250]].forEach(([x, w, h]) => spire(x, 1200, w, h));
    // steps
    for (let i = 0; i < 9; i++) { ctx.fillStyle = mix(sil, "#c9a27a", 0.1 + i * 0.05); ctx.fillRect(0, 1300 + i * 26, W, 26); }
    // river
    vGradient(ctx, [[0, mix(p.flower, "#ffb347", 0.35)], [0.3, mix(p.deep, "#2b4a6a", 0.4)], [1, darken(p.deep, 0.45)]], 1534, H);
    // boat
    ctx.fillStyle = darken(sil, 0.2);
    ctx.beginPath(); ctx.moveTo(620, 1720); ctx.quadraticCurveTo(760, 1770, 900, 1700); ctx.lineTo(880, 1690); ctx.lineTo(640, 1700); ctx.fill();
    ctx.fillRect(760, 1610, 6, 90);
  },
  live(ctx, p, t) {
    ctx.strokeStyle = alpha("#ffd27a", 0.3); ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) { const y = 1560 + i * 40, o = Math.sin(t + i) * 20; ctx.beginPath(); ctx.moveTo(470 + o - i * 6, y); ctx.lineTo(610 + o + i * 6, y); ctx.stroke(); }
    const r = rng(2);
    for (let i = 0; i < 12; i++) {
      const sp = 14 + r() * 16, x = ((r() * W + t * sp) % (W + 100)) - 50, y = 1600 + r() * 280;
      ctx.fillStyle = mix("#2f8a3a", p.deep, 0.2); ctx.beginPath(); ctx.ellipse(x, y + 6, 22, 7, 0, 0, Math.PI * 2); ctx.fill();
      flame(ctx, x, y, 0.7, t, i);
    }
    // marigold strands at the top
    for (let x = 30; x < W; x += 90) for (let y = 0; y < 120 + (x % 180 ? 60 : 0); y += 24) marigold(ctx, x, y + 10, 12, (y / 24) % 2 ? mg1(p) : mg2(p), x + y);
  },
};

// ───────────────────── GOAN ─────────────────────
export const goanSunset: Scene = {
  still(ctx, p) {
    vGradient(ctx, [[0, p.deep], [0.5, mix(p.deep, p.flower, 0.5)], [0.68, mix(p.flower, "#ffd27a", 0.5)]]);
    glow(ctx, 540, 1320, 320, "#fff1b8", 0.65);
    ctx.fillStyle = "#fff0c2"; ctx.beginPath(); ctx.arc(540, 1320, 110, Math.PI, 0); ctx.fill();
    vGradient(ctx, [[0, mix(p.sky, p.flower, 0.4)], [1, darken(p.sky, 0.35)]], 1320, 1620);
    vGradient(ctx, [[0, mix("#f1d3a0", p.sky, 0.2)], [1, mix("#d9b07a", p.deep, 0.2)]], 1620, H);
    ctx.fillStyle = alpha("#ffffff", 0.7);
    ctx.beginPath(); ctx.moveTo(0, 1620); for (let x = 0; x <= W; x += 30) ctx.lineTo(x, 1620 + Math.sin(x / 60) * 8); ctx.lineTo(W, 1640); ctx.lineTo(0, 1640); ctx.fill();
    const dark = darken(p.deep, 0.5);
    palm(ctx, 90, 1900, 760, 140, dark);
    palm(ctx, 990, 1900, 700, -150, dark);
    palm(ctx, 180, 1880, 520, 60, darken(dark, 0.2));
    // chapel facade
    ctx.fillStyle = mix("#ffffff", p.sky, 0.15);
    ctx.fillRect(800, 1470, 150, 150);
    ctx.beginPath(); ctx.moveTo(790, 1470); ctx.quadraticCurveTo(875, 1380, 960, 1470); ctx.fill();
    ctx.fillStyle = dark; ctx.fillRect(866, 1350, 18, 60); ctx.fillRect(850, 1366, 50, 14);
    ctx.fillStyle = alpha(dark, 0.6); ctx.beginPath(); ctx.moveTo(850, 1620); ctx.lineTo(850, 1560); ctx.arc(875, 1560, 25, Math.PI, 0); ctx.lineTo(900, 1620); ctx.fill();
  },
  live(ctx, p, t) {
    const pts = hangPoints(-20, 80, W + 20, 120, 160, 46);
    ctx.strokeStyle = alpha("#ffffff", 0.4); ctx.lineWidth = 1.5;
    ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y))); ctx.stroke();
    pts.forEach((q, i) => bulb(ctx, q.x, q.y + 5, 5, "#ffdca0", 0.5 + 0.5 * Math.sin(t * 3 + i)));
    ctx.strokeStyle = alpha("#ffffff", 0.25); ctx.lineWidth = 2;
    for (let i = 0; i < 7; i++) { const y = 1360 + i * 36, o = Math.sin(t * 0.8 + i) * 30; ctx.beginPath(); ctx.moveTo(420 + o, y); ctx.lineTo(660 + o, y); ctx.stroke(); }
  },
};
