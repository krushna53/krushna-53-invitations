// Extra illustrated designs for Wedding, Engagement and Reception.
import { alpha, darken, lighten, mix } from "./color";
import { H, W, bulb, glow, goldGradient, hangPoints, leaf, lotus, marigold, rng, rose, scallops, sparkle } from "./draw-kit";
import { bouquet, diya, leafGreen, mg1, mg2, vGradient } from "./scenes";
const lighter = (ctx, fn) => {
    const prev = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "lighter";
    fn();
    ctx.globalCompositeOperation = prev;
};
// ───────────────────── WEDDING ─────────────────────
function dome(ctx, x, base, w, h) {
    ctx.beginPath();
    ctx.moveTo(x - w / 2, base);
    ctx.bezierCurveTo(x - w / 2, base - h * 0.7, x - w * 0.15, base - h * 0.8, x, base - h);
    ctx.bezierCurveTo(x + w * 0.15, base - h * 0.8, x + w / 2, base - h * 0.7, x + w / 2, base);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(x - 3, base - h - 30, 6, 32);
}
function palace(ctx, p, base, color) {
    ctx.fillStyle = color;
    ctx.fillRect(60, base - 300, 960, 320);
    dome(ctx, 540, base - 300, 300, 230);
    for (const x of [250, 830]) {
        ctx.fillRect(x - 70, base - 420, 140, 140);
        dome(ctx, x, base - 420, 140, 120);
    }
    for (const x of [90, 990]) {
        ctx.fillRect(x - 40, base - 520, 80, 540);
        dome(ctx, x, base - 520, 90, 90);
    }
    for (const x of [380, 700])
        dome(ctx, x, base - 300, 90, 80);
    ctx.fillRect(0, base, W, H - base);
    // windows
    const win = (x, y, w, h) => { ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x, y + w / 2); ctx.arc(x + w / 2, y + w / 2, w / 2, Math.PI, 0); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill(); };
    ctx.fillStyle = mix("#ffcf6b", p.accent, 0.3);
    for (let i = 0; i < 9; i++)
        win(120 + i * 100, base - 220, 44, 90);
    for (let i = 0; i < 9; i++)
        win(120 + i * 100, base - 100, 44, 80);
    for (const x of [222, 802])
        win(x, base - 390, 56, 90);
    win(500, base - 470, 80, 140);
}
export const weddingPalace = {
    still(ctx, p) {
        vGradient(ctx, [[0, darken(p.deep, 0.35)], [0.45, p.deep], [0.7, mix(p.deep, p.flower, 0.5)], [0.82, mix(p.flower, "#ffcf6b", 0.45)], [1, darken(p.deep, 0.2)]]);
        glow(ctx, 540, 1350, 600, mix("#ffcf6b", p.flower, 0.3), 0.5);
        const r = rng(9);
        for (let i = 0; i < 120; i++) {
            ctx.fillStyle = alpha("#fff4dc", 0.2 + r() * 0.5);
            ctx.beginPath();
            ctx.arc(r() * W, r() * 800, r() * 2 + 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
        palace(ctx, p, 1680, darken(p.deep, 0.55));
        // reflection pool
        vGradient(ctx, [[0, alpha(mix(p.flower, "#ffcf6b", 0.4), 0.35)], [1, alpha(darken(p.deep, 0.6), 0.9)]], 1700, H);
        ctx.strokeStyle = alpha("#ffffff", 0.15);
        ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.moveTo(200 + i * 20, 1730 + i * 22);
            ctx.lineTo(880 - i * 20, 1730 + i * 22);
            ctx.stroke();
        }
        // hanging floral strings at the top
        for (let x = 30; x < W; x += 70) {
            const len = 160 + ((x / 70) % 3) * 70;
            for (let y = 0; y < len; y += 26)
                rose(ctx, x, y + 10, 13, (y / 26) % 2 ? p.flower : lighten(p.flower, 0.5), x + y);
        }
    },
    live(ctx, p, t) {
        lighter(ctx, () => {
            for (let i = 0; i < 9; i++)
                glow(ctx, 142 + i * 100, 1430, 60, "#ffcf6b", 0.15 + 0.1 * Math.sin(t * 2 + i));
            glow(ctx, 540, 1260, 140, "#ffcf6b", 0.22 + 0.06 * Math.sin(t * 1.5));
        });
        const r = rng(31);
        for (let i = 0; i < 18; i++) {
            const x = r() * W, y = 900 + r() * 700;
            lighter(ctx, () => glow(ctx, x + Math.sin(t + i) * 30, y + Math.cos(t * 0.7 + i) * 20, 14, "#fff2a8", 0.6 * Math.max(0, Math.sin(t * 1.3 + i))));
        }
    },
};
function bell(ctx, p, x, y, s, ang) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    ctx.strokeStyle = goldGradient(ctx, -4, 0, 4, 0, p.accent);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -200 * s);
    ctx.lineTo(0, 0);
    ctx.stroke();
    for (let i = 1; i < 5; i++)
        marigold(ctx, 0, -i * 40 * s, 12 * s, i % 2 ? mg1(p) : mg2(p), i);
    ctx.fillStyle = goldGradient(ctx, -40 * s, 0, 40 * s, 0, mix(p.accent, "#d4a03a", 0.5));
    ctx.beginPath();
    ctx.moveTo(-12 * s, 0);
    ctx.quadraticCurveTo(-18 * s, 30 * s, -40 * s, 70 * s);
    ctx.lineTo(40 * s, 70 * s);
    ctx.quadraticCurveTo(18 * s, 30 * s, 12 * s, 0);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 76 * s, 9 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
