// Feature 008 tests. Each test name starts with the acceptance criterion it proves.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createServer } from '../src/server.js';
import { PHOTO_MODELS, nearestModel } from '../public/models.js';
import { foundationShades } from '../public/try-on.js';

let server, base;
before(async () => {
  server = await createServer();
  await new Promise((r) => server.listen(0, r));
  base = `http://localhost:${server.address().port}`;
});
after(() => server.close());

const text = async (p) => (await fetch(`${base}${p}`)).text();
const PAGES = ['/', '/discover.html', '/shade-finder.html', '/cart.html', '/credits.html', '/recommendations.html'];
const publicDir = new URL('../public/', import.meta.url);

test('AC-1: the hero and the band show photographs of women, each with alternative text', async () => {
  const home = await text('/');
  const art = home.match(/<div class="hero-art photo"[\s\S]*?<div class="shade-card"/)[0];
  const models = [...art.matchAll(/<img[^>]*data-model="([^"]+)"[^>]*src="([^"]+)"[^>]*alt="([^"]+)"/g)];
  assert.deepEqual(models.map((m) => m[1]), PHOTO_MODELS.map((m) => m.id));
  assert.deepEqual(models.map((m) => m[2]), PHOTO_MODELS.map((m) => m.src));
  assert.deepEqual(models.map((m) => m[3]), PHOTO_MODELS.map((m) => m.alt));
  assert.match(home, /<section class="band">\s*<img src="\/photos\/group\.jpg" alt="[^"]{20,}"/);
});

test('AC-2: every foundation shade is shown beside the model with the closest skin depth', async () => {
  const shades = foundationShades((await (await fetch(`${base}/api/products`)).json()).products);
  const picks = shades.map((s) => nearestModel(s.depth));
  for (const [i, s] of shades.entries()) {
    const gap = Math.abs(picks[i].depth - s.depth);
    for (const m of PHOTO_MODELS) assert.ok(gap <= Math.abs(m.depth - s.depth), `${s.code} is closest to ${picks[i].id}`);
  }
  // Lighter to deeper shades never step back to a lighter model, and all four models are used.
  const order = picks.map((m) => PHOTO_MODELS.indexOf(m));
  assert.deepEqual(order, [...order].sort((a, b) => a - b));
  assert.equal(new Set(order).size, PHOTO_MODELS.length);
  assert.equal(nearestModel(3).id, 'lighter', 'a tie goes to the lighter model');
});

test('AC-3: a picked shade is shown on a card, and the page says a photo cannot show a shade exactly', async () => {
  const home = await text('/');
  assert.match(home, /id="shade-card-name"/);
  assert.match(home, /Shown beside a model with a similar skin depth\. A photo cannot show a shade exactly\./);
  assert.match(home, /nearestModel\(shade\.depth\)/);
  assert.match(await text('/styles.css'), /\.shade-card \.chip \{[^}]*background: var\(--skin/);
});

test('AC-4: no photograph is recoloured or filtered', async () => {
  const css = (await text('/styles.css')) + (await text('/discover.css'));
  assert.doesNotMatch(css, /mix-blend-mode|background-blend-mode|[^-]filter:|hue-rotate|sepia\(/);
  for (const p of PAGES) assert.doesNotMatch(await text(p), /<canvas|getImageData|mix-blend-mode/, p);
});

test('AC-5: every photograph is a JPEG kept in the app, and no page loads anything from another site', async () => {
  const files = (await readdir(new URL('photos/', publicDir))).filter((f) => f.endsWith('.jpg')).sort();
  assert.deepEqual(files, ['group.jpg', 'model-deeper.jpg', 'model-light-medium.jpg', 'model-lighter.jpg', 'model-medium-deep.jpg']);
  for (const f of files) {
    const bytes = await readFile(new URL(`photos/${f}`, publicDir));
    assert.deepEqual([...bytes.subarray(0, 3)], [0xff, 0xd8, 0xff], f);
    assert.ok(bytes.length < 200_000, `${f} is under 200 KB`);
  }
  for (const p of PAGES) {
    const loads = [...(await text(p)).matchAll(/(?:src|srcset)="([^"]+)"|<link[^>]+href="([^"]+)"|url\(([^)]+)\)/g)].map((m) => m[1] ?? m[2] ?? m[3]);
    for (const u of loads) assert.match(u, /^\/[^/]/, `${p} loads ${u}`);
  }
});

test('AC-6: the credits page lists every photograph with its photographer and source, and says the models endorse nothing', async () => {
  const credits = await text('/credits.html');
  const files = (await readdir(new URL('photos/', publicDir))).filter((f) => f.endsWith('.jpg'));
  for (const f of files) {
    const row = credits.match(new RegExp(`<li><code>photos/${f}</code>: "[^"]+" by [^<]+\\. <a href="https://www\\.pexels\\.com/photo/[^"]+"`));
    assert.ok(row, f);
  }
  assert.match(credits, /do not endorse and are not affiliated with this demo/);
  assert.match(credits, /https:\/\/www\.pexels\.com\/license\//);
  for (const p of ['/', '/discover.html']) {
    assert.match(await text(p), /do not endorse this demo or its products\. <a href="\/credits\.html">Photo credits<\/a>/, p);
  }
});

test('AC-7: the people pictured are never given a name', async () => {
  for (const m of PHOTO_MODELS) assert.match(m.label, /^(Lighter|Light to medium|Medium to deep|Deeper)$/);
  const js = await readFile(new URL('discover.js', publicDir), 'utf8');
  for (const p of PAGES) assert.doesNotMatch((await text(p)) + js, /Amara|Sofia|Elise|\bMei\b/, p);
});

test('AC-8: the illustrated models are gone', async () => {
  assert.equal((await fetch(`${base}/hero.svg`)).status, 404);
  for (const p of ['/', '/discover.html']) assert.doesNotMatch(await text(p), /hero\.svg|<svg|modelSvg/, p);
});
