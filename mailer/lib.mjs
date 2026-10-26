// Booking mailer: checks a request from the booking form and turns it into one plain-text mail.
// Security rules live in docs/superpowers/specs/2026-10-27-booking-mailer-design.md; every check here has a test.

// One plain address: no spaces, commas, angle brackets, quotes or second @, so it can never become several recipients.
const EMAIL = /^[^\s@<>,;:"()[\]\\]+@[^\s@<>,;:"()[\]\\]+\.[A-Za-z]{2,}$/;
// Single-line fields must not contain line breaks or other control characters (header injection).
const SINGLE_LINE_BAD = /[\u0000-\u001f\u007f\u0085\u2028\u2029]/;
// The message may contain line breaks and tabs, nothing else from the control range.
const MULTI_LINE_BAD = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

const FIELDS = {
  name: { max: 100, required: true },
  email: { max: 254, required: true },
  event: { max: 200, required: true },
  date: { max: 10, required: false },
  message: { max: 4000, required: true, multiLine: true },
  website: { max: 200, required: false }, // honeypot, must stay empty for people
};

const isEmail = (s) => s.length <= 254 && EMAIL.test(s);

export function readConfig(env) {
  const dryRun = env.MAIL_DRY_RUN === '1';
  const needed = ['MAIL_FROM', 'MAIL_TO', 'ALLOWED_ORIGINS', ...(dryRun ? [] : ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'])];
  const missing = needed.filter((key) => !String(env[key] ?? '').trim());
  if (!missing.length) {
    for (const key of ['MAIL_FROM', 'MAIL_TO']) if (!isEmail(env[key].trim())) missing.push(key);
  }
  return {
    disabled: missing.length > 0,
    missing,
    dryRun,
    smtp: { host: env.SMTP_HOST, port: Number(env.SMTP_PORT), user: env.SMTP_USER, pass: env.SMTP_PASS },
    from: env.MAIL_FROM?.trim(),
    to: env.MAIL_TO?.trim(),
    origins: new Set(String(env.ALLOWED_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean)),
  };
}

export function validate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { ok: false, field: 'body' };
  for (const key of Object.keys(body)) if (!(key in FIELDS)) return { ok: false, field: key };
  const data = {};
  for (const [field, rule] of Object.entries(FIELDS)) {
    const raw = body[field] ?? '';
    if (typeof raw !== 'string') return { ok: false, field };
    const value = raw.trim();
    if (rule.required && !value) return { ok: false, field };
    if (value.length > rule.max) return { ok: false, field };
    if ((rule.multiLine ? MULTI_LINE_BAD : SINGLE_LINE_BAD).test(value)) return { ok: false, field };
    data[field] = value;
  }
  if (!isEmail(data.email)) return { ok: false, field: 'email' };
  if (data.date) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data.date);
    const d = m && new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    if (!m || d.getUTCMonth() !== +m[2] - 1 || d.getUTCDate() !== +m[3]) return { ok: false, field: 'date' };
  }
  return { ok: true, data };
}

export function buildMail(data, config) {
  const date = data.date ? data.date.split('-').reverse().join('.') : 'noch offen';
  return {
    from: config.from,
    to: config.to,
    replyTo: data.email,
    subject: `Booking-Anfrage: ${data.event}`,
    text: [
      'Neue Booking-Anfrage über habibihermanos.de',
      '',
      `Name: ${data.name}`,
      `E-Mail: ${data.email}`,
      `Ort / Veranstaltung: ${data.event}`,
      `Wunschtermin: ${date}`,
      '',
      data.message,
      '',
      '— Mit „Antworten“ geht die Mail direkt an die anfragende Person.',
    ].join('\n'),
  };
}

export function createLimiter({ max, windowMs, now = Date.now }) {
  const hits = new Map();
  return {
    hit(ip) {
      const t = now();
      const recent = (hits.get(ip) ?? []).filter((at) => t - at < windowMs);
      if (recent.length >= max) {
        hits.set(ip, recent);
        return false;
      }
      recent.push(t);
      hits.set(ip, recent);
      if (hits.size > 10_000) for (const [key, list] of hits) if (!list.some((at) => t - at < windowMs)) hits.delete(key);
      return true;
    },
  };
}
