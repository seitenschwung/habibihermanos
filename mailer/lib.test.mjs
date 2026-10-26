import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readConfig, validate, buildMail, createLimiter } from './lib.mjs';

const env = {
  SMTP_HOST: 'mail.your-server.de', SMTP_PORT: '587', SMTP_USER: 'booking@example.com', SMTP_PASS: 'secret',
  MAIL_FROM: 'booking@example.com', MAIL_TO: 'band@example.com', ALLOWED_ORIGINS: 'https://a.example, https://b.example',
};
const good = { name: 'Lea Müller', email: 'lea@example.de', event: 'Sommerfest Kiel', date: '2027-06-12', message: 'Hallo,\r\nwir feiern 🎉 im Garten.', website: '' };

test('readConfig reads all values', () => {
  const c = readConfig(env);
  assert.equal(c.disabled, false);
  assert.deepEqual(c.smtp, { host: 'mail.your-server.de', port: 587, user: 'booking@example.com', pass: 'secret' });
  assert.equal(c.from, 'booking@example.com');
  assert.equal(c.to, 'band@example.com');
  assert.deepEqual([...c.origins], ['https://a.example', 'https://b.example']);
});

test('readConfig is disabled, not throwing, when SMTP credentials are missing', () => {
  const c = readConfig({ ...env, SMTP_PASS: '' });
  assert.equal(c.disabled, true);
  assert.deepEqual(c.missing, ['SMTP_PASS']);
});

test('readConfig needs no credentials in dry run', () => {
  const c = readConfig({ ...env, SMTP_USER: '', SMTP_PASS: '', MAIL_DRY_RUN: '1' });
  assert.equal(c.disabled, false);
  assert.equal(c.dryRun, true);
});

test('readConfig rejects a recipient that is not one plain address', () => {
  assert.equal(readConfig({ ...env, MAIL_TO: 'a@example.com, b@example.com' }).disabled, true);
});

test('validate accepts a normal German request with CRLF, umlauts and emoji', () => {
  const r = validate(good);
  assert.equal(r.ok, true);
  assert.equal(r.data.name, 'Lea Müller');
  assert.equal(r.data.message, good.message);
});

test('validate trims and allows an empty optional date', () => {
  const r = validate({ ...good, name: '  Lea  ', date: '' });
  assert.equal(r.ok, true);
  assert.equal(r.data.name, 'Lea');
  assert.equal(r.data.date, '');
});

for (const field of ['name', 'email', 'event', 'date']) {
  for (const bad of ['x\r\nBcc: evil@example.com', 'x\nTo: evil@example.com', 'x\u0000y', 'x y', 'x\u007fy']) {
    test(`validate rejects control characters in ${field}: ${JSON.stringify(bad)}`, () => {
      const r = validate({ ...good, [field]: bad });
      assert.deepEqual(r, { ok: false, field });
    });
  }
}

test('validate rejects control characters other than line breaks and tabs in the message', () => {
  assert.deepEqual(validate({ ...good, message: 'a\u0007b' }), { ok: false, field: 'message' });
  assert.equal(validate({ ...good, message: 'a\tb\nc' }).ok, true);
});

for (const email of ['a@b', 'a b@example.com', 'a@example.com, b@example.com', '<a@example.com>', 'a@@example.com', 'a@example.com;b@example.com', '"a"@example.com', `${'a'.repeat(250)}@example.com`]) {
  test(`validate rejects email ${JSON.stringify(email.slice(0, 40))}`, () => {
    assert.deepEqual(validate({ ...good, email }), { ok: false, field: 'email' });
  });
}

for (const [field, max] of [['name', 100], ['event', 200], ['message', 4000]]) {
  test(`validate enforces the ${field} length limit (${max})`, () => {
    assert.equal(validate({ ...good, [field]: 'a'.repeat(max) }).ok, true);
    assert.deepEqual(validate({ ...good, [field]: 'a'.repeat(max + 1) }), { ok: false, field });
  });
}

test('validate requires name, email, event and message', () => {
  for (const field of ['name', 'email', 'event', 'message']) {
    assert.deepEqual(validate({ ...good, [field]: '   ' }), { ok: false, field });
  }
});

test('validate rejects a wrong date format and impossible dates', () => {
  assert.deepEqual(validate({ ...good, date: '12.06.2027' }), { ok: false, field: 'date' });
  assert.deepEqual(validate({ ...good, date: '2027-02-30' }), { ok: false, field: 'date' });
});

test('validate rejects unknown fields and non-string values', () => {
  assert.deepEqual(validate({ ...good, to: 'evil@example.com' }), { ok: false, field: 'to' });
  assert.deepEqual(validate({ ...good, name: ['a'] }), { ok: false, field: 'name' });
  assert.deepEqual(validate({ ...good, website: 1 }), { ok: false, field: 'website' });
  assert.equal(validate(null).ok, false);
  assert.equal(validate([good]).ok, false);
});

test('buildMail only takes reply-to and text from the request', () => {
  const c = readConfig(env);
  const m = buildMail(validate(good).data, c);
  assert.equal(m.from, 'booking@example.com');
  assert.equal(m.to, 'band@example.com');
  assert.equal(m.replyTo, 'lea@example.de');
  assert.equal(m.subject, 'Booking-Anfrage: Sommerfest Kiel');
  assert.equal(m.html, undefined);
  assert.match(m.text, /Name: Lea Müller/);
  assert.match(m.text, /Wunschtermin: 12\.06\.2027/);
  assert.match(m.text, /wir feiern 🎉 im Garten\./);
  assert.deepEqual(Object.keys(m).sort(), ['from', 'replyTo', 'subject', 'text', 'to']);
});

test('limiter allows the limit, then blocks, and frees after the window', () => {
  let t = 0;
  const l = createLimiter({ max: 10, windowMs: 3600_000, now: () => t });
  for (let i = 0; i < 10; i++) assert.equal(l.hit('1.2.3.4'), true);
  assert.equal(l.hit('1.2.3.4'), false);
  assert.equal(l.hit('5.6.7.8'), true);
  t = 3600_001;
  assert.equal(l.hit('1.2.3.4'), true);
});
