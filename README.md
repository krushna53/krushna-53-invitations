# Krushna 53 — invitation studio

Design invitations for every ceremony — **Engagement, Haldi, Mehndi, Sangeet, Wedding and Reception** — as a printable card or a cinematic 9:16 video invite.

## Pages

- `/` — home: choose **Create my own**, **Pick a card template**, or **Make a video reel**.
- `/create` — card studio: (1) design & colours, (2) Animated or Simple card, (3) tell your story. Opens pre-filled with `?template=<id>`.
- `/templates` — 55 designs, including a ✦ Painted collection (10 hand-painted style scenes in `public/art`: Banaras ghats, Udaipur lake palace, jasmine mandap, elephant baraat, haldi haveli, mango grove, parasol garden, lantern courtyard, moonlit rooftop, garba night). Plus 45 illustrated designs: 4 per ceremony, 8 premium artwork designs (Royal Baraat, Pichwai Lotus, Royal Mandala, Gulabi Bagh, Pastel Peony, Celestial Night, Jharokha Bloom, Tropical Haldi) plus 13 regional & cultural designs (South Indian, Kerala, Bengali, Marathi, Gujarati, Rajasthani, Punjabi & Sikh, Nikah, Walima, Christian, Madhubani, Banaras, Goan), each in 4 colour options, with ceremony / tradition / style filters.
- `/reels` — 65 reel templates: 7 per ceremony (Classic reveal, Envelope opening, Palace doors, Save the date, Royal scroll, Cinematic trailer, Photo story — each on a different design), one for every regional and premium design, plus 2 multi-function Wedding journey reels.
- `/reels/create` — reel maker (opens pre-filled with `?reel=<id>`), MP4 download and guest link.
- `/preview` — the guest page for cards, video invites and reels.

## What's inside

- **Six illustrated event scenes** drawn in code (mandap with toran and diyas, moonlit garden arch, marigold haldi, mehndi parasols, sangeet stage with marquee lights, reception chandelier). Every colour is editable, and the scenes move in the video: swaying garlands, twinkling lights, sweeping spotlights.
- **Upload your own artwork** (for example, made in Canva or a free AI image tool). Your text, frame and animation go on top.
- **Design controls:** 3 palettes per event plus 5 colour pickers, recolour strength for uploaded artwork, brightness, 5 frames (Mughal arch, jharokha, floral corners, royal border, none), text backing (glow, glass, paper scroll), text position, 3 lettering pairs, particles, and intro (light bloom, curtain opening, petal burst).
- **Video invite:** a 16-second timeline (intro → frame draws in → title writes on with a gold shimmer → names → date → venue), with built-in music generated in the browser (soft santoor/tanpura or festive dhol) or your own song.
- **Download MP4** (1080×1920, H.264 + AAC in Chrome/Edge/Safari), **PNG**, or **Print / PDF**.
- **Guest link** that plays the invite with a "tap to open" screen, sound, and a Directions button.

## Painted artwork

The painted designs read their pictures from `public/art/*.jpg`. To download the full-quality versions, run once from the project folder:

```
powershell -ExecutionPolicy Bypass -File scripts\get-art.ps1
```

Cards can also show the couple's names in their own script (e.g. आरोही संग रेयांश) via the "Names in your language" field.

## Run locally

```bash
npm install
npm run dev
# optional: `npx netlify dev` also runs the image-storage function that keeps guest links short
```

## Deploy (Netlify)

1. Push to the connected repo. The static site builds to `out/`, and the function in `netlify/functions` deploys automatically. No API keys are needed.

Uploaded artwork and couple photos are stored in Netlify Blobs and served from `/api/scene/<id>`, which keeps guest links short.

## Where to customise

- `lib/invite-design.ts` — events, palettes, defaults.
- `lib/designs.ts` — the design library: 4 illustrated designs per ceremony with 4 colourways each. Add a design here and it appears in templates, the card studio and the reel maker.
- `lib/scenes.ts`, `lib/scenes-festive.ts`, `lib/scenes-grand.ts`, `lib/scenes-regional.ts`, `lib/scenes-premium.ts` — the illustrated artwork for every design. Regional designs also carry traditional wording (e.g. Muhurtham, Shubho Bibaho, Anand Karaj, Nikah, Holy Matrimony).
- Card text styles: 5 layouts (Classic, Monogram crest, Big names, Date block, Grand), 7 lettering pairs, gold-foil titles, a blessing line in Devanagari / Bengali / Gurmukhi / Arabic, and a Printed card backing — all switchable in the editors.
- `lib/templates.ts` — card templates (built from the design library).
- `lib/reels.ts` — reel templates and the reel engine (each reel style is one method).
- `lib/renderer.ts` — frames, text layout, particles, intros, video timeline.
- `lib/music.ts` — built-in music.
- `lib/export-video.ts` — MP4 export (Mediabunny / WebCodecs).
- `app/page.tsx` — the studio UI. `app/preview/page.tsx` — the guest page.
