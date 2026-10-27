// Checks the song list from the CMS before it goes live (CI runs it via `npm test`).
// Covers need the original artist and may not carry an audio sample (publishing a cover recording needs a licence).
import { readFileSync, statSync } from 'node:fs';

const files = ['public/assets/songs.json', 'public/assets/songs.demo.json'];
const known = new Set(['title', 'own', 'artist', 'language', 'note', 'audio']);
const languages = new Set(['Spanisch', 'Arabisch', 'Deutsch', 'Englisch', 'Mehrsprachig', 'Instrumental']);
const MAX_BYTES = 20 * 1024 * 1024;
const errors = [];
const text = (v, max) => v == null || v === '' || (typeof v === 'string' && v.length <= max);

for (const file of files) {
  let songs;
  try {
    songs = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    errors.push(`${file}: kein gültiges JSON (${e.message})`);
    continue;
  }
  if (!Array.isArray(songs)) {
    errors.push(`${file}: muss eine Liste [ … ] sein`);
    continue;
  }
  songs.forEach((s, i) => {
    const at = `${file} Eintrag ${i + 1}`;
    if (!s || typeof s !== 'object' || Array.isArray(s)) return errors.push(`${at}: muss ein Objekt { … } sein`);
    if (typeof s.title !== 'string' || !s.title.trim()) errors.push(`${at}: Titel fehlt`);
    else if (s.title.length > 80) errors.push(`${at}: Titel ist länger als 80 Zeichen`);
    if (s.own != null && typeof s.own !== 'boolean') errors.push(`${at}: "Eigener Song" muss an oder aus sein`);
    if (!text(s.artist, 80)) errors.push(`${at}: "Original von" muss Text bis 80 Zeichen sein`);
    if (!s.own && !(typeof s.artist === 'string' && s.artist.trim())) errors.push(`${at}: Cover ohne "Original von"`);
    if (!languages.has(s.language)) errors.push(`${at}: Sprache "${s.language}" ist keine der Auswahl`);
    if (!text(s.note, 140)) errors.push(`${at}: Notiz muss Text bis 140 Zeichen sein`);
    if (s.audio) {
      let path = '';
      try { path = decodeURI(String(s.audio)); } catch {}
      if (!s.own) errors.push(`${at}: Hörprobe nur bei eigenen Songs`);
      if (!/^\/assets\/media\/[^"'\\<>?#]+\.(mp3|m4a)$/i.test(path) || path.includes('..')) {
        errors.push(`${at}: Hörprobe "${s.audio}" muss eine MP3- oder M4A-Datei unter /assets/media/ sein`);
      } else {
        try {
          if (statSync(`public${path}`).size > MAX_BYTES) errors.push(`${at}: Hörprobe ist größer als 20 MB`);
        } catch {
          errors.push(`${at}: Hörprobe "${s.audio}" fehlt`);
        }
      }
    }
    for (const key of Object.keys(s)) if (!known.has(key)) errors.push(`${at}: unbekanntes Feld "${key}"`);
  });
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Songs OK (${files.join(', ')})`);
