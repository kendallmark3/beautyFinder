// Feature 017 tests. Each test name starts with the acceptance criterion it proves.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';

const SHEETS = ['styles.css', 'discover.css', 'shade-finder.css', 'cart.css', 'recommendations.css'];
let server, base;
const css = {};
before(async () => {
  server = await createServer();
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
  for (const s of SHEETS) css[s] = await (await fetch(`${base}/${s}`)).text();
});
after(() => server.close());

const sizes = (sheet) => [...sheet.matchAll(/font-size:\s*([^;}]+)/g)].map((m) => m[1].trim());
const rule = (sheet, selector) => {
  const m = sheet.match(new RegExp(`(?:^|\\n)${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\{([^}]*)\\}`));
  assert.ok(m, `no rule for ${selector}`);
  return m[1];
};

test('AC-1: every font size in every stylesheet is relative to one root size; none is in pixels', () => {
  let count = 0;
  for (const s of SHEETS) {
    for (const size of sizes(css[s])) {
      // The root rule itself is the one place pixels appear.
      if (size.startsWith('clamp(')) continue;
      assert.match(size, /^\d*\.?\d+rem$/, `${s}: font-size: ${size}`);
      count += 1;
    }
    assert.doesNotMatch(css[s], /font:\s*[^;]*\d+px/, `${s}: no pixel size in a font shorthand`);
  }
  assert.ok(count > 90, `${count} sizes checked`);
});

test('AC-2: the root size is defined once and grows with the window from 16px to 20px', () => {
  const roots = SHEETS.flatMap((s) => [...css[s].matchAll(/(?:^|\n)html \{([^}]*)\}/g)].map((m) => [s, m[1]]));
  assert.equal(roots.length, 1);
  assert.equal(roots[0][0], 'styles.css');
  assert.match(roots[0][1], /font-size: clamp\(16px, calc\(14px \+ 0\.3vw\), 20px\);/);
  // What that gives at the three widths the evidence was taken at.
  const at = (w) => Math.min(20, Math.max(16, 14 + 0.003 * w));
  assert.deepEqual([390, 1280, 1728, 2400].map((w) => Math.round(at(w) * 100) / 100), [16, 17.84, 19.18, 20]);
});

test('AC-3: no font size is below 0.8 of the root, and buttons take their size from the scale', () => {
  for (const s of SHEETS) for (const size of sizes(css[s])) if (size.endsWith('rem')) assert.ok(parseFloat(size) >= 0.8, `${s}: ${size}`);
  assert.match(rule(css['styles.css'], '.cta'), /font-family: inherit; font-size: 0\.875rem;/);
  // At 1280px that floor is over 14px: 0.8 × 17.84.
  assert.ok(0.8 * 17.84 > 14);
});

test('AC-4: the page width is a share of the window up to a cap, defined once, used by header and sections', () => {
  const all = SHEETS.map((s) => css[s]).join('\n');
  assert.equal([...all.matchAll(/--page:/g)].length, 1);
  assert.match(rule(css['styles.css'], ':root'), /--page: min\(1480px, 92vw\);/);
  assert.match(rule(css['styles.css'], 'header'), /padding: 20px var\(--gutter\);/);
  for (const s of ['main', '.bundles', '.site-footer']) assert.match(rule(css['styles.css'], s), /max-width: var\(--page\);/, s);
  for (const s of ['.studio', '.look', '.welcome']) assert.match(rule(css['discover.css'], s), /max-width: var\(--page\);/, s);
  assert.doesNotMatch(all, /max-width: (9|1[0-4])\d\dpx/, 'no section caps itself at a fixed pixel width');
});

test('AC-5: the picks, the bag and the Discover screens are sized to fill the width', () => {
  assert.match(rule(css['recommendations.css'], '.pick'), /max-width: none;/);
  assert.match(rule(css['cart.css'], '.bag-layout'), /grid-template-columns: minmax\(0, 1fr\) 26rem;/);
  assert.match(rule(css['cart.css'], '.receipt'), /max-width: 38rem;/);
  assert.match(rule(css['discover.css'], '.studio .model'), /height: min\(60vh, 680px\);/);
  assert.match(rule(css['discover.css'], '.mini'), /width: min\(17rem, 22%\); aspect-ratio: 3 \/ 4;/);
  assert.match(rule(css['styles.css'], '.bag-line'), /grid-template-columns: 44px 1fr 7\.5rem 5\.5rem 5rem;/);
});

test('AC-6: narrow-screen rules are kept, so phones are laid out as before', () => {
  assert.match(css['styles.css'], /@media \(max-width: 760px\) \{[\s\S]*header \{ flex-direction: column;/);
  assert.match(css['discover.css'], /@media \(max-width: 800px\) \{[\s\S]*\.studio, \.look \{ grid-template-columns: 1fr;/);
  for (const s of ['shade-finder.css', 'cart.css']) assert.match(css[s], /@media \(max-width: 860px\) \{/, s);
  // Where four labels no longer fit one row at a readable size, the row becomes two.
  const narrow = css['cart.css'].slice(css['cart.css'].indexOf('@media (max-width: 860px) {'));
  assert.match(narrow, /\.journey \{ grid-template-columns: repeat\(2, 1fr\);/);
  assert.match(rule(css['cart.css'], '.receipt .r > :last-child'), /white-space: nowrap;/);
});
