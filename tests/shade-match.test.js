// Feature 002 tests. Each test name starts with the acceptance criterion it proves.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from '../src/server.js';
import { matchShades } from '../src/lib/shadeMatch.js';

let server, base;
before(async () => {
  server = await createServer();
  await new Promise((r) => server.listen(0, r));
  base = `http://localhost:${server.address().port}`;
});
after(() => server.close());

const post = (body) => fetch(`${base}/api/shade-match`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});

test('AC-1: a valid request returns exactly 3 shades, best match first', async () => {
  const res = await post({ depth: 5, undertone: 'warm' });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.matches.length, 3);
  assert.deepEqual(body.matches[0], {
    code: '230', name: '230 Honey Beige', depth: 5, undertone: 'warm',
    productId: 'FDN-001', productName: 'Radiance Skin Foundation',
    score: 0, confidence: 'excellent',
  });
  // 160, 250 and 260 all score 1.5; 250 has the smallest depth gap (BR-SM-3).
  assert.deepEqual(body.matches.map((m) => m.code), ['230', '220', '250']);
  assert.deepEqual(body.matches.map((m) => m.score), [0, 1, 1.5]);
  assert.deepEqual(body.matches.map((m) => m.confidence), ['excellent', 'good', 'fair']);
  assert.equal(body.consultation, false);
});

test('AC-2: at equal depth distance, the shopper\'s undertone ranks first', () => {
  const shades = [
    { code: '910', name: 'Warm', depth: 5, undertone: 'warm' },
    { code: '920', name: 'Neutral', depth: 5, undertone: 'neutral' },
    { code: '930', name: 'Cool', depth: 5, undertone: 'cool' },
  ];
  const { matches } = matchShades({ depth: 5, undertone: 'cool' }, shades);
  assert.deepEqual(matches.map((m) => m.code), ['930', '920', '910']);
  assert.deepEqual(matches.map((m) => m.score), [0, 0.5, 1.5]);
});

test('AC-3: invalid input returns 400 with a message per invalid field', async () => {
  const both = await post({ depth: 14, undertone: 'olive' });
  assert.equal(both.status, 400);
  const body = await both.json();
  assert.equal(body.error, 'Invalid input');
  assert.deepEqual(Object.keys(body.fields).sort(), ['depth', 'undertone']);

  const notANumber = await post({ depth: '5', undertone: 'warm' });
  assert.equal(notANumber.status, 400);
  assert.deepEqual(Object.keys((await notANumber.json()).fields), ['depth']);

  const empty = await post({});
  assert.equal(empty.status, 400);
  assert.deepEqual(Object.keys((await empty.json()).fields).sort(), ['depth', 'undertone']);
});

test('AC-4: when the best match scores above 1.5, consultation is true', () => {
  const shades = [
    { code: '910', name: 'A', depth: 1, undertone: 'cool' },
    { code: '920', name: 'B', depth: 2, undertone: 'cool' },
    { code: '930', name: 'C', depth: 3, undertone: 'cool' },
  ];
  assert.equal(matchShades({ depth: 9, undertone: 'warm' }, shades).consultation, true);
  // Exactly 1.5 is not above the threshold.
  assert.equal(matchShades({ depth: 4.5, undertone: 'cool' }, shades).consultation, false);
  assert.equal(matchShades({ depth: 1, undertone: 'cool' }, shades).consultation, false);
});

test('AC-5: skin inputs are never written to logs or storage', async () => {
  const seen = [];
  const orig = { log: console.log, info: console.info, warn: console.warn, error: console.error, debug: console.debug };
  for (const k of Object.keys(orig)) console[k] = (...a) => seen.push(a.join(' '));
  try {
    await post({ depth: 6.5, undertone: 'neutral' });
    await post({ depth: 14, undertone: 'olive' });
  } finally {
    Object.assign(console, orig);
  }
  assert.deepEqual(seen, []);

  // The feature's server code has no logging or file access at all.
  for (const file of ['../src/lib/shadeMatch.js', '../src/routes/shade-match.js']) {
    const src = await readFile(new URL(file, import.meta.url), 'utf8');
    assert.doesNotMatch(src, /console\.|node:fs|process\.std(out|err)/, file);
  }
});

test('AC-6: /shade-finder.html offers depth and undertone and shows results and the consultation notice', async () => {
  const res = await fetch(`${base}/shade-finder.html`);
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.match(html, /Shade Finder/);
  assert.match(html, /id="depth"/);
  assert.match(html, /name="undertone"/);
  assert.match(html, /id="results"/);
  assert.match(html, /id="consultation"/);
  assert.match(html, /\/api\/shade-match/);
  assert.doesNotMatch(html, /perfect/i);
});
