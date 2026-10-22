export type InvitationVisual =
  | "midnight-floral"
  | "burgundy-filigree"
  | "watercolor-photo"
  | "ivory-portrait"
  | "night-garden"
  | "rose-arch"
  | "moonlit-dulhan"
  | "mehendi-mandap"
  | "pink-baraat"
  | "sangeet-noir"
  | "haldi-sunshine"
  | "wedding-bundle";

export type InvitationTemplate = {
  id: string;
  name: string;
  mood: string;
  colors: { paper: string; ink: string; accent: string; line: string };
  motif: string;
  animation: "curtain" | "petals" | "moonlight" | "envelope" | "saffron";
  visual?: InvitationVisual;
};

export const invitationTemplates: InvitationTemplate[] = [
  { id: "midnight-floral", name: "Midnight Florals", mood: "Ink black · hand-drawn gold blooms", colors: { paper: "#171923", ink: "#fff9ec", accent: "#d3b46f", line: "#9d8452" }, motif: "✿", animation: "moonlight", visual: "midnight-floral" },
  { id: "burgundy-filigree", name: "Burgundy Heirloom", mood: "Deep wine · ornate gold frame", colors: { paper: "#481b20", ink: "#f7edda", accent: "#d9bd82", line: "#b59255" }, motif: "❧", animation: "saffron", visual: "burgundy-filigree" },
  { id: "watercolor-photo", name: "Blue Watercolor", mood: "Soft blue · floral arch", colors: { paper: "#f6f8f4", ink: "#24394a", accent: "#678baa", line: "#d5bd78" }, motif: "❀", animation: "petals", visual: "watercolor-photo" },
  { id: "ivory-portrait", name: "The Portrait Edit", mood: "Warm ivory · modern portrait layout", colors: { paper: "#faf6ef", ink: "#282b2b", accent: "#a47b42", line: "#d8c8a9" }, motif: "✧", animation: "envelope", visual: "ivory-portrait" },
  { id: "night-garden", name: "Garden After Dark", mood: "Forest ink · botanical gold", colors: { paper: "#151e1c", ink: "#f8f2e5", accent: "#d2bd79", line: "#778c72" }, motif: "❋", animation: "curtain", visual: "night-garden" },
  { id: "rose-arch", name: "Rosewater Arch", mood: "Blush paper · soft romantic frame", colors: { paper: "#fbf1ed", ink: "#513c40", accent: "#b87979", line: "#d9b5aa" }, motif: "♡", animation: "petals", visual: "rose-arch" },
  { id: "moonlit-dulhan", name: "Moonlit Dulhan", mood: "Midnight blue · jeweled bridal portrait", colors: { paper: "#101d38", ink: "#fff3d8", accent: "#e9bd53", line: "#a5c5d7" }, motif: "✦", animation: "moonlight", visual: "moonlit-dulhan" },
  { id: "mehendi-mandap", name: "Mehendi Mandap", mood: "Emerald garden · marigold details", colors: { paper: "#174a3b", ink: "#fff2db", accent: "#e5ad4c", line: "#a2c28c" }, motif: "❋", animation: "curtain", visual: "mehendi-mandap" },
  { id: "pink-baraat", name: "Pink Baraat", mood: "Rose ceremony · lush floral frame", colors: { paper: "#f8e6e8", ink: "#552638", accent: "#c44769", line: "#dca8ae" }, motif: "✿", animation: "petals", visual: "pink-baraat" },
  { id: "sangeet-noir", name: "Sangeet Noir", mood: "Black tie · amber stage lights", colors: { paper: "#171717", ink: "#fff7e7", accent: "#e8b843", line: "#a87935" }, motif: "✧", animation: "saffron", visual: "sangeet-noir" },
  { id: "haldi-sunshine", name: "Haldi Sunshine", mood: "Saffron glow · ivory botanical border", colors: { paper: "#fff2d4", ink: "#533b24", accent: "#d18a19", line: "#e7bd60" }, motif: "❀", animation: "envelope", visual: "haldi-sunshine" },
  { id: "wedding-bundle", name: "The Wedding Edit", mood: "Jewel-tone portrait · floral gold frame", colors: { paper: "#102b35", ink: "#fff6dc", accent: "#e3b64d", line: "#db8f9a" }, motif: "❀", animation: "curtain", visual: "wedding-bundle" },
];

export type InvitationData = {
  brideName: string;
  groomName: string;
  eventType: "Wedding" | "Reception" | "Wedding & Reception";
  date: string;
  time: string;
  venue: string;
  city: string;
  message: string;
  couplePhoto?: string;
};

export function formatInvitationDate(value: string) {
  if (!value) return "Your celebration date";
  return new Date(value + "T12:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
