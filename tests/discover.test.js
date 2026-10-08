// Feature 007 tests. Each test name starts with the acceptance criterion it proves.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from '../src/server.js';
import { MODELS, NO_MATCH, lookItems, lookName, lookSummary, reasoning, modelSvg } from '../public/discover.js';

let server, base, products;
before(async () => {
  server = await createServer();
  await new Promise((r) => server.listen(0, r));
  base = `http://localhost:${server.address().port}`;
  products = (await (await fetch(`${base}/api/products`)).json()).products;
});
after(() => server.close());

const text = async (p) => (await fetch(`${base}${p}`)).text();
const state = { model: MODELS[0], depth: 8, undertone: 'warm', lip: 'berry', eyes: 'dramatic', finish: 'dewy', blush: 'peach' };
const match = { code: '330', name: '330 Warm Amber', depth: 8, undertone: 'warm', confidence: 'excellent' };
const header = (html) => html.match(/<header>[\s\S]*?<\/header>/)[0];

test('AC-1: the hero has one primary button, to discovery, and every page links to Discover', async () => {
  const hero = (await text('/')).match(/<section class="hero"[\s\S]*?<\/section>/)[0];
  const buttons = [...hero.matchAll(/<a class="cta[^"]*" href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(buttons, ['/discover.html']);
  for (const path of ['/', '/discover.html', '/shade-finder.html', '/cart.html']) {
    assert.match(header(await text(path)), /<a href="\/discover\.html">Discover<\/a>/, path);
  }
  const page = await text('/discover.html');
  assert.match(page, /id="begin"/);
  assert.match(page, /id="add-look"/);
});

test('AC-2: the look is named, summarised and explained without "perfect"', () => {
  assert.match(lookName(state), /Amara/);
  assert.match(lookSummary(state), /dewy skin/);
  const why = reasoning(state, match);
  assert.match(why, /330 Warm Amber/);
  assert.doesNotMatch(why + lookName(state) + lookSummary(state), /perfect/i);
});

test('AC-3: every model has repaintable skin, lips, lashes and cheeks, and its own glow', () => {
  const glowIds = [];
  for (const m of [...MODELS, MODELS[0]]) {
    const svg = modelSvg(m);
    for (const v of ['--skin', '--skin-shadow', '--lip', '--lash', '--blush', '--shine']) assert.ok(svg.includes(`var(${v})`), `${m.id} ${v}`);
    const id = svg.match(/<radialGradient id="([^"]+)"/)[1];
    assert.ok(svg.includes(`fill="url(#${id})"`), 'the glow uses its own gradient');
    glowIds.push(id);
  }
  // Two drawings sharing an id is what stopped the finish from showing.
  assert.equal(new Set(glowIds).size, glowIds.length);
});

test('AC-4: discovery choices are never stored or logged, and only two addresses are requested', async () => {
  const js = await readFile(new URL('../public/discover.js', import.meta.url), 'utf8');
  const html = await text('/discover.html');
  assert.doesNotMatch(js + html, /localStorage|sessionStorage|indexedDB|document\.cookie|sendBeacon|console\./);
  assert.doesNotMatch(js + html, /https?:\/\/(?!www\.w3\.org)/);
  assert.doesNotMatch(js, /fetch\(/);
  assert.deepEqual([...html.matchAll(/fetch\(([^,)]*)/g)].map((m) => m[1]).sort(), ["'/api/products'", "'/api/shade-match'"]);
});

test('AC-5: the look\'s products follow the choices', () => {
  const names = (s, m = match) => lookItems(s, m, products).map((i) => i.label);
  assert.deepEqual(names(state), ['330 Warm Amber', 'Hydra Glow Serum', 'Volume Lift Mascara', 'Velvet Matte Lipstick']);
  assert.deepEqual(names({ ...state, finish: 'matte', eyes: 'natural' }), ['330 Warm Amber', 'Velvet Matte Lipstick']);
  const [foundation, , , lipstick] = lookItems(state, match, products);
  assert.deepEqual(foundation.item, { productId: 'FDN-001', name: 'Radiance Skin Foundation', shadeCode: '330', shadeName: '330 Warm Amber', depth: 8, undertone: 'warm' });
  // The lipstick goes in the bag without a colour, and its label does not claim one.
  assert.deepEqual(lipstick.item, { productId: 'LIP-001', name: 'Velvet Matte Lipstick' });
  assert.doesNotMatch(lipstick.role, /berry/i);
});

test('AC-6: with no shade match the look says so and lists no foundation', () => {
  assert.deepEqual(lookItems(state, null, products).map((i) => i.product.category), ['serum', 'mascara', 'lipstick']);
  const why = reasoning(state, null);
  assert.ok(why.startsWith(NO_MATCH));
  assert.match(NO_MATCH, /could not match a foundation shade/);
  assert.deepEqual(lookItems(state, match, []), []);
});

test('AC-7: the page says what is sent and that lip, cheek and eye colours are a preview', async () => {
  const page = await text('/discover.html');
  assert.match(page, /id="privacy-note">[^<]*skin depth and undertone are sent to our server, which does not log or store them/);
  assert.match(page, /id="preview-note">Lip, cheek and eye colours are a preview on the model\./);
  assert.doesNotMatch(page, /stay on this device|exactly what created it/);
  assert.match(reasoning(state, match), /the berry colour on the model is a preview/);
});

test('AC-8: the discovery page uses the app\'s name and navigation, and its product buttons are readable', async () => {
  const page = await text('/discover.html');
  const home = await text('/');
  const name = (html) => header(html).match(/<h1>([^<]+)<\/h1>/)[1];
  assert.equal(name(page), name(home));
  for (const href of ['/', '/discover.html', '/shade-finder.html', '/cart.html']) assert.ok(header(page).includes(`href="${href}"`), href);
  const rule = (await text('/discover.css')).match(/\.products \.add \{[^}]*\}/)[0];
  assert.match(rule, /background: #fff;/);
  assert.match(rule, /[^-]color: #111;/);
});
