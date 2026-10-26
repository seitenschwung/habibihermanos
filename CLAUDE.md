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
- `public/index.html`: one-pager start page: fixed top menu (`.bar--fixed`, gradient background; turns dark with light text while the section under its middle line is the photo, a `[data-dark]` block or the footer; checked per scroll frame in `site.js`, dark layer fades via `::before`), hero with band name, claim and marquee, then the Musik block (see below), then a full-screen photo (`hero-stage.webp`, pinned with `position:fixed` inside a `clip-path` section so scrolling uncovers it; keep the img eager, lazy never loads there)., then full-screen blocks. Musik block (after the hero: dark, muted `bar-loop.mp4` plays behind the text while visible, "Ton an" unmutes; paused for reduced motion / save-data), next gigs (`#gigs` from `termine.json`), Über uns teaser. `<html class="snap">` turns on native CSS scroll-snap (`mandatory`) over every `main > section`; no JS
- Menu: top bar with Musik, Fotos, Über uns, Live and a filled `Buchen` (`.pages .book`). Instagram (https://www.instagram.com/habibihermanoshh/) in every footer, link only, no embed.
- Subpages follow the start page (spec: `docs/superpowers/specs/2026-10-26-unterseiten-design.md`): fixed header, a full-screen `.opener` (`--media` photo/video with `data-dark`, `--panel` for portrait video, `--poster` gradient title + marquee, `--short`), then `.block`/`.block--dark` sections with `.block--fit` (content height); `<html class="snap-soft">` snaps gently (`proximity`); `musik.html` uses `snap` (mandatory) because it is built from full screens. Media pages start with `header.bar--fixed.on-photo` so the dark header shows before the observer runs. `musik.html` (loop opener, tiles open a cinema `<dialog>`, audio player), `fotos.html` (no opener, no snapping: photos uncropped in CSS columns, 3 on desktop / 2 on phones, captions in the lightbox; hidden `h1`), `ueber-uns.html`, `live.html` (next-gig ticket + gigs), `buchen.html` (form); legal pages: fixed header, plain text. Same header/footer markup in each, copy it when adding a page
- `public/assets/{css,js,media,images}`
- Debug: `?debug=1` opens a small panel on every page (kept per browser tab, `?debug=0` closes) to switch section snapping and the drifting background off and on; `window.habibiDebug.setSnap(bool)` / `.setFlow(bool)` do the same.
- Background: `--stage-bg` radial centres (`--g1x/--g1y/--g2x/--g2y`, registered with `@property`) drift via `stage-drift` on `:root` (90 s, `steps(900)` to limit repaints); `html.bg-still` pauses it, reduced motion turns it off.
- `public/assets/js/site.js`: shared by all pages, each block guards for its elements (header colour, `video[data-loop]` + `[data-sound-for]` loops, cinema, audio waveform, lightbox, booking form, gigs)
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
- Gigs live in `public/assets/termine.json` (`date` YYYY-MM-DD, `time`, `venue`, `label`, `text`); `site.js` renders them into `#gigs` (start page: `data-limit="3"`) and `#next-gig` and hides past dates; made-up gigs from `termine.demo.json` show on localhost and with `?demo` (labelled; `?demo=0` turns them off; never on the production host). `<noscript>` holds a static fallback card (29.10) to delete after the date.
- Media is ~45 MB, most of it `arches-live.mp4` (4:49 song, 540x960, 750 kbit/s); videos are H.264 + 64k mono AAC, photos webp q72–80. No ffmpeg on this Mac: re-encode with an AVFoundation AVAssetWriter script at a set bitrate (`avconvert` presets give 100+ MB). Strip location metadata (writer and PIL do). Favicon: `mark-64.png` / `mark-180.png` from the duo drawing (`duo-mark.webp`). Logo on the site: `duo-mark.svg` (potrace vector of `duo-mark.webp`), used as a CSS mask (`.mark`) so it takes `currentColor`.
- Caching (`nginx.conf`): HTML/CSS/JS `no-cache` (revalidate), fonts/images/media 1 day. Files are not fingerprinted, so replaced media may show old for up to a day; rename the file to force it.
