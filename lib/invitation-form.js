// Form for /wedding-websites/create. Text fields are turned into the same shape as
// lib/demo-invitation.js, so the preview renders exactly like the demo.
import { demoInvitation as demo } from "./demo-invitation";

const ICONS = ["flower", "leaf", "dhol", "diya", "glass", "rings"];
const WEDDING_EVENT = /wedding|shaadi|vivah|nikah|pheras/i;

/** [key, label, type?] — type defaults to a single-line text input. */
export const FORM_GROUPS = [
  { title: "Couple", fields: [["groom", "Groom's name"], ["bride", "Bride's name"], ["message", "Banner line"], ["date", "Wedding date & time", "datetime-local"], ["place", "City / place"], ["heroImage", "Cover photo", "image"]] },
  { title: "Welcome & families", fields: [["welcome", "Welcome message", "textarea"], ["groomParents", "Groom's parents"], ["brideParents", "Bride's parents"]] },
  { title: "Celebrations", hint: "One per line: Name | Date | Time | Venue | Note", fields: [["events", "Events", "textarea"]] },
  { title: "Programme of the day", hint: "One per line: Time | Title | Detail", fields: [["program", "Timeline", "textarea"]] },
  { title: "Venue", fields: [["venueName", "Venue name"], ["venueAddress", "Address"], ["venueMap", "Map search (optional)"], ["venueImage", "Venue photo", "image"]] },
  { title: "Gallery photos", photos: true },
  { title: "Menu & dress code", fields: [["veg", "Dishes (one per line)", "textarea"], ["women", "Women's dress code"], ["men", "Men's dress code"]] },
  { title: "Guest info", fields: [["transport", "Transportation", "textarea"], ["stay", "Accommodation", "textarea"], ["gifts", "Gifts", "textarea"], ["rsvpDeadline", "RSVP deadline"]] },
  { title: "Closing", fields: [["closing", "Thank-you message", "textarea"], ["hashtag", "Hashtag"], ["groomContact", "Groom's family contact (Name | Phone)"], ["brideContact", "Bride's family contact (Name | Phone)"]] },
];

const lines = (text) => (text || "").split("\n").map((l) => l.split("|").map((p) => p.trim())).filter((r) => r.some(Boolean));
const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export const formDefaults = {
  groom: demo.groom,
  bride: demo.bride,
  message: demo.message,
  date: "2027-02-14T18:30",
  place: demo.place,
  heroImage: demo.heroImage,
  welcome: demo.welcome.message,
  groomParents: demo.welcome.families[0].parents,
  brideParents: demo.welcome.families[1].parents,
  events: demo.events.map((e) => [e.name, e.date, e.time, e.venue, e.note].join(" | ")).join("\n"),
  program: demo.program.map((p) => [p.time, p.title, p.detail].join(" | ")).join("\n"),
  venueName: demo.venue.name,
  venueAddress: demo.venue.address,
  venueMap: demo.venue.mapQuery,
  venueImage: demo.venue.image,
  gallery: demo.gallery.map((g) => ({ src: g.src, caption: g.caption })),
  veg: demo.menu.veg.join("\n"),
  women: demo.dressCode.women,
  men: demo.dressCode.men,
  transport: demo.guestInfo[0].text,
  stay: demo.guestInfo[1].text,
  gifts: demo.guestInfo[2].text,
  rsvpDeadline: demo.rsvp.deadline,
  closing: demo.closing.message,
  hashtag: demo.closing.hashtag,
  groomContact: `${demo.closing.contacts[0].name} | ${demo.closing.contacts[0].phone}`,
  brideContact: `${demo.closing.contacts[1].name} | ${demo.closing.contacts[1].phone}`,
};

/** "2027-02-14T18:30" → IST timestamps. Returns null when the date is empty or invalid. */
function parseWhen(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value || "");
  if (!m) return null;
  const [, y, mo, da, h, mi] = m;
  const iso = `${y}-${mo}-${da}T${h}:${mi}:00+05:30`;
  const start = new Date(iso).getTime();
  if (Number.isNaN(start)) return null;
  return { iso, endIso: new Date(start + 5 * 3600e3).toISOString(), label: `${da} · ${mo} · ${y}` };
}

/** Turns the form text into the invitation object used by CardInvitation. */
export function buildInvitation(f) {
  const when = parseWhen(f.date) || parseWhen(demo.date);
  const groom = f.groom.trim() || "Groom";
  const bride = f.bride.trim() || "Bride";
  const venueName = f.venueName.trim() || "Venue";
  const mapQuery = f.venueMap.trim() || `${venueName}, ${f.place}`;

  const events = lines(f.events)
    .filter(([name]) => name)
    .map(([name, date = "", time = "", venue = "", note = ""], i) => ({
      name, icon: ICONS[i % ICONS.length], date, time, note,
      venue: venue || venueName,
      mapUrl: mapsUrl(venue || mapQuery),
      highlight: WEDDING_EVENT.test(name),
    }));

  const program = lines(f.program)
    .filter(([title]) => title)
    .map(([time = "", title, detail = ""], i) => ({ time, title, detail, icon: ICONS[(i + 2) % ICONS.length] }));

  const gallery = f.gallery
    .filter((p) => p.src)
    .map((p) => ({ src: p.src, alt: p.caption || "Photo", caption: p.caption }));

  const veg = lines(f.veg).map((r) => r[0]).filter(Boolean);

  const guestInfo = [
    { icon: "car", title: "Transportation", text: f.transport },
    { icon: "bed", title: "Accommodation", text: f.stay },
    { icon: "gift", title: "Gifts", text: f.gifts },
  ].filter((item) => item.text.trim());

  const contacts = [["Groom's family", f.groomContact], ["Bride's family", f.brideContact]]
    .map(([label, text]) => { const [name = "", phone = ""] = lines(text)[0] || []; return { label, name, phone }; })
    .filter((c) => c.name && c.phone);

  return {
    groom, bride,
    monogram: `${groom[0]} & ${bride[0]}`.toUpperCase(),
    blessing: demo.blessing,
    message: f.message.trim() || demo.message,
    date: when.iso,
    endDate: when.endIso,
    dateLabel: when.label,
    place: f.place.trim(),
    heroImage: f.heroImage.trim() || demo.heroImage,
    welcome: {
      message: f.welcome,
      families: [
        { role: "The Groom", name: groom, parents: f.groomParents },
        { role: "The Bride", name: bride, parents: f.brideParents },
      ],
    },
    events,
    program,
    venue: { name: venueName, address: f.venueAddress.trim(), mapQuery, image: f.venueImage || undefined },
    gallery,
    menu: { veg },
    dressCode: { women: f.women, men: f.men, palette: demo.dressCode.palette },
    guestInfo,
    rsvp: { deadline: f.rsvpDeadline, events: events.map((e) => e.name) },
    closing: { message: f.closing, hashtag: f.hashtag, contacts },
  };
}
