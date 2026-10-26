# Buchungsformular verschickt echte E-Mails (Mail-Dienst über Hetzner SMTP)

Stand: 2026-10-27. Vom Owner bestätigt: Ansatz „zweiter Container“, eigenes Postfach, Sicherheit hat Vorrang.

## Ziel
Das Formular auf `buchen.html` schickt Anfragen selbst als E-Mail an die Band, statt nur einen Mail-Entwurf im
Mailprogramm des Besuchers zu öffnen. Erfolgskriterium: Eine Anfrage kommt als Mail bei `aemsez08@gmail.com` an,
„Antworten“ geht an den Besucher, ohne dass der Besucher ein Mailprogramm braucht.

## Rahmen
- Ein Docker-Image, gebaut und getestet von der gemeinsamen Pipeline (`pipeline.yml`, nicht änderbar): Port 8080,
  `/healthz`, `/version.txt`, kein root, schreibgeschütztes Dateisystem, nur `/tmp` beschreibbar.
- Coolify startet `docker-compose.yml`; der Dienst `web` (nginx) behält CrowdSec-Labels und Cache-Regeln.
- Keine Anfragen der Website an fremde Dienste. Das SMTP-Passwort steht nie im Repo.

## Aufbau
- **Image:** wie bisher `nginxinc/nginx-unprivileged`, zusätzlich Node.js (`apk add nodejs`) und `mailer/`
  (`server.mjs`, Logik in `mailer/lib.mjs`, Abhängigkeit nur `nodemailer`, exakt gepinnt, ohne eigene Abhängigkeiten).
  Die Abhängigkeiten kommen aus einer Build-Stufe (`npm ci --omit=dev`), nicht aus dem Repo.
- **Compose:** zweiter Dienst `mailer` aus demselben `${IMAGE}`, Befehl `node /app/mailer/server.mjs`, Port 3000 nur
  im internen Netz (kein `ports`, keine Domain in Coolify). Gleiche Härtung wie `web`: `read_only`, `cap_drop: ALL`,
  `no-new-privileges`, Benutzer 101, `mem_limit: 128m`, `pids_limit: 50`, Healthcheck auf `/healthz` (Port 3000).
- **nginx:** nur `location = /api/anfrage` geht an `http://mailer:3000` (Auflösung zur Laufzeit über den Docker-DNS,
  damit nginx auch ohne `mailer` startet, z. B. im CI-Test). Nur `POST`, Körper höchstens 16 KB, Anfrage-Limit
  `limit_req` 5/min pro IP (Burst 3), kurze Timeouts. Alle anderen Pfade unverändert.
- **Konfiguration (Coolify-Variablen):** `SMTP_HOST=mail.your-server.de`, `SMTP_PORT=587`,
  `SMTP_USER=booking.habibihermanos@seitenschwung.com`, `SMTP_PASS` (Secret), `MAIL_FROM=booking.habibihermanos@seitenschwung.com`,
  `MAIL_TO=aemsez08@gmail.com`, `ALLOWED_ORIGINS=https://habibihermanos.de,https://www.habibihermanos.de,https://habibi.seitenschwung.com,https://www.habibi.seitenschwung.com`.
  Fehlt eine Pflichtvariable, startet `mailer` nicht (klarer Fehler im Log).

## Ablauf
1. `site.js` sendet beim Absenden `POST /api/anfrage` mit JSON `{name, email, event, date, message, website}`
   (`website` = unsichtbares Fangfeld), `Content-Type: application/json`. Knopf gesperrt, Status „Wird gesendet …“.
2. `mailer` prüft und verschickt eine **reine Text-Mail**: Von `MAIL_FROM`, an `MAIL_TO`, `Reply-To` = Besucher,
   Betreff `Booking-Anfrage: <Ort>`, Text wie die bisherige Mail-Vorlage.
3. Antwort `{"ok":true}` → Status „Danke! Deine Anfrage ist angekommen. Wir melden uns per E-Mail.“, Formular leer.
4. Fehler: 400 (ungültige Eingabe, Text nennt das Feld), 403 (fremde Herkunft), 413 (zu groß), 415 (falscher Typ),
   429 (zu viele), 502/503 (Versand nicht möglich). Bei Netzwerk-/5xx-Fehlern zeigt die Seite „Gerade klappt der
   Versand nicht. Schreib uns direkt an aemsez08@gmail.com“ mit `mailto`-Link; „Als Text kopieren“ bleibt.

## Sicherheit
Jeder Punkt hat einen automatischen Test (`mailer/*.test.mjs`, läuft über `npm test`).

