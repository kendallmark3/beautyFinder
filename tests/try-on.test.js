// Feature 004 tests. Each test name starts with the acceptance criterion it proves.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from '../src/server.js';
import { shadeColor } from '../public/shade-color.js';
import { STEP_MS, createTryOn, foundationShades, previewText, skinColors, swatchButtons } from '../public/try-on.js';

let server, base, shades;
before(async () => {
  server = await createServer();
  await new Promise((r) => server.listen(0, r));
  base = `http://localhost:${server.address().port}`;
  shades = foundationShades((await (await fetch(`${base}/api/products`)).json()).products);
});
after(() => server.close());

const text = async (path) => (await fetch(`${base}${path}`)).text();
const source = (file) => readFile(new URL(`../public/${file}`, import.meta.url), 'utf8');

// A stand-in for setInterval that the test advances by hand.
function fakeTimers() {
  const t = { fn: null, ms: null, cleared: 0 };
  t.setInterval = (fn, ms) => { t.fn = fn; t.ms = ms; return 1; };
  t.clearInterval = () => { t.fn = null; t.cleared += 1; };
  return t;
}

test('AC-1: every foundation shade is offered as a button labelled with its name', async () => {
  const buttons = swatchButtons(shades);
  assert.equal(buttons.length, 18);
  assert.deepEqual(buttons.map((b) => b.label), shades.map((s) => `Preview ${s.name}`));
  const js = await source('try-on.js');
  assert.match(js, /createElement\('button'\)/);
  assert.match(js, /setAttribute\('aria-label', d\.label\)/);
  assert.match(await text('/'), /id="hero-shades"/);
});

test('AC-2: picking a shade paints the model with that shade\'s shadeColor and names it', () => {
  const shown = [];
  const tryOn = createTryOn({ shades, show: (shade, i, colors) => shown.push({ shade, i, colors }), timers: fakeTimers() });
  const i = shades.findIndex((s) => s.code === '230');
  tryOn.pick(i);
  assert.equal(shown.length, 1);
  assert.equal(shown[0].colors.skin, shadeColor(5, 'warm'));
  assert.deepEqual(shown[0].colors, skinColors(shades[i]));
  assert.equal(previewText(shown[0].shade), 'Previewing 230 Honey Beige · warm undertone');
});

test('AC-3: until a shade is picked the model steps lighter to deeper and wraps; picking stops it', () => {
  const seen = [];
  const timers = fakeTimers();
  const tryOn = createTryOn({ shades, show: (shade) => seen.push(shade.code), timers });
  tryOn.start();
  assert.equal(timers.ms, STEP_MS);
  for (let n = 0; n < shades.length; n++) timers.fn();
  const inOrder = shades.map((s) => s.code);
  assert.deepEqual(seen, [...inOrder, inOrder[0]]);
  assert.deepEqual(shades.map((s) => s.depth), [...shades.map((s) => s.depth)].sort((a, b) => a - b));

  tryOn.pick(4);
  assert.equal(tryOn.cycling, false);
  assert.equal(timers.fn, null);
  tryOn.start();
  assert.equal(tryOn.cycling, false, 'a pick stops the cycle for good');
});

test('AC-4: with reduced motion nothing auto-cycles or animates, and picking still works', async () => {
  const seen = [];
  const timers = fakeTimers();
  const tryOn = createTryOn({ shades, show: (shade) => seen.push(shade.code), reducedMotion: true, timers });
  tryOn.start();
  assert.equal(timers.fn, null);
  assert.deepEqual(seen, []);
  tryOn.pick(2);
  assert.deepEqual(seen, [shades[2].code]);

  const css = await text('/styles.css');
  const rule = css.match(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\}\s*\}/)?.[0] ?? '';
  assert.match(rule, /animation: none !important/);
  assert.match(rule, /transition: none !important/);
  assert.match(await text('/'), /reducedMotion: matchMedia\('\(prefers-reduced-motion: reduce\)'\)\.matches/);
});

test('AC-5: /hero.svg keeps its original colours as defaults when no script runs', async () => {
  const svg = await text('/hero.svg');
  assert.match(svg, /fill:var\(--skin, hsl\(32, 52%, 55%\)\)/);
  assert.match(svg, /fill:var\(--skin-shadow, hsl\(32, 52%, 50%\)\)/);
  assert.match(await text('/'), /<img[^>]+src="\/hero\.svg"/);
  // A double hyphen inside an XML comment makes the whole file unreadable.
  for (const [, comment] of svg.matchAll(/<!--([\s\S]*?)-->/g)) assert.doesNotMatch(comment, /--/);
});

test('AC-6: the picked shade is never logged, stored, or sent', async () => {
  const js = await source('try-on.js');
  assert.doesNotMatch(js, /fetch\(|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage|indexedDB|document\.cookie|console\.|location|history\./);
  // Every request the front screen makes goes to a fixed address that carries no shade.
  const requests = [...(await text('/')).matchAll(/fetch\(([^,)]*)/g)].map((m) => m[1]);
  assert.ok(requests.length > 0);
  for (const r of requests) assert.match(r, /^['`]\/(api\/products(\?category=foundation|\$\{q\})|api\/bundles|hero\.svg|shade-finder\.html)['`]$/);
});

test('AC-7: try-on copy calls itself a preview and never uses "perfect"', async () => {
  const hero = (await text('/')).match(/<section class="hero"[\s\S]*?<\/section>/)[0];
  assert.match(hero, /preview/i);
  assert.match(previewText(shades[0]), /^Previewing /);
  assert.doesNotMatch(hero + (await source('try-on.js')), /perfect/i);
});
