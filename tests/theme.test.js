// Feature 011 tests. Each test name starts with the acceptance criterion it proves.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';

let server, base;
const PAGES = ['/', '/discover.html', '/shade-finder.html', '/cart.html', '/credits.html'];
before(async () => {
  server = await createServer();
  await new Promise((r) => server.listen(0, r));
  base = `http://localhost:${server.address().port}`;
});
after(() => server.close());
const text = async (p) => (await fetch(`${base}${p}`)).text();

test('AC-1: the page background is defined once, on body, and is the deeper blush', async () => {
  const css = await text('/styles.css');
  const bodies = [...css.matchAll(/(?:^|\n)body \{([^}]*)\}/g)];
  assert.equal(bodies.length, 1);
  assert.match(bodies[0][1], /background: #f3d5c4 radial-gradient\(circle at 50% 0%, #f9e4d6 0%, #f3d5c4 45%, #ecc6b2 100%\) fixed;/);
  assert.doesNotMatch(css, /#f6e6dc|#fbf1e9/, 'the lighter background is gone');
});

test('AC-2: no page or section sets a page background of its own', async () => {
  const css = await text('/styles.css');
  const discover = await text('/discover.css');
  assert.doesNotMatch(discover, /\.disco \{[^}]*background/);
  assert.doesNotMatch(discover, /(?:^|\n)(body|html|main)[^{]*\{[^}]*background/);
  assert.doesNotMatch(css.match(/(?:^|\n)\.hero \{([^}]*)\}/)[1], /background/);
  assert.doesNotMatch(css, /(?:^|\n)(html|main)[^{]*\{[^}]*background/);
  for (const p of PAGES) {
    const html = await text(p);
    assert.doesNotMatch(html, /<style|<body[^>]*style=|<main[^>]*style=/, p);
  }
});

test('AC-3: every page loads the shared stylesheet', async () => {
  for (const p of PAGES) assert.match(await text(p), /<link rel="stylesheet" href="\/styles\.css" \/>/, p);
});

test('AC-4: page headings use one typeface on every page', async () => {
  const css = await text('/styles.css');
  assert.match(css.match(/(?:^|\n)h2 \{([^}]*)\}/)[1], /font-family: Didot, "Bodoni 72", "Playfair Display", Georgia, serif;/);
  assert.doesNotMatch(await text('/discover.css'), /h2 \{[^}]*font-family/);
});
