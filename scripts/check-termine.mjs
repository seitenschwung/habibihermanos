// Checks the gig files before they go live (CI runs it via `npm test`).
// The site shows "keine Termine" when termine.json is broken, so a typo from the CMS or a hand edit must fail here.
import { readFileSync } from 'node:fs';

const files = ['public/assets/termine.json', 'public/assets/termine.demo.json'];
const known = new Set(['date', 'time', 'venue', 'label', 'text', 'tickets']);
const errors = [];

for (const file of files) {
  let gigs;
  try {
    gigs = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    errors.push(`${file}: kein gültiges JSON (${e.message})`);
    continue;
  }
  if (!Array.isArray(gigs)) {
    errors.push(`${file}: muss eine Liste [ … ] sein`);
    continue;
  }
  gigs.forEach((g, i) => {
    const at = `${file} Eintrag ${i + 1}`;
    if (!g || typeof g !== 'object' || Array.isArray(g)) return errors.push(`${at}: muss ein Objekt { … } sein`);
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(g.date ?? '');
    const d = m && new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    if (!m || d.getUTCMonth() !== +m[2] - 1 || d.getUTCDate() !== +m[3]) errors.push(`${at}: Datum "${g.date}" muss JJJJ-MM-TT sein`);
    if (g.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(g.time)) errors.push(`${at}: Uhrzeit "${g.time}" muss HH:MM sein`);
    if (typeof g.venue !== 'string' || !g.venue.trim()) errors.push(`${at}: Ort fehlt`);
    if (g.tickets) {
      let url;
      try { url = new URL(g.tickets); } catch { url = null; }
      if (!url || url.protocol !== 'https:' || /\s/.test(g.tickets)) errors.push(`${at}: Ticket-Link "${g.tickets}" muss eine vollständige https://-Adresse sein`);
    }
    for (const key of ['time', 'label', 'text', 'tickets']) if (g[key] != null && typeof g[key] !== 'string') errors.push(`${at}: ${key} muss Text sein`);
    for (const key of Object.keys(g)) if (!known.has(key)) errors.push(`${at}: unbekanntes Feld "${key}"`);
  });
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Termine OK (${files.join(', ')})`);
