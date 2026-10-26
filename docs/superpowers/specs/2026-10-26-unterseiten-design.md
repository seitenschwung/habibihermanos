# Unterseiten im Stil der Startseite

Stand: 2026-10-26. Branch `claude/scroll-snap` (PR #23 gegen `redesign-sunset`). Baut auf `design-concept-v2.md` auf.

## Ziel
Musik, Fotos, Über uns, Live und Buchen sprechen dieselbe Sprache wie die Startseite: bildschirmfüllender Einstieg,
danach helle (Verlauf) und dunkle Blöcke im Wechsel, gleicher Header und Footer. Impressum und Datenschutz bleiben
schlichte Textseiten mit neuem Kopf.

## Entscheidungen (vom Owner bestätigt)
- Startseite: Termine bleiben wie sie sind (nächste 3, gleiche Karten).
- Ansatz „gemischt“: Medienseiten (Musik, Fotos, Über uns) öffnen mit Foto/Video, Infoseiten (Live, Buchen) mit Plakat.
- Unterseiten rasten sanft ein (`proximity`), die Startseite bleibt bei `mandatory`.

## Gemeinsames System
- **Header:** überall `bar bar--fixed` wie auf der Startseite; hell über `[data-dark]`-Blöcken, dunkel auf dem Verlauf
  (bestehender IntersectionObserver). `aria-current="page"` bleibt.
- **Medien-Einstieg** `.opener.opener--media` (`data-dark`): 100dvh, dunkel, Foto oder Video als Fläche, Kicker,
  Anton-Titel und Lead in Creme unten links, leichter Verlauf nach unten für Kontrast.
  Variante `.opener--panel` für Hochkant-Video: Video als hohe Fläche rechts, Titel links auf Dunkel;
  unter 980 px füllt das Video den Hintergrund.
- **Plakat-Einstieg** `.opener.opener--poster`: wie `.home` (Verlauf, riesiger Titel, Lead), unten das dunkle
  Laufband `.marquee` mit seitenspezifischen Wörtern. `.opener--short` (ca. 75dvh) für Buchen.
- **Danach:** vorhandene `.block` und `.block--dark`; auf Unterseiten Höhe nach Inhalt (`.block--fit`, kein 100dvh).
- **Einrasten:** `html.snap-soft{scroll-snap-type:y proximity}`, `scroll-snap-align:start` für Einstieg und Blöcke,
  `end` für den Footer.
- **Footer:** der neue dunkle Footer, unverändert.
- **Hintergrundvideo:** `site.js` startet stumme Loops in `.opener video[data-loop]` nur ohne reduzierte Bewegung und
  ohne Save-Data (wie beim Musikblock der Startseite); sonst bleibt das Poster stehen.

## Seiten
Bilder der Startseite (Bühnenfoto, Bar-Video/-Foto, Anzug-Porträt) werden in den Einstiegen nicht wiederholt.

### Musik (Medien, Panel)
1. Einstieg: „Hör selbst.“, Lead, Button „Ton an“ (schaltet den Ton des Loops); `hero-loop.mp4` als Panel rechts.
2. Dunkel „Ein ganzer Song“: `arches-live.mp4` als großes 16:9-Vorschaubild mit Play; öffnet den vorhandenen
   Video-Dialog, lädt erst beim Klick.
3. Verlauf „Mitschnitte“: die drei Hochkant-Clips (Café, zweiter Mitschnitt, Bar) nebeneinander, mobil untereinander.
4. Dunkel „Nur zuhören“: vorhandener Audio-Player mit Wellenform, volle Breite.

### Fotos (Medien)
1. Einstieg: `gallery-performance.webp` bildschirmfüllend, „Momente.“
2. Verlauf: Collage mit versetzten Höhen (3 Spalten, mobil 2), Label unter dem Bild; Foto-Dialog bleibt.

### Über uns (Medien)
1. Einstieg: `hero-duo.webp`, „Aus zwei Freunden wird eine Band.“
2. Verlauf: erster Absatz groß, übriger Text schmal neben `stage-duo.webp`.
3. Dunkel: „الموسيقى تجمعنا“ groß (Noto Naskh), darunter „Musik verbindet uns“, Duo-Zeichen (`duo-mark.webp`, auf
   Dunkel invertiert, falls nötig).
4. Verlauf: Buttons „Nächste Auftritte“ (live.html) und „Buchen“ (buchen.html).

### Live (Plakat)
1. Einstieg: „Live.“, Lead „Nächste Auftritte in Kiel und Umgebung.“, nächster Termin als Anreißer (Datum groß,
   Ort), Link nach unten zur Liste; Laufband „Café / Bar / Fest / Kultur / Live aus Kiel“.
   Ohne Termine entfällt der Anreißer.
2. Verlauf: alle Termin-Karten (bestehendes Rendering, `?demo` funktioniert weiter).
3. Dunkel: „Ihr plant einen Abend?“ + Button „Buchen“; „Neue Termine zuerst auf Instagram“ + Link.

### Buchen (Plakat, kurz)
1. Einstieg: „Eure Bühne. Unser Sound.“, Lead, Button „Zur Anfrage“ (Anker zum Formular);
   Laufband „Café & Bar / Konzert & Kultur / Fest & privat“.
2. Verlauf: Anlässe links, Formular rechts (Felder und Logik unverändert).
3. Dunkel: „Lieber direkt?“ mit `info@seitenschwung.com` (mailto) und Instagram.

### Impressum, Datenschutz
Fester Header, kurzer Plakat-Titel auf dem Verlauf, Text in lesbarer Spalte (max. ca. 70 Zeichen), Footer.
Kein Einrasten. Inhalt unverändert.

## Grenzen
- Keine neuen Texte über die Band, keine erfundenen Termine, Orte oder Links. Neue Überschriften sind reine
  Abschnittsnamen.
- Keine neuen Bibliotheken, keine externen Requests; Medien bleiben wie sie sind.
- Bewegung nur: Laufband, stumme Loops, Hover; alles aus bei `prefers-reduced-motion`.

## Prüfung
- Chrome 1280×768 und 375×812: jede Seite durchscrollen; Header-Farbe über hell/dunkel richtig; kein Inhalt unter
  dem Header; Video-/Foto-Dialog, Audio-Player, Formular (mailto + Kopieren) funktionieren.
- Ohne JS: Inhalte sichtbar (Poster statt Video, `noscript`-Termin).
- Lighthouse lokal (a11y, best-practices, SEO ≥ 90), da der PR gegen `redesign-sunset` keine CI hat.
