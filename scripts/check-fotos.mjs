// Checks the photo files from the CMS before they go live (CI runs it via `npm test`).
// A missing image or a broken entry would show an empty tile in the gallery, so it must fail here.
import { readFileSync, statSync } from 'node:fs';

const files = ['public/assets/fotos.json', 'public/assets/fotos.demo.json'];
const known = new Set(['image', 'title', 'date', 'text']);
const MAX_BYTES = 15 * 1024 * 1024;
const errors = [];

for (const file of files) {
  let photos;
  try {
    photos = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    errors.push(`${file}: kein gültiges JSON (${e.message})`);
    continue;
  }
  if (!Array.isArray(photos)) {
    errors.push(`${file}: muss eine Liste [ … ] sein`);
    continue;
  }
  photos.forEach((p, i) => {
    const at = `${file} Eintrag ${i + 1}`;
    if (!p || typeof p !== 'object' || Array.isArray(p)) return errors.push(`${at}: muss ein Objekt { … } sein`);
    const image = typeof p.image === 'string' ? p.image : '';
    // Phone file names may contain spaces or umlauts (Pages CMS may store them %-encoded); quotes and ".." may not.
    let path = '';
    try { path = decodeURI(image); } catch {}
    if (!/^\/assets\/images\/[^"'\\<>?#]+\.(jpe?g|png|webp)$/i.test(path) || path.includes('..')) {
      errors.push(`${at}: Bild "${p.image}" muss eine JPG-, PNG- oder WebP-Datei unter /assets/images/ sein`);
    } else {
      try {
        const size = statSync(`public${path}`).size;
        if (size > MAX_BYTES) errors.push(`${at}: Bild "${image}" ist größer als 15 MB`);
      } catch {
        errors.push(`${at}: Bild "${image}" fehlt`);
      }
    }
    if (typeof p.title !== 'string' || !p.title.trim()) errors.push(`${at}: Titel fehlt`);
    else if (p.title.length > 80) errors.push(`${at}: Titel ist länger als 80 Zeichen`);
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(p.date ?? '');
    const d = m && new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    if (!m || d.getUTCMonth() !== +m[2] - 1 || d.getUTCDate() !== +m[3]) errors.push(`${at}: Datum "${p.date}" muss JJJJ-MM-TT sein`);
    if (p.text != null && typeof p.text !== 'string') errors.push(`${at}: Beschreibung muss Text sein`);
    else if (p.text && p.text.length > 400) errors.push(`${at}: Beschreibung ist länger als 400 Zeichen`);
    for (const key of Object.keys(p)) if (!known.has(key)) errors.push(`${at}: unbekanntes Feld "${key}"`);
  });
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Fotos OK (${files.join(', ')})`);
