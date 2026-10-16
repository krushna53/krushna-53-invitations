# Krushna 53 — wedding invitation studio

A small Next.js app for creating original wedding and reception invitations as print-friendly cards or template-led animated guest pages.

## Run locally

```bash
npm install
npm run dev
```

Open the local address printed by Next.js. If port 3000 is busy, Next.js may choose another port, such as 3001 or 3002.

## Included now

- Five original visual directions: Rajwada Jharokha, Gulmohar Garden, Noor-e-Shaam, Saffron Dusk, and The Love Letter.
- A details form for names, event, date and time, venue, city, and a guest note.
- A custom-template maker for naming a design, choosing its ornament, palette, and motion style. Saved custom designs live in that browser's local storage.
- Invitation card preview with browser print / Save as PDF.
- Animated story preview with different scene palettes, curtains, particles, envelope reveal, and timed name/date/venue captions.
- A generated `/preview` guest link that opens the selected invitation design and can be replayed. The invitation data and template are encoded in the link, so there is no database in this prototype.
- The old `/demo` page has been removed.

## Important sharing and video details

The guest link uses the current site address. On localhost it is only useful on the same computer while the app is running. Deploy the app to a public host (for example, Vercel) before sending links to guests. Since the invitation is encoded in the URL, avoid putting sensitive information in the form.

The animated story is an HTML/CSS animation, not an exported MP4. A good next step for personalized, repeatable video is Remotion: keep each invitation as structured data, compose a 9:16 video scene in React, and render it to MP4 on a server or render worker. Generative media can supply optional background artwork, while the exact names, date, and venue should stay as deterministic text layers. OpenAI's Sora app was discontinued on April 26, 2026, and its Videos API was scheduled to shut down on September 24, 2026, so it should not be a dependency for this project.

## Where to customize

- `lib/invitation-templates.ts` — built-in palettes, motifs, and animation variants.
- `app/page.tsx` — creator form, custom template controls, card/video previews, and share-link creation.
- `app/preview/page.tsx` — guest-facing share-link page.
- `app/globals.css` — card styling, template looks, and motion choreography.