export const weddingAgni = {
    still(ctx, p) {
        const g = ctx.createRadialGradient(540, 1650, 60, 540, 1200, 1400);
        g.addColorStop(0, mix(p.deep, "#ff9a3c", 0.45));
        g.addColorStop(0.5, p.deep);
        g.addColorStop(1, darken(p.deep, 0.45));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        // patterned silk backdrop
        ctx.strokeStyle = alpha(p.accent, 0.1);
        ctx.lineWidth = 2;
        for (let y = 120; y < 1500; y += 90)
            for (let x = (y / 90) % 2 ? 45 : 0; x < W; x += 90)
                lotus(ctx, x, y, 18, alpha(p.accent, 0.4), 0.5);
        // canopy toran
        ctx.fillStyle = mix(p.flower, p.deep, 0.3);
        ctx.fillRect(0, 0, W, 90);
        scallops(ctx, 0, W, 90, 30, mix(p.flower, p.deep, 0.3), p.accent);
        // agni kund
        const gold = mix(p.accent, "#d4a03a", 0.5);
        ctx.fillStyle = darken(gold, 0.35);
        ctx.beginPath();
        ctx.moveTo(380, 1700);
        ctx.lineTo(700, 1700);
        ctx.lineTo(660, 1800);
        ctx.lineTo(420, 1800);
        ctx.fill();
        ctx.fillStyle = goldGradient(ctx, 360, 0, 720, 0, gold);
        ctx.fillRect(360, 1690, 360, 18);
        ctx.fillRect(400, 1800, 280, 20);
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(330 - i * 30, 1820 + i * 25, 420 + i * 60, 22);
        }
        // petals & lotuses around
        const r = rng(14);
        for (let i = 0; i < 90; i++) {
            ctx.fillStyle = alpha(r() > 0.5 ? p.flower : "#f28a17", 0.85);
            ctx.beginPath();
            ctx.ellipse(r() * W, 1780 + r() * 140, 10, 6, r() * 3, 0, Math.PI * 2);
            ctx.fill();
        }
        for (const x of [140, 940]) {
            for (let i = 0; i < 6; i++)
                leaf(ctx, x, 1800, 90, 26, -Math.PI / 2 + (i - 2.5) * 0.4, leafGreen(p));
            lotus(ctx, x, 1790, 50, lighten(p.flower, 0.3));
        }
    },
    live(ctx, p, t) {
        // fire
        lighter(ctx, () => glow(ctx, 540, 1640, 380 * (0.92 + 0.08 * Math.sin(t * 9)), "#ff8a2a", 0.4));
        for (let i = 0; i < 9; i++) {
            const x = 420 + i * 30, h = 120 + 70 * Math.abs(Math.sin(t * (4 + i * 0.7) + i));
            const fg = ctx.createLinearGradient(0, 1695, 0, 1695 - h);
            fg.addColorStop(0, "#fff4c0");
            fg.addColorStop(0.4, "#ffb02e");
            fg.addColorStop(1, alpha("#ff4d1a", 0));
            ctx.fillStyle = fg;
            ctx.beginPath();
            ctx.moveTo(x - 26, 1695);
            ctx.quadraticCurveTo(x + Math.sin(t * 7 + i) * 18, 1695 - h, x + 26, 1695);
            ctx.fill();
        }
        for (let i = 0; i < 10; i++) {
            const u = ((t * 0.5 + i / 10) % 1);
            lighter(ctx, () => glow(ctx, 540 + Math.sin(i * 3 + t) * 80, 1650 - u * 500, 8, "#ffcf6b", 0.8 * (1 - u)));
        }
        for (let i = 0; i < 7; i++)
            bell(ctx, p, 80 + i * 153, 300 + (i % 2) * 90, 1, Math.sin(t * 1.4 + i) * 0.06);
    },
};
export const weddingBouquet = {
    still(ctx, p) {
        vGradient(ctx, [[0, lighten(p.sky, 0.3)], [1, mix(p.sky, p.deep, 0.25)]]);
        // watercolour wash
        const r = rng(21);
        for (let i = 0; i < 30; i++) {
            ctx.fillStyle = alpha(i % 2 ? p.deep : p.flower, 0.05);
            ctx.beginPath();
            ctx.ellipse(r() * W, r() * H, 120 + r() * 200, 80 + r() * 150, r() * 3, 0, Math.PI * 2);
            ctx.fill();
        }
        const cols = [p.flower, lighten(p.flower, 0.45), lighten(p.sky, 0.6), darken(p.flower, 0.15), mix(p.flower, p.accent, 0.3)];
        const corner = (x, y, dir, scale, seed) => {
            const rr = rng(seed);
            for (let i = 0; i < 46; i++) {
                const a = rr() * Math.PI * 0.5 + (dir === 0 ? 0 : dir === 1 ? Math.PI * 0.5 : dir === 2 ? Math.PI : Math.PI * 1.5);
                const d = rr() * 300 * scale;
                leaf(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d, (60 + rr() * 70) * scale, (18 + rr() * 10) * scale, a + (rr() - 0.5), rr() > 0.5 ? leafGreen(p) : mix(leafGreen(p), "#9bb58a", 0.4));
            }
            for (let i = 0; i < 34; i++) {
                const a = rr() * Math.PI * 0.5 + (dir === 0 ? 0 : dir === 1 ? Math.PI * 0.5 : dir === 2 ? Math.PI : Math.PI * 1.5);
                const d = rr() * 260 * scale;
                rose(ctx, x + Math.cos(a) * d, y + Math.sin(a) * d, (34 + rr() * 40) * scale, cols[i % cols.length], rr() * 6);
            }
            for (let i = 0; i < 16; i++) {
                const a = rr() * Math.PI * 0.5 + (dir === 0 ? 0 : dir === 1 ? Math.PI * 0.5 : dir === 2 ? Math.PI : Math.PI * 1.5);
                const d = 200 * scale + rr() * 140 * scale;
                ctx.fillStyle = lighten(p.sky, 0.6);
                ctx.beginPath();
                ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 6, 0, Math.PI * 2);
                ctx.fill();
            }
        };
        corner(0, 0, 0, 1.25, 3);
        corner(W, H, 2, 1.3, 5);
        corner(W, 0, 1, 0.65, 7);
        corner(0, H, 3, 0.7, 9);
        ctx.strokeStyle = alpha(p.accent, 0.7);
        ctx.lineWidth = 2;
        ctx.strokeRect(70, 70, W - 140, H - 140);
    },
    live(ctx, p, t) {
        const r = rng(5);
        for (let i = 0; i < 10; i++)
            sparkle(ctx, 120 + r() * 840, 200 + r() * 1500, 12, lighten(p.accent, 0.5), Math.max(0, Math.sin(t * 1.6 + i * 1.2)));
    },
};
// ───────────────────── ENGAGEMENT ─────────────────────
function ring(ctx, p, x, y, r, tilt, front) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);
    const g = goldGradient(ctx, -r, -r, r, r, p.accent);
    ctx.strokeStyle = g;
    ctx.lineWidth = r * 0.16;
    ctx.beginPath();
    if (front === "back")
        ctx.ellipse(0, 0, r, r * 0.38, 0, Math.PI, Math.PI * 2);
    else
        ctx.ellipse(0, 0, r, r * 0.38, 0, 0, Math.PI);
    ctx.stroke();
    ctx.restore();
}
export const engagementRings = {
    still(ctx, p) {
        const g = ctx.createRadialGradient(540, 420, 40, 540, 800, 1400);
        g.addColorStop(0, mix(p.deep, p.sky, 0.5));
        g.addColorStop(0.5, p.deep);
        g.addColorStop(1, darken(p.deep, 0.5));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        // spotlight cone
        const sg = ctx.createLinearGradient(540, 0, 540, 700);
        sg.addColorStop(0, alpha("#ffffff", 0.16));
        sg.addColorStop(1, alpha("#ffffff", 0));
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.moveTo(470, 0);
        ctx.lineTo(610, 0);
        ctx.lineTo(860, 700);
        ctx.lineTo(220, 700);
        ctx.fill();
        // velvet cushion
        const cg = ctx.createRadialGradient(520, 470, 20, 540, 500, 200);
        cg.addColorStop(0, lighten(p.flower, 0.15));
        cg.addColorStop(1, darken(p.flower, 0.4));
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.ellipse(540, 500, 200, 70, 0, 0, Math.PI * 2);
        ctx.fill();
        // rose petals at the bottom
        const r = rng(12);
        for (let i = 0; i < 26; i++)
            rose(ctx, r() * W, 1720 + r() * 220, 22 + r() * 30, i % 3 ? p.flower : lighten(p.flower, 0.4), r() * 6);
        for (let i = 0; i < 80; i++) {
            ctx.fillStyle = alpha(p.flower, 0.8);
            ctx.beginPath();
            ctx.ellipse(r() * W, 1600 + r() * 320, 11, 6, r() * 3, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    live(ctx, p, t) {
        const bob = Math.sin(t * 1.2) * 6;
        ring(ctx, p, 480, 410 + bob, 90, -0.35, "back");
        ring(ctx, p, 600, 400 - bob, 90, 0.35, "back");
        ring(ctx, p, 480, 410 + bob, 90, -0.35, "front");
        ring(ctx, p, 600, 400 - bob, 90, 0.35, "front");
        // diamond
        const dx = 600 + Math.sin(0.35) * -90 * 0.0, dy = 400 - bob - 52;
        ctx.fillStyle = "#e8f6ff";
        ctx.beginPath();
        ctx.moveTo(dx - 26, dy);
        ctx.lineTo(dx - 14, dy - 18);
        ctx.lineTo(dx + 14, dy - 18);
        ctx.lineTo(dx + 26, dy);
        ctx.lineTo(dx, dy + 30);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = alpha("#9fd0ff", 0.8);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        sparkle(ctx, dx + 10, dy - 12, 40, "#ffffff", 0.5 + 0.5 * Math.sin(t * 3));
        lighter(ctx, () => {
            const r = rng(4);
            for (let i = 0; i < 22; i++) {
                const x = r() * W, y = ((r() * H - t * (10 + r() * 20)) % H + H) % H;
                glow(ctx, x, y, 30 + r() * 50, lighten(p.accent, 0.2), 0.16);
            }
        });
    },
};
export const engagementWreath = {
    still(ctx, p) {
        vGradient(ctx, [[0, lighten(p.sky, 0.25)], [1, mix(p.sky, p.deep, 0.3)]]);
        glow(ctx, 540, 1080, 650, "#ffffff", 0.45);
        const cols = [p.flower, lighten(p.flower, 0.45), "#fffaf2", darken(p.flower, 0.15)];
        const r = rng(8);
        const cx = 540, cy = 1080, rx = 470, ry = 700;
        for (let i = 0; i < 160; i++) {
            const a = (i / 160) * Math.PI * 2;
            const x = cx + Math.cos(a) * rx + (r() - 0.5) * 40, y = cy + Math.sin(a) * ry + (r() - 0.5) * 40;
            leaf(ctx, x, y, 40 + r() * 40, 14 + r() * 6, a + Math.PI / 2 + (r() - 0.5) * 1.2, r() > 0.5 ? leafGreen(p) : darken(leafGreen(p), 0.2));
        }
        // flower clusters: denser at top-left and bottom-right
        for (let i = 0; i < 90; i++) {
            const a = (i / 90) * Math.PI * 2;
            const dense = Math.cos(a - Math.PI * 1.25) > 0.3 || Math.cos(a - Math.PI * 0.25) > 0.55;
            if (!dense && i % 3)
                continue;
            const x = cx + Math.cos(a) * rx + (r() - 0.5) * 50, y = cy + Math.sin(a) * ry + (r() - 0.5) * 50;
            rose(ctx, x, y, (dense ? 26 : 16) + r() * 18, cols[i % cols.length], r() * 6);
        }
        vGradient(ctx, [[0, alpha(p.deep, 0)], [1, alpha(p.deep, 0.25)]], 1600, H);
    },
    live(ctx, p, t) {
        const r = rng(6);
        for (let i = 0; i < 14; i++) {
            const a = r() * Math.PI * 2;
            sparkle(ctx, 540 + Math.cos(a) * 470, 1080 + Math.sin(a) * 700, 14, lighten(p.accent, 0.5), Math.max(0, Math.sin(t * 2 + i * 1.4)));
        }
    },
};
function heart(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.9);
    ctx.bezierCurveTo(x - s * 1.4, y, x - s * 0.7, y - s * 1.1, x, y - s * 0.35);
    ctx.bezierCurveTo(x + s * 0.7, y - s * 1.1, x + s * 1.4, y, x, y + s * 0.9);
    ctx.closePath();
}
export const engagementHearts = {
    still(ctx, p) {
        vGradient(ctx, [[0, darken(p.deep, 0.3)], [0.6, p.deep], [1, mix(p.deep, p.flower, 0.35)]]);
        glow(ctx, 540, 1000, 700, lighten(p.flower, 0.2), 0.25);
        // candles on the floor
        vGradient(ctx, [[0, alpha(darken(p.deep, 0.5), 0)], [1, darken(p.deep, 0.55)]], 1550, H);
    },
    live(ctx, p, t) {
        const strands = [[-30, 60, 1110, 60, 180], [-30, 240, 560, 200, 110], [520, 200, 1110, 250, 120]];
        strands.forEach(([x1, y1, x2, y2, sag], si) => {
            const pts = hangPoints(x1, y1, x2, y2, sag + Math.sin(t * 0.8 + si) * 5, 54);
            ctx.strokeStyle = alpha(p.accent, 0.6);
            ctx.lineWidth = 2;
            ctx.beginPath();
            pts.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)));
            ctx.stroke();
            pts.forEach((q, i) => {
                const on = 0.55 + 0.45 * Math.sin(t * 3 + i * 1.1 + si);
                lighter(ctx, () => glow(ctx, q.x, q.y + 14, 40, lighten(p.flower, 0.4), 0.3 * on));
                ctx.fillStyle = mix(p.flower, "#ffffff", 0.3 + 0.4 * on);
                heart(ctx, q.x, q.y + 14, 12);
                ctx.fill();
            });
        });
        // hanging paper hearts
        for (let i = 0; i < 8; i++) {
            const x = 90 + i * 128, len = 380 + (i % 3) * 120, sw = Math.sin(t * 1.2 + i) * 10;
            ctx.strokeStyle = alpha(p.accent, 0.5);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + sw, len);
            ctx.stroke();
            ctx.save();
            ctx.translate(x + sw, len);
            ctx.scale(Math.cos(t * 1.5 + i), 1);
            ctx.fillStyle = i % 2 ? p.flower : lighten(p.flower, 0.35);
            heart(ctx, 0, 0, 34);
            ctx.fill();
            ctx.restore();
        }
        for (let i = 0; i < 7; i++) {
            const x = 120 + i * 140, h = 60 + (i % 3) * 40, y = 1880;
            ctx.fillStyle = "#fbf1e0";
            ctx.fillRect(x - 18, y - h, 36, h);
            const f = 0.85 + 0.15 * Math.sin(t * 11 + i);
            lighter(ctx, () => glow(ctx, x, y - h - 18, 90 * f, "#ffb347", 0.4));
            ctx.fillStyle = "#ffd36b";
            ctx.beginPath();
            ctx.ellipse(x, y - h - 16, 8, 18 * f, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    },
};
// ───────────────────── RECEPTION ─────────────────────
function decoFan(ctx, p, x, y, R, flip) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, flip);
    ctx.strokeStyle = goldGradient(ctx, -R, 0, R, 0, p.accent);
    ctx.lineWidth = 3;
    for (let k = 0; k < 4; k++) {
        ctx.beginPath();
        ctx.arc(0, 0, R * (1 - k * 0.18), 0, Math.PI);
        ctx.stroke();
    }
    for (let i = 0; i <= 16; i++) {
        const a = (i / 16) * Math.PI;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * R * 0.2, Math.sin(a) * R * 0.2);
        ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R);
        ctx.stroke();
    }
    ctx.fillStyle = goldGradient(ctx, -R, 0, R, 0, p.accent);
    ctx.beginPath();
    ctx.arc(0, 0, R * 0.16, 0, Math.PI);
    ctx.fill();
    ctx.restore();
}
export const receptionDeco = {
    still(ctx, p) {
        vGradient(ctx, [[0, darken(p.deep, 0.3)], [0.5, p.deep], [1, darken(p.deep, 0.35)]]);
        ctx.strokeStyle = alpha(p.accent, 0.18);
        ctx.lineWidth = 2;
        for (let x = 60; x < W; x += 80) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
        }
        decoFan(ctx, p, 540, 0, 380, 1);
        decoFan(ctx, p, 540, H, 380, -1);
        // stepped borders
        ctx.strokeStyle = goldGradient(ctx, 0, 0, W, 0, p.accent);
        ctx.lineWidth = 3;
        for (const [inset, step] of [[40, 0], [58, 30]]) {
            ctx.beginPath();
            ctx.moveTo(inset, 420 + step);
            ctx.lineTo(inset, H - 420 - step);
            ctx.moveTo(W - inset, 420 + step);
            ctx.lineTo(W - inset, H - 420 - step);
            ctx.stroke();
        }
        for (const sy of [1, -1])
            for (const sx of [1, -1]) {
                ctx.save();
                ctx.translate(sx > 0 ? 40 : W - 40, sy > 0 ? 420 : H - 420);
                ctx.scale(sx, sy);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -40);
                ctx.lineTo(40, -40);
                ctx.lineTo(40, -80);
                ctx.lineTo(80, -80);
                ctx.stroke();
                ctx.restore();
            }
        for (const y of [470, H - 470]) {
            ctx.fillStyle = goldGradient(ctx, 0, 0, W, 0, p.accent);
            ctx.save();
            ctx.translate(540, y);
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(-14, -14, 28, 28);
            ctx.restore();
        }
    },
    live(ctx, p, t) {
        const x = ((t * 260) % (W + 800)) - 400;
        ctx.save();
        lighter(ctx, () => {
            const g = ctx.createLinearGradient(x - 160, 0, x + 160, 0);
            g.addColorStop(0, alpha(lighten(p.accent, 0.5), 0));
            g.addColorStop(0.5, alpha(lighten(p.accent, 0.5), 0.12));
            g.addColorStop(1, alpha(lighten(p.accent, 0.5), 0));
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, W, H);
        });
        ctx.restore();
        const r = rng(9);
        for (let i = 0; i < 16; i++)
            sparkle(ctx, r() * W, r() * H, 8 + r() * 10, lighten(p.accent, 0.5), Math.max(0, Math.sin(t * 1.4 + i * 1.7)) * 0.8);
    },
};
export const receptionFireworks = {
    still(ctx, p) {
        vGradient(ctx, [[0, darken(p.deep, 0.45)], [0.7, p.deep], [1, mix(p.deep, p.sky, 0.5)]]);
        const r = rng(3);
        for (let i = 0; i < 150; i++) {
            ctx.fillStyle = alpha("#ffffff", 0.2 + r() * 0.5);
            ctx.beginPath();
            ctx.arc(r() * W, r() * 1300, r() * 1.8 + 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
        // skyline
        const sky = darken(p.deep, 0.6);
        ctx.fillStyle = sky;
        let x = 0;
        while (x < W) {
            const w = 50 + r() * 90, h = 120 + r() * 260;
            ctx.fillRect(x, 1920 - 200 - h, w, h + 200);
            x += w;
        }
        ctx.fillStyle = alpha("#ffd88a", 0.6);
        for (let i = 0; i < 160; i++) {
            const wx = r() * W, wy = 1500 + r() * 380;
            ctx.fillRect(wx, wy, 6, 9);
        }
        vGradient(ctx, [[0, alpha(sky, 0)], [1, sky]], 1700, H);
    },
    live(ctx, p, t) {
        const colors = [lighten(p.accent, 0.3), lighten(p.flower, 0.3), lighten(p.sky, 0.5), "#ffffff"];
        const bursts = [[260, 360, 0, 200], [780, 300, 0.9, 240], [540, 560, 1.7, 180], [180, 760, 2.4, 150], [900, 700, 3.1, 170]];
        bursts.forEach(([bx, by, delay, R], k) => {
            const u = ((t + delay) % 3.2) / 3.2;
            if (u < 0.12) {
                const yy = 1600 - (1600 - by) * (u / 0.12);
                lighter(ctx, () => glow(ctx, bx, yy, 16, "#ffe9b0", 0.9));
                return;
            }
            const e = (u - 0.12) / 0.88;
            const rad = R * Math.sqrt(e);
            const a = 1 - e;
            lighter(ctx, () => {
                for (let i = 0; i < 28; i++) {
                    const ang = (i / 28) * Math.PI * 2;
                    const px = bx + Math.cos(ang) * rad, py = by + Math.sin(ang) * rad + e * e * 60;
                    glow(ctx, px, py, 16, colors[(i + k) % colors.length], a);
                    ctx.strokeStyle = alpha(colors[(i + k) % colors.length], a * 0.4);
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(bx + Math.cos(ang) * rad * 0.6, by + Math.sin(ang) * rad * 0.6 + e * e * 30);
                    ctx.lineTo(px, py);
                    ctx.stroke();
                }
                glow(ctx, bx, by, R * 0.8, colors[k % colors.length], 0.15 * a);
            });
        });
    },
};
export const receptionCandles = {
    still(ctx, p) {
        const g = ctx.createRadialGradient(540, 1500, 80, 540, 1100, 1300);
        g.addColorStop(0, mix(p.deep, "#ffb347", 0.25));
        g.addColorStop(0.6, p.deep);
        g.addColorStop(1, darken(p.deep, 0.5));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        // draped table
        ctx.fillStyle = mix(p.sky, "#ffffff", 0.35);
        ctx.beginPath();
        ctx.moveTo(-20, 1640);
        ctx.lineTo(W + 20, 1640);
        ctx.lineTo(W + 20, H);
        ctx.lineTo(-20, H);
        ctx.fill();
        ctx.strokeStyle = alpha(darken(p.sky, 0.25), 0.4);
        ctx.lineWidth = 2;
        for (let x = 40; x < W; x += 70) {
            ctx.beginPath();
            ctx.moveTo(x, 1650);
            ctx.quadraticCurveTo(x + 10, 1800, x - 6, H);
            ctx.stroke();
        }
        ctx.fillStyle = goldGradient(ctx, 0, 0, W, 0, p.accent);
        ctx.fillRect(0, 1636, W, 8);
        // centrepiece bouquets
        bouquet(ctx, p, 540, 1600, 260, 4, [p.flower, "#fffaf2", lighten(p.flower, 0.4)]);
        bouquet(ctx, p, 120, 1610, 160, 6, [p.flower, "#fffaf2"]);
        bouquet(ctx, p, 960, 1610, 160, 7, [p.flower, "#fffaf2"]);
        // candelabras
        for (const cx of [300, 780]) {
            ctx.fillStyle = goldGradient(ctx, cx - 80, 0, cx + 80, 0, p.accent);
            ctx.fillRect(cx - 6, 1420, 12, 220);
            ctx.beginPath();
            ctx.ellipse(cx, 1640, 50, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.lineWidth = 8;
            ctx.strokeStyle = goldGradient(ctx, cx - 80, 0, cx + 80, 0, p.accent);
            ctx.beginPath();
            ctx.moveTo(cx - 80, 1430);
            ctx.quadraticCurveTo(cx, 1520, cx + 80, 1430);
            ctx.stroke();
            for (const dx of [-80, 0, 80])
                ctx.fillRect(cx + dx - 14, 1424, 28, 10);
        }
    },
    live(ctx, p, t) {
        const strands = [[-30, 40, 1110, 300, 160], [1110, 40, -30, 300, 160], [-30, 180, 1110, 180, 220]];
        strands.forEach(([x1, y1, x2, y2, sag], si) => {
            const pts = hangPoints(x1, y1, x2, y2, sag, 40);
            ctx.strokeStyle = alpha(p.accent, 0.4);
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            pts.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)));
            ctx.stroke();
            pts.forEach((q, i) => bulb(ctx, q.x, q.y + 4, 4, "#ffdca0", 0.5 + 0.5 * Math.sin(t * 2.6 + i * 0.9 + si)));
        });
        for (const cx of [300, 780])
            for (const dx of [-80, 0, 80]) {
                const x = cx + dx, y = 1424;
                ctx.fillStyle = "#fbf1e0";
                ctx.fillRect(x - 10, y - 90, 20, 90);
                const f = 0.85 + 0.15 * Math.sin(t * 12 + x);
                lighter(ctx, () => glow(ctx, x, y - 108, 110 * f, "#ffb347", 0.35));
                ctx.fillStyle = "#ffd36b";
                ctx.beginPath();
                ctx.ellipse(x + Math.sin(t * 8 + x) * 2, y - 106, 7, 17 * f, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        for (let i = 0; i < 5; i++)
            diya(ctx, p, 170 + i * 185, 1700, 0.6, t, i);
    },
};
