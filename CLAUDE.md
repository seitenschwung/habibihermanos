# Habibi Hermanos website

## Purpose
Artist website (German) for the acoustic duo Habibi Hermanos (guitar, vocals, cajón): music, about,
dates, photos, booking form. Production URL: https://habibi.seitenschwung.com (current, may change).

## Stack
Plain static HTML/CSS/JS, no build step, no package.json. Served by unprivileged nginx.

## Commands
- Dev server: `cd public && python3 -m http.server 8080 --bind 0.0.0.0`
- Tests/build: none locally; CI builds the Docker image and crawls the site (axe + Lighthouse).
- Local check: `lighthouse http://localhost:8080 --chrome-flags="--no-sandbox --headless"`

## Layout
- `public/index.html`: one-pager start page: fixed top menu (`.bar--fixed`, gradient background; turns light over the photo and `[data-dark]` blocks via IntersectionObserver), hero with band name, claim and marquee, then then a full-screen photo (`hero-stage.webp`, pinned with `position:fixed` inside a `clip-path` section so scrolling uncovers it; keep the img eager, lazy never loads there)., then full-screen blocks: Musik (dark, muted `bar-loop.mp4` plays behind the text while visible, "Ton an" unmutes; paused for reduced motion / save-data), next gigs (`#gigs` from `termine.json`), Über uns teaser. `<html class="snap">` turns on section-by-section scrolling over every `main > section` in `site.js`
- Menu: top bar with Musik, Fotos, Über uns, Live and a filled `Buchen` (`.pages .book`); on the start page the hero marquee also ends in a fixed `Buchen` field (`.marquee-book`). Instagram (https://www.instagram.com/habibihermanoshh/) in every footer, link only, no embed.
- Subpages: `musik.html` (video poster tiles open a dark cinema `<dialog>`, plus audio player), `fotos.html` (masonry + lightbox), `ueber-uns.html`, `live.html` (gigs), `buchen.html` (form); same header/footer markup in each, copy it when adding a page
- `public/assets/{css,js,media,images}`
- `public/assets/js/site.js`: shared by all pages, each block guards for its elements (section snapping, audio waveform, lightbox, booking form, gigs)
- `Dockerfile` + `nginx.conf`: port 8080, `/healthz`, `/version.txt` (from `APP_VERSION`)
- `docker-compose.yml`: what Coolify runs (`image: ${IMAGE}`, CrowdSec labels, log rotation)

## CI and deploy contract
`.github/workflows/ci.yml` is owner-managed; don't edit. CI needs: port 8080, `GET /healthz` 200,
`GET /version.txt`, non-root, read-only root fs. `/` is HTML, so axe (WCAG AA) and Lighthouse
(a11y, best-practices, SEO >= 90) run. `main` deploys after green CI. Keep the CrowdSec labels.

## Conventions / pitfalls
- UI language is German; keep copy honest (no invented dates, links or performers).
- `BOOKING_EMAIL` in `site.js` is `info@seitenschwung.com` (form opens a mailto draft; empty value would make it copy text only).
- Fonts are self-hosted in `public/assets/fonts` (Anton, Roboto, Noto Naskh Arabic; OFL). No external requests.
  Add weights via `@font-face` at the top of `style.css`; keep it free of external requests (GDPR).
- `public/impressum.html` and `public/datenschutz.html` are placeholders (`.todo` fields); owner must fill and legally review before public launch.
- Design: terracotta gradient (`--terracotta`, `--clay`, `--sand` plus a soft brick glow top left; no motifs), dark brown text `#2a170d` (keep ≥ 4.5:1 on the darkest gradient spot), everything square (no border-radius), no hairlines or frames, square buttons, small tracked caps labels, Anton headlines. History: `docs/design-concept-v2.md`, `docs/design-critique.md`; brand concept `docs/design-concept.md`. Brand spelling is "Habibi" (one b).
- Gigs live in `public/assets/termine.json` (`date` YYYY-MM-DD, `time`, `venue`, `label`, `text`); `site.js` renders them into `#gigs` on `live.html` and hides past dates. `<noscript>` holds a static fallback card (29.10) to delete after the date.
- Media is ~45 MB, most of it `arches-live.mp4` (4:49 song, 540x960, 750 kbit/s); videos are H.264 + 64k mono AAC, photos webp q72–80. No ffmpeg on this Mac: re-encode with an AVFoundation AVAssetWriter script at a set bitrate (`avconvert` presets give 100+ MB). Strip location metadata (writer and PIL do). Favicon: `mark-64.png` / `mark-180.png` from the duo drawing (`duo-mark.webp`).
- Caching (`nginx.conf`): HTML/CSS/JS `no-cache` (revalidate), fonts/images/media 1 day. Files are not fingerprinted, so replaced media may show old for up to a day; rename the file to force it.
