// Feature 010 tests. Each test name starts with the acceptance criterion it proves.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';

let server, base, css, discoverCss, home;
before(async () => {
  server = await createServer();
  await new Promise((r) => server.listen(0, r));
  base = `http://localhost:${server.address().port}`;
  const text = async (p) => (await fetch(`${base}${p}`)).text();
  [css, discoverCss, home] = await Promise.all([text('/styles.css'), text('/discover.css'), text('/')]);
});
after(() => server.close());

// The first rule whose selector is exactly `selector`.
const rule = (sheet, selector) => {
  const m = sheet.match(new RegExp(`(?:^|\\n)${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\{([^}]*)\\}`));
  assert.ok(m, `no rule for ${selector}`);
  return m[1];
};

test('AC-1: the header and every section share one page width and gutter', () => {
  assert.match(rule(css, ':root'), /--page: 1160px;/);
  assert.match(rule(css, ':root'), /--gutter: max\(40px, calc\(\(100vw - var\(--page\)\) \/ 2 \+ 40px\)\);/);
  assert.match(rule(css, 'header'), /padding: 20px var\(--gutter\);/);
  for (const s of ['main', '.bundles', '.site-footer']) {
    assert.match(rule(css, s), /max-width: var\(--page\);/, s);
    assert.match(rule(css, s), /margin: (\d+px|0) auto/, s);
  }
  for (const s of ['.studio', '.look']) assert.match(rule(discoverCss, s), /max-width: var\(--page\); margin: 0 auto; padding: \d+px 40px/, s);
  assert.doesNotMatch(css + discoverCss, /max-width: 1[01]00px/);
});

test('AC-2: the hero headline, text, button and links are centred', () => {
  assert.match(rule(css, '.hero-inner'), /display: flex; flex-direction: column; align-items: center;/);
  assert.match(rule(css, '.hero-copy'), /text-align: center;/);
  assert.match(rule(css, '.hero p'), /margin: 0 auto/);
  const copy = home.match(/<div class="hero-copy">[\s\S]*?<div class="hero-art/)[0];
  assert.match(copy, /<h2>[\s\S]*<a class="cta primary"[\s\S]*<div class="hero-links">/);
});

test('AC-3: all four models are side by side across the window, and the closest one is wider', () => {
  const art = rule(css, '.hero-art.photo');
  assert.match(art, /display: flex;/);
  assert.match(art, /width: 100%;/);
  const img = rule(css, '.hero-art.photo img');
  assert.match(img, /flex: 1 1 0;/);
  assert.doesNotMatch(img, /position: absolute|opacity/);
  assert.match(rule(css, '.hero-art.photo img.on'), /flex-grow: 1\.7;/);
  assert.equal([...home.match(/<div class="hero-art photo"[\s\S]*?<\/div>/)[0].matchAll(/<img /g)].length, 4);
  // The hero is not held inside the page width.
  assert.doesNotMatch(rule(css, '.hero-inner'), /max-width/);
});

test('AC-4: the shade card is below the photographs, never over one', () => {
  const art = home.match(/<div class="hero-art photo"[\s\S]*?<\/div>/)[0];
  assert.doesNotMatch(art, /shade-card/);
  assert.match(home.match(/<div class="tryon">[\s\S]*?<\/section>/)[0], /id="hero-shades"[\s\S]*id="shade-card"/);
  assert.doesNotMatch(rule(css, '.shade-card'), /position/);
});

test('AC-5: the swatches, bundle heading, band text, collection heading and footer are centred', () => {
  assert.match(rule(css, '.tryon'), /align-items: center;/);
  assert.match(rule(css, '.hero .swatches'), /justify-content: center;/);
  for (const s of ['.bundles', '.band-copy', '#collection', '.site-footer']) assert.match(rule(css, s), /text-align: center;/, s);
  // The band is one centred column: photograph, then text.
  assert.doesNotMatch(rule(css, '.band'), /grid/);
  assert.match(home, /<section class="band">\s*<img [^>]+>\s*<div class="band-copy">/);
});

test('AC-6: a row of products that does not fill the width is centred', () => {
  const grid = rule(css, '.grid');
  assert.match(grid, /display: flex; flex-wrap: wrap; justify-content: center;/);
  assert.match(rule(css, '.card'), /max-width: 320px;/);
});
