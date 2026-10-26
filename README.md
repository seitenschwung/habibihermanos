# Habibi Hermanos

Website of the acoustic duo Habibi Hermanos (guitar, vocals, cajón) from Kiel: music, photos, about, live dates
and a booking form. German UI, plain static HTML/CSS/JS, no build step, served by nginx.

Live: https://habibi.seitenschwung.com and https://habibihermanos.de

## Work on it

```bash
cd public && python3 -m http.server 8080 --bind 0.0.0.0
```

Open http://localhost:8080. On localhost the gig lists show labelled example dates from `termine.demo.json`
(`?demo=0` shows the real `termine.json`); `?debug=1` opens a panel to switch scroll-snapping, the background
drift and the animations. Structure and conventions: `CLAUDE.md`.

- Gigs: the band edits them in Pages CMS (below), or edit `public/assets/termine.json` by hand. Past dates hide themselves.
- Booking: the form opens a mail draft to `aemsez08@gmail.com`; nothing is sent to a server.

## Termine pflegen (Pages CMS)

`.pages.yml` gives the band a form for `public/assets/termine.json` in [Pages CMS](https://pagescms.org)
(fields: Datum, Uhrzeit, Ort, Label, Text). Saving commits the file; CI checks it (`npm test` →
`scripts/check-termine.mjs`: valid JSON, date `YYYY-MM-DD`, time `HH:MM`, venue set) and deploys `main` only when
the check passes, so a broken entry never goes live.

Setup (owner, once):
1. Open https://app.pagescms.org, sign in with GitHub and install the Pages CMS GitHub App for
   `seitenschwung/habibihermanos` (this repository only).
2. In Pages CMS open the repository, branch `main`, then "Termine": the form appears.
3. Invite the band as collaborators by email (they need no GitHub account). They can edit content but not
   `.pages.yml`.

Saving on `main` publishes after CI (a few minutes). `main` has no branch protection, so the commit lands directly;
to review first, let them save on another branch and merge it as a PR.

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
