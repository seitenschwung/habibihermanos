# Habibi Hermanos

Website of the acoustic duo Habibi Hermanos (guitar, vocals, cajón) from Kiel: music, photos, about, live dates
and a booking form. German UI, plain static HTML/CSS/JS, no build step, served by nginx.

Live: https://habibihermanos.de (habibi.seitenschwung.com and www. forward there)

## Work on it

```bash
cd public && python3 -m http.server 8080 --bind 0.0.0.0
```

Open http://localhost:8080. On localhost the gig lists show labelled example dates from `termine.demo.json`
(`?demo=0` shows the real `termine.json`); `?debug=1` opens a panel to switch scroll-snapping, the background
drift and the animations. Structure and conventions: `CLAUDE.md`.

- Gigs: the band edits them in Pages CMS (below), or edit `public/assets/termine.json` by hand. Past dates hide themselves.
- Booking: the form posts to `/api/anfrage`; the mailer service (`mailer/`) sends it as a plain-text mail via the
  Hetzner mailbox to itself (`MAIL_TO`) (Reply-To = visitor). Locally (python server) there is no mailer, so the
  page shows the fallback with the address.

## Termine pflegen (Pages CMS)

`.pages.yml` gives the band a form for `public/assets/termine.json` in [Pages CMS](https://pagescms.org)
(fields: Datum, Uhrzeit, Ort, Label, Text, Ticket-Link; a filled ticket link shows a "Tickets buchen" button on the card). Saving commits the file; CI checks it (`npm test` →
`scripts/check-termine.mjs`: valid JSON, date `YYYY-MM-DD`, time `HH:MM`, venue set, ticket link a full `https://` address) and deploys `main` only when
the check passes, so a broken entry never goes live.

Setup (owner, once):
1. Open https://app.pagescms.org, sign in with GitHub and install the Pages CMS GitHub App for
   `seitenschwung/habibihermanos` (this repository only).
2. In Pages CMS open the repository, branch `main`, then "Termine": the form appears.
3. Invite the band as collaborators by email (they need no GitHub account). They can edit content but not
   `.pages.yml`.

**Fotos** (second form): Bild, Titel, Datum, Beschreibung → `public/assets/fotos.json`, images in
`public/assets/images/uploads/`. The gallery on `fotos.html` shows them before the fixed photos, newest first; date and
description appear in the large view. `scripts/check-fotos.mjs` checks the entries (image exists, JPG/PNG/WebP,
at most 15 MB, title, date). The Docker build turns every upload upright, shrinks it to 1600 px, recompresses it and
strips all metadata including GPS (stage `photos` in the `Dockerfile`); git keeps the originals. To delete a photo,
remove its entry and the file in Pages CMS (media).

**Songs** (third form): Titel, Eigener Song, Original von (covers), Sprache, Notiz, Hörprobe →
`public/assets/songs.json`, samples in `public/assets/media/uploads/`. `musik.html` shows them as "Repertoire" (own
songs first, filter chips per kind and language, play button for samples); the section stays hidden while the list
is empty. `scripts/check-songs.mjs`: covers need "Original von" and may not have a sample (publishing a cover recording
needs a licence), samples MP3/M4A up to 20 MB. The Docker build (stage `audio`) re-encodes samples to 128 kbit/s and
drops cover art and tags.

Saving on `main` publishes after CI (a few minutes). `main` has no branch protection, so the commit lands directly;
to review first, let them save on another branch and merge it as a PR.

## Log retention (owner, once, before deploying the journald change)

Container logs (web and mailer) go to the server's journald (`docker-compose.yml`); the privacy policy says access
logs with IP addresses are deleted after 14 days. journald must enforce that on the host. On the Coolify server, as root:

```bash
mkdir -p /etc/systemd/journald.conf.d
printf '[Journal]\nMaxRetentionSec=14day\nMaxFileSec=1day\n' > /etc/systemd/journald.conf.d/retention.conf
systemctl restart systemd-journald
```

`MaxFileSec=1day` starts a new journal file daily, so `MaxRetentionSec` can drop whole days on time. This applies to
the whole host journal. Check: `journalctl -t habibi-web --since today | tail` shows nginx lines after the next deploy,
and `journalctl --header | grep -i retention` or the oldest entry (`journalctl -t habibi-web | head -1`) is never
older than 14 days. Coolify's proxy (Traefik) keeps no access log by default; leave it that way.

## Booking mail (owner, once)

The `mailer` service in `docker-compose.yml` sends the form via SMTP. Design and security rules:
`docs/superpowers/specs/2026-10-27-booking-mailer-design.md`.

1. Create the mailbox `booking.habibihermanos@seitenschwung.com` in konsoleH (Hetzner webhosting `www790`).
2. In Coolify, for this resource, set the environment variable `SMTP_PASS` (mark it secret) to that mailbox's
   password. Defaults that can be overridden: `SMTP_HOST=mail.your-server.de`, `SMTP_PORT=587`,
   `SMTP_USER`/`MAIL_FROM=booking.habibihermanos@seitenschwung.com`, `MAIL_TO=booking.habibihermanos@seitenschwung.com`,
   `ALLOWED_ORIGINS` (both domains with and without `www.`).
3. Redeploy and send one test request from the live site.

Without `SMTP_PASS` the mailer answers 503 and the page offers the address directly, so deploying first is safe.
`npm test` runs the mailer tests; locally `MAIL_DRY_RUN=1` builds mails without sending.

## CI and deploy

`.github/workflows/ci.yml` calls the shared pipeline `seitenschwung/template/.github/workflows/pipeline.yml@v1`
(checks, hardened Docker test, axe + Lighthouse browser tests, deploy to Coolify after green CI on `main`).
`docker-compose.yml` is what Coolify runs (the image tested by CI, CrowdSec labels, log rotation).

## Setting up the deploy (owner, once per project)

Nothing deploys until `COOLIFY_APP_UUID` is set, so CI stays green before that.

1. **Coolify:** New Resource → this repository → Build Pack **Docker Compose**. Give the
   service `web` the domain `https://<domain>:8080`. The server needs a `docker login ghcr.io`
   (a token with `read:packages`) if the repository is private.
2. **GitHub → Settings → Environments → `production`:**
   - secrets `COOLIFY_TOKEN` (Coolify API token with read, write and deploy),
     `TS_OAUTH_CLIENT_ID`, `TS_OAUTH_SECRET` (Tailscale OAuth client with tag `tag:ci`)
   - variables `COOLIFY_URL` (Coolify on the tailnet) and `APP_URL` (`https://<domain>`)
3. **GitHub → Settings → Secrets and variables → Actions → Variables (repository):**
   `COOLIFY_APP_UUID`. It must be a repository variable, since it decides whether the deploy
   job runs at all.
4. Optional: `BROWSER_TESTS=off` (repository variable) for a project without a web UI.

The deploy steps live in the workflow on purpose: the bot that writes the code can't change
workflow files, so it can't change what runs with the deploy secrets.
