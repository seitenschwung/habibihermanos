# Rechtliche Prüfung Impressum und Datenschutz (27.10.2026)

Technische und inhaltliche Prüfung gegen DDG, DSGVO und TDDDG anhand dessen, was die Seite wirklich tut
(Code, nginx, Compose, Mailer). Keine Rechtsberatung; bei Zweifeln Anwalt oder IHK fragen.

## Erledigt (dieser PR)

| Befund | Gewicht | Änderung |
|---|---|---|
| Gmail als Empfänger der Formular-Mails nicht genannt (Empfänger, Drittland: Art. 13 Abs. 1 lit. e, f) | hoch | Google Ireland als Empfänger, mögliche US-Übermittlung, Data Privacy Framework |
| CrowdSec (wertet Logs aus, meldet Angreifer-IPs an CrowdSec SAS, Paris) fehlte | mittel | eigener Absatz mit Rechtsgrundlage |
| Speicherdauer fehlte (Logs, Anfragen; Art. 13 Abs. 2 lit. a) | mittel | Logs: 14 Tage (journald, Host-Einstellung); Anfragen: Löschung nach Erledigung, spätestens 1 Jahr, sonst gesetzliche Fristen |
| Widerspruchsrecht nicht hervorgehoben (Art. 21 Abs. 4) | mittel | eigener, fett markierter Absatz |
| Pflichtangaben im Formular nicht erklärt (Art. 13 Abs. 2 lit. e) | gering | ergänzt |
| Log-Inhalte zu vage | gering | vollständige Liste (IP, Zeit, Datei, Status, Größe, User-Agent, Referrer) |
| Instagram-Link nicht erwähnt | gering | Absatz: nur Link, keine Einbettung |
| sessionStorage des Debug-Panels (§ 25 TDDDG) | gering | erwähnt; nur auf eigenen Aufruf, ohne Übertragung, daher ohne Einwilligung zulässig |
| Kein Hinweis auf die Datenschutzerklärung am Formular | gering | kurzer Hinweis mit Link unter dem Formular |
| Stand-Datum fehlte | gering | „Stand: Oktober 2026“ |

Geprüft und in Ordnung: keine Cookies, keine externen Requests (Schriften, Medien lokal), keine Einbettungen,
HTTPS, Mailer speichert nichts und loggt keine Inhalte, Rate-Limit-IP nur im Speicher (max. 1 h), Aufsichtsbehörde
ULD korrekt, Impressum nach § 5 DDG (nicht mehr TMG). Ein Link zur EU-Streitschlichtungsplattform ist seit deren
Abschaltung (20.07.2025) nicht mehr nötig; ein VSBG-Hinweis ist erst ab mehr als 10 Beschäftigten Pflicht.

## Offen: Entscheidung des Betreibers

1. **Wer ist Anbieter?** Impressum und Datenschutz nennen Philipp Nirnberger. Das stimmt nur, wenn er die Seite
   als eigenes Angebot betreibt. Bieten die Bandmitglieder ihre Auftritte selbst an (Buchungen, Gagen), sind sie
   Diensteanbieter nach § 5 DDG und Verantwortliche nach DSGVO: dann müssen ihre Namen und eine ladungsfähige
   Anschrift (GbR: Name der GbR und vertretungsberechtigte Gesellschafter) ins Impressum, und Philipp wird als
   technischer Dienstleister (Auftragsverarbeiter) geführt, mit einem AV-Vertrag zwischen Band und ihm.
2. **Erledigt 27.10.2026** (`MAIL_TO` und Kontaktadresse = Hetzner-Postfach, Gmail-Absatz entfernt). **Gmail als Postfach.** Ein privates Gmail-Konto hat keinen Auftragsverarbeitungsvertrag; Aufsichtsbehörden
   sehen das für geschäftliche Anfragen kritisch. Der Text beschreibt es jetzt ehrlich, sauberer ist aber:
   `MAIL_TO` in Coolify auf das Hetzner-Postfach `booking.habibihermanos@seitenschwung.com` setzen (die Band liest es
   per App/IMAP) oder Google Workspace mit AV-Vertrag nutzen. Dann den Gmail-Absatz in § 4 anpassen und die
   Kontaktadresse auf der Seite ebenfalls umstellen.
3. **Erledigt 27.10.2026.** **AV-Vertrag mit Hetzner** im Hetzner-Konto (Robot/konsoleH) abschließen bzw. prüfen, dass er auch das
   Webhosting-Paket mit dem Mailpostfach abdeckt. Der Text behauptet, dass er besteht.
4. **Log-Aufbewahrung 14 Tage** (umgesetzt): Container-Logs gehen an journald; auf dem Server muss einmal die
   Aufbewahrung gesetzt werden (README, „Log retention“), **bevor** dieser Stand deployt wird. § 2 nennt 14 Tage.
5. **CrowdSec-Konsole:** Nur wenn die Instanz an der Community-Blocklist teilnimmt (Konsole eingeschrieben),
   werden Signale an CrowdSec übermittelt. Falls nicht, den Satz in § 2 streichen.
