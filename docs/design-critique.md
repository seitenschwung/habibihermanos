# Design-Kritik: Habibi Hermanos (Stand vor Konzept „Cartel“)

Stand: 2026-10-25. Basis: Branch `redesign-sunset` (Commit fdcb5df), Startseite (Verlauf-Hero + Scroll-Reveal-Foto)
und Unterseiten, Desktop 1024 px und Mobil 375 px. Referenzen: adventureson.band, bigthief.net, metallica.com.
Ergebnis fließt in `design-concept-v2.md`.

## Gesamteindruck
Der kräftige Verlauf und das freigelegte Bühnenfoto haben Wirkung. Der Rest ist aber Standard: runde Pillen-Buttons,
eine Zeile Claim, keine Information. Die Seite wirkt wie eine schöne Visitenkarte, nicht wie eine Band mit Programm.
Größte Chance: Typografie und Struktur als Kunstmittel (Plakat), plus echte Information auf der Startseite.

## Usability
| Befund | Schwere | Empfehlung |
|---|---|---|
| Startseite zeigt keinen Termin; das Wichtigste für Fans („wann spielen sie?“) liegt eine Seite tiefer | 🔴 | Nächsten Auftritt aus `termine.json` direkt im Hero zeigen |
| Fünf gleich gewichtete Pillen; „Buchen“ (Ziel für Veranstalter) geht unter | 🟡 | Navigation als nummerierte Tracklist, Buchen als eigener eckiger Primär-Button |
| Unterseiten-Kopf ist eine generische Pillen-Navigation | 🟡 | Gleiche Tracklist-/Tab-Sprache, eckig, mit Nummern |
| Mobil: 5 Buttons füllen den ganzen ersten Screen | 🟢 | Kompakte Tracklist-Zeilen (48 px) statt großer Pillen |

## Visuelle Hierarchie
- **Erster Blick:** Bandname, richtig. Danach nichts Gerichtetes; Claim ist klein und blass.
- **Lesefluss:** Name → Claim → Buttonreihe. Keine zweite Ebene (Termin, Besetzung, Herkunft).
- **Betonung:** Alles hat dasselbe Gewicht außer dem Namen. Referenzen arbeiten mit kleinen, gesperrten Labels
  (Adventureson „BACKGROUND“, Metallica-Buttons), die Ordnung und Haltung geben.

## Konsistenz
| Element | Problem | Empfehlung |
|---|---|---|
| Ecken | Pillen (999 px), Panels 18 px, Fotos 14–16 px, Video 16 px | Durchgängig 0 px |
| Labels | Teils Versalien gesperrt, teils normal | Ein Label-Stil: 12–13 px, 500, Versalien, .16em |
| Bilder | Galerie als gleichförmige Spalten mit Pillen-Label im Bild | Versetzte Collage, Label unter dem Bild |
| Flächen | Halbtransparente runde Panels | Haarlinien und Rahmen statt Kästen |

## Barrierefreiheit
- **Kontrast:** Pflaume `#2a1219` auf Orange/Koralle ≥ 5:1, ok. Weißer Name auf Foto mit Verlauf unten, ok.
- **Touch-Ziele:** ≥ 48 px, ok; neue Tracklist-Zeilen ≥ 52 px halten.
- **Lesbarkeit:** Fließtext 17 px ok; Claim 17–21 px auf Verlauf ok.

## Was funktioniert
- Intensiver Verlauf als eigenständige Bühne, ohne Motive.
- Scroll-Reveal des Bühnenfotos und Abschnitts-Scrollen.
- Anton als Plakatschrift, echte Fotos.

## Prioritäten
1. **Plakat-Hero:** Rahmen mit Eckbeschriftungen, Name einzeilig über die volle Breite, darunter drei Spalten:
   Claim, nächster Auftritt (Ticket), Tracklist-Navigation.
2. **Eckige, gesperrte Buttons und Tracklist** auf allen Seiten.
3. **Collage und Haarlinien** auf den Unterseiten statt runder Panels.
