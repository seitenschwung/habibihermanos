# Unterseiten im Stil der Startseite – Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Musik, Fotos, Über uns, Live, Buchen get a full-screen opener and alternating light/dark blocks like the start page; legal pages get the fixed header.

**Architecture:** Plain static HTML per page, one shared `style.css` and `site.js`. New CSS components (`.opener`, `.block--fit`) next to the existing `.block`/`.marquee`; `site.js` gains one generic loop-video block and reuses the existing header observer and `#next-gig` renderer.

**Tech Stack:** HTML, CSS, vanilla JS; no build, no test suite. Verification = Chrome (built-in browser) at 1280×768 and 375×812 + local Lighthouse.

**Spec:** `docs/superpowers/specs/2026-10-26-unterseiten-design.md`

## Global Constraints
- No invented band copy, dates, venues or links; new headings are section names only.
- No new libraries, no external requests; media files unchanged.
- Motion only: marquee, muted loops, hover; off under `prefers-reduced-motion`; loops also off with Save-Data.
- Subpages `html.snap-soft` → `scroll-snap-type:y proximity`; start page keeps `html.snap` (mandatory); legal pages no snap.
- Square corners, Anton titles, existing tokens in `:root`.

## Review Focus
- Fixed header over content: no heading may start under the header (desktop ~62 px, phone ~125 px). Check each opener and the first block after it.
- Header colour: light only over `[data-dark]` openers/blocks, dark elsewhere, also after snapping onto an edge.
- Reduced motion / Save-Data: loop video must not autoplay; poster image stays; "Ton an" still works on click.
- No JS: openers show poster/photo, gigs show the `noscript` card, form fields visible.
- Empty gig list: Live opener hides the next-gig teaser, list shows the empty state.

---

### Task 1: Shared system
**Files:** Modify `public/assets/css/style.css`, `public/assets/js/site.js`, all subpage `<html>`/`<header>` lines.

**Produces:**
- `html.snap-soft` (proximity); `.snap-soft main>section{scroll-snap-align:start}`, `.snap-soft .footer{scroll-snap-align:end}`.
- `.opener` (100dvh, `display:flex`, content bottom-left in `.wrap`); `.opener--media` (`data-dark`, `.opener-bg` = img/video cover + dark gradient overlay); `.opener--panel` (video `.opener-panel` right ~40 % on desktop, cover background < 980 px); `.opener--poster` (gradient + `.marquee` at bottom, same markup as `.home`); `.opener--short` (min-height 75dvh).
- `.opener .title` big Anton (`clamp(64px,11vw,180px)`), `.kicker`, `.lead`, `.block-actions`.
- `.block--fit` (min-height auto, padding `clamp(80px,12vh,140px) 0`).
- JS: `video[data-loop]` muted loop plays while ≥25 % visible unless reduced motion/Save-Data; a button `[data-sound-for="<video id>"]` toggles mute, label "Ton an"/"Ton aus", `aria-pressed`. Replace the `#bg-video/#bg-sound` block with this generic one; start page markup gets `data-loop` and `data-sound-for="bg-video"`.
- Every subpage: `<html lang="de" class="snap-soft">` (not legal), `<header class="bar bar--fixed">`.

- [ ] Implement CSS + JS + header/class changes.
- [ ] Verify start page unchanged (music loop + Ton an still work).

### Task 2: Musik
**Files:** `public/musik.html` main.
1. `section.opener.opener--media.opener--panel[data-dark]`: `video#musik-loop[data-loop] muted loop playsinline preload=none poster=live-cover.jpg` with `hero-loop.mp4`; kicker "Unser Sound", h1 "Hör selbst.", existing lead, buttons `[data-sound-for=musik-loop]` "Ton an" + ghost link "#mitschnitte" "Alle Mitschnitte".
2. `section.block.block--dark.block--fit` "Ein ganzer Song": wide clip button for `arches-live.mp4` (16:9 frame, `video preload=metadata #t=2`), label "Ein ganzer Song, live · 4:49".
3. `section.block.block--fit#mitschnitte` "Mitschnitte": three clips (Café, Zweiter Mitschnitt, Live in der Bar 16:9 → use `bar-live.webp` in 9:16 crop) in `.music`.
4. `section.block.block--dark.block--fit` "Nur zuhören": `.player.player--dark` (light bars on dark).
- [ ] Build, check cinema dialog + audio.

### Task 3: Fotos + Über uns
**Fotos:** opener media with `gallery-performance.webp`, kicker "Unterwegs", h1 "Momente.", lead; block `.gallery.gallery--collage` (all 7 photos incl. performance; every 2nd column offset by `margin-top`, mobile 2 columns), photo dialog unchanged.
**Über uns:** opener media `hero-duo.webp`, kicker "Über uns", h1 "Aus zwei Freunden wird eine Band."; block story (lead + text, `stage-duo.webp`); dark block `.ar` line huge + "Musik verbindet uns" + `duo-mark.webp`; block with buttons "Nächste Auftritte" → live.html, "Buchen" → buchen.html. Text verbatim from current page.
- [ ] Build, check lightbox and mobile.

### Task 4: Live + Buchen
**Live:** `section.opener.opener--poster`: kicker "Live erleben", h1 "Live.", lead "Nächste Auftritte in Kiel und Umgebung.", `a#next-gig.ticket[href="#termine"]` with `.ticket-more` "Alle Termine" (hidden until JS fills it; `.ticket:not(.is-set){display:none}` → JS adds `is-set`), marquee "Café / Bar / Fest / Kultur / Live aus Kiel". Block `#termine` with `#dates-layout` (unchanged). Dark block "Ihr plant einen Abend?" + Buchen button + Instagram line.
**Buchen:** poster opener `.opener--short`, kicker "Buchung & Kontakt", h1 "Eure Bühne. Unser Sound.", lead, button "Zur Anfrage" → `#anfrage`; marquee "Café & Bar / Konzert & Kultur / Fest & privat". Block `#anfrage` `.booking` unchanged. Dark block "Lieber direkt?" mailto + Instagram.
- JS: `#next-gig` renderer adds class `is-set`.
- [ ] Build, check `?demo`, empty state, mailto/copy.

### Task 5: Legal pages
`header.bar.bar--fixed`; `.legal` padding-top clears header (`calc(var(--frame)*2 + 46px + 48px)` desktop, 170px < 980 px). Content unchanged.
- [ ] Build, check.

### Task 6: Verify + ship
- [ ] Chrome 1280×768 and 375×812, each page top to bottom: Review Focus items.
- [ ] Lighthouse a11y/best-practices/SEO ≥ 90 on musik, live, buchen (`lighthouse <url> --only-categories=accessibility,best-practices,seo --chrome-flags="--headless"`).
- [ ] Update `CLAUDE.md` layout notes if paths changed; commit; push to PR #23; update PR body.
