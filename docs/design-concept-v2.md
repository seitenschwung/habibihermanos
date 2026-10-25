# Habibi Hermanos – Konzept „Cartel“ (Website v2)

Stand: 2026-10-25. Baut auf `design-concept.md` (Marke, Farben) auf und ersetzt dessen Website-Teil.

## Idee
Die Website ist ein **Konzertplakat** („cartel“ wie bei spanischen Fiesta- und Konzertplakaten): ein gerahmtes,
typografisches Plakat auf dem intensiven Sonnenuntergangs-Verlauf. Darunter wird beim Scrollen das Bühnenfoto
freigelegt. Alles ist eckig, mit Haarlinien gegliedert, die Navigation ist eine **Tracklist**.

## Inspiration (übernommen, nicht kopiert)
| Quelle | Was wir übernehmen |
|---|---|
| metallica.com | Eckige Buttons mit Rahmen und gesperrten Versalien; Bühnenbild bildschirmfüllend |
| bigthief.net | Ruhe: ein Foto, ein Name, wenig Elemente, viel Fläche |
| adventureson.band | Kleine gesperrte Labels („BACKGROUND“), versetzte Bild-Collage, Text in schmaler Spalte |

## Regeln
1. **Eckig.** Kein `border-radius` außer 0. Buttons = Rahmen 1.5 px, Versalien, Sperrung .14em.
2. **Plakatrahmen.** Hero und Unterseiten-Kopf sitzen in einem 1-px-Rahmen mit Eckbeschriftungen (Ort, Besetzung).
3. **Tracklist statt Menü.** Navigation als nummerierte Zeilen `01 Musik & Videos →`, Haarlinie dazwischen;
   Hover füllt die Zeile dunkel.
4. **Informativ.** Startseite zeigt den nächsten Auftritt aus `termine.json` als Ticket-Zeile.
5. **Typo.** Anton riesig für Namen/Titel; Roboto 500 klein, Versalien, gesperrt für Labels; Fließtext ruhig.
6. **Farbe.** Verlauf bleibt die Bühne; Text Pflaume `#2a1219`, auf Foto Weiß. Keine weiteren Motive.
7. **Bilder.** Eckig, Collage mit versetzten Höhen, Bildunterschrift als kleines Label darunter.
8. **Bewegung.** Nur Scroll-Reveal des Fotos, Abschnitts-Scrollen und kurze Hover-Übergänge.
