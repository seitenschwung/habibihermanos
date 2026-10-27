# Verzeichnis von Verarbeitungstätigkeiten (Art. 30 Abs. 1 DSGVO)

Website habibihermanos.de (Habibi Hermanos). Stand: 27.10.2026. Grundlage sind die Datenschutzerklärung
(`public/datenschutz.html`) und der tatsächliche Betrieb (nginx, Mailer, Compose). Bei jeder Änderung an Seite,
Hosting oder Mail-Empfänger prüfen und das Datum oben anpassen. Kein Ersatz für Rechtsberatung.

Hinweis: Das Repository ist öffentlich. Dieses Verzeichnis enthält nur, was die Datenschutzerklärung ohnehin nennt;
interne Details (Zugangsdaten, Server-Zugänge) gehören nicht hierher.

## Verantwortlicher

Philipp Nirnberger, Wühren 35, 24794 Bünsdorf, booking.habibihermanos@seitenschwung.com.
Ein Datenschutzbeauftragter ist nicht benannt (nicht erforderlich: weniger als 20 Personen verarbeiten regelmäßig
personenbezogene Daten, keine Kerntätigkeit nach Art. 37 DSGVO).

Offen: Bieten die Bandmitglieder ihre Auftritte selbst an, sind sie (mit) Verantwortliche; dann dieses Verzeichnis
und Impressum/Datenschutz anpassen (siehe `docs/legal-review-2026-10-27.md`, Punkt 1).

## Auftragsverarbeiter und Empfänger

| Wer | Wofür | Sitz | Vertrag |
|---|---|---|---|
| Hetzner Online GmbH | Server (Website, Mailer, Logs), Webhosting mit Mailpostfach `booking.habibihermanos@seitenschwung.com` (SMTP-Versand) | Gunzenhausen, DE | AV-Vertrag nach Art. 28 DSGVO, abgeschlossen am 27.10.2026 (PDF beim Verantwortlichen); läuft das Webhosting unter einer anderen Kundennummer, dort ebenfalls abschließen |
| CrowdSec SAS | Empfänger der IP-Adressen erkannter Angreifer (gemeinsame Sperrliste) | Paris, FR | Eigenverantwortlicher Empfänger, kein AV-Vertrag nötig |
| GitHub Inc. | Quellcode, CI, Inhaltspflege über Pages CMS; keine Besucherdaten | USA | Nutzungsbedingungen; nur Daten der Bandmitglieder (siehe 5) |

## Verarbeitungstätigkeiten

### 1. Bereitstellung der Website und Server-Logs

- **Zweck:** Auslieferung der Seite, Fehlersuche, Erkennen von Angriffen.
- **Betroffene:** Besucher der Website.
- **Daten:** IP-Adresse, Datum und Uhrzeit, aufgerufene Datei, Statuscode, Datenmenge, User-Agent, Referrer.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO (sicherer, stabiler Betrieb).
- **Empfänger:** Hetzner (Hosting).
- **Drittland:** nein.
- **Löschfrist:** 14 Tage (journald auf dem Server, `MaxRetentionSec=14day`, siehe README „Log retention“).

### 2. Schutz vor Angriffen (CrowdSec)

- **Zweck:** Erkennen und vorübergehendes Sperren von Angreifern.
- **Betroffene:** Besucher, deren Verhalten als Angriff erkannt wird.
- **Daten:** IP-Adresse, Art und Zeitpunkt des Angriffs (aus den Logs von 1).
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO.
- **Empfänger:** CrowdSec SAS (nur erkannte Angreifer, keine gewöhnlichen Besuche).
- **Drittland:** nein.
- **Löschfrist:** lokale Sperren laufen automatisch ab; Logs wie 1.

### 3. Buchungsanfragen (Formular und direkte E-Mail)

