export type InvitationTemplate = {
  id: string;
  name: string;
  mood: string;
  colors: { paper: string; ink: string; accent: string; line: string };
  motif: string;
  animation: "curtain" | "petals" | "moonlight" | "envelope" | "saffron";
};

// Original design systems: each palette and motion cue belongs to this project.
export const invitationTemplates: InvitationTemplate[] = [
  { id: "rajwada", name: "Rajwada Jharokha", mood: "Palace romance · vermilion & gold", colors: { paper: "#f4e5c9", ink: "#512d31", accent: "#b17a39", line: "#c59a5c" }, motif: "❧", animation: "curtain" },
  { id: "gulmohar", name: "Gulmohar Garden", mood: "Botanical · rose & leaf", colors: { paper: "#f7e9e3", ink: "#563b3b", accent: "#ad655f", line: "#d0a092" }, motif: "❋", animation: "petals" },
  { id: "noor", name: "Noor-e-Shaam", mood: "Twilight · jade & starlight", colors: { paper: "#203a34", ink: "#f5e9cc", accent: "#d6b66f", line: "#71877a" }, motif: "✦", animation: "moonlight" },
  { id: "saffron", name: "Saffron Dusk", mood: "Festive · marigold & plum", colors: { paper: "#f3dfbd", ink: "#542d37", accent: "#d47d35", line: "#cf9d5c" }, motif: "✺", animation: "saffron" },
  { id: "letter", name: "The Love Letter", mood: "Keepsake · ink & handmade paper", colors: { paper: "#f5eee2", ink: "#39443d", accent: "#9b6c58", line: "#c9b7a0" }, motif: "♡", animation: "envelope" },
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
};

export function formatInvitationDate(value: string) {
  if (!value) return "Your celebration date";
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
