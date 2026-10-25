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

## Umsetzung (nach Feedback)
Erster Entwurf mit Sonne, Skyline und Bogen-Buttons war dem Owner zu viel. Umgesetzt ist die schlichte Variante:
1. **Intensiver Verlauf als einziger Hintergrund:** Rose → Koralle → Orange → Bernstein → Gold, ohne weitere Motive.
2. **Startseite reduziert:** nur Bandname, eine Zeile Claim und einfache Pillen-Buttons zu den Unterseiten.
3. **Unterseiten:** Musik (Videos + Audio), Fotos (Galerie + Lightbox), Über uns, Live, Buchen; schlichte Kopfzeile, keine Effekte.
