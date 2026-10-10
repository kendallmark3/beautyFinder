// Feature 014 tests. Each test name starts with the acceptance criterion it proves.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from '../src/server.js';
import { addItem, countItems, pricingRequest } from '../public/cart.js';
import { JOURNEY, categoryLetter, itemCountLabel, receiptRows } from '../public/bag-view.js';

let server, base, page, css;
before(async () => {
  server = await createServer();
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
  page = await (await fetch(`${base}/cart.html`)).text();
  css = await (await fetch(`${base}/cart.css`)).text();
});
after(() => server.close());

const price = async (lines) => (await fetch(`${base}/api/cart/price`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pricingRequest(lines)),
})).json();

const cocoa = { productId: 'FDN-001', name: 'Radiance Skin Foundation', shadeCode: '340', shadeName: '340 Cocoa', depth: 8.5, undertone: 'neutral' };
const amber = { ...cocoa, shadeCode: '330', shadeName: '330 Warm Amber', depth: 8, undertone: 'warm' };
const mascara = { productId: 'MSC-001', name: 'Volume Lift Mascara' };
const lipstick = { productId: 'LIP-001', name: 'Velvet Matte Lipstick' };
const fill = (...items) => items.reduce(addItem, []);

test('AC-1: the bag shows its lines beside an order summary and says how many items it holds', () => {
  assert.match(page, /<div class="bag-layout" id="bag" hidden>[\s\S]*<div id="lines"><\/div>[\s\S]*<aside class="panel summary" id="summary"/);
  assert.match(css, /(?:^|\n)\.bag-layout \{ display: grid; grid-template-columns: minmax\(0, 1fr\) 360px;/);
  assert.match(page, /id="bag-size"/);
  assert.match(page, /\$\('bag-size'\)\.textContent = lines\.length \? itemCountLabel\(countItems\(lines\)\) : '';/);
  assert.equal(itemCountLabel(1), '1 item');
  assert.equal(itemCountLabel(4), '4 items');
});

test('AC-2: every line has a visual: its shade\'s colour or a tile for its category', () => {
  assert.match(page, /const visual = line\.shadeCode \? el\('span', 'swatch'\) : el\('span', 'thumb', categoryLetter\(category\)\);/);
  assert.match(page, /if \(line\.shadeCode\) visual\.style\.background = shadeColor\(line\.depth, line\.undertone\);/);
  assert.deepEqual(['foundation', 'serum', 'mascara', 'lipstick'].map(categoryLetter), ['F', 'S', 'M', 'L']);
  assert.equal(categoryLetter(undefined), '·');
  assert.match(css, /(?:^|\n)\.thumb \{/);
});

test('AC-3: an earned bundle is shown as unlocked with its saving, and a bundle one product away with what to add', async () => {
  // Both come straight from the server's answer; the page works out nothing.
  const earned = await price(fill(cocoa, mascara, lipstick));
  assert.deepEqual(earned.bundles.map((b) => [b.name, b.savingCents, b.items.map((i) => i.name).join(' + ')]), [
    ['Complete Look', 1380, 'Radiance Skin Foundation + Volume Lift Mascara + Velvet Matte Lipstick'],
  ]);
  const oneAway = await price(fill(cocoa, lipstick));
  assert.deepEqual(oneAway.suggestions.map((s) => s.missingCategory), ['mascara', 'serum']);
  assert.match(page, /\$\('unlocked'\)\.replaceChildren\(\.\.\.priced\.bundles\.map\(\(b\) => \{/);
  assert.match(page, /el\('b', '', `\$\{b\.name\} unlocked`\), el\('small', '', b\.items\.map\(\(i\) => i\.name\)\.join\(' \+ '\)\)/);
  assert.match(page, /\$\('suggestions'\)\.replaceChildren\(\.\.\.priced\.suggestions\.map/);
  assert.doesNotMatch(page + await readFile(new URL('../public/bag-view.js', import.meta.url), 'utf8'), /percentOff \*|\* 0\.\d|categories\.every/, 'no bundle arithmetic in the page');
});

test('AC-4: Checkout opens a preview at the bottom with Bag complete and the later steps marked not in this demo', () => {
  assert.deepEqual(JOURNEY.map((s) => [s.label, s.inDemo]), [['Bag', true], ['Delivery', false], ['Payment', false], ['Confirmation', false]]);
  assert.match(page, /el\('small', '', step\.inDemo \? 'Complete' : 'Not in this demo'\)/);
  // The preview is the last thing in the page's main content, and starts hidden.
  assert.match(page, /<section class="checkout-preview" id="checkout-panel" hidden aria-live="polite">[\s\S]*<\/section>\s*<\/main>/);
  const handler = page.match(/\$\('checkout'\)\.onclick = \(\) => \{[\s\S]*?\n    \};/)[0];
  assert.match(handler, /drawPreview\(\);[\s\S]*\$\('checkout-panel'\)\.hidden = false;[\s\S]*scrollIntoView/);
  assert.match(page, /id="journey"/);
});

test('AC-5: the receipt lists every line, each bundle saving, and the server\'s total', async () => {
  const lines = fill(cocoa, cocoa, amber, mascara, lipstick);
  const priced = await price(lines);
  const rows = receiptRows(lines, priced);
  assert.deepEqual(rows.map((r) => [r.kind, r.label, r.amountCents]), [
    ['line', '2 × 340 Cocoa', 8400],
    ['line', '1 × 330 Warm Amber', 4200],
    ['line', '1 × Volume Lift Mascara', 2600],
    ['line', '1 × Velvet Matte Lipstick', 2400],
    ['subtotal', 'Subtotal', 17600],
    ['saving', 'Complete Look · 15% off the set', -1380],
    ['total', 'Total', 16220],
  ]);
  assert.equal(rows[0].detail, 'Radiance Skin Foundation');
  // The parts agree with each other and with the server.
  const of = (kind) => rows.filter((r) => r.kind === kind).reduce((s, r) => s + r.amountCents, 0);
  assert.equal(of('line'), priced.subtotalCents);
  assert.equal(of('subtotal') + of('saving'), priced.totalCents);
  assert.equal(of('total'), priced.totalCents);
  assert.equal(countItems(lines), 5);
  // A bag with no bundle has no saving row.
  const plain = fill(lipstick);
  assert.deepEqual(receiptRows(plain, await price(plain)).map((r) => r.kind), ['line', 'subtotal', 'total']);
});

test('AC-6: checkout places no order and sends nothing', () => {
  assert.match(page, /id="checkout-notice" hidden>This is a demo\. No order is placed and no payment is taken\./);
  assert.deepEqual([...page.matchAll(/fetch\(([^,)]*)/g)].map((m) => m[1]), ["'/api/cart/price'"]);
  assert.doesNotMatch(page, /<form|<input|<select|<textarea|type="(email|password|tel)"|name="card|autocomplete=/i);
  assert.doesNotMatch(page, /https?:\/\//);
  const handler = page.match(/\$\('checkout'\)\.onclick = \(\) => \{[\s\S]*?\n    \};/)[0];
  assert.match(handler, /\$\('checkout-notice'\)\.hidden = false;/);
  assert.doesNotMatch(handler, /fetch|sendBeacon|location\.href|submit/);
});

test('AC-7: an empty bag offers Discover, the Shade Finder, and the collection', () => {
  const empty = page.match(/<div class="panel bag-empty" id="empty" hidden>[\s\S]*?\n    <\/div>/)[0];
  assert.deepEqual([...empty.matchAll(/href="([^"]+)"/g)].map((m) => m[1]), ['/discover.html', '/shade-finder.html', '/#collection']);
  assert.match(empty, /<h3>Your bag is waiting<\/h3>/);
});

test('AC-8: the bag and the preview fit a phone-width screen', () => {
  const narrow = css.slice(css.indexOf('@media (max-width: 860px) {'));
  assert.match(narrow, /\.bag-layout \{ grid-template-columns: 1fr;/);
  assert.match(narrow, /\.bag-layout \.summary \{ position: static;/);
  assert.match(narrow, /\.preview-body \{ padding: 22px 16px;/);
  assert.match(css, /\.journey \{[^}]*grid-template-columns: repeat\(4, 1fr\);/);
});
