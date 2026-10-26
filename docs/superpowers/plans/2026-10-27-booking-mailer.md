# Booking Mailer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The booking form sends its request as a plain-text email via Hetzner SMTP instead of opening a mailto draft.

**Architecture:** A small Node service (`mailer/`) runs as a second Compose service from the same image; nginx proxies only `POST /api/anfrage` to it. Pure logic (`mailer/lib.mjs`) is separate from the process entry (`mailer/server.mjs`) so it is testable without network.

**Tech Stack:** Node (Alpine `nodejs`), `nodemailer` 10.2.1 (exact), `node:test`, nginx-unprivileged, Docker Compose.

**Spec:** `docs/superpowers/specs/2026-10-27-booking-mailer-design.md`

## Global Constraints
- Only dependency `nodemailer` pinned exactly; installed via `npm ci --omit=dev` in a Docker build stage.
- `to`/`from` only from env; request may set only `replyTo` (one validated address) and text.
- Plain text mail only. No request content, addresses or SMTP error text in logs or responses.
- Limits: body 16 KB; name 100, event 200, date 10 (`YYYY-MM-DD` or empty), message 4000, email 254; 10 requests/hour/IP in the service, 5/min/IP burst 3 in nginx; max 2 concurrent sends; read timeout 10 s; SMTP connection 10 s, socket 20 s; `requireTLS`.
- Missing SMTP config must not break `web`: the mailer answers 503 and the page falls back to the mailto text.
- CI contract unchanged (port 8080, `/healthz`, `/version.txt`, non-root, read-only).

## Review Focus
- Origin header missing (some privacy tools strip it): request must be rejected (403), the page shows the direct-mail fallback.
- Message with Windows line endings and German umlauts/emoji: accepted, delivered unchanged.
- Request arriving in two TCP chunks or slowly: body assembled correctly; > 10 s → 408.
- SMTP down: 502, no retry loop, concurrency slot released.
- Same visitor submits twice quickly: second within limits succeeds; 11th within an hour → 429.

---

### Task 1: Validation and mail composition (`mailer/lib.mjs`)
**Files:** Create `mailer/lib.mjs`, `mailer/lib.test.mjs`, `mailer/package.json`, `mailer/package-lock.json`; Modify root `package.json` (`test`: `node scripts/check-termine.mjs && npm --prefix mailer ci --no-audit --no-fund && node --test mailer/`).

**Produces:** `readConfig(env) -> {disabled, missing[], smtp:{host,port,user,pass}, from, to, origins:Set, dryRun}`; `validate(body) -> {ok:true,data} | {ok:false,field}`; `buildMail(data, config) -> {from,to,replyTo,subject,text}`; `createLimiter({max, windowMs, now}) -> {hit(ip) -> boolean}`.

- [ ] Tests: CR/LF/control chars in `name`/`email`/`event`/`date` → `{ok:false,field}`; unknown key → fail; non-string → fail; over-length per field → fail; email with comma, `<`, space, two `@` → fail; valid German text with umlauts and `\r\n` in message → ok; `buildMail` uses config from/to, `replyTo` = email, subject `Booking-Anfrage: <event>`, no `html`; `readConfig` with missing SMTP_PASS → `disabled:true`; limiter allows 10 then blocks, resets after window.
- [ ] Run `node --test mailer/` → fails (module missing). Implement. Run → passes. Commit.

### Task 2: HTTP handler (`createHandler` in `mailer/lib.mjs`) and entry (`mailer/server.mjs`)
**Interfaces:** `createHandler({config, transport, limiter, maxConcurrent=2, log}) -> (req,res)`; `server.mjs` builds nodemailer transport (`jsonTransport` when `MAIL_DRY_RUN=1`), listens on `0.0.0.0:3000`.
- [ ] Tests (real `http` server on port 0, nodemailer `jsonTransport`): `/healthz` 200; GET `/api/anfrage` 405; wrong/missing Origin 403; `text/plain` 415; 17 KB body 413; broken JSON 400; honeypot filled → 200 and transport not called; valid → 200 and one mail with exact from/to/replyTo; transport throws → 502 and later request succeeds (slot freed); 11th request same `X-Real-IP` → 429; disabled config → 503; responses never contain submitted values; body split over two writes → 200.
- [ ] Run → fail, implement, run → pass. Commit.

### Task 3: Container, nginx, Compose
**Files:** Modify `Dockerfile` (node build stage + `apk add --no-cache nodejs`, copy `mailer/{server,lib}.mjs`, `package.json`, `node_modules` to `/app/mailer`), `nginx.conf` (`limit_req_zone`, real IP from private ranges via `X-Forwarded-For`, `location = /api/anfrage` with POST-only, 16k body, runtime resolver `127.0.0.11`, `proxy_pass $mailer`, `X-Real-IP`), `docker-compose.yml` (service `mailer`, same hardening, `mem_limit: 128m`, `pids_limit: 50`, healthcheck on 3000, env defaults, no `:?` so `web` deploys without secrets).
- [ ] `docker build` succeeds; CI-style run of `web` alone: `/healthz` 200, `/version.txt`, `POST /api/anfrage` 502 (no mailer), site unchanged.
- [ ] Compose locally with `MAIL_DRY_RUN=1`: valid curl → 200 and mail JSON in mailer log line count only (no content); foreign Origin 403; 6 quick requests → 429 from nginx. Commit.

### Task 4: Front end and privacy text
**Files:** `public/buchen.html` (honeypot field `website`, visually hidden, `tabindex="-1"`, `autocomplete="off"`), `public/assets/css/style.css` (`.hp` off-screen), `public/assets/js/site.js` (submit → `fetch` JSON; statuses per spec; fallback with mailto link built via DOM, not innerHTML), `public/datenschutz.html` section 4 (spec text), `README.md`/`CLAUDE.md` (owner setup: mailbox, Coolify variables).
- [ ] Browser against compose stack: submit valid → success text, form reset; stop mailer → fallback text with link; layout of `buchen.html` unchanged otherwise. Commit, push, PR.
