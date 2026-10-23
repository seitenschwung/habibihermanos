# Habibi Hermanos – Designkonzept

Zweck: Single source of truth für Look & Feel (Website, Instagram, Flyer, Cover, Video).
Geschrieben so, dass eine KI es direkt als Briefing nutzen kann. Quelle: `designinspo/` (Canva-Posts,
Bandfoto, Gradient-Moodboard). Abschnitte mit **[ergänzt]** sind nicht aus den Vorlagen abgelesen,
sondern konsistent weitergedacht.

## 1. Essenz in einem Satz

Warmer Abendlicht-Verlauf (Koralle → Orange → Gold → Blush) als Bühne, darauf eine wuchtige,
schmale, großgeschriebene Schrift in dunklem Pflaumenbraun: **handgemacht, nahbar, lebendig – spanisch-deutsche
Musik mit arabischem Takt**.

## 2. Marke

- Name: **HABIBI HERMANOS** (immer Versalien, zweizeilig: HABIBI / HERMANOS).
- Duo: akustische Musik, Gitarre, Gesang, Cajón; Kiel. Sprachen: Deutsch (UI), Spanisch, Arabisch.
- Claim: „Spanisch-deutsche Musik mit arabischem Takt“. Story-Zeile: „Aus zwei Freunden wird eine Band.“
- Arabische Wörter als Zierde: الحرية، الحب، الرغبة (Freiheit, Liebe, Verlangen). Nur echte, korrekte
  Wörter; im Zweifel Owner fragen. Nie als Dekor-Pseudotext.
- Persönlichkeit: warm, herzlich, ungezwungen, leidenschaftlich, nicht kitschig, nicht „Clubflyer“.
- Tonalität Text: kurz, direkt, du/ihr-nah, keine Floskeln, keine erfundenen Fakten (Termine, Orte, Namen).

## 3. Visuelle Prinzipien

1. **Verlauf ist die Bühne.** Fläche = weicher, unscharfer Mesh-Gradient, keine harten Kanten, kein Muster.
2. **Typo ist das Bild.** Der Bandname ist das größte Element, füllt 70–90 % der Breite, eng gesetzt.
3. **Wenig Elemente, viel Luft.** Max. 3 Textebenen pro Fläche: Titel, Fakt, Mikrotext.
4. **Kontrast durch Dunkel auf Hell.** Standard: Pflaumenbraun auf warmem Verlauf. Weiß nur auf Foto oder
   sattem Orange (große Schrift).
5. **Asymmetrie mit Ankern.** Titel oben links bündig, Fakten unten (Datum links groß, Details rechts,
   rechtsbündig). Mikrolabels in den oberen Ecken.
6. **Menschlich.** Echte Fotos der beiden, ungestellt, Bühnenlicht, nie Stockfotos von Fremden.
7. **Weicher Schatten** unter großer Schrift (wie Tiefenglow, nicht Hartschatten).

## 4. Farben

Aus den Vorlagen geschätzt (Hex ungefähr), als Design-Tokens:

| Token | Hex | Rolle |
|---|---|---|
| `--plum` | `#6B4A52` | Haupttextfarbe auf hellem Verlauf, Titel |
| `--plum-deep` | `#3A2229` | Dunkelste Textstufe, Fließtext klein, Dark-Mode-Fläche **[ergänzt]** |
| `--coral` | `#FF5A36` | Verlauf: heißer Kern links |
| `--salmon` | `#F2786A` | Verlauf: Übergang Koralle → Rosa |
| `--orange` | `#FF8A3D` | Verlauf: Hauptfläche, Buttons **[ergänzt]** |
| `--amber` | `#FDB544` | Verlauf: Lichtpunkt (Sonne) |
| `--peach` | `#F9C9A8` | Verlauf: weicher Rand |
| `--blush` | `#FDE3D6` | Verlauf: hellste Zone, Seitenhintergrund hell |
| `--paper` | `#FFF8F3` | Fast-Weiß, Hintergrund mit Bokeh-Blob |
| `--white` | `#FFFFFF` | Text auf Foto/Orange |
| `--dust-rose` | `#D9967F` | Arabische Zierschrift, 60 % Deckkraft auf Verlauf |
| `--terracotta` | `#C4604A` | Himmel im Wüstenbild, Akzentfläche **[ergänzt]** |
| `--lilac-dune` | `#D9A9C0` | Kühler Gegenton (Wüstenbild), sparsam **[ergänzt]** |

