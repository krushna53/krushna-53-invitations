// Form for /wedding-websites/create. The fields match the Sacred Garden design, and
// buildInvitation() turns them into the garden's content (lib/sacred-garden.js).
import { demoInvitation as demo } from "./demo-invitation";
import { sacredGardenFrom, DEFAULT_WELCOME_TITLE, DEFAULT_MUSIC, DEFAULT_FONTS, FONT_CHOICES, COLOR_PRESETS, DEFAULT_COLORS } from "./sacred-garden";

/**
 * [key, label, type?, choices?] — type defaults to a single-line text input.
 * Other types: "textarea", "datetime-local", "image" (upload or link), "audio" (upload, link, design track or none),
 * "select" (choices: [[value, label], …]), "color", "envelope-ai" (our envelope film with the seal letters changed by Grok).
 * A group with `presets` also shows one-click themes that fill its colour fields.
 */
export const FORM_GROUPS = [
  { title: "Couple", fields: [["blessing", "God's name / blessing line (e.g. ॥ श्री गणेशाय नमः ॥)"], ["groom", "Groom's name"], ["bride", "Bride's name"], ["initials", "Letters on the wax seal (empty = first letters of the names)"], ["date", "Wedding date & time", "datetime-local"]] },
  { title: "Envelope video", hint: "The letters above are painted on the seal automatically. Or keep our film and let Grok change only the seal's letters (paid; you confirm the cost first).", fields: [["envelopeVideo", "Envelope film", "envelope-ai"]] },
  { title: "Welcome", fields: [["welcomeTitle", "Welcome heading (one line each)", "textarea"], ["welcome", "Welcome message", "textarea"]] },
  { title: "Schedule of events", hint: "One per line: Time | Event", fields: [["program", "Schedule", "textarea"]] },
  { title: "Location", fields: [["venueName", "Venue name"], ["venueAddress", "Address"], ["venueMap", "Map search (optional)"], ["venueImage", "Location picture (upload to replace the drawing)", "image"]] },
  { title: "Dress code & gifts", fields: [["dress", "Dress code", "textarea"], ["gifts", "Gift note", "textarea"]] },
  { title: "RSVP", fields: [["rsvpDeadline", "Reply-by note (e.g. Kindly reply by 20 January 2027)"]] },
  { title: "Closing", fields: [["couplePhoto", "Photo at the bottom of the page (upload to replace the sample)", "image"]] },
  { title: "Fonts", fields: [
    ["fontScript", "Headings font", "select", FONT_CHOICES.script],
    ["fontNames", "Names font", "select", FONT_CHOICES.names],
    ["fontBody", "Text font", "select", FONT_CHOICES.body],
    ["fontBodyStyle", "Text style", "select", FONT_CHOICES.bodyStyle],
  ] },
  { title: "Colours", hint: "Pick a theme, then fine-tune any colour.", presets: COLOR_PRESETS, fields: [
    ["colorAccent", "Headings, names & countdown", "color"],
    ["colorText", "Text", "color"],
    ["colorBackground", "Background", "color"],
    ["colorDetail", "Schedule line & markers", "color"],
    ["colorTime", "Schedule times", "color"],
    ["colorButton", "Buttons (RSVP & music)", "color"],
  ] },
  { title: "Music", hint: "Plays when the guest opens the envelope.", fields: [["music", "Background music", "audio"]] },
];

/** a colour theme ({ accent, text, … }) as form fields ({ colorAccent, colorText, … }) */
export const colorFields = (k) => ({ colorAccent: k.accent, colorText: k.text, colorBackground: k.background, colorDetail: k.detail, colorTime: k.time, colorButton: k.button });

const lines = (text) => (text || "").split("\n").map((l) => l.split("|").map((p) => p.trim())).filter((r) => r.some(Boolean));

export const formDefaults = {
  blessing: demo.blessing,
  groom: demo.groom,
  bride: demo.bride,
  initials: "",
  date: "2027-02-14T18:30",
  welcomeTitle: DEFAULT_WELCOME_TITLE,
  welcome: demo.welcome.message,
  program: demo.program.map((p) => [p.time, p.title].join(" | ")).join("\n"),
  venueName: demo.venue.name,
  venueAddress: demo.venue.address,
  venueMap: demo.venue.mapQuery,
  venueImage: "",
  dress: [demo.dressCode.women, demo.dressCode.men].join(" "),
  gifts: demo.guestInfo.find((item) => item.icon === "gift").text,
  rsvpDeadline: demo.rsvp.deadline,
  couplePhoto: "",
  envelopeVideo: "",
  fontScript: DEFAULT_FONTS.script,
  fontNames: DEFAULT_FONTS.names,
  fontBody: DEFAULT_FONTS.body,
  fontBodyStyle: DEFAULT_FONTS.bodyStyle,
  music: DEFAULT_MUSIC,
  ...colorFields(DEFAULT_COLORS),
};

/** The design's own track, for the music field's "Use the design's music" button. */
export const DESIGN_MUSIC = DEFAULT_MUSIC;

/** "2027-02-14T18:30" → ISO time in IST, or null when empty / invalid. */
function parseWhen(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value || "");
  if (!m) return null;
  const iso = `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:00+05:30`;
  return Number.isNaN(new Date(iso).getTime()) ? null : iso;
}

/** Turns the form into the Sacred Garden content used by <SacredGardenInvitation>. */
export function buildInvitation(f) {
  const groom = f.groom.trim() || "Groom";
  const bride = f.bride.trim() || "Bride";
  const venueName = f.venueName.trim() || "Venue";
  return sacredGardenFrom({
    groom, bride,
    monogram: f.initials.trim() || `${groom[0]} & ${bride[0]}`.toUpperCase(),
    blessing: f.blessing.trim(),
    date: parseWhen(f.date) || demo.date,
    welcome: { title: f.welcomeTitle.trim(), message: f.welcome },
    program: lines(f.program).filter((r) => r[1] || r[0]).map(([time = "", title = ""]) => ({ time, title })),
    venue: { name: venueName, address: f.venueAddress.trim(), mapQuery: f.venueMap.trim() },
    dressCode: { women: f.dress.trim() },
    guestInfo: f.gifts.trim() ? [{ icon: "gift", text: f.gifts.trim() }] : [],
    rsvp: { deadline: f.rsvpDeadline.trim() },
    envelopeVideo: f.envelopeVideo || undefined,
    music: f.music.trim(),
    fonts: { script: f.fontScript, names: f.fontNames, body: f.fontBody, bodyStyle: f.fontBodyStyle },
    colors: { accent: f.colorAccent, text: f.colorText, background: f.colorBackground, detail: f.colorDetail, time: f.colorTime, button: f.colorButton },
  }, { venue: f.venueImage || undefined, couple: f.couplePhoto || undefined });
}
