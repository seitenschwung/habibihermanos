# Habbibi Hermanos website

## Purpose
Artist website (German) for the acoustic duo Habbibi Hermanos (guitar, vocals, cajón): music, about,
dates, photos, booking form. Production URL: TODO (ask owner).

## Stack
Plain static HTML/CSS/JS, no build step, no package.json. Served by unprivileged nginx.

## Commands
- Dev server: `cd public && python3 -m http.server 8080 --bind 0.0.0.0`
- Tests/build: none locally; CI builds the Docker image and crawls the site (axe + Lighthouse).
- Local check: `lighthouse http://localhost:8080 --chrome-flags="--no-sandbox --headless"`

## Layout
- `public/index.html` single page; `public/assets/{css,js,media,images}`
- `public/assets/js/site.js`: hero sound, video/photo dialogs, audio waveform, booking form
- `Dockerfile` + `nginx.conf`: port 8080, `/healthz`, `/version.txt` (from `APP_VERSION`)
- `docker-compose.yml`: what Coolify runs (`image: ${IMAGE}`, CrowdSec labels, log rotation)

## CI and deploy contract
`.github/workflows/ci.yml` is owner-managed; don't edit. CI needs: port 8080, `GET /healthz` 200,
`GET /version.txt`, non-root, read-only root fs. `/` is HTML, so axe (WCAG AA) and Lighthouse
(a11y, best-practices, SEO >= 90) run. `main` deploys after green CI. Keep the CrowdSec labels.

## Conventions / pitfalls
- UI language is German; keep copy honest (no invented dates, links or performers).
- `BOOKING_EMAIL` in `site.js` is empty until the owner supplies it (form then only copies text).
- Google Fonts are loaded externally (GDPR concern); plan: self-host. Blocked in the sandbox proxy,
  so a console error for it is expected locally.
- `public/impressum.html` and `public/datenschutz.html` are placeholders (`.todo` fields); owner must fill and legally review before public launch.
- Design: tokens in `:root` of `style.css` (`--dusk`, `--rose`, `--gold`, glows); hero is a sunrise (violet sky, horizon glow). Plan/critique: `docs/design-critique.md`.
- Media is ~16 MB (videos); keep new media compressed.
