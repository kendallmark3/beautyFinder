// Feature 005 tests. Each test name starts with the acceptance criterion it proves.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from '../src/server.js';
import { BAG_KEY, addItem, countItems, formatMoney, lineKey, loadBag, pricingRequest, removeLine, saveBag, setQuantity } from '../public/cart.js';

let server, base;
before(async () => {
  server = await createServer();
  await new Promise((r) => server.listen(0, r));
  base = `http://localhost:${server.address().port}`;
});
after(() => server.close());

const text = async (path) => (await fetch(`${base}${path}`)).text();
const price = (body) => fetch(`${base}/api/cart/price`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});
const honey = { productId: 'FDN-001', name: 'Radiance Skin Foundation', shadeCode: '230', shadeName: '230 Honey Beige', depth: 5, undertone: 'warm' };
const ivory = { ...honey, shadeCode: '120', shadeName: '120 Ivory', depth: 1.5, undertone: 'neutral' };
const lipstick = { productId: 'LIP-001', name: 'Velvet Matte Lipstick' };

function fakeStorage() {
  const data = new Map();
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, v) };
}

test('AC-1: every product has a priceCents that is a positive whole number', async () => {
  const { products } = await (await fetch(`${base}/api/products`)).json();
  assert.equal(products.length, 5);
  for (const p of products) assert.ok(Number.isInteger(p.priceCents) && p.priceCents > 0, p.id);
});

test('AC-2: pricing returns each line with unit price and line total, a subtotal, and a total', async () => {
  const res = await price({ items: [{ productId: 'FDN-001', quantity: 1 }, { productId: 'LIP-001', quantity: 2 }] });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.deepEqual(body.lines, [
    { productId: 'FDN-001', name: 'Radiance Skin Foundation', category: 'foundation', unitPriceCents: 4200, quantity: 1, lineTotalCents: 4200 },
    { productId: 'LIP-001', name: 'Velvet Matte Lipstick', category: 'lipstick', unitPriceCents: 2400, quantity: 2, lineTotalCents: 4800 },
  ]);
  assert.equal(body.subtotalCents, 9000);
  assert.equal(body.totalCents, 9000);
});

test('AC-3: a price supplied in the request is ignored', async () => {
  const body = await (await price({ items: [{ productId: 'SRM-002', quantity: 1, unitPriceCents: 1, priceCents: 1 }], totalCents: 1 })).json();
  assert.equal(body.lines[0].unitPriceCents, 5400);
  assert.equal(body.totalCents, 5400);
});

test('AC-4: invalid input returns 400 with a message per invalid field', async () => {
  for (const bad of [{}, { items: [] }, { items: 'FDN-001' }]) {
    const res = await price(bad);
    assert.equal(res.status, 400);
    assert.deepEqual(Object.keys((await res.json()).fields), ['items']);
  }
  const res = await price({ items: [
    { productId: 'NOPE', quantity: 1 },
    { productId: 'LIP-001', quantity: 0 },
    { productId: 'LIP-001', quantity: 1.5 },
    { productId: 'MSC-001', quantity: 1000 },
  ] });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.error, 'Invalid input');
  assert.deepEqual(Object.keys(body.fields).sort(), [
    'items[0].productId', 'items[1].quantity', 'items[2].productId', 'items[2].quantity', 'items[3].quantity',
  ]);
  assert.doesNotMatch(JSON.stringify(body), /NOPE/, 'raw input is not echoed back');
});

test('AC-5: same product and shade raises quantity, another shade is a new line, quantity stays 1 to 10, lines can be removed', () => {
  let lines = addItem(addItem(addItem([], honey), honey), ivory);
  assert.deepEqual(lines.map((l) => [l.shadeCode, l.quantity]), [['230', 2], ['120', 1]]);
  lines = addItem(lines, lipstick);
  assert.equal(countItems(lines), 4);

  const key = lineKey(honey);
  assert.equal(setQuantity(lines, key, 25)[0].quantity, 10);
  assert.equal(setQuantity(lines, key, 0)[0].quantity, 1);
  let full = lines;
  for (let i = 0; i < 20; i++) full = addItem(full, honey);
  assert.equal(full[0].quantity, 10);

  assert.deepEqual(removeLine(lines, key).map(lineKey), ['FDN-001:120', 'LIP-001:']);
  assert.equal(formatMoney(4200), '$42.00');
});

