// Feature 016 tests. Each test name starts with the acceptance criterion it proves.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';

let server, base, page, css, shared;
before(async () => {
  server = await createServer();
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
  const text = async (p) => (await fetch(`${base}${p}`)).text();
  [page, css, shared] = await Promise.all([text('/cart.html'), text('/cart.css'), text('/styles.css')]);
});
after(() => server.close());

const rule = (sheet, selector) => {
  const m = sheet.match(new RegExp(`(?:^|\\n)${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\{([^}]*)\\}`));
  assert.ok(m, `no rule for ${selector}`);
  return m[1];
};

test('AC-1: the bag\'s boxes are warm-tinted and the order summary is a dark card with a gold Checkout button', () => {
  const panel = rule(css, '.bag-page .panel');
  assert.match(panel, /background: linear-gradient\(160deg, #fffaf5 0%, #fdeee4 100%\);/);
  assert.doesNotMatch(panel, /#fff[;\s,)]/, 'not plain white');
  const summary = rule(css, '.bag-layout .summary');
  assert.match(summary, /background: #111; color: #fff;/);
  assert.match(rule(css, '.bag-layout .summary .cta'), /background: #c9a36a; color: #111;/);
  const preview = rule(css, '.checkout-preview');
  assert.match(preview, /background: linear-gradient\(/);
  assert.doesNotMatch(preview, /background: #fff;/);
});

test('AC-2: the checkout preview shows one of the app\'s photographs, scaled to the box, with alternative text', async () => {
  const img = page.match(/<section class="checkout-preview"[\s\S]*?<img class="preview-photo" src="(\/photos\/[a-z-]+\.jpg)" alt="([^"]{20,})" \/>/);
  assert.ok(img);
  const res = await fetch(`${base}${img[1]}`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'image/jpeg');
  assert.ok((await (await fetch(`${base}/credits.html`)).text()).includes(`<code>${img[1].slice(1)}</code>`), 'the photo is on the credits page');
  const photo = rule(css, '.preview-photo');
  assert.match(photo, /width: 100%;/);
  assert.match(photo, /aspect-ratio: 21 \/ 7; object-fit: cover;/);
});

test('AC-3: the preview greets the shopper cheerfully and still says no order is placed', () => {
  assert.match(page, /<h3>You're all set<\/h3>\s*<p class="cheer">Your bag is ready, and it looks good\.<\/p>/);
  assert.match(page, /id="checkout-notice" hidden>This is a demo\. No order is placed and no payment is taken\./);
  const preview = page.match(/<section class="checkout-preview"[\s\S]*?<\/section>/)[0];
  assert.doesNotMatch(preview, /order (is|has been) (placed|confirmed)(?! and)|thank you for your order|on its way/i);
  assert.match(preview, /Not in this demo|id="journey"/);
});

test('AC-4: the sparkle is decorative only and stops under reduced motion', () => {
  assert.match(page, /<span class="sparkles" aria-hidden="true"><\/span>/);
  const sparkles = rule(css, '.sparkles');
  assert.match(sparkles, /pointer-events: none;/);
  assert.match(sparkles, /animation: bag-twinkle/);
  assert.match(shared, /@media \(prefers-reduced-motion: reduce\) \{\s*\*, \*::before, \*::after \{ animation: none !important; transition: none !important; \}/);
});

test('AC-5: the bag page and the Shade Finder carry the stock-model line and credits link', async () => {
  for (const p of ['/cart.html', '/shade-finder.html']) {
    const html = await (await fetch(`${base}${p}`)).text();
    assert.match(html, /<footer class="site-footer">Photography from Pexels\. The people pictured are stock models and do not endorse this demo or its products\. <a href="\/credits\.html">Photo credits<\/a><\/footer>/, p);
  }
});

test('AC-6: the photograph is not recoloured, filtered, or overlaid', () => {
  assert.doesNotMatch(css, /mix-blend-mode|background-blend-mode|[^-]filter:|hue-rotate|sepia\(|opacity: 0?\.\d+;[^}]*\}\s*\.preview-photo/);
  assert.doesNotMatch(rule(css, '.preview-photo'), /opacity|filter|position: absolute/);
  // Nothing is positioned over the photo: it sits above the body of the preview, not behind it.
  assert.match(page, /<img class="preview-photo"[^>]*\/>\s*<div class="preview-body">/);
  assert.doesNotMatch(css, /\.preview-photo::|\.checkout-preview::(before|after)/);
});
