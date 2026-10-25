# Design-Kritik: Habibi Hermanos

Stand: 2026-10-25. Basis: Startseite auf `main` (Screenshots 800 px Breite, Hero, „Hör selbst“, „Über uns“)
und `public/assets/css/style.css`. Ergebnis: Grundlage für den Redesign-Branch `redesign-sunset`.

## Gesamteindruck
Ehrlich und sympathisch, aber blass: Pastell-Blush mit Pflaumentext wirkt wie ein Baukasten-Template,
nicht wie eine Band. Größte Chance: Farbe und Bühne. Ein intensiver Sonnenuntergang statt Pastellnebel
und eine Startseite, die nur Name und Atmosphäre zeigt.

## Usability
| Befund | Schwere | Empfehlung |
|---|---|---|
| Startseite ist eine lange Scrollseite mit 5 gleich gebauten Sektionen; Fotos und Videos liegen weit unten | 🟡 | Startseite = Bühne + Einstiege; Inhalte auf eigene Unterseiten (Musik, Fotos, Über uns, Live, Buchen) |
| Videos öffnen erst im Dialog, Vorschau ist ein kleines Standbild | 🟡 | Videos direkt groß auf der Musikseite abspielbar |
| Hero hat 7 Elemente (Label, Name, Claim, 2 Buttons, arabische Zeile, Video mit Ton-Button) | 🟡 | Auf Name + Einstiege reduzieren |
| Navigation oben ist Standard-Topbar mit Pillen-Button | 🟢 | Eigene, thematische Navigation |

## Visuelle Hierarchie
- **Erster Blick:** Bandname, korrekt, aber er konkurriert mit dem Videokasten rechts.
- **Lesefluss:** Klassisch Z-förmig, jede Sektion „01 —“-Label, Titel, Lead. Vorhersehbar, Template-Gefühl.
- **Betonung:** Farben zu weich (Sättigung niedrig, Pflaume auf Blush), keine Lichtquelle, keine Tiefe.

## Konsistenz
| Element | Problem | Empfehlung |
|---|---|---|
| Buttons | Gefüllte Pille + Ghost-Pille überall, generisch | Ein eigener Button-Typ (Bogen/Arkade) für Navigation |
| Karten | Audio- und Formular-Karte mit Rahmen, Rest ohne | Glasflächen mit innerer Kante, einheitlich |
| Fotos | Gleiche 3er-Reihe, gleiche Seitenverhältnisse | Masonry, wechselnde Größen |

## Barrierefreiheit
- **Kontrast:** Pflaume auf Blush besteht; arabische Zierzeile (`--dust-rose`) und Labels grenzwertig.
- **Touch-Ziele:** Buttons ≥ 44 px, ok.
- **Lesbarkeit:** Fließtext 17 px, gut.

## Was funktioniert
- Anton als Display-Schrift hat Wiedererkennung.
- Echte, ungestellte Fotos und Mitschnitte; ehrliche Texte ohne erfundene Fakten.
- Arabische Zeilen als Kulturbezug.

## Prioritäten
1. **Intensiver Sonnenuntergang als Bühne:** Nacht-Violett → Weinrot → Karmin → Orange → Safran, Sonne am
   Horizont, Silhouette aus Dünen, Kuppel, Minarett/Glockenturm und Palmen (Andalusien trifft Maghreb).
2. **Startseite reduzieren:** nur Bandname und Einstiege; Einstiege als Arkade aus maurischen Bögen,
   die auf dem Horizont stehen.
3. **Unterseiten mit Bewegung:** Musik (Videos + Audio), Fotos (Masonry + Lightbox), Über uns, Live, Buchen;
   gestaffelte Einblendungen, magnetische Buttons, Seitenübergänge; `prefers-reduced-motion` respektieren.