test('AC-6: the bag is kept in session storage only, the pricing request has no shade, and the server keeps nothing', async () => {
  const storage = fakeStorage();
  const lines = addItem(addItem([], honey), ivory);
  saveBag(lines, storage);
  assert.deepEqual([...storage.data.keys()], [BAG_KEY]);
  assert.deepEqual(loadBag(storage), lines);
  assert.deepEqual(loadBag({ getItem: () => 'not json' }), []);

  // Two shades of one product go to the server as one product with a quantity.
  assert.deepEqual(pricingRequest(addItem(lines, lipstick)), { items: [{ productId: 'FDN-001', quantity: 2 }, { productId: 'LIP-001', quantity: 1 }] });

  const client = await readFile(new URL('../public/cart.js', import.meta.url), 'utf8');
  assert.doesNotMatch(client, /localStorage|indexedDB|document\.cookie|fetch\(|sendBeacon|console\./);

  const seen = [];
  const orig = { log: console.log, info: console.info, warn: console.warn, error: console.error, debug: console.debug };
  for (const k of Object.keys(orig)) console[k] = (...a) => seen.push(a.join(' '));
  try {
    await price({ items: [{ productId: 'FDN-001', quantity: 2 }] });
    await price({ items: [{ productId: 'NOPE', quantity: 0 }] });
  } finally {
    Object.assign(console, orig);
  }
  assert.deepEqual(seen, []);
  for (const file of ['../src/lib/pricing.js', '../src/routes/cart.js']) {
    const src = await readFile(new URL(file, import.meta.url), 'utf8');
    assert.doesNotMatch(src, /console\.|node:fs|process\.std(out|err)/, file);
  }
});

test('AC-7: /cart.html shows lines, quantity controls and total, and every page header has a Bag link with a count', async () => {
  const res = await fetch(`${base}/cart.html`);
  assert.equal(res.status, 200);
  const html = await res.text();
  for (const id of ['lines', 'subtotal', 'total', 'empty']) assert.match(html, new RegExp(`id="${id}"`));
  assert.match(html, /setQuantity\(lines, key, line\.quantity \+ 1\)/);
  assert.match(html, /removeLine\(lines, key\)/);
  for (const path of ['/', '/shade-finder.html', '/cart.html']) {
    const header = (await text(path)).match(/<header>[\s\S]*?<\/header>/)[0];
    assert.match(header, /<a class="bag-link" href="\/cart\.html">Bag \(<span data-bag-count>0<\/span>\)<\/a>/, path);
    assert.match(await text(path), /updateBagCount\(/, path);
  }
});

test('AC-8: checkout says it is a demo and sends nothing', async () => {
  const html = await text('/cart.html');
  assert.match(html, /id="checkout-notice" hidden>This is a demo\. No order is placed and no payment is taken\./);
  assert.match(html, /\$\('checkout'\)\.onclick = \(\) => \{ \$\('checkout-notice'\)\.hidden = false; \};/);
  assert.deepEqual([...html.matchAll(/fetch\(([^,)]*)/g)].map((m) => m[1]), ["'/api/cart/price'"]);
  assert.doesNotMatch(html, /<form|type="(email|password|tel)"|name="card/i);
});

test('AC-9: add to bag is offered on the catalog, the hero try-on, and Shade Finder results', async () => {
  const home = await text('/');
  assert.match(home, /addToBag\(\{ productId: p\.id, name: p\.name \}, b\)/);
  assert.match(home, /id="tryon-add"/);
  assert.match(home, /addToBag\(\{ productId: s\.productId, name: s\.productName, shadeCode: s\.code/);
  assert.match(await text('/shade-finder.html'), /addToBag\(\{ productId: m\.productId, name: m\.productName, shadeCode: m\.code/);
});
