// Feature 002 tests. Each test name starts with the acceptance criterion it proves.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
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

test('AC-1: valid input returns exactly 3 shades, best match first', async () => {
  const res = await post({ depth: 5, undertone: 'warm' });
  assert.equal(res.status, 200);
  const { matches } = await res.json();
  assert.equal(matches.length, 3);
  assert.equal(matches[0].code, '230');
  for (let i = 1; i < matches.length; i++) assert.ok(matches[i - 1].score <= matches[i].score);
});

test('AC-2: at equal depth distance, the matching undertone ranks higher', () => {
  const shades = [
    { code: 'A', name: 'A', depth: 5, undertone: 'warm' },
    { code: 'B', name: 'B', depth: 5, undertone: 'cool' },
    { code: 'C', name: 'C', depth: 5, undertone: 'neutral' },
  ];
  const { matches } = matchShades({ depth: 5, undertone: 'cool' }, shades);
  assert.deepEqual(matches.map((m) => m.code), ['B', 'C', 'A']);
});

test('AC-3: invalid input returns 400 with a message per field', async () => {
  const res = await post({ depth: 14, undertone: 'olive' });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.ok(body.fields.depth);
  assert.ok(body.fields.undertone);
});

test('AC-4: when the best score is above 1.5, consultation is true', () => {
  const shades = [
    { code: 'X', name: 'X', depth: 1, undertone: 'cool' },
    { code: 'Y', name: 'Y', depth: 2, undertone: 'cool' },
    { code: 'Z', name: 'Z', depth: 3, undertone: 'cool' },
  ];
  assert.equal(matchShades({ depth: 9, undertone: 'warm' }, shades).consultation, true);
  assert.equal(matchShades({ depth: 1, undertone: 'cool' }, shades).consultation, false);
});

test('AC-5: skin inputs are never written to the console', async () => {
  const seen = [];
  const orig = { log: console.log, info: console.info, warn: console.warn, error: console.error };
  for (const k of Object.keys(orig)) console[k] = (...a) => seen.push(a.join(' '));
  try {
    await post({ depth: 6.5, undertone: 'neutral' });
  } finally {
    Object.assign(console, orig);
  }
  assert.ok(!seen.some((l) => l.includes('6.5') || l.includes('neutral')));
});

test('AC-6: the Shade Finder page is served', async () => {
  const res = await fetch(`${base}/shade-finder.html`);
  assert.equal(res.status, 200);
  assert.match(await res.text(), /Shade Finder/);
});