- **Zweck:** Beantworten von Anfragen, Abstimmen von Auftritten.
- **Betroffene:** Anfragende (Veranstalter, Privatpersonen).
- **Daten:** Name, E-Mail-Adresse, Ort bzw. Veranstaltung, Wunschtermin, Nachricht; bei Auftrag zusätzlich
  Vertrags- und Rechnungsdaten.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung); ohne Auftrittsbezug lit. f; Rechnungen
  lit. c (gesetzliche Aufbewahrung).
- **Empfänger:** Hetzner (Versand und Postfach booking.habibihermanos@seitenschwung.com).
- **Drittland:** nein. Das Postfach mit einer normalen Mail-App (IMAP) lesen, nicht in Gmail importieren.
- **Löschfrist:** nach Erledigung ohne Auftrag, spätestens nach 1 Jahr (Postfach einmal im Jahr aufräumen);
  bei Auftrag gesetzliche Fristen (bis 10 Jahre für steuerlich relevante Unterlagen).
- **Missbrauchsschutz:** IP-Adresse höchstens 1 Stunde im Arbeitsspeicher (Rate-Limit), nicht gespeichert;
  der Mailer speichert und loggt keine Inhalte.

### 4. Darstellung der Band (Namen, Fotos, Videos, Tonaufnahmen)

- **Zweck:** Vorstellung der Band auf der Website.
- **Betroffene:** Bandmitglieder; ggf. weitere erkennbare Personen auf Fotos und Videos (Publikum, Freunde).
- **Daten:** Namen (Impressum), Fotos, Videos, Audioaufnahmen.
- **Rechtsgrundlage:** Einwilligung der Bandmitglieder (Art. 6 Abs. 1 lit. a DSGVO, § 22 KUG); erkennbare
  Dritte nur mit Einwilligung oder als Beiwerk bzw. Versammlung (§ 23 KUG).
- **Empfänger:** Besucher der Website (öffentlich), Hetzner (Hosting).
- **Drittland:** nein.
- **Löschfrist:** bis zum Widerruf der Einwilligung bzw. Ende der Zusammenarbeit; dann von der Seite nehmen.
- **Hinweis:** Einwilligungen am besten kurz schriftlich festhalten (E-Mail oder Chat genügt).

### 5. Inhaltspflege über Pages CMS

- **Zweck:** Bandmitglieder pflegen Termine, Fotos und Songs.
- **Betroffene:** Bandmitglieder mit Zugang.
- **Daten:** GitHub-Konto (Benutzername, ggf. E-Mail-Adresse) in der öffentlichen Versionsgeschichte des Repositorys.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. f DSGVO bzw. Einwilligung der Bandmitglieder.
- **Empfänger:** GitHub (öffentlich einsehbar), Pages CMS.
- **Drittland:** USA (GitHub, Data Privacy Framework).
- **Löschfrist:** Versionsgeschichte bleibt bestehen; Bandmitglieder können in GitHub eine private
  `noreply`-Adresse einstellen.

## Technische und organisatorische Maßnahmen (Art. 32 DSGVO)

- Verschlüsselung: HTTPS für alle Aufrufe; Mailversand per SMTP mit Verschlüsselung (Port 587).
- Datensparsamkeit: keine Cookies, kein Tracking, keine externen Einbindungen; Mailer ohne Speicherung;
  Uploads ohne Metadaten (GPS) und verkleinert.
- Server: Container ohne Root-Rechte, schreibgeschütztes Dateisystem, minimale Berechtigungen; CrowdSec;
  Rate-Limit und Spam-Schutz am Formular.
- Zugriff: Verwaltung (Coolify) nur über das private Netz (Tailscale); Deploy nur über geprüfte CI.
- Löschung: Logs automatisch nach 14 Tagen; Anfragen jährlich aufräumen.
- Datenpannen: innerhalb von 72 Stunden an das ULD Schleswig-Holstein melden (Art. 33 DSGVO).
- Auskunftsanfragen: innerhalb eines Monats beantworten (Art. 12 Abs. 3 DSGVO).
