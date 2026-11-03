# xAI wedding video setup

The Reel Maker AI upload flow now uses `/api/ai-video/config`, `/quote`, `/generate` and `/status`.

## Local setup

1. Open the ignored `.env.local` file in the project. Set `XAI_API_KEY` to your Grok API key. Never send the key through chat or put it in a public JavaScript variable.
2. Keep `AI_VIDEO_ACCESS_CODE` private. It authorises spending your account's credits; it is not the API key. A random local code is generated during setup if the file does not exist. The key and code must both be configured before generation is enabled.
3. Restart `npm run dev`. Use Reel Maker → Upload my own · AI video. Enter the generation access code, choose model, duration, resolution, style and ceremony, then upload a JPG/PNG/WebP under 3 MB.
4. Uploading opens a price review. This sends only a photo hash and settings to the quote endpoint, not the photo to xAI. Confirm and generate sends the image to xAI and starts one paid clip. Cancel sends no generation request.

## Netlify setup

Set `XAI_API_KEY` and `AI_VIDEO_ACCESS_CODE` as secret environment variables with Functions scope in Netlify. Redeploy to apply them. Do not add secrets to netlify.toml. The function is `netlify/functions/ai-video.mjs`; it uses Netlify Blobs for per-job records and an atomic claim to prevent repeating the same paid submission. Preview and production job stores are separated by deploy context. Do not publicly expose the access code. This flow does not collect payment from visitors; add verified payment or user quotas before opening paid generation to everyone.

## What is supported

- One clip per request: Haldi, Mehndi, Sangeet, Wedding, Reception, or Opening/Finale multi-scene film parts; Marathi, Bengali or Marwari styling.
- Models Imagine 1.5 Lite and Imagine 1.5 at 480p/720p/1080p, with 5/10/15-second settings.
- Server-calculated signed quotes bound to the exact photo and settings, expiring after 10 minutes. Rates are configured in `lib/ai-video-pricing.mjs`, not fetched live. Validate provider rates when changing them.
- Confirm-first generation, no automatic paid POST retries, status polling and video preview/open/save link. The current job is retained in session storage for the same tab; re-enter the access code after reload and use Check progress.
- An ambiguous connection failure does not prove no charge occurred. Check xAI Usage before starting a new generation. Never retry a paid submission automatically.

## Limits and next steps

Before confirmation the displayed USD amount is an estimate. Completed jobs show actual cost when xAI returns usage.cost_in_usd_ticks; Refresh actual charge rechecks delayed billing without a generation POST. The existing first paid job was verified at $0.46 on 3 November 2026. This is not the live account balance. Check xAI Console for deductions and available credits. Taxes and currency conversion are excluded. Face matching, headings and animation quality are not guaranteed. This image-to-video endpoint can begin with the uploaded still. The prompt requests no lettering; Create your reel below the result supports editable names and ceremony/date/time/venue overlays and concatenates clips into a portrait MP4 using Mediabunny. Export uses browser-generated instrumental music rather than the provider audio. Opening and Finale are each limited to 15 seconds; confirm each paid clip separately for a 30-second film. Additional creative direction is signed into the quote; the exact generated prompt is visible before generation. Saved MP4s can be imported without another API generation. Save the generated MP4 while the provider link is available; videos are not copied into permanent media storage in this implementation.

Run `node --test scripts/ai-video-service.test.mjs` for mocked verification. No real xAI charges are made by these tests. Real paid generation must be tested through the website's cost confirmation, after the key is configured. Production deployment and real output quality are not verified by mock tests.

Local development update: requests from the loopback computer on localhost no longer require entering the generation access code. The dev server opts in only for loopback socket clients and enforces same-origin POSTs. Netlify generation still requires the private access code. The cost confirmation remains mandatory in both environments. The prompt viewer has been removed; optional creative direction remains.


Editable prompt update: after a photo is selected, the full default animation prompt is shown in an editable textarea with Reset to default. Style/ceremony/duration changes load matching defaults. Review cost after editing; the signed quote contains the exact final prompt (up to 6000 characters). Uploading no longer opens the review dialog automatically, allowing prompt edits first. Existing clips are unchanged until a new generation is explicitly confirmed.

