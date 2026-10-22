// Formal, card-first invitation artwork with restrained ornament and deep paper tones.
import { alpha, darken, lighten, mix } from "./color";
import { H, W, glow, leaf, rose } from "./draw-kit";
function border(ctx, p, inset, width, opacity = 0.8) {
    ctx.strokeStyle = alpha(p.accent, opacity);
    ctx.lineWidth = width;
    ctx.strokeRect(inset, inset, W - inset * 2, H - inset * 2);
}
function goldCorner(ctx, p, x, y, sx, sy) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(sx, sy);
    ctx.strokeStyle = alpha(p.accent, 0.84);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 150 + i * 23);
        ctx.bezierCurveTo(20, 32 + i * 20, 110 + i * 14, 24, 185 + i * 20, 0);
        ctx.bezierCurveTo(128 + i * 12, 78, 80, 120 + i * 18, 0, 150 + i * 23);
        ctx.stroke();
    }
    for (const [cx, cy] of [[18, 160], [78, 84], [158, 28], [37, 204], [205, 9]]) {
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fillStyle = p.accent;
        ctx.fill();
    }
    ctx.restore();
}
export const invitationNoir = {
    still(ctx, p) {
        const g = ctx.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, darken(p.deep, 0.28));
        g.addColorStop(0.5, p.deep);
        g.addColorStop(1, mix(p.deep, "#08090d", 0.38));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        glow(ctx, 540, 770, 720, p.accent, 0.1);
        border(ctx, p, 50, 2);
        border(ctx, p, 70, 1, 0.48);
        goldCorner(ctx, p, 74, 82, 1, 1);
        goldCorner(ctx, p, W - 74, 82, -1, 1);
        goldCorner(ctx, p, 74, H - 82, 1, -1);
        goldCorner(ctx, p, W - 74, H - 82, -1, -1);
    },
    live(ctx, p, t) { glow(ctx, 540 + Math.sin(t * 0.35) * 20, 760, 500, p.accent, 0.035 + Math.max(0, Math.sin(t * 1.3)) * 0.025); },
};
export const invitationRuby = {
    still(ctx, p) {
        const g = ctx.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, lighten(p.deep, 0.1));
        g.addColorStop(0.48, p.deep);
        g.addColorStop(1, darken(p.deep, 0.28));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        border(ctx, p, 34, 5);
        border(ctx, p, 54, 1.5, 0.8);
        border(ctx, p, 79, 1, 0.5);
        goldCorner(ctx, p, 82, 84, 1, 1);
        goldCorner(ctx, p, W - 82, 84, -1, 1);
        goldCorner(ctx, p, 82, H - 84, 1, -1);
        goldCorner(ctx, p, W - 82, H - 84, -1, -1);
        for (let i = 0; i < 13; i++) {
            ctx.fillStyle = alpha(p.accent, i % 3 === 0 ? 0.62 : 0.28);
            for (const x of [104, W - 104]) {
                ctx.beginPath();
                ctx.arc(x, 390 + i * 94, i % 3 === 0 ? 4 : 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    },
    live(ctx, p, t) { glow(ctx, 540, 320 + ((t * 26) % 1350), 180, p.accent, 0.04); },
};
export const invitationIvory = {
    still(ctx, p) {
        const g = ctx.createLinearGradient(0, 0, W, H);
        g.addColorStop(0, lighten(p.sky, 0.24));
        g.addColorStop(0.52, p.sky);
        g.addColorStop(1, mix(p.sky, p.flower, 0.13));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        // Fine paper grain gives the light card a printed, stationery feel.
        for (let i = 0; i < 90; i++) {
            const x = (i * 173) % W, y = (i * 317) % H;
            ctx.fillStyle = alpha(mix(p.accent, "#ffffff", 0.5), 0.12);
            ctx.fillRect(x, y, 2 + (i % 3), 2 + (i % 2));
        }
        border(ctx, p, 42, 2.5);
        border(ctx, p, 61, 1, 0.52);
        for (const [x, y, direction] of [[120, 150, 1], [W - 120, H - 150, -1]]) {
            for (let i = 0; i < 8; i++) {
                const a = i * 0.78;
                leaf(ctx, x + Math.cos(a) * 86, y + Math.sin(a) * 70, 62, 20, a + direction * 0.6, mix(p.deep, "#55715a", 0.45));
            }
            for (let i = 0; i < 5; i++)
                rose(ctx, x + Math.cos(i * 1.25) * 43, y + Math.sin(i * 1.25) * 38, 21 + i % 3 * 4, i % 2 ? p.flower : lighten(p.flower, 0.24), i * 1.3);
        }
    },
    live(ctx, p, t) { glow(ctx, 540, 520, 650, p.accent, 0.025 + Math.max(0, Math.sin(t * 1.1)) * 0.02); },
};
