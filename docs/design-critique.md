# Design-Kritik: Habbibi Hermanos

Stand: 2026-10-21. Basis: Screenshots 1280×800 (Hero, „Hör selbst“, „Über uns“, „Momente“) und `public/assets/css/style.css`. Nicht geprüft: Kontaktsektion, mobile Ansicht.

## Was funktioniert
- Eigene Identität: Orange, Schokolade, Creme passen zu spanisch-arabischer Wärme.
- Typografie: große Condensed-Titel + Serif-Zeilen + Labels in Versalien haben Wiedererkennungswert.
- Details (arabische Zeile, Wortspiele) gehören zum Duo.

## Probleme

### Hero
- Verlauf Orange (`#f97b46`) → Rotbraun mit halbtransparentem Video, weicher Maske und Multiply-Tint: Bild wirkt wie ein Fleck, keine saubere Kante.
- „HH — LIVE“ (oben rechts) und „ENTDECKEN“ (unten) werden vom Video überdeckt.
- „HERMANOS.“ läuft ins Video; „OS“ verliert Kontrast.
- Vertikale arabische Zeile liegt über dem Gesicht/der Weste des Cajón-Spielers.
- Ton-Button schwebt ohne Bezug zum Layout.

### Verläufe (Rest der Seite)
- Jede Sektion hat einen eigenen Winkel (180°, 125°, 110°, 135°, 100°), alle halbtransparent über demselben unscharfen `orange-haze`. Keine ruhige, durchgehende Farbführung, harte Sektionsränder.
- Nur zwei Töne (Rost, Schokolade), wenig Tiefe; kein dritter Ton als Lichtquelle.
- Werte als rgba/Hex in jeder Regel statt als Variablen.

### Bilder und Medien
- Dasselbe Foto (Duo vor Backsteinwand) in „Über uns“ und „Momente“ (mehrfach).
- Hero-Video und Live-Standbild sind unscharf/kontrastarm gegenüber den Handyfotos.
- Galeriebilder mit unterschiedlichen Farbstichen und Belichtung.

### Typografie und Rhythmus
- Extremes Verhältnis Titel (bis 270 px) zu Fließtext (13–14 px); Labels mit 10–11 px schwer lesbar.
- Große Leerräume (z. B. ~200 px vor „Hör selbst“) wirken wie Lücken.
- Randtexte oben rechts in Sektionen schweben ohne Bezug.

### Interaktive Elemente
- Zu viele Button-Stile: schwarzer Block, Outline-Pille, Textlink, oranger Kreis, Creme-Pille.
- Orangener Submit-Button auf Rostgrund: wenig Kontrast.

## Vorschläge

### Farbsystem
```css
:root{
  --bg-deep:#1a0a07;
  --bg-warm:#2b100a;
  --bg-ember:#5a1d10;
  --gold:#f2b469;
  --fire:#ef5e2b;
  --grad-page:linear-gradient(180deg,var(--bg-deep) 0%,var(--bg-warm) 45%,var(--bg-ember) 100%);
  --grad-glow:radial-gradient(60% 50% at 80% 0%,rgba(239,94,43,.28),transparent 70%);
}
```

### Verläufe
1. Ein durchgehender Seitenverlauf (`--grad-page`) statt fünf Sektionsverläufe; pro Sektion nur ein radiales Licht (`--grad-glow`) an wechselnder Stelle.
2. Ein einheitlicher Winkel (z. B. 160°) für lineare Verläufe.
3. Hero: dunkle Basis, warmes Glühen hinter dem Titel, Video mit klarer Kante oder dunklem Overlay (`linear-gradient(90deg,var(--bg-deep) 0%,transparent 60%)`); Titel in Creme.
4. Gold als dritter Ton; Verlauf `linear-gradient(90deg,var(--gold),var(--fire))` im zweiten Titelwort (`background-clip:text`).
5. Feines Korn (SVG-Noise, 3–4 %) gegen Banding.
6. Alle Einzelwerte in Tokens überführen.

### Layout und Details
- Arabische Zeile aus dem Hero nehmen (Über uns oder Footer).
- Überlappungen im Hero beseitigen.
- Buttons auf zwei Stile reduzieren (gefüllt, Textlink).
- Mindestens 12–13 px für Labels, 16 px für Fließtext.
- Sektionsabstände auf festes Raster (120/160 px).

### Bilder
- Einheitliches Grading, pro Sektion ein anderes Motiv, besseres Hero-Video (höhere Auflösung, ruhige Kamera). Braucht Material vom Owner.

## Priorität
1. Hero neu abmischen.
2. Durchgehender Verlauf + Farbvariablen.
3. Gold-Akzent, Verlaufstitel.
4. Buttons und Schriftgrößen vereinheitlichen.
5. Bildmaterial verbessern.

Nach jeder Umsetzung: Lighthouse (a11y, best-practices, SEO ≥ 90) und Kontrast prüfen; CI führt axe aus.
