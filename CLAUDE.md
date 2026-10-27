# Habibi Hermanos website

## Purpose
Artist website (German) for the acoustic duo Habibi Hermanos (guitar, vocals, cajón): music, about,
dates, photos, booking form. Production: https://habibihermanos.de (main address); `habibi.seitenschwung.com` and the `www.` names 301 to it (`nginx.conf`)
(Coolify on Hetzner). Canonical/og URLs, `robots.txt` and `sitemap.xml` use habibihermanos.de; add new pages to the sitemap.

## Stack
Plain static HTML/CSS/JS, no build step. Served by unprivileged nginx. One server part: the booking mailer
(`mailer/`, Node + `nodemailer`, second Compose service from the same image, reached only via nginx `/api/anfrage`). `package.json` exists only so the
shared CI runs `npm test` (the gig check); keep it dependency-free.

## Commands
- Dev server: `cd public && python3 -m http.server 8080 --bind 0.0.0.0`
- Tests: `npm test` checks `termine.json` / `termine.demo.json`; CI also builds the Docker image and crawls the site (axe + Lighthouse).
- Local check: `lighthouse http://localhost:8080 --chrome-flags="--no-sandbox --headless"`

## Layout
- `public/assets/{css,js,media,images}`; one `style.css`, one `site.js` for all pages. Each `site.js` block guards for its
  elements (header colour, scroll reveal, debug panel, `video[data-loop]` + `[data-sound-for]` loops, cinema dialog,
  audio waveform, lightbox, booking form, gigs).
