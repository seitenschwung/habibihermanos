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

- Gigs: edit `public/assets/termine.json` (past dates hide themselves).
- Booking: the form opens a mail draft to `aemsez08@gmail.com`; nothing is sent to a server.

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
