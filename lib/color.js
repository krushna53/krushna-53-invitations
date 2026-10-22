// Tiny colour helpers shared by the canvas renderer and the builder UI.
export function hexToRgb(hex) {
    let h = hex.replace("#", "").trim();
    if (h.length === 3)
        h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h.slice(0, 6), 16);
    if (Number.isNaN(n))
        return { r: 0, g: 0, b: 0 };
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
export function rgbToHex({ r, g, b }) {
    const c = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
    return `#${c(r)}${c(g)}${c(b)}`;
}
/** Mix a towards b by k (0 = a, 1 = b). */
export function mix(a, b, k) {
    const x = hexToRgb(a);
    const y = hexToRgb(b);
    return rgbToHex({ r: x.r + (y.r - x.r) * k, g: x.g + (y.g - x.g) * k, b: x.b + (y.b - x.b) * k });
}
export const lighten = (c, k) => mix(c, "#ffffff", k);
export const darken = (c, k) => mix(c, "#000000", k);
export function alpha(c, a) {
    const { r, g, b } = hexToRgb(c);
    return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
}
/** Relative luminance 0..1 */
export function luminance(c) {
    const { r, g, b } = hexToRgb(c);
    const f = (v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
export const isLight = (c) => luminance(c) > 0.42;
/** Rotate hue of a hex colour by deg degrees. */
export function hueShift(c, deg) {
    const { r, g, b } = hexToRgb(c);
    const R = r / 255, G = g / 255, B = b / 255;
    const max = Math.max(R, G, B), min = Math.min(R, G, B);
    let h = 0;
    const l = (max + min) / 2;
    const d = max - min;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    if (d !== 0) {
        if (max === R)
            h = ((G - B) / d) % 6;
        else if (max === G)
            h = (B - R) / d + 2;
        else
            h = (R - G) / d + 4;
        h *= 60;
    }
    h = (h + deg + 360) % 360;
    const C = (1 - Math.abs(2 * l - 1)) * s;
    const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - C / 2;
    const [r1, g1, b1] = h < 60 ? [C, X, 0] : h < 120 ? [X, C, 0] : h < 180 ? [0, C, X] : h < 240 ? [0, X, C] : h < 300 ? [X, 0, C] : [C, 0, X];
    return rgbToHex({ r: (r1 + m) * 255, g: (g1 + m) * 255, b: (b1 + m) * 255 });
}
