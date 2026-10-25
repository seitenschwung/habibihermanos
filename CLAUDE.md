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
- `public/index.html`: start page, hero slider (slide 1: band name + buttons to the subpages, slide 2: poster `poster-stage.webp`) with arrows, dots, arrow keys and swipe
- Subpages: `musik.html` (videos + audio), `fotos.html` (masonry + lightbox), `ueber-uns.html`, `live.html` (gigs), `buchen.html` (form); same header/footer markup in each, copy it when adding a page
- `public/assets/{css,js,media,images}`
- `public/assets/js/site.js`: shared by all pages, each block guards for its elements (hero slider, audio waveform, lightbox, booking form, gigs)
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
- Design: plain, intense sunset gradient on `body` (rose, coral, orange, amber, gold; fixed, no motifs), dark plum text, Anton headlines, simple pill buttons. Tokens in `:root` of `style.css`; full concept in `docs/design-concept.md`. Brand spelling is "Habibi" (one b).
- Gigs live in `public/assets/termine.json` (`date` YYYY-MM-DD, `time`, `venue`, `label`, `text`); `site.js` renders them into `#gigs` on `live.html` and hides past dates. `<noscript>` holds a static fallback card (29.10) to delete after the date.
- Media is ~12 MB (videos H.264 crf 29, 64k mono audio; photos webp q72, max 1000 px wide); keep new media compressed.
- Caching (`nginx.conf`): HTML/CSS/JS `no-cache` (revalidate), fonts/images/media 1 day. Files are not fingerprinted, so replaced media may show old for up to a day; rename the file to force it.