- Header (every page): `.bar--fixed` with brand + `.mark` logo, pages and a filled `Buchen` (`.pages .book`; on phones it
  sits next to the brand). Light on the gradient; dark with light text while the section under its middle line is
  `.stage-photo`, `[data-dark]` or `.footer` (checked per scroll frame; dark layer fades via `::before`). Pages that
  open on a dark section start with `header.bar--fixed.on-photo`. Footer: dark, same markup on every page (brand,
  "Jetzt anfragen", pages, contact, Instagram https://www.instagram.com/habibihermanoshh/ as a link only, legal).
  Copy header/footer markup when adding a page.
- `index.html`: hero (band name, claim, marquee, large logo) → stage photo (`hero-stage.webp`, pinned with
  `position:fixed` inside a `clip-path` section so scrolling uncovers it from behind the hero; keep the img eager)
  with the about teaser bottom left and the white name bottom right → Musik block (dark, muted `bar-loop.mp4` behind
  the text while visible, "Ton an" unmutes; paused for reduced motion / Save-Data) → gigs (`#gigs`, `data-limit="3"`).
- Subpages (spec: `docs/superpowers/specs/2026-10-26-unterseiten-design.md`): a first-screen `.opener`, then
  `.block` / `.block--dark` sections (`.block--fit` = content height). `musik.html`: `.opener--split` (text + framed
  portrait loop), one-screen song block, clips + audio player. `fotos.html`: no opener, photos uncropped in CSS
  columns (3 desktop / 2 phone), captions in the lightbox, hidden `h1`. `ueber-uns.html`: `.opener--motto` (Arabic
  line + h1 "Musik verbindet uns"), story with h2. `live.html` / `buchen.html`: `.opener--poster` (title + marquee on
  the bottom edge), light `.cta-card` closing block; Live teases the next gig (`#next-gig`). Buchen (`.opener--book`) has
  the form card in the opener next to title and occasions (phones: form first, occasions below); the opener may be taller than one screen. Legal pages: plain text.
- Scroll-snap (CSS only): `html.snap` (mandatory) on index, Musik, Über uns; keep every section at most one screen
  tall on desktop there (`.block--screen`, `.block--tight`), or it gets a second stop at its end. `html.snap-soft`
  (proximity) on Live and Buchen; none on Fotos and legal pages.
- Motion: hero name and subpage openers animate on load (CSS `rise` / `fade-up`). Below the first screen `site.js`
  marks text, cards and images (`.reveal` fades up, `.reveal-img` settles from a zoom; the start page sets its own
  classes in `[data-reveal]` sections, incl. `.reveal-rise`) and adds `.is-in` per element in view (`.reveal-rise`
  starts fully clipped, so its parent is observed). Content only starts hidden when `html.js` is set.
- Background: `--stage-bg` radial centres (`--g1x/--g1y/--g2x/--g2y`, registered with `@property`) drift via
  `stage-drift` on `:root` (48 s, `steps(480)` to limit repaints); dark blocks glow with the same vars.
- All motion is off for `prefers-reduced-motion`. Debug: `?debug=1` opens a panel on every page (kept per browser
  tab, `?debug=0` closes) to switch snapping, background drift and animations (`html.snap*`, `html.bg-still`,
  `html.no-anim`); `window.habibiDebug.setSnap/setFlow/setAnim(bool)` do the same.
- `Dockerfile` + `nginx.conf`: port 8080, `/healthz`, `/version.txt` (from `APP_VERSION`); copies `public/` and the mailer
  (`node /app/mailer/server.mjs`, port 3000, internal only). nginx proxies `POST /api/anfrage` with a rate limit.
- `docker-compose.yml`: what Coolify runs (`image: ${IMAGE}`, CrowdSec labels, log rotation).

## CI and deploy contract
`.github/workflows/ci.yml` is owner-managed; don't edit. CI needs: port 8080, `GET /healthz` 200,
`GET /version.txt`, non-root, read-only root fs. `/` is HTML, so axe (WCAG AA) and Lighthouse
(a11y, best-practices, SEO >= 90) run. `main` deploys after green CI. Keep the CrowdSec labels.

## Conventions / pitfalls
- UI language is German; keep copy honest (no invented dates, links or performers).
- Every Buchen/anfragen link points to `buchen.html#formular` (the form card; `scroll-margin-top` keeps it clear of the header).
- The form posts to `/api/anfrage` (mailer, SMTP via `booking.habibihermanos@seitenschwung.com` to `aemsez08@gmail.com`); `BOOKING_EMAIL` in `site.js` is only the fallback address shown when that fails. Mailer security rules and their tests: spec `2026-10-27-booking-mailer-design.md`, `mailer/*.test.mjs`; keep form `maxlength`s in sync with `mailer/lib.mjs`. Owner setup (mailbox, `SMTP_PASS` in Coolify): `README.md`.
- Fonts are self-hosted in `public/assets/fonts` (Anton, Roboto, Noto Naskh Arabic; OFL). No external requests.
  Add weights via `@font-face` at the top of `style.css`; keep it free of external requests (GDPR).
- `public/impressum.html` and `public/datenschutz.html` are filled with the operator's details; the owner is responsible for their legal review.
- Design: terracotta gradient (`--terracotta`, `--clay`, `--sand` plus a soft brick glow top left; no motifs), dark brown text `#2a170d` (keep ≥ 4.5:1 on the darkest gradient spot), everything square (no border-radius), no hairlines or frames, square buttons, small tracked caps labels, Anton headlines. History: `docs/design-concept-v2.md`, `docs/design-critique.md`; brand concept `docs/design-concept.md`. Brand spelling is "Habibi" (one b).
- The band edits gigs in Pages CMS (`.pages.yml`, setup in `README.md`); keep its fields in sync with `scripts/check-termine.mjs` and `site.js`.
- Gigs live in `public/assets/termine.json` (`date` YYYY-MM-DD, `time`, `venue`, `label`, `text`); `site.js` renders them into `#gigs` (start page: `data-limit="3"`) and `#next-gig` and hides past dates; made-up gigs from `termine.demo.json` show on localhost and with `?demo` (labelled; `?demo=0` turns them off; never on the production host). `<noscript>` holds a static fallback card (29.10) to delete after the date.
- Media is ~45 MB, most of it `arches-live.mp4` (4:49 song, 540x960, 750 kbit/s); videos are H.264 + 64k mono AAC, photos webp q72–80. No ffmpeg on this Mac: re-encode with an AVFoundation AVAssetWriter script at a set bitrate (`avconvert` presets give 100+ MB). Strip location metadata (writer and PIL do). `duo-mark.webp` is the source drawing (not used by a page): favicons `mark-64.png` / `mark-180.png` and the logo `duo-mark.svg` (potrace vector, used as a CSS mask `.mark` so it takes `currentColor`) come from it.
- Caching (`nginx.conf`): HTML/CSS/JS `no-cache` (revalidate), fonts/images/media 1 day. Files are not fingerprinted, so replaced media may show old for up to a day; rename the file to force it.