Regeln:
- Verlauf besteht immer aus **2–4 Farbblobs** (Koralle, Orange, Gold) auf Blush/Paper, stark weichgezeichnet
  (Blur ≈ 25–35 % der Kantenlänge). Eine Ecke bleibt fast weiß (Leseruhe, Platz für Mikrotext).
- Nie mehr als ein Blau/Violett-Akzent, nie reines Schwarz (`#000`) für Schrift.
- Kontrast: `--plum` auf `--blush`/`--peach` ≥ 4.5:1 (geprüft nötig bei Orange: dort nur Großschrift ≥ 24 px
  oder `--plum-deep`). Weiß auf Orange nur ab 32 px fett.
- Dark Mode **[ergänzt]**: Fläche `--plum-deep`, Verlauf als Glow mit 40–60 % Deckkraft, Text `--blush`.
  Entspricht der aktuellen Website (Ember/Dusk); Marke bleibt, nur Helligkeit kippt.

CSS-Beispiel Mesh-Gradient:

```css
.stage{
  background:
    radial-gradient(40% 35% at 15% 62%, var(--coral) 0%, transparent 70%),
    radial-gradient(35% 30% at 62% 56%, var(--amber) 0%, transparent 70%),
    radial-gradient(70% 50% at 50% 100%, var(--orange) 0%, transparent 75%),
    var(--blush);
}
```

Varianten:
- **Vollverlauf** (Standard): Verlauf füllt die ganze Fläche (Event, Statement).
- **Orb**: weißer Grund, ein runder, weicher Blob mittig/rechts, Text klein im Zentrum (Teaser, Profilbild,
  Reel-Cover).
- **Foto + Titel**: Foto vollflächig, Bandname weiß unten rechts, kein Verlauf-Overlay.
- **Landschaft**: Wüstenbild mit warmem Terracotta-Himmel, Mikrotext oben (Stimmung, Claim).

## 5. Typografie

- **Display**: `Anton` (Google Fonts, selbst hosten – DSGVO), Versalien, Zeilenhöhe 0.88–0.95, Laufweite
  −0.01em bis 0. Fallback `Impact, 'Arial Narrow', sans-serif`. (Aktuelle Website nutzt `Barlow Condensed`
  900; gleiche Anmutung, bei Umstellung auf Anton Größen um ~8 % senken.)
- **Text/UI**: `Roboto` 400/500/700. Fakten (Wochentag, Uhrzeit, Ort) in 400, Labels in 400 Versalien mit
  +0.06em Laufweite.
- **Arabisch**: `Noto Naskh Arabic` (oder `Noto Sans Arabic`), 400–600, `--dust-rose`, gestapelt Zeile für
  Zeile, rechtsbündig. Immer `lang="ar" dir="rtl"`.
- Skala (Verhältnis 1.5, Display fluid):

| Stufe | Größe | Nutzung |
|---|---|---|
| Display XL | `clamp(72px, 14vw, 220px)` | Bandname, Hero |
| Display L | `clamp(48px, 9vw, 140px)` | Aussagen („Aus zwei Freunden …“) |
| Display M | `clamp(40px, 6vw, 88px)` | Datum (`29.10`), Zahlen |
| Body L | 20–24 px / 1.4 | Fakten (Donnerstag 18:00 Alma Kiel) |
| Body | 16–18 px / 1.6 | Fließtext |
| Label | 12–14 px, Versalien, +0.06em | Ecklabels (BANDGRÜNDUNG, LIVE) |