| Risiko | Gegenmaßnahme |
|---|---|
| Header-Injection (Zeilenumbrüche in Name, Ort, E-Mail → neue Header/Empfänger) | Einzeilige Felder (`name`, `email`, `event`, `date`) werden abgelehnt, wenn sie `\r`, `\n` oder andere Steuerzeichen enthalten. Betreff nur aus geprüftem `event`; Nodemailer kodiert Header zusätzlich. |
| Offenes Mail-Relay (Empfänger oder Absender aus der Anfrage) | `to` und `from` kommen ausschließlich aus Variablen; die Anfrage kann nur `Reply-To` (geprüfte Einzeladresse) und Text bestimmen. Unbekannte JSON-Felder werden abgelehnt. |
| Mehrere/manipulierte Adressen in `Reply-To` | Strenge Einzeladresse: `^[^\s@<>,;:"()\[\]\\]+@[^\s@<>,;:"()\[\]\\]+\.[A-Za-z]{2,}$`, max. 254 Zeichen. |
| HTML-/Skript-Injection in der Mail | Nur `text/plain`, kein HTML-Teil. |
| XSS auf der Website | Antworten enthalten keine Eingaben; `site.js` setzt Texte nur über `textContent`. |
| Spam / Missbrauch | Fangfeld (gefüllt → 200 ohne Versand), nginx-Limit 5/min/IP, zusätzlich Limit im Dienst (10/Stunde/IP, Speicher), Längengrenzen (Name 100, Ort 200, Datum 10, Nachricht 4000). |
| Fremde Seiten lassen Besucher Formulare an uns schicken (CSRF/Spam über Browser) | `Origin` muss in `ALLOWED_ORIGINS` stehen, sonst 403. Keine CORS-Header (Browser blockt fremde Antworten). Nur `application/json` (kein einfaches Formular-POST von außen). |
| Speicher-/Zeit-DoS | Körper max. 16 KB (nginx und Dienst), Lesezeit max. 10 s, SMTP-Timeouts (Verbindung 10 s, gesamt 20 s), höchstens 2 Sendungen parallel, danach 503. |
| SMTP abhören / falscher Server | Port 587 mit Pflicht-STARTTLS (`requireTLS`), Zertifikat wird geprüft. |
| Zugangsdaten in Logs/Antworten | Nur Variablen; Logs enthalten nie Formularinhalt, Adressen oder SMTP-Fehlertexte mit Zugangsdaten, nur „gesendet“/„Fehler (Code)“. Antworten nennen keine internen Details. |
| Dienst von außen direkt erreichbar | `mailer` hat keinen veröffentlichten Port und keine Domain; erreichbar nur über nginx im internen Netz. |
| Ausbruch / Rechte im Container | Wie `web`: kein root, keine Capabilities, schreibgeschützt, `no-new-privileges`, Ressourcenlimits. |
| Lieferkette | Eine Abhängigkeit (`nodemailer`, selbst ohne Abhängigkeiten), exakte Version im Lockfile, `npm ci`. |
| Falsche IP für Limits (Proxy) | nginx setzt `X-Real-IP` aus der echten Client-IP (Coolify/Traefik `X-Forwarded-For`, letzter vertrauenswürdiger Wert über `real_ip_header`); der Dienst vertraut nur diesem Header. |

## Datenschutz
Abschnitt „4. Buchungsanfrage“ in `datenschutz.html` wird neu formuliert (Entwurf, rechtliche Prüfung durch den Owner):
Angaben aus dem Formular werden zur Bearbeitung der Anfrage über den Server bei Hetzner (Deutschland) per E-Mail an
die Band übermittelt, nicht auf der Website gespeichert; Rechtsgrundlage Art. 6 Abs. 1 lit. b DSGVO (Anbahnung eines
Vertrags); Speicherung im Postfach nur solange für die Anfrage nötig.

## Nicht enthalten
Bestätigungsmail an den Besucher, Datenbank/Speicherung, Captcha, Dateianhänge.

## Prüfung
- `npm test`: Gig-Prüfung wie bisher plus Tests für Validierung, Injection-Fälle, Herkunft, Limits und Mail-Aufbau
  (mit Nodemailers `jsonTransport`, kein Versand).
- Lokal mit Docker: Image bauen, `web` + `mailer` mit Test-SMTP (`jsonTransport` per `MAIL_DRY_RUN=1`) starten,
  Formular im Browser absenden, Fehlerfälle per `curl` (fremde Origin, Injection, zu groß, Limit).
- CI: bestehender Container-Test (nur `web`) muss grün bleiben.
- Nach dem Deploy: erste echte Anfrage durch den Owner.
