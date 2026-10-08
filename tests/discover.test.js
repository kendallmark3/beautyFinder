// Feature 007 tests. Each test name starts with the acceptance criterion it proves.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from '../src/server.js';
import { shadeColor } from '../public/shade-color.js';
import { MODELS, NO_MATCH, lookItems, lookName, lookSummary, palette, reasoning } from '../public/discover.js';

let server, base, products;
before(async () => {
  server = await createServer();
  await new Promise((r) => server.listen(0, r));
  base = `http://localhost:${server.address().port}`;
  products = (await (await fetch(`${base}/api/products`)).json()).products;
});
after(() => server.close());

const text = async (p) => (await fetch(`${base}${p}`)).text();
const state = { model: MODELS[3], depth: 9, undertone: 'warm', lip: 'berry', eyes: 'dramatic', finish: 'dewy', blush: 'peach' };
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
  assert.equal(lookName(state), 'Evening Berry Glow');
  assert.match(lookSummary(state), /dewy skin/);
  const why = reasoning(state, match);
  assert.match(why, /330 Warm Amber/);
  assert.doesNotMatch(why + lookName(state) + lookSummary(state), /perfect/i);
});

test('AC-3: the chosen model is a photograph and the look is a palette of the chosen colours (changed by Feature 008)', async () => {
  const chips = palette(state, match);
  assert.deepEqual(chips.map((c) => c.part), ['Foundation', 'Finish', 'Eyes', 'Lips', 'Cheeks']);
  assert.deepEqual(chips.map((c) => c.value), ['330 Warm Amber', 'Dewy glow', 'Dramatic', 'Berry', 'Peach']);
  assert.equal(chips[0].color, shadeColor(match.depth, match.undertone));
  assert.equal(chips[0].finish, 'dewy');
  assert.equal(chips[3].color, '#7a2447');
  // Nothing applied shows as an empty chip, and a pending match says so.
  const bare = palette({ ...state, eyes: 'natural', blush: 'none' }, null);
  assert.equal(bare[2].color, null);
  assert.equal(bare[4].color, null);
  assert.equal(bare[0].value, 'Finding your shade');
  for (const m of MODELS) assert.match(m.src, /^\/photos\/model-[a-z-]+\.jpg$/);
  const js = await readFile(new URL('../public/discover.js', import.meta.url), 'utf8');
  assert.doesNotMatch(js, /<svg|modelSvg|applyLook/);
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

test('AC-7: the page says what is sent and that the palette is a preview', async () => {
  const page = await text('/discover.html');
  assert.match(page, /id="privacy-note">[^<]*skin depth and undertone are sent to our server, which does not log or store them/);
  assert.match(page, /id="preview-note">The palette is a preview of your choices; nothing in the photograph is altered\./);
  assert.doesNotMatch(page, /stay on this device|exactly what created it/);
  assert.match(reasoning(state, match), /the berry colour in the palette is a preview/);
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
