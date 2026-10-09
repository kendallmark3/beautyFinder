// Feature 003 tests. Each test name starts with the acceptance criterion it proves.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';

let server, base;
before(async () => {
  server = await createServer();
  await new Promise((r) => server.listen(0, r));
  base = `http://localhost:${server.address().port}`;
});
after(() => server.close());

const text = async (path) => (await fetch(`${base}${path}`)).text();
const hero = (html) => html.match(/<section class="hero"[\s\S]*?<\/section>/)?.[0] ?? '';

test('AC-1: / shows a hero with a headline and a link to the Shade Finder', async () => {
  const section = hero(await text('/'));
  assert.match(section, /<h2[^>]*>[^<]+/);
  assert.match(section, /<a[^>]+href="\/shade-finder\.html"/);
});

test('AC-2: the hero shows a photograph with alternative text (changed by Feature 008)', async () => {
  const imgs = [...hero(await text('/')).matchAll(/<img[^>]*src="(\/photos\/[^"]+\.jpg)"[^>]*alt="([^"]{10,})"/g)];
  assert.ok(imgs.length >= 1);
  const res = await fetch(`${base}${imgs[0][1]}`);
  assert.equal(res.status, 200);
  const bytes = new Uint8Array(await res.arrayBuffer());
  assert.deepEqual([...bytes.slice(0, 3)], [0xff, 0xd8, 0xff], 'a JPEG file');
});

test('AC-3: the shared stylesheet fills the page with a new background colour', async () => {
  const css = await text('/styles.css');
  const body = css.match(/(?:^|\n)body\s*\{[^}]*\}/)?.[0] ?? '';
  assert.match(body, /background:/);
  assert.match(body, /min-height:\s*100vh/);
  assert.doesNotMatch(body, /#fafaf8/i);
});

test('AC-4: the catalog filters and product grid are still on the front screen', async () => {
  const html = await text('/');
  assert.match(html, /id="filters"/);
  assert.match(html, /id="grid"/);
  assert.match(html, /\/api\/products/);
});

test('AC-5: the front screen loads nothing from another site', async () => {
  for (const path of ['/', '/styles.css']) {
    const body = await text(path);
    assert.doesNotMatch(body, /https?:\/\/|url\(\s*['"]?\/\//i, path);
  }
});

test('AC-6: hero copy never uses "perfect"', async () => {
  assert.doesNotMatch(hero(await text('/')), /perfect/i);
});
