// Event presets, palettes and the shape of an invitation design.
// Everything the renderer needs is plain JSON so it can travel in a share link.
export const EVENT_PRESETS = {
    engagement: {
        kind: "engagement",
        label: "Engagement",
        title: "Engagement",
        hostLine: "With joy in our hearts, we invite you to the",
        message: "Join us as we exchange rings and begin our forever.",
        palettes: [
            { name: "Midnight", palette: { deep: "#0b1532", sky: "#2f4f93", accent: "#e9c46d", flower: "#f4d5e3", text: "#fff6e4" } },
            { name: "Plum", palette: { deep: "#25102b", sky: "#6d3a78", accent: "#f0c674", flower: "#f6b8c9", text: "#fff3ea" } },
            { name: "Emerald", palette: { deep: "#08261f", sky: "#246b55", accent: "#e8c779", flower: "#fbe3d4", text: "#fff8e8" } },
        ],
        frame: "floral-corners",
        particles: "bokeh",
        intro: "bloom",
        fonts: "romantic",
        layout: "center",
        backdrop: "glow",
    },
    haldi: {
        kind: "haldi",
        label: "Haldi",
        title: "Haldi",
        hostLine: "Come drenched in sunshine for the",
        message: "A splash of turmeric, laughter and marigolds — wear yellow!",
        palettes: [
            { name: "Sunshine", palette: { deep: "#f2a516", sky: "#fff4cc", accent: "#a5531a", flower: "#ff8a1c", text: "#5a2a0a" } },
            { name: "Marigold", palette: { deep: "#e8731a", sky: "#ffe2b0", accent: "#8a2f12", flower: "#ffc21a", text: "#4d1d08" } },
            { name: "Leaf & gold", palette: { deep: "#d99a1e", sky: "#fdf6d8", accent: "#2f6b2a", flower: "#f2b705", text: "#3c3a12" } },
        ],
        frame: "double-border",
        particles: "marigold",
        intro: "petal-burst",
        fonts: "modern",
        layout: "center",
        backdrop: "glow",
    },
    mehndi: {
        kind: "mehndi",
        label: "Mehndi",
        title: "Mehndi",
        hostLine: "Let the colours of henna bloom at our",
        message: "An evening of henna, music and colourful celebrations.",
        palettes: [
            { name: "Emerald", palette: { deep: "#0d4434", sky: "#4f9a62", accent: "#f2bb4d", flower: "#e8578a", text: "#fff5dc" } },
            { name: "Peacock", palette: { deep: "#0b3646", sky: "#1f8a8a", accent: "#f0c25c", flower: "#f27a3a", text: "#fff6e2" } },
            { name: "Henna", palette: { deep: "#4a2412", sky: "#a8643a", accent: "#f3cf7a", flower: "#7fb24a", text: "#fff3df" } },
        ],
        frame: "jharokha",
        particles: "petals",
        intro: "bloom",
        fonts: "royal",
        layout: "center",
        backdrop: "glow",
    },
    sangeet: {
        kind: "sangeet",
        label: "Sangeet",
        title: "Sangeet",
        hostLine: "Put on your dancing shoes for our",
        message: "A night of music, dance and lights. Come ready to dance!",
        palettes: [
            { name: "Ruby stage", palette: { deep: "#22040a", sky: "#8f1526", accent: "#f5c451", flower: "#ffb24a", text: "#fff3dc" } },
            { name: "Noir gold", palette: { deep: "#0d0d10", sky: "#3a3340", accent: "#e9bd56", flower: "#f2d27a", text: "#fff7e6" } },
            { name: "Violet", palette: { deep: "#14082a", sky: "#5a2a8f", accent: "#f6c95e", flower: "#ff7ac0", text: "#fff2fb" } },
        ],
        frame: "double-border",
        particles: "confetti",
        intro: "curtain",
        fonts: "royal",
        layout: "center",
        backdrop: "glow",
    },
    wedding: {
        kind: "wedding",
        label: "Wedding",
        title: "Wedding Ceremony",
        hostLine: "Together with their families",
        message: "Request the honour of your presence as we take our pheras.",
        palettes: [
            { name: "Rose", palette: { deep: "#e59aa6", sky: "#fff0ec", accent: "#a8742a", flower: "#d23a64", text: "#7a1530" } },
            { name: "Royal red", palette: { deep: "#5c0a18", sky: "#b02a3a", accent: "#f0c35e", flower: "#ff9a3c", text: "#fff3dd" } },
            { name: "Ivory", palette: { deep: "#d9c3a0", sky: "#fffaf0", accent: "#9b6b23", flower: "#c9567a", text: "#4a2c16" } },
        ],
        frame: "arch",
        particles: "petals",
        intro: "bloom",
        fonts: "romantic",
        layout: "center",
        backdrop: "glow",
    },
    reception: {
        kind: "reception",
        label: "Reception",
        title: "Reception",
        hostLine: "Please join us for an evening of celebration",
        message: "Dinner, dancing and a toast to the newlyweds.",
        palettes: [
            { name: "Champagne", palette: { deep: "#14111c", sky: "#43354f", accent: "#e8c47c", flower: "#f6e7cf", text: "#fff8ea" } },
            { name: "Navy", palette: { deep: "#08142a", sky: "#22406e", accent: "#e2c07a", flower: "#dfe8f6", text: "#f9f6ee" } },
            { name: "Wine", palette: { deep: "#2a0712", sky: "#6e1d33", accent: "#efc77c", flower: "#f5c7d2", text: "#fff2ea" } },
        ],
        frame: "arch",
        particles: "sparkles",
        intro: "curtain",
        fonts: "royal",
        layout: "center",
        backdrop: "glow",
    },
};
export const EVENT_ORDER = ["engagement", "haldi", "mehndi", "sangeet", "wedding", "reception"];
export function designForEvent(kind, paletteIndex = 0) {
    const p = EVENT_PRESETS[kind];
    return {
        event: kind,
        palette: { ...p.palettes[paletteIndex].palette },
        frame: p.frame,
        backdrop: p.backdrop,
        layout: p.layout,
        particles: p.particles,
        intro: p.intro,
        fonts: p.fonts,
        background: { kind: "scene" },
        tint: 0.25,
        brightness: 1,
        showPhoto: true,
    };
}
export const FONT_PAIRS = {
    royal: { label: "Royal", script: "'Great Vibes'", caps: "'Cinzel'", serif: "'Cormorant Garamond'", capsW: 500, serifW: 600, italic: true },
    romantic: { label: "Romantic", script: "'Pinyon Script'", caps: "'Cinzel'", serif: "'Cormorant Garamond'", capsW: 500, serifW: 600, italic: true },
    modern: { label: "Modern", script: "'Parisienne'", caps: "'Marcellus'", serif: "'Cormorant Garamond'", capsW: 400, serifW: 600, italic: true },
    classic: { label: "Classic", script: "'Alex Brush'", caps: "'Playfair Display'", serif: "'Playfair Display'", capsW: 600, serifW: 500, italic: true },
    luxe: { label: "Luxe", script: "'Allura'", caps: "'Cinzel Decorative'", serif: "'Cormorant Garamond'", capsW: 700, serifW: 600, italic: true },
    heritage: { label: "Heritage", script: "'Yatra One'", caps: "'Rozha One'", serif: "'Rozha One'", capsW: 400, serifW: 400, italic: false },
    editorial: { label: "Editorial", script: "'Great Vibes'", caps: "'Italiana'", serif: "'Italiana'", capsW: 400, serifW: 400, italic: false },
};
export const VIDEO_SECONDS = 16;
export function formatInviteDate(value) {
    if (!value)
        return "Date to be announced";
    const d = new Date(value + "T12:00:00");
    if (Number.isNaN(d.getTime()))
        return value;
    const weekday = d.toLocaleDateString("en-IN", { weekday: "long" });
    const rest = d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    return `${weekday} · ${rest}`;
}
export function formatInviteTime(value) {
    if (!value)
        return "";
    const [h, m] = value.split(":").map(Number);
    if (Number.isNaN(h))
        return value;
    const suffix = h >= 12 ? "PM" : "AM";
    const hour = ((h + 11) % 12) + 1;
    return `${hour}:${String(m || 0).padStart(2, "0")} ${suffix} onwards`;
}
export const DEMO_DETAILS = {
    title: EVENT_PRESETS.wedding.title,
    hostLine: EVENT_PRESETS.wedding.hostLine,
    blessing: "॥ श्री गणेशाय नमः ॥",
    brideName: "Aarohi",
    groomName: "Reyansh",
    date: "2026-12-20",
    time: "16:30",
    venue: "The Gulmohar Palace",
    city: "Jaipur, Rajasthan",
    message: EVENT_PRESETS.wedding.message,
};