- Ausrichtung: Titel linksbündig, Fakten rechtsbündig, nie zentrierter Fließtext. Ausnahme: Orb-Variante.
- Textschatten Display: `0 6px 24px rgba(58,34,41,.28)` (weich, keine Kontur).
- Zahlen im Display-Schnitt, Punkt statt Schrägstrich: `29.10`.

## 6. Layout & Raster

- Formate: Instagram Post 4:5 (1080×1350), Story/Reel 9:16, Website Desktop 1440, Mobil 390.
- Rand: Social 5 % der Breite (54 px bei 1080), Website `clamp(24px, 5vw, 80px)`.
- Event-Post (Referenz „Bandgründung“): Ecklabels oben (links Anlass, rechts „LIVE“), Titel zweizeilig
  darunter, Mitte frei (Gradient atmen lassen), unten links Datum Display M, unten rechts Wochentag / Uhrzeit /
  Ort rechtsbündig, darüber optional arabische Zierzeilen.
- Statement-Post (Referenz „Aus zwei Freunden“): 3–4 Zeilen Display L oben links, Bandname klein oder
  Display M weiß unten rechts, rechtsbündig.
- Foto-Post: Foto 4:5, Bandname weiß unten rechts über ruhigem Bildbereich (Boden/Bühne).
- Abstände: 8-px-Raster; Abschnitte Website 96–160 px vertikal **[ergänzt]**.
- Ecken: 0–2 px für Karten und Bilder (editorial, hart), Pills (999 px) nur für Buttons/Tags.

## 7. Bildsprache

- Fotos: Bühne/Auftritt, natürliche Interaktion (Blickkontakt, Lachen), Cajón und Gitarre sichtbar, warme
  Farbtemperatur, leicht entsättigt, kein Filter-Look. Ausschnitt 4:5, Personen im oberen/mittleren Drittel,
  Platz unten für den Namen.
- Grading **[ergänzt]**: Wärme +, Schatten leicht warm (braun), Highlights cremig; Sättigung −10 %.
- Landschaft/Textur: Wüste, Dünen, Licht, Staub; zeigt „arabischer Takt“ ohne Klischee-Moschee/Kamel.
- Keine Stockfotos von Menschen, keine Clip-Art, keine Instrumenten-Icons als Dekor.
- Videos: kurz, handgehalten, Bühne/Probe, Untertitel in Roboto 500 weiß mit weichem Schatten.

## 8. Komponenten (Website)

**[ergänzt]**, abgeleitet aus Sprache oben.

- **Hero**: Vollverlauf (Hell) oder Dusk-Glow (Dark), Bandname Display XL zweizeilig, Claim Body L,
  CTA „Booking anfragen“ + Textlink „Reinhören“.
- **Button primär**: Fläche `--plum-deep`, Text `--blush`, Radius 999, Höhe 52 px; Hover: Fläche `--orange`.
  Auf dunkel: Fläche `--blush`, Text `--plum-deep`.
- **Button sekundär**: 1.5 px Kontur `--plum`, transparent.
- **Link**: unterstrichen (1 px, Offset 4 px), Hover Farbe `--coral`.
- **Termin-Karte**: Datum Display M links, rechts Wochentag, Uhrzeit, Ort; Trennlinie 1 px
  `rgba(107,74,82,.25)`. Leerer Zustand: ehrlicher Text „Aktuell keine Termine – schreib uns für Booking.“
- **Formular**: Linienfelder (nur Unterstrich), Label Versalien 12 px, Fokus `--coral`, Fehler `#B3261E`
  mit Icon + Text.
- **Medienkarten** (Video/Foto): Bild 4:5 oder 16:9, Play-Button rund 72 px, Glas-Effekt, Beschriftung
  Label-Stil.
- **Audio-Player**: Waveform in `--dust-rose`, abgespielter Teil `--coral`.
- **Nav**: Logo links (Wortmarke), Links Roboto 500 14 px, CTA als Pill rechts; Mobil: Vollbild-Menü mit
  Display L Links.

## 9. Motion **[ergänzt]**

- Hintergrund: Blobs driften langsam (60–90 s, ±8 % Position, leichter Scale), CSS-Animation
  oder Canvas; `prefers-reduced-motion` → statisch.
