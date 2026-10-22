// Low-level canvas drawing primitives used by the scenes, frames and particles.
import { alpha, darken, lighten, mix } from "./color";
export const W = 1080;
export const H = 1920;
/** Deterministic pseudo random generator so every frame (and every export) is identical. */
export function rng(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
export const clamp01 = (v) => Math.max(0, Math.min(1, v));
export const easeOut = (v) => 1 - Math.pow(1 - clamp01(v), 3);
export const easeInOut = (v) => {
    const x = clamp01(v);
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
/** 0..1 progress of an event that starts at `start` and lasts `dur` seconds. */
export const progress = (t, start, dur) => clamp01((t - start) / dur);
export function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}
export function glow(ctx, x, y, r, color, a = 0.6) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, alpha(color, a));
    g.addColorStop(0.35, alpha(color, a * 0.45));
    g.addColorStop(1, alpha(color, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
export function rose(ctx, x, y, r, color, seed = 1) {
    const g = ctx.createRadialGradient(x - r * 0.25, y - r * 0.3, r * 0.1, x, y, r);
    g.addColorStop(0, lighten(color, 0.35));
    g.addColorStop(0.65, color);
    g.addColorStop(1, darken(color, 0.3));
    ctx.fillStyle = g;
    ctx.beginPath();
    // slightly irregular, petal-like outline
    for (let i = 0; i <= 10; i++) {
        const a = (i / 10) * Math.PI * 2 + seed;
        const rr = r * (0.92 + 0.08 * Math.sin(i * 2.3 + seed));
        const px = x + Math.cos(a) * rr;
        const py = y + Math.sin(a) * rr;
        if (i === 0)
            ctx.moveTo(px, py);
        else
            ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.lineCap = "round";
    ctx.strokeStyle = alpha(darken(color, 0.45), 0.55);
    for (let k = 0; k < 4; k++) {
        const rr = r * (0.78 - k * 0.19);
        if (rr <= 1)
            break;
        ctx.lineWidth = Math.max(1, r * 0.07);
        ctx.beginPath();
        const s = seed * 3 + k * 1.9;
        ctx.arc(x + Math.cos(s) * r * 0.05, y + Math.sin(s) * r * 0.05, rr, s, s + Math.PI * 1.25);
        ctx.stroke();
    }
    ctx.fillStyle = alpha(darken(color, 0.5), 0.5);
    ctx.beginPath();
    ctx.arc(x, y, r * 0.12, 0, Math.PI * 2);
    ctx.fill();
}
export function marigold(ctx, x, y, r, color, seed = 1) {
    ctx.fillStyle = darken(color, 0.2);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    const n = 14;
    for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + seed;
        ctx.fillStyle = i % 2 ? lighten(color, 0.18) : color;
        ctx.beginPath();
        ctx.arc(x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.42, 0, Math.PI * 2);
        ctx.fill();
    }
    for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2 + seed * 2;
        ctx.fillStyle = lighten(color, 0.3);
        ctx.beginPath();
        ctx.arc(x + Math.cos(a) * r * 0.28, y + Math.sin(a) * r * 0.28, r * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = alpha(darken(color, 0.4), 0.6);
    ctx.beginPath();
    ctx.arc(x, y, r * 0.16, 0, Math.PI * 2);
    ctx.fill();
}
export function leaf(ctx, x, y, len, width, angle, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    const g = ctx.createLinearGradient(0, -width, 0, width);
    g.addColorStop(0, lighten(color, 0.15));
    g.addColorStop(1, darken(color, 0.2));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(len * 0.45, -width, len, 0);
    ctx.quadraticCurveTo(len * 0.45, width, 0, 0);
    ctx.fill();
    ctx.strokeStyle = alpha(lighten(color, 0.35), 0.6);
    ctx.lineWidth = Math.max(1, width * 0.08);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(len * 0.92, 0);
    ctx.stroke();
    ctx.restore();
}
/** Large banana / palm leaf with ribbed edge. */
export function bananaLeaf(ctx, x, y, len, angle, color, flip = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(1, flip);
    const w = len * 0.2;
    const g = ctx.createLinearGradient(0, -w, 0, w);
    g.addColorStop(0, lighten(color, 0.2));
    g.addColorStop(0.5, color);
    g.addColorStop(1, darken(color, 0.25));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(len * 0.2, -w * 1.3, len * 0.75, -w * 1.1, len, -w * 0.05);
    ctx.bezierCurveTo(len * 0.75, w * 0.9, len * 0.2, w * 1.1, 0, 0);
    ctx.fill();
    ctx.strokeStyle = alpha(darken(color, 0.35), 0.55);
    ctx.lineWidth = 2;
    for (let i = 1; i < 22; i++) {
        const px = (i / 22) * len;
        const k = Math.sin((i / 22) * Math.PI);
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px + len * 0.04, -w * 1.05 * k);
        ctx.moveTo(px, 0);
        ctx.lineTo(px + len * 0.04, w * 0.9 * k);
        ctx.stroke();
    }
    ctx.strokeStyle = lighten(color, 0.4);
    ctx.lineWidth = len * 0.012;
    ctx.beginPath();
    ctx.moveTo(-len * 0.1, 0);
    ctx.lineTo(len * 0.98, -w * 0.04);
    ctx.stroke();
    ctx.restore();
}
/** Points along a hanging (catenary-like) curve. */
export function hangPoints(x1, y1, x2, y2, sag, step) {
    const len = Math.hypot(x2 - x1, y2 - y1);
    const n = Math.max(2, Math.round(len / step));
    const pts = [];
    for (let i = 0; i <= n; i++) {
        const u = i / n;
        pts.push({ x: x1 + (x2 - x1) * u, y: y1 + (y2 - y1) * u + sag * 4 * u * (1 - u) });
    }
    return pts;
}
export function bulb(ctx, x, y, r, color, intensity) {
    const prev = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "lighter";
    glow(ctx, x, y, r * 6, color, 0.35 * intensity);
    ctx.globalCompositeOperation = prev;
    ctx.fillStyle = mix(color, "#ffffff", 0.3 + 0.5 * intensity);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}
export function sparkle(ctx, x, y, r, color, a) {
    if (a <= 0.01)
        return;
    ctx.save();
    ctx.globalAlpha *= a;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.quadraticCurveTo(x, y, x, y + r);
    ctx.quadraticCurveTo(x, y, x - r, y);
    ctx.quadraticCurveTo(x, y, x, y - r);
    ctx.fill();
    ctx.globalCompositeOperation = "lighter";
    glow(ctx, x, y, r * 1.6, color, 0.5);
    ctx.restore();
}
/** Velvet curtain panel with vertical folds. */
export function curtain(ctx, x, y, w, h, color, folds = 7) {
    const g = ctx.createLinearGradient(x, 0, x + w, 0);
    for (let i = 0; i <= folds * 2; i++) {
        const u = i / (folds * 2);
        g.addColorStop(u, i % 2 ? lighten(color, 0.16) : darken(color, 0.35));
    }
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
    const shade = ctx.createLinearGradient(0, y, 0, y + h);
    shade.addColorStop(0, alpha("#000000", 0.25));
    shade.addColorStop(0.3, alpha("#000000", 0));
    shade.addColorStop(1, alpha("#000000", 0.3));
    ctx.fillStyle = shade;
    ctx.fillRect(x, y, w, h);
}
/** A row of semicircular scallops (valance / canopy edge). */
export function scallops(ctx, x1, x2, y, r, fill, trim) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    for (let x = x1; x < x2; x += r * 2)
        ctx.arc(x + r, y, r, Math.PI, 0, true);
    ctx.lineTo(x2, y - 2);
    ctx.closePath();
    ctx.fill();
    if (trim) {
        ctx.strokeStyle = trim;
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = x1; x < x2; x += r * 2) {
            ctx.moveTo(x, y);
            ctx.arc(x + r, y, r, Math.PI, 0, true);
        }
        ctx.stroke();
    }
}
/** Ornamental lotus / mandala medallion. */
export function lotus(ctx, x, y, r, color, a = 1) {
    ctx.save();
    ctx.globalAlpha *= a;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = Math.max(1.5, r * 0.06);
    for (let i = 0; i < 5; i++) {
        const ang = -Math.PI / 2 + (i - 2) * 0.42;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ang + Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(r * 0.38, -r * 0.55, 0, -r * (i === 2 ? 1.1 : 0.85));
        ctx.quadraticCurveTo(-r * 0.38, -r * 0.55, 0, 0);
        ctx.stroke();
        ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(x, y + r * 0.12, r * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
export function mandala(ctx, x, y, r, color, a) {
    ctx.save();
    ctx.globalAlpha *= a;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    const rings = [1, 0.8, 0.6, 0.42, 0.26];
    rings.forEach((k, ri) => {
        const rr = r * k;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, rr, 0, Math.PI * 2);
        ctx.stroke();
        const n = 12 + ri * 4;
        for (let i = 0; i < n; i++) {
            const ang = (i / n) * Math.PI * 2;
            const px = x + Math.cos(ang) * rr;
            const py = y + Math.sin(ang) * rr;
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(ang + Math.PI / 2);
            ctx.beginPath();
            const pr = r * 0.09 * (1 - ri * 0.12);
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(pr * 0.7, -pr, 0, -pr * 2);
            ctx.quadraticCurveTo(-pr * 0.7, -pr, 0, 0);
            ctx.stroke();
            ctx.restore();
            if (ri % 2 === 0) {
                ctx.beginPath();
                ctx.arc(x + Math.cos(ang + Math.PI / n) * (rr - r * 0.05), y + Math.sin(ang + Math.PI / n) * (rr - r * 0.05), 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });
    ctx.restore();
}
export function paisley(ctx, x, y, s, angle, color, a) {
    ctx.save();
    ctx.globalAlpha *= a;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    for (const k of [1, 0.7, 0.42]) {
        ctx.beginPath();
        ctx.moveTo(0, -s * k);
        ctx.bezierCurveTo(s * 0.9 * k, -s * 0.9 * k, s * 0.9 * k, s * 0.7 * k, 0, s * 0.7 * k);
        ctx.bezierCurveTo(-s * 0.8 * k, s * 0.6 * k, -s * 0.6 * k, -s * 0.2 * k, 0, -s * 0.15 * k);
        ctx.bezierCurveTo(s * 0.25 * k, -s * 0.35 * k, s * 0.2 * k, -s * 0.8 * k, 0, -s * k);
        ctx.stroke();
    }
    ctx.restore();
}
export function goldGradient(ctx, x1, y1, x2, y2, accent) {
    const g = ctx.createLinearGradient(x1, y1, x2, y2);
    g.addColorStop(0, darken(accent, 0.25));
    g.addColorStop(0.3, lighten(accent, 0.45));
    g.addColorStop(0.55, accent);
    g.addColorStop(0.8, lighten(accent, 0.25));
    g.addColorStop(1, darken(accent, 0.3));
    return g;
}
