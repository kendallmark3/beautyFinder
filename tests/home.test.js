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

test('AC-2: /hero.svg is served as an SVG image and shown with alternative text', async () => {
  const res = await fetch(`${base}/hero.svg`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'image/svg+xml');
  assert.match(await res.text(), /<svg[\s>]/);
  assert.match(hero(await text('/')), /<img[^>]+src="\/hero\.svg"[^>]+alt="[^"]{10,}"/);
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

test('AC-5: the front screen and the illustration load nothing from another site', async () => {
  for (const path of ['/', '/styles.css', '/hero.svg']) {
    const body = (await text(path)).replaceAll('xmlns="http://www.w3.org/2000/svg"', '');
    assert.doesNotMatch(body, /https?:\/\/|url\(\s*['"]?\/\//i, path);
  }
});

test('AC-6: hero copy never uses "perfect"', async () => {
  assert.doesNotMatch(hero(await text('/')), /perfect/i);
  assert.doesNotMatch(await text('/hero.svg'), /perfect/i);
});
