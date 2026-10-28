export const PLANS = [
    { id: "basic", name: "Basic", tagline: "Simple, beautiful invitations", description: "Floral cards, ivory botanicals and classic black-and-gold or ruby invitations.", features: ["Simple and floral card templates", "Black & gold, ruby and ivory styles", "Add your own artwork", "Personalise names, date and venue"], cta: "Explore Basic" },
    { id: "premium", name: "Premium", tagline: "Invitations that come alive", description: "Regional and decorative designs, animated invitations and single-ceremony reels.", features: ["Regional and cultural card designs", "Animated invitation templates", "Cinematic reveals and video reels", "Custom colours, music and event details"], cta: "Explore Premium" },
    { id: "pro", name: "Pro", tagline: "Your whole wedding story", description: "Bride-and-groom illustrations and wedding journeys that bring every celebration together.", features: ["Bride & groom illustration templates", "Wedding and pre-wedding journeys", "Haldi, Mehndi, Sangeet, Wedding & Reception", "Personalise each function’s date and venue"], cta: "Explore Pro" },
];
export const PLAN_PRICES = {
    basic: [{ label: "Static digital invitation", price: "₹199", scope: "One simple or floral invitation, personalised with your event details." }],
    premium: [
        { label: "Premium static invitation", price: "₹399", scope: "One regional or decorative invitation with personalised wording and colours." },
        { label: "Animated invitation", price: "₹699", scope: "One personalised animated card with an opening effect and music." },
        { label: "Premium wedding reel", price: "₹999", scope: "One single-ceremony reel with your names, event details, animation and music." },
    ],
    pro: [{ label: "Wedding Journey reel", price: "₹1,499", scope: "One multi-function reel covering Haldi, Mehndi, Sangeet, Wedding and Reception, with each function’s details." }],
};
const SIMPLE = new Set(["wedding-bouquet", "noir-foil", "ruby-engraving", "ivory-botanical", "engagement-wreath", "engagement-rings", "engagement-hearts", "reception-candles", "pastel-garden"]);
export const validPlan = (id) => PLANS.some((p) => p.id === id);
export function cardPlan(template) {
    if (template.style === "Couple" || template.coupleArt) return "pro";
    if (template.userSaved || SIMPLE.has(template.id)) return "basic";
    return "premium";
}
export const reelPlan = (reel) => reel.kind === "journey" || reel.design.startsWith("couple-") ? "pro" : "premium";
export const STARTING_PRICES = { basic: 199, premium: 399, pro: 1499 };
export function templatePrice(template, reel = false) {
    const tier = reel ? reelPlan(template) : cardPlan(template);
    return { tier, amount: reel && tier === "premium" ? 999 : STARTING_PRICES[tier] };
}