- Einblenden: Titelzeilen schieben 24 px hoch + Fade, 600 ms `cubic-bezier(.2,.7,.2,1)`, 80 ms Versatz je Zeile.
- Hover: 200 ms, Farbwechsel/Unterstreichung, keine Bounce-Effekte.
- Reels/Stories: Verlauf atmet, Text blendet Zeile für Zeile ein, Beat-Schnitte nur mit Musik.

## 10. Barrierefreiheit & Technik

- WCAG AA: Textkontraste prüfen (Plum auf Orange knapp), Fokus sichtbar (2 px `--plum-deep` + 2 px Offset),
  Zielgrößen ≥ 44 px, `alt` für Fotos (beschreibend), Arabisch mit `lang="ar"`.
- Gradienten statt großer Bilddateien (CSS/SVG), Fotos als WebP/AVIF, Videos komprimiert (Seite < 16 MB).
- Schriften selbst hosten (keine Google-CDN-Aufrufe), `font-display: swap`.
- Sprache UI: Deutsch; Spanisch/Arabisch nur als Akzent mit Übersetzung bei Bedarf.

## 11. Do / Don't

Do
- Bandname riesig, zweizeilig, Versalien.
- Eine warme Verlaufsfläche, eine Ecke fast weiß.
- Pflaumenbraun statt Schwarz, weicher Schatten.
- Echte Fotos, echte Daten.

Don't
- Neon, kalte Blautöne, harte Verlaufskanten, Glitzer, Orient-Klischees.
- Mehr als 2 Schriftfamilien (+ Arabisch), Schmuckschriften.
- Zentrierter Fließtext, kleine Texte auf Orange, Textblöcke über Gesichtern.
- Erfundene Termine, Zitate, Presse-Logos.

## 12. Social-Templates (Kurzspez)

| Template | Format | Aufbau |
|---|---|---|
| Event | 4:5 | Ecklabels, Titel, Datum + Fakten unten, optional Arabisch |
| Statement | 4:5 | Display-L-Aussage oben links, Bandname unten rechts |
| Foto | 4:5 | Foto, Bandname weiß unten rechts |
| Orb / Claim | 4:5 | Weiß, Blob, Mikrotext mittig |
| Story | 9:16 | wie Event, Safe Zone oben/unten 250 px frei |
| Reel-Cover | 9:16 | Orb oder Foto, Titel im mittleren Drittel |

Dateinamen: `JJJJ-MM-TT_HoMa_<Kanal>_<Thema>.png`.

## 13. KI-Briefing (zum Kopieren)

> Gestalte für das Duo **Habibi Hermanos** (spanisch-deutsche Akustikmusik mit arabischem Takt). Stil:
> weicher, unscharfer Mesh-Gradient aus Koralle `#FF5A36`, Orange `#FF8A3D`, Gold `#FDB544` auf Blush
> `#FDE3D6`, eine Ecke fast weiß. Text in Pflaumenbraun `#6B4A52` (nie Schwarz), Display in `Anton`,
> Versalien, eng, mit weichem Schatten; Body in `Roboto`. Bandname „HABIBI / HERMANOS“ zweizeilig, größtes
> Element, oben links. Fakten klein, rechtsbündig unten, Datum groß unten links. Optional arabische
> Zierzeilen in gedämpftem Rosa. Fotos: echt, warm, Bühne. Wenig Elemente, viel Luft, keine Deko,
> keine erfundenen Inhalte. UI-Sprache Deutsch, WCAG AA.

## 14. Offene Fragen an den Owner

- Logo/Wortmarke vorhanden? (Website hat aktuell ein Icon; Verhältnis zur Anton-Wortmarke klären.)
- Website hell (Blush-Verlauf wie Social) oder dunkel (aktuell Ember)? Empfehlung: Hell als Standard,
  Dark Mode wie in Abschnitt 4.
- Korrektheit der arabischen Wörter und Übersetzung freigeben.
- Schrift: Anton selbst hosten (Lizenz OFL) – ok?
