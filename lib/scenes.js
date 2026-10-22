// Illustrated, palette-driven event scenes. Each scene has a static layer (cached)
// and a dynamic layer redrawn every frame (swaying garlands, twinkling lights...).
import { alpha, darken, lighten, mix } from "./color";
import { H, W, bananaLeaf, bulb, curtain, glow, goldGradient, hangPoints, leaf, lotus, mandala, marigold, paisley, rng, rose, scallops, sparkle, } from "./draw-kit";
export const leafGreen = (p) => mix("#3f7a34", p.deep, 0.2);
export const mg1 = (p) => mix("#f28a17", p.flower, 0.18);
export const mg2 = (p) => mix("#ffc629", p.flower, 0.12);
export function vGradient(ctx, stops, y1 = 0, y2 = H) {
    const g = ctx.createLinearGradient(0, y1, 0, y2);
    stops.forEach(([o, c]) => g.addColorStop(o, c));
    ctx.fillStyle = g;
    ctx.fillRect(0, y1, W, y2 - y1);
}
/** Points along an arch: up the left leg, over the top, down the right leg. */
export function archPath(cx, halfW, topY, bottomY, step, pointed = false) {
    const springY = topY + halfW * (pointed ? 0.85 : 1);
    const pts = [];
    const legLen = bottomY - springY;
    const curveLen = Math.PI * halfW;
    const total = legLen * 2 + curveLen;
    for (let d = 0; d <= total; d += step) {
        let x, y;
        if (d < legLen) {
            x = cx - halfW;
            y = bottomY - d;
        }
        else if (d < legLen + curveLen) {
            const a = Math.PI + ((d - legLen) / curveLen) * Math.PI;
            x = cx + Math.cos(a) * halfW;
            const s = Math.sin(a);
            y = springY + s * (springY - topY) * (pointed ? 1 + 0.15 * (1 - Math.abs(Math.cos(a))) : 1);
        }
        else {
            x = cx + halfW;
            y = springY + (d - legLen - curveLen);
        }
        pts.push({ x, y, u: d / total });
    }
    return pts;
}
export function flowerArch(ctx, p, cx, halfW, topY, bottomY, seed, palette, size = 1) {
    const r = rng(seed);
    const pts = archPath(cx, halfW, topY, bottomY, 26);
    const green = leafGreen(p);
    for (const pt of pts) {
        for (let k = 0; k < 2; k++)
            leaf(ctx, pt.x + (r() - 0.5) * 30, pt.y + (r() - 0.5) * 30, (34 + r() * 30) * size, (12 + r() * 6) * size, r() * Math.PI * 2, r() > 0.5 ? green : darken(green, 0.2));
    }
    for (const pt of pts) {
        const nearBase = Math.min(pt.u, 1 - pt.u) < 0.12 ? 1.35 : 1;
        const n = 1 + Math.floor(r() * 2);
        for (let k = 0; k < n; k++) {
            const c = palette[Math.floor(r() * palette.length)];
            rose(ctx, pt.x + (r() - 0.5) * 40, pt.y + (r() - 0.5) * 40, (16 + r() * 18) * size * nearBase, c, r() * 6);
        }
        if (r() > 0.6) {
            ctx.fillStyle = lighten(p.sky, 0.6);
            for (let k = 0; k < 4; k++) {
                ctx.beginPath();
                ctx.arc(pt.x + (r() - 0.5) * 60, pt.y + (r() - 0.5) * 60, 4 + r() * 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}
export function bouquet(ctx, p, x, y, spread, seed, palette) {
    const r = rng(seed);
    const green = leafGreen(p);
    for (let i = 0; i < 18; i++)
        leaf(ctx, x + (r() - 0.5) * spread, y + (r() - 0.5) * spread * 0.6, 40 + r() * 50, 14 + r() * 8, r() * Math.PI * 2, i % 2 ? green : darken(green, 0.25));
    for (let i = 0; i < 16; i++)
        rose(ctx, x + (r() - 0.5) * spread, y + (r() - 0.5) * spread * 0.55, 20 + r() * 22, palette[i % palette.length], r() * 6);
}
export function marigoldString(ctx, p, x, y, len, t, phase, r = 15) {
    const sway = Math.sin(t * 1.1 + phase) * 0.035;
    const step = r * 1.55;
    const n = Math.floor(len / step);
    for (let i = 0; i < n; i++) {
        const dy = i * step;
        const dx = Math.sin(sway * (dy / 40)) * dy * 0.35;
        if (i % 5 === 4)
            leaf(ctx, x + dx, y + dy, r * 1.6, r * 0.6, Math.PI / 2 + 0.6, leafGreen(p));
        marigold(ctx, x + dx, y + dy, r, i % 2 ? mg1(p) : mg2(p), i + phase);
    }
    const endX = x + Math.sin(sway * (n * step / 40)) * n * step * 0.35;
    ctx.fillStyle = alpha(p.accent, 0.9);
    ctx.beginPath();
    ctx.moveTo(endX - 6, y + n * step - 4);
    ctx.lineTo(endX + 6, y + n * step - 4);
    ctx.lineTo(endX, y + n * step + 22);
    ctx.closePath();
    ctx.fill();
}
export function diya(ctx, p, x, y, s, t, seed) {
    ctx.fillStyle = mix("#9a4a1c", p.deep, 0.2);
    ctx.beginPath();
    ctx.ellipse(x, y, 34 * s, 14 * s, 0, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = goldGradient(ctx, x - 34 * s, y, x + 34 * s, y, p.accent);
    ctx.fillRect(x - 34 * s, y - 3 * s, 68 * s, 5 * s);
    const f = 0.85 + 0.15 * Math.sin(t * 13 + seed) * Math.sin(t * 7.3 + seed * 2);
    const prev = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "lighter";
    glow(ctx, x, y - 22 * s, 120 * s * f, "#ffb347", 0.35);
    ctx.globalCompositeOperation = prev;
    const fl = ctx.createRadialGradient(x, y - 18 * s, 1, x, y - 22 * s, 22 * s);
    fl.addColorStop(0, "#fffbe0");
    fl.addColorStop(0.5, "#ffd34d");
    fl.addColorStop(1, alpha("#ff7a1a", 0));
    ctx.fillStyle = fl;
    ctx.beginPath();
    ctx.moveTo(x - 9 * s, y - 6 * s);
    ctx.quadraticCurveTo(x + Math.sin(t * 9 + seed) * 4 * s, y - 52 * s * f, x + 9 * s, y - 6 * s);
    ctx.closePath();
    ctx.fill();
}
// ───────────────────────── Wedding: floral mandap ─────────────────────────
let weddingArch;
const wedding = {
    still(ctx, p) {
        vGradient(ctx, [[0, lighten(p.sky, 0.3)], [0.55, p.sky], [1, mix(p.sky, p.deep, 0.55)]]);
        // back drape folds
        const folds = 16;
        for (let i = 0; i < folds; i++) {
            const x = (i / folds) * W;
            const g = ctx.createLinearGradient(x, 0, x + W / folds, 0);
            g.addColorStop(0, alpha(p.deep, 0.02));
            g.addColorStop(0.5, alpha(p.deep, 0.16));
            g.addColorStop(1, alpha(p.deep, 0.02));
            ctx.fillStyle = g;
            ctx.fillRect(x, 0, W / folds, 1650);
        }
        glow(ctx, 540, 900, 700, lighten(p.sky, 0.7), 0.7);
        // swags
        const swag = mix(p.sky, p.flower, 0.28);
        for (let i = 0; i < 3; i++) {
            const x1 = i * 360, x2 = x1 + 360;
            ctx.fillStyle = swag;
            ctx.beginPath();
            ctx.moveTo(x1, 170);
            ctx.quadraticCurveTo((x1 + x2) / 2, 400, x2, 170);
            ctx.quadraticCurveTo((x1 + x2) / 2, 300, x1, 170);
            ctx.fill();
            ctx.strokeStyle = alpha(darken(swag, 0.25), 0.6);
            ctx.lineWidth = 3;
            for (let k = 1; k < 4; k++) {
                ctx.beginPath();
                ctx.moveTo(x1 + 10, 172);
                ctx.quadraticCurveTo((x1 + x2) / 2, 300 + k * 25, x2 - 10, 172);
                ctx.stroke();
            }
        }
        // canopy
        ctx.fillStyle = mix(p.flower, p.deep, 0.35);
        ctx.fillRect(0, 0, W, 170);
        scallops(ctx, 0, W, 170, 30, mix(p.flower, p.deep, 0.35), p.accent);
        ctx.fillStyle = goldGradient(ctx, 0, 0, W, 0, p.accent);
        ctx.fillRect(0, 150, W, 8);
        for (let x = 30; x < W; x += 60)
            lotus(ctx, x, 120, 22, alpha(lighten(p.accent, 0.3), 1), 0.7);
        // pillars
        for (const px of [18, 992]) {
            ctx.fillStyle = goldGradient(ctx, px, 0, px + 70, 0, p.accent);
            ctx.fillRect(px, 180, 70, 1560);
            for (let y = 260; y < 1700; y += 210) {
                ctx.fillStyle = goldGradient(ctx, px - 10, 0, px + 80, 0, darken(p.accent, 0.1));
                ctx.fillRect(px - 10, y, 90, 26);
            }
            ctx.fillRect(px - 22, 1700, 114, 60);
        }
        for (const [px, s] of [[53, 11], [1027, 29]]) {
            const r = rng(s);
            for (let y = 300; y < 1650; y += 70)
                rose(ctx, px + (r() - 0.5) * 50, y + r() * 30, 20 + r() * 10, r() > 0.5 ? p.flower : lighten(p.flower, 0.5), r() * 6);
        }
        // floor
        vGradient(ctx, [[0, mix(p.deep, p.sky, 0.35)], [1, darken(p.deep, 0.25)]], 1660, H);
        ctx.strokeStyle = alpha(p.accent, 0.25);
        ctx.lineWidth = 2;
        for (let i = -6; i <= 6; i++) {
            ctx.beginPath();
            ctx.moveTo(540 + i * 40, 1660);
            ctx.lineTo(540 + i * 260, H);
            ctx.stroke();
        }
        const r = rng(7);
        for (let i = 0; i < 140; i++) {
            ctx.fillStyle = alpha(r() > 0.4 ? p.flower : lighten(p.flower, 0.5), 0.85);
            ctx.beginPath();
            ctx.ellipse(r() * W, 1680 + r() * 240, 9 + r() * 6, 5 + r() * 3, r() * 3, 0, Math.PI * 2);
            ctx.fill();
        }
        flowerArch(ctx, p, 540, 410, 470, 1700, 3, [p.flower, lighten(p.flower, 0.45), lighten(p.sky, 0.6), darken(p.flower, 0.15)]);
        bouquet(ctx, p, 170, 1690, 230, 5, [p.flower, lighten(p.flower, 0.5), lighten(p.sky, 0.7)]);
        bouquet(ctx, p, 910, 1690, 230, 9, [p.flower, lighten(p.flower, 0.5), lighten(p.sky, 0.7)]);
    },
    live(ctx, p, t) {
        for (let i = 0; i < 20; i++)
            marigoldString(ctx, p, 27 + i * 54, 168, i % 2 ? 150 : 95, t, i * 0.7, 13);
        for (let i = 0; i < 7; i++)
            diya(ctx, p, 120 + i * 140, 1850, 1, t, i);
        const r = rng(41);
        const arch = (weddingArch ?? (weddingArch = archPath(540, 410, 470, 1700, 10)));
        for (let i = 0; i < 14; i++) {
            const pt = arch[Math.floor(r() * arch.length)];
            if (pt)
                sparkle(ctx, pt.x, pt.y, 14, "#fffbe8", Math.max(0, Math.sin(t * 2.2 + i * 1.7)));
        }
    },
};
// ─────────────────────── Engagement: moonlit garden ───────────────────────
const engagement = {
    still(ctx, p) {
        vGradient(ctx, [[0, darken(p.deep, 0.2)], [0.55, p.deep], [0.82, mix(p.deep, p.sky, 0.55)], [1, darken(p.deep, 0.3)]]);
        const r = rng(12);
        for (let i = 0; i < 180; i++) {
            ctx.fillStyle = alpha("#ffffff", 0.25 + r() * 0.6);
            ctx.beginPath();
            ctx.arc(r() * W, r() * 1300, r() * 2.2 + 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
        glow(ctx, 830, 270, 330, lighten(p.sky, 0.5), 0.5);
        const moon = ctx.createRadialGradient(810, 250, 10, 830, 270, 80);
        moon.addColorStop(0, "#fffdf2");
        moon.addColorStop(1, mix("#fff3d0", p.sky, 0.2));
        ctx.fillStyle = moon;
        ctx.beginPath();
        ctx.arc(830, 270, 78, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = alpha(p.sky, 0.12);
        for (const [x, y, rr] of [[805, 250, 14], [850, 300, 10], [860, 240, 8]]) {
            ctx.beginPath();
            ctx.arc(x, y, rr, 0, Math.PI * 2);
            ctx.fill();
        }
        // tree line
        const tree = darken(p.deep, 0.45);
        ctx.fillStyle = tree;
        for (let i = 0; i < 26; i++) {
            ctx.beginPath();
            ctx.arc(i * 45 + r() * 20, 1400 + r() * 80, 70 + r() * 70, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillRect(0, 1450, W, 500);
        vGradient(ctx, [[0, alpha(darken(p.deep, 0.5), 0)], [1, darken(p.deep, 0.55)]], 1450, H);
        // garden path
        ctx.fillStyle = alpha(lighten(p.sky, 0.2), 0.25);
        ctx.beginPath();
        ctx.moveTo(480, 1640);
        ctx.lineTo(600, 1640);
        ctx.lineTo(820, H);
        ctx.lineTo(260, H);
        ctx.closePath();
        ctx.fill();
        flowerArch(ctx, p, 540, 405, 520, 1680, 21, [lighten(p.flower, 0.5), p.flower, "#fffaf4", darken(p.flower, 0.12)]);
        bouquet(ctx, p, 160, 1700, 260, 22, [lighten(p.flower, 0.6), p.flower, "#fffaf4"]);
        bouquet(ctx, p, 920, 1700, 260, 23, [lighten(p.flower, 0.6), p.flower, "#fffaf4"]);
    },
    live(ctx, p, t) {
        const r = rng(77);
        for (let i = 0; i < 40; i++) {
            const x = r() * W, y = r() * 1250, ph = r() * 6;
            sparkle(ctx, x, y, 6 + r() * 6, "#ffffff", Math.max(0, Math.sin(t * 1.6 + ph)) * 0.9);
        }
        const strands = [[-40, 120, 1120, 90, 210], [-40, 330, 600, 260, 150], [480, 260, 1120, 380, 170]];
        strands.forEach(([x1, y1, x2, y2, sag], si) => {
            const pts = hangPoints(x1, y1, x2, y2, sag + Math.sin(t * 0.8 + si) * 6, 38);
            ctx.strokeStyle = alpha(darken(p.deep, 0.5), 0.9);
            ctx.lineWidth = 2;
            ctx.beginPath();
            pts.forEach((pt, i) => (i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y)));
            ctx.stroke();
            pts.forEach((pt, i) => bulb(ctx, pt.x, pt.y + 6, 5, "#ffd88a", 0.55 + 0.45 * Math.sin(t * 3 + i * 1.3 + si)));
        });
        for (const [x, y, s] of [[330, 1760, 1], [750, 1760, 1], [420, 1660, 0.7], [660, 1660, 0.7]]) {
            ctx.fillStyle = darken(p.accent, 0.45);
            ctx.fillRect(x - 18 * s, y - 60 * s, 36 * s, 60 * s);
            ctx.fillStyle = goldGradient(ctx, x - 22 * s, 0, x + 22 * s, 0, p.accent);
            ctx.fillRect(x - 22 * s, y - 66 * s, 44 * s, 8 * s);
            ctx.fillRect(x - 22 * s, y, 44 * s, 8 * s);
            const f = 0.8 + 0.2 * Math.sin(t * 9 + x);
            ctx.fillStyle = alpha("#ffd27a", 0.9 * f);
            ctx.fillRect(x - 12 * s, y - 54 * s, 24 * s, 48 * s);
            const prev = ctx.globalCompositeOperation;
            ctx.globalCompositeOperation = "lighter";
            glow(ctx, x, y - 30 * s, 150 * s * f, "#ffb347", 0.35);
            ctx.globalCompositeOperation = prev;
        }
    },
};
// ─────────────────────────── Haldi: marigold sunshine ───────────────────────────
const haldi = {
    still(ctx, p) {
        const g = ctx.createRadialGradient(540, 760, 50, 540, 900, 1250);
        g.addColorStop(0, lighten(p.sky, 0.5));
        g.addColorStop(0.45, p.sky);
        g.addColorStop(1, mix(p.sky, p.deep, 0.75));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        mandala(ctx, 540, 900, 470, p.accent, 0.1);
        // floor cloth + border
        ctx.fillStyle = mix(p.flower, p.deep, 0.35);
        ctx.fillRect(0, 1700, W, 220);
        ctx.fillStyle = goldGradient(ctx, 0, 0, W, 0, p.accent);
        ctx.fillRect(0, 1700, W, 10);
        for (let x = 20; x < W; x += 50) {
            ctx.fillStyle = alpha(p.accent, 0.5);
            ctx.beginPath();
            ctx.moveTo(x, 1712);
            ctx.lineTo(x + 14, 1740);
            ctx.lineTo(x - 14, 1740);
            ctx.fill();
        }
        const green = mix("#3f8a2c", p.deep, 0.12);
        bananaLeaf(ctx, -60, 1920, 600, -1.28, green);
        bananaLeaf(ctx, -90, 1760, 470, -0.98, darken(green, 0.12));
        bananaLeaf(ctx, 1140, 1920, 600, -Math.PI + 1.28, green, -1);
        bananaLeaf(ctx, 1170, 1760, 470, -Math.PI + 0.98, darken(green, 0.12), -1);
        // brass urli
        ctx.fillStyle = goldGradient(ctx, 300, 0, 780, 0, p.accent === "#2f6b2a" ? "#c9952c" : mix(p.accent, "#d4a03a", 0.6));
        ctx.beginPath();
        ctx.ellipse(540, 1780, 250, 70, 0, 0, Math.PI);
        ctx.fill();
        ctx.fillStyle = mix("#f7c33a", p.sky, 0.3);
        ctx.beginPath();
        ctx.ellipse(540, 1780, 250, 34, 0, 0, Math.PI * 2);
        ctx.fill();
        const r = rng(5);
        for (let i = 0; i < 14; i++)
            marigold(ctx, 330 + r() * 420, 1770 + (r() - 0.5) * 30, 18 + r() * 8, i % 2 ? mg1(p) : mg2(p), i);
        for (const x of [200, 880]) {
            ctx.fillStyle = goldGradient(ctx, x - 70, 0, x + 70, 0, mix(p.accent, "#d4a03a", 0.6));
            ctx.beginPath();
            ctx.ellipse(x, 1820, 70, 34, 0, 0, Math.PI);
            ctx.fill();
            ctx.fillStyle = "#f4b81c";
            ctx.beginPath();
            ctx.ellipse(x, 1820, 70, 16, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    live(ctx, p, t) {
        ctx.save();
        ctx.translate(540, 760);
        ctx.rotate(t * 0.04);
        for (let i = 0; i < 28; i++) {
            ctx.rotate((Math.PI * 2) / 28);
            if (i % 2)
                continue;
            const g = ctx.createLinearGradient(0, 0, 0, -1400);
            g.addColorStop(0, alpha("#ffffff", 0.22));
            g.addColorStop(1, alpha("#ffffff", 0));
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-70, -1400);
            ctx.lineTo(70, -1400);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
        const xs = [10, 60, 110, 160, 215, 270, 330, 750, 810, 865, 920, 970, 1020, 1070, 420, 540, 660];
        const lens = [980, 820, 700, 560, 450, 360, 240, 240, 360, 450, 560, 700, 820, 980, 150, 110, 150];
        xs.forEach((x, i) => marigoldString(ctx, p, x, -10, lens[i], t, i * 0.9, 17));
    },
};
// ─────────────────────────── Mehndi: parasols & lanterns ───────────────────────────
function parasol(ctx, x, y, r, color, accent, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = alpha(darken(accent, 0.3), 0.9);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -2000);
    ctx.stroke();
    const ribs = 10;
    for (let i = 0; i < ribs; i++) {
        const a1 = Math.PI + (i / ribs) * Math.PI, a2 = Math.PI + ((i + 1) / ribs) * Math.PI;
        ctx.fillStyle = i % 2 ? color : lighten(color, 0.22);
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.6);
        ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r * 0.55 + r * 0.25);
        ctx.quadraticCurveTo(Math.cos((a1 + a2) / 2) * r * 1.02, Math.sin((a1 + a2) / 2) * r * 0.55 + r * 0.4, Math.cos(a2) * r, Math.sin(a2) * r * 0.55 + r * 0.25);
        ctx.closePath();
        ctx.fill();
    }
    ctx.strokeStyle = accent;
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let i = 0; i <= ribs; i++) {
        const a = Math.PI + (i / ribs) * Math.PI;
        const px = Math.cos(a) * r, py = Math.sin(a) * r * 0.55 + r * 0.25;
        if (i === 0)
            ctx.moveTo(px, py);
        else
            ctx.lineTo(px, py);
    }
    ctx.stroke();
    for (let i = 0; i <= ribs; i++) {
        const a = Math.PI + (i / ribs) * Math.PI;
        const px = Math.cos(a) * r, py = Math.sin(a) * r * 0.55 + r * 0.25;
        ctx.strokeStyle = alpha(accent, 0.8);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px, py + 28);
        ctx.stroke();
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(px, py + 32, 5, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}
const mehndi = {
    still(ctx, p) {
        const g = ctx.createRadialGradient(540, 1000, 100, 540, 1000, 1300);
        g.addColorStop(0, mix(p.deep, p.sky, 0.55));
        g.addColorStop(0.6, p.deep);
        g.addColorStop(1, darken(p.deep, 0.35));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        mandala(ctx, 540, 1000, 520, p.accent, 0.13);
        mandala(ctx, 540, 1000, 300, p.accent, 0.1);
        const r = rng(9);
        for (let i = 0; i < 18; i++)
            paisley(ctx, r() * W, 300 + r() * 1400, 40 + r() * 30, r() * 6, p.accent, 0.12);
        // floor & cushions
        vGradient(ctx, [[0, mix(p.deep, p.flower, 0.25)], [1, darken(p.deep, 0.4)]], 1690, H);
        ctx.fillStyle = goldGradient(ctx, 0, 0, W, 0, p.accent);
        ctx.fillRect(0, 1688, W, 6);
        const cushions = [[170, 1790, p.flower], [400, 1820, p.accent], [680, 1820, lighten(p.sky, 0.2)], [910, 1790, mix(p.flower, "#ff9a3c", 0.5)]];
        cushions.forEach(([x, y, c]) => {
            const cg = ctx.createRadialGradient(x - 30, y - 30, 10, x, y, 140);
            cg.addColorStop(0, lighten(c, 0.3));
            cg.addColorStop(1, darken(c, 0.25));
            ctx.fillStyle = cg;
            ctx.beginPath();
            ctx.ellipse(x, y, 140, 70, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = alpha(p.accent, 0.8);
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(x, y, 110, 48, 0, 0, Math.PI * 2);
            ctx.stroke();
            for (const s of [-1, 1]) {
                ctx.fillStyle = p.accent;
                ctx.beginPath();
                ctx.arc(x + s * 140, y, 9, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        // potted palms
        for (const [x, flip] of [[70, 1], [1010, -1]]) {
            const green = leafGreen(p);
            for (let i = 0; i < 7; i++)
                bananaLeaf(ctx, x, 1560, 300 + i * 10, -Math.PI / 2 + (i - 4.6) * 0.24 * flip, i % 2 ? green : darken(green, 0.15), flip);
            ctx.fillStyle = goldGradient(ctx, x - 70, 0, x + 70, 0, p.accent);
            ctx.beginPath();
            ctx.moveTo(x - 80, 1560);
            ctx.lineTo(x + 80, 1560);
            ctx.lineTo(x + 55, 1700);
            ctx.lineTo(x - 55, 1700);
            ctx.closePath();
            ctx.fill();
        }
    },
    live(ctx, p, t) {
        for (let i = 0; i < 22; i++)
            marigoldString(ctx, p, 24 + i * 50, -6, i % 3 === 0 ? 120 : 70, t, i, 12);
        const colors = [p.flower, p.accent, lighten(p.sky, 0.15), mix(p.flower, "#ff9a3c", 0.5), mix(p.flower, "#7a3cff", 0.35)];
        const ps = [[130, 300, 120], [360, 230, 95], [720, 230, 95], [950, 300, 120], [250, 470, 70], [830, 470, 70], [540, 150, 80]];
        ps.forEach(([x, y, rr], i) => parasol(ctx, x, y, rr, colors[i % colors.length], p.accent, Math.sin(t * 0.9 + i) * 0.05));
        for (const [x, y] of [[60, 560], [1020, 560], [440, 380], [640, 380]]) {
            const sw = Math.sin(t * 1.2 + x) * 6;
            ctx.strokeStyle = alpha(p.accent, 0.8);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + sw, y - 40);
            ctx.stroke();
            ctx.fillStyle = goldGradient(ctx, x - 24, 0, x + 24, 0, p.accent);
            ctx.fillRect(x + sw - 22, y - 42, 44, 8);
            ctx.fillStyle = alpha(mix("#ffcf6b", p.flower, 0.3), 0.9);
            ctx.beginPath();
            ctx.ellipse(x + sw, y, 26, 36, 0, 0, Math.PI * 2);
            ctx.fill();
            const prev = ctx.globalCompositeOperation;
            ctx.globalCompositeOperation = "lighter";
            glow(ctx, x + sw, y, 110 * (0.9 + 0.1 * Math.sin(t * 6 + x)), "#ffb347", 0.35);
            ctx.globalCompositeOperation = prev;
        }
    },
};
// ─────────────────────────── Sangeet: stage of lights ───────────────────────────
function marqueePoints() {
    return archPath(540, 395, 510, 1560, 46);
}
const sangeet = {
    still(ctx, p) {
        const g = ctx.createRadialGradient(540, 950, 50, 540, 950, 1100);
        g.addColorStop(0, mix(p.deep, p.sky, 0.55));
        g.addColorStop(1, darken(p.deep, 0.2));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        // arch band
        const pts = archPath(540, 395, 510, 1560, 6);
        ctx.strokeStyle = darken(p.accent, 0.55);
        ctx.lineWidth = 46;
        ctx.beginPath();
        pts.forEach((pt, i) => (i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y)));
        ctx.stroke();
        ctx.strokeStyle = goldGradient(ctx, 160, 0, 920, 0, p.accent);
        ctx.lineWidth = 4;
        for (const off of [-22, 22]) {
            const inner = archPath(540, 395 + off, 510 - off, 1560, 6);
            ctx.beginPath();
            inner.forEach((pt, i) => (i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y)));
            ctx.stroke();
        }
        // stage floor
        vGradient(ctx, [[0, mix(darken(p.sky, 0.4), p.deep, 0.3)], [1, darken(p.deep, 0.5)]], 1560, H);
        ctx.fillStyle = goldGradient(ctx, 0, 0, W, 0, p.accent);
        ctx.fillRect(0, 1556, W, 8);
        const refl = ctx.createLinearGradient(0, 1564, 0, 1800);
        refl.addColorStop(0, alpha(p.accent, 0.25));
        refl.addColorStop(1, alpha(p.accent, 0));
        ctx.fillStyle = refl;
        ctx.fillRect(145, 1564, 790, 240);
        // curtains
        const cc = mix(p.sky, p.flower, 0.08);
        for (const side of [0, 1]) {
            ctx.save();
            ctx.beginPath();
            if (side === 0) {
                ctx.moveTo(0, 0);
                ctx.lineTo(240, 0);
                ctx.quadraticCurveTo(200, 900, 120, 1150);
                ctx.quadraticCurveTo(170, 1500, 210, H);
                ctx.lineTo(0, H);
            }
            else {
                ctx.moveTo(W, 0);
                ctx.lineTo(W - 240, 0);
                ctx.quadraticCurveTo(W - 200, 900, W - 120, 1150);
                ctx.quadraticCurveTo(W - 170, 1500, W - 210, H);
                ctx.lineTo(W, H);
            }
            ctx.closePath();
            ctx.clip();
            curtain(ctx, side ? W - 250 : 0, 0, 250, H, cc, 6);
            ctx.restore();
            ctx.fillStyle = goldGradient(ctx, 0, 0, 60, 0, p.accent);
            ctx.beginPath();
            ctx.ellipse(side ? W - 125 : 125, 1150, 40, 14, side ? 0.4 : -0.4, 0, Math.PI * 2);
            ctx.fill();
        }
        curtain(ctx, 0, 0, W, 150, cc, 18);
        scallops(ctx, 0, W, 150, 45, cc, p.accent);
        for (let x = 6; x < W; x += 12) {
            ctx.strokeStyle = alpha(p.accent, 0.8);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, 150);
            ctx.lineTo(x, 172 + Math.sin(x) * 4);
            ctx.stroke();
        }
    },
    live(ctx, p, t) {
        const prev = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = "lighter";
        [[200, 0.45], [540, 0], [880, -0.45]].forEach(([x, base], i) => {
            const a = base + Math.sin(t * 0.7 + i * 2) * 0.28;
            ctx.save();
            ctx.translate(x, 120);
            ctx.rotate(a);
            const g = ctx.createLinearGradient(0, 0, 0, 1600);
            g.addColorStop(0, alpha(lighten(p.accent, 0.5), 0.32));
            g.addColorStop(1, alpha(lighten(p.accent, 0.5), 0));
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.moveTo(-14, 0);
            ctx.lineTo(14, 0);
            ctx.lineTo(240, 1600);
            ctx.lineTo(-240, 1600);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        });
        ctx.globalCompositeOperation = prev;
        const pts = marqueePoints();
        const chase = Math.floor(t * 7);
        pts.forEach((pt, i) => bulb(ctx, pt.x, pt.y, 9, "#ffd88a", (i + chase) % 3 === 0 ? 1 : 0.35));
    },
};
// ─────────────────────────── Reception: chandelier evening ───────────────────────────
const reception = {
    still(ctx, p) {
        const g = ctx.createRadialGradient(540, 800, 80, 540, 900, 1300);
        g.addColorStop(0, mix(p.sky, p.deep, 0.2));
        g.addColorStop(0.6, p.deep);
        g.addColorStop(1, darken(p.deep, 0.4));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = alpha(p.accent, 0.12);
        ctx.lineWidth = 2;
        for (const x of [60, 300, 560, 820]) {
            ctx.strokeRect(x, 520, 200, 1000);
            ctx.strokeRect(x + 16, 536, 168, 968);
        }
        const swag = mix(p.sky, p.flower, 0.35);
        for (let i = 0; i < 4; i++) {
            const x1 = i * 270, x2 = x1 + 270;
            ctx.fillStyle = swag;
            ctx.beginPath();
            ctx.moveTo(x1, 0);
            ctx.quadraticCurveTo((x1 + x2) / 2, 260, x2, 0);
            ctx.quadraticCurveTo((x1 + x2) / 2, 150, x1, 0);
            ctx.fill();
            ctx.fillStyle = goldGradient(ctx, x2 - 10, 0, x2 + 10, 0, p.accent);
            ctx.fillRect(x2 - 6, 0, 12, 70);
            ctx.beginPath();
            ctx.moveTo(x2 - 16, 70);
            ctx.lineTo(x2 + 16, 70);
            ctx.lineTo(x2, 120);
            ctx.fill();
        }
        vGradient(ctx, [[0, darken(p.deep, 0.1)], [1, darken(p.deep, 0.6)]], 1620, H);
        ctx.fillStyle = alpha(p.accent, 0.5);
        ctx.fillRect(0, 1618, W, 3);
        for (const x of [86, 994]) {
            ctx.fillStyle = goldGradient(ctx, x - 12, 0, x + 12, 0, p.accent);
            ctx.fillRect(x - 8, 1150, 16, 600);
            ctx.beginPath();
            ctx.moveTo(x - 60, 1760);
            ctx.lineTo(x + 60, 1760);
            ctx.lineTo(x + 20, 1700);
            ctx.lineTo(x - 20, 1700);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(x - 50, 1150);
            ctx.lineTo(x + 50, 1150);
            ctx.lineTo(x + 20, 1200);
            ctx.lineTo(x - 20, 1200);
            ctx.fill();
            bouquet(ctx, p, x, 1100, 150, x, [p.flower, "#fffaf2", lighten(p.flower, 0.4)]);
            const r = rng(x);
            for (let i = 0; i < 10; i++)
                leaf(ctx, x + (r() - 0.5) * 90, 1180 + i * 22, 50, 14, Math.PI / 2 + (r() - 0.5), leafGreen(p));
        }
    },
    live(ctx, p, t) {
        const prev = ctx.globalCompositeOperation;
        const r = rng(88);
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < 26; i++) {
            const x = r() * W, sp = 10 + r() * 20, y = ((r() * H - t * sp) % H + H) % H, rr = 20 + r() * 50;
            glow(ctx, x, y, rr, lighten(p.accent, 0.3), 0.18 + 0.08 * Math.sin(t + i));
        }
        ctx.globalCompositeOperation = prev;
        const sway = Math.sin(t * 0.6) * 0.012;
        ctx.save();
        ctx.translate(540, 0);
        ctx.rotate(sway);
        ctx.strokeStyle = goldGradient(ctx, -10, 0, 10, 0, p.accent);
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 200);
        ctx.stroke();
        const tiers = [[250, 230, 14], [330, 170, 11], [400, 110, 8]];
        tiers.forEach(([y, rx, n], ti) => {
            ctx.strokeStyle = goldGradient(ctx, -rx, 0, rx, 0, p.accent);
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.ellipse(0, y, rx, rx * 0.18, 0, 0, Math.PI * 2);
            ctx.stroke();
            for (let i = 0; i < n; i++) {
                const a = (i / n) * Math.PI * 2;
                const x = Math.cos(a) * rx, yy = y + Math.sin(a) * rx * 0.18;
                for (let k = 0; k < 4; k++) {
                    ctx.fillStyle = alpha("#ffffff", 0.75 - k * 0.12);
                    ctx.beginPath();
                    ctx.moveTo(x, yy + 10 + k * 22);
                    ctx.lineTo(x + 5, yy + 20 + k * 22);
                    ctx.lineTo(x, yy + 30 + k * 22);
                    ctx.lineTo(x - 5, yy + 20 + k * 22);
                    ctx.fill();
                }
                if (Math.sin(t * 3 + i * 2 + ti) > 0.85)
                    sparkle(ctx, x, yy + 40, 12, "#ffffff", 1);
                bulb(ctx, x, yy - 14, 5, "#ffe2a8", 0.8 + 0.2 * Math.sin(t * 5 + i));
            }
        });
        ctx.restore();
        const g2 = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = "lighter";
        glow(ctx, 540, 330, 380, "#ffd9a0", 0.22);
        ctx.globalCompositeOperation = g2;
    },
};
export const SCENES = { wedding, engagement, haldi, mehndi, sangeet, reception };
