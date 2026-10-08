// Feature 006 tests. Each test name starts with the acceptance criterion it proves.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from '../src/server.js';
import { applyBundles, savingFor } from '../src/lib/bundles.js';

let server, base;
before(async () => {
  server = await createServer();
  await new Promise((r) => server.listen(0, r));
  base = `http://localhost:${server.address().port}`;
});
after(() => server.close());

const text = async (path) => (await fetch(`${base}${path}`)).text();
const price = async (quantities) => {
  const items = Object.entries(quantities).map(([productId, quantity]) => ({ productId, quantity }));
  const res = await fetch(`${base}/api/cart/price`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }),
  });
  assert.equal(res.status, 200);
  return res.json();
};
const ids = (bundle) => bundle.items.map((i) => i.productId);

test('AC-1: GET /api/bundles lists both bundles with name, categories, and percentage', async () => {
  const res = await fetch(`${base}/api/bundles`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { bundles: [
    { id: 'complete-look', name: 'Complete Look', categories: ['foundation', 'mascara', 'lipstick'], percentOff: 15 },
    { id: 'glow-duo', name: 'Glow Duo', categories: ['foundation', 'serum'], percentOff: 10 },
  ] });
});

test('AC-2: foundation, mascara and lipstick get the Complete Look, 15% off those three', async () => {
  const body = await price({ 'FDN-001': 1, 'MSC-001': 1, 'LIP-001': 1 });
  assert.equal(body.subtotalCents, 9200);
  assert.equal(body.bundles.length, 1);
  assert.equal(body.bundles[0].name, 'Complete Look');
  assert.deepEqual(ids(body.bundles[0]), ['FDN-001', 'MSC-001', 'LIP-001']);
  assert.equal(body.bundles[0].savingCents, 1380);
  assert.equal(body.savingsCents, 1380);
  assert.equal(body.totalCents, 7820);
});

test('AC-3: foundation and serum get the Glow Duo, 10% off those two', async () => {
  const body = await price({ 'FDN-001': 1, 'SRM-001': 1 });
  assert.equal(body.bundles.length, 1);
  assert.equal(body.bundles[0].name, 'Glow Duo');
  assert.equal(body.bundles[0].savingCents, 800);
  assert.equal(body.totalCents, 8000 - 800);
});

test('AC-4: a unit is in at most one bundle, Complete Look forms first, and the highest priced unit is used first', async () => {
  // One foundation: the Complete Look takes it, so no Glow Duo despite two serums.
  const one = await price({ 'FDN-001': 1, 'MSC-001': 1, 'LIP-001': 1, 'SRM-001': 1, 'SRM-002': 1 });
  assert.deepEqual(one.bundles.map((b) => b.id), ['complete-look']);
  assert.equal(one.savingsCents, 1380);

  // Two foundations: the second pairs with the dearer serum.
  const two = await price({ 'FDN-001': 2, 'MSC-001': 1, 'LIP-001': 1, 'SRM-001': 1, 'SRM-002': 1 });
  assert.deepEqual(two.bundles.map((b) => b.id), ['complete-look', 'glow-duo']);
  assert.deepEqual(ids(two.bundles[1]), ['FDN-001', 'SRM-002']);
  assert.equal(two.bundles[1].savingCents, 960);
  assert.equal(two.totalCents, two.subtotalCents - 1380 - 960);

  // Two full sets form two Complete Looks.
  const twice = await price({ 'FDN-001': 2, 'MSC-001': 2, 'LIP-001': 2 });
  assert.deepEqual(twice.bundles.map((b) => b.id), ['complete-look', 'complete-look']);
});

test('AC-5: a saving is rounded to the nearest cent, half up', () => {
  assert.equal(savingFor(999, 15), 150);   // 149.85
  assert.equal(savingFor(990, 15), 149);   // 148.5 rounds up
  assert.equal(savingFor(983, 10), 98);    // 98.3
  assert.equal(savingFor(985, 10), 99);    // 98.5 rounds up
  const lines = [
    { productId: 'A', name: 'A', category: 'foundation', unitPriceCents: 333, quantity: 1 },
    { productId: 'B', name: 'B', category: 'mascara', unitPriceCents: 333, quantity: 1 },
    { productId: 'C', name: 'C', category: 'lipstick', unitPriceCents: 333, quantity: 1 },
  ];
  assert.equal(applyBundles(lines).savingsCents, 150);
});

test('AC-6: a bag with no bundle has no savings and a total equal to its subtotal', async () => {
  const body = await price({ 'LIP-001': 3 });
  assert.deepEqual(body.bundles, []);
  assert.deepEqual(body.suggestions, []);
  assert.equal(body.savingsCents, 0);
  assert.equal(body.totalCents, body.subtotalCents);
  assert.equal(body.totalCents, 7200);
  assert.deepEqual(body.lines, [
    { productId: 'LIP-001', name: 'Velvet Matte Lipstick', category: 'lipstick', unitPriceCents: 2400, quantity: 3, lineTotalCents: 7200 },
  ]);
});

test('AC-7: a bundle is suggested only when leftover units cover all but one of its categories', async () => {
  const missing = (body) => body.suggestions.map((s) => `${s.bundleId}:${s.missingCategory}`);
  // Foundation alone: one short of a Glow Duo, two short of a Complete Look.
  assert.deepEqual(missing(await price({ 'FDN-001': 1 })), ['glow-duo:serum']);
  // Foundation and lipstick: one short of each.
  const both = await price({ 'FDN-001': 1, 'LIP-001': 1 });
  assert.deepEqual(missing(both), ['complete-look:mascara', 'glow-duo:serum']);
  assert.deepEqual(both.suggestions[0], { bundleId: 'complete-look', name: 'Complete Look', percentOff: 15, missingCategory: 'mascara' });
  // A serum alone is one foundation short of a Glow Duo.
  assert.deepEqual(missing(await price({ 'SRM-001': 1 })), ['glow-duo:foundation']);
  // A complete set with nothing left over: nothing to suggest.
  assert.deepEqual(missing(await price({ 'FDN-001': 1, 'MSC-001': 1, 'LIP-001': 1 })), []);
});

test('AC-8: the bag page shows savings and suggestions, and the front screen shows the bundles', async () => {
  const bag = await text('/cart.html');
  assert.match(bag, /id="savings"/);
  assert.match(bag, /id="suggestions"/);
  assert.match(bag, /priced\.bundles\.map/);
  assert.match(bag, /priced\.suggestions\.map/);
  assert.match(bag, /a\.href = '\/#collection'/);
  const home = await text('/');
  assert.match(home, /id="bundles"/);
  assert.match(home, /fetch\('\/api\/bundles'\)/);
  assert.match(home, /id="collection"/);
});

test('AC-9: bundle code neither logs nor stores a bag', async () => {
  const seen = [];
  const orig = { log: console.log, info: console.info, warn: console.warn, error: console.error, debug: console.debug };
  for (const k of Object.keys(orig)) console[k] = (...a) => seen.push(a.join(' '));
  try {
    await price({ 'FDN-001': 1, 'MSC-001': 1, 'LIP-001': 1 });
    await fetch(`${base}/api/bundles`);
  } finally {
    Object.assign(console, orig);
  }
  assert.deepEqual(seen, []);
  for (const file of ['../src/lib/bundles.js', '../src/routes/bundles.js']) {
    const src = await readFile(new URL(file, import.meta.url), 'utf8');
    assert.doesNotMatch(src, /console\.|node:fs|process\.std(out|err)/, file);
  }
});
