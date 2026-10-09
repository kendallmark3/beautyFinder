// Feature 015 tests: Curated Recommendations. Each test name starts with the acceptance criterion it proves.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from '../src/server.js';
import { MAX_PICKS, ROUTINE, getRecommendations } from '../src/lib/recommendations.js';

let server, base;
before(async () => {
  server = await createServer();
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const get = async (query = '') => {
  const res = await fetch(`${base}/api/recommendations${query}`);
  assert.equal(res.status, 200);
  return res.json();
};
const text = async (p) => (await fetch(`${base}${p}`)).text();
const source = (p) => readFile(new URL(`../${p}`, import.meta.url), 'utf8');

test('AC-1: GET /api/recommendations returns exactly three curated picks by default', async () => {
  const body = await get();
  assert.equal(body.count, 3);
  assert.equal(body.recommendations.length, 3);
  assert.equal(MAX_PICKS, 3);
  // Names and prices are the catalog's, not the page's.
  const catalog = new Map((await (await fetch(`${base}/api/products`)).json()).products.map((p) => [p.id, p]));
  for (const item of body.recommendations) {
    const product = catalog.get(item.id);
    assert.ok(product, item.id);
    assert.deepEqual([item.name, item.category, item.description, item.priceCents], [product.name, product.category, product.description, product.priceCents]);
    assert.ok(item.reason.length > 0);
  }
});

test('AC-2: ?category= filters the recommendations to a single product category', async () => {
  const serum = await get('?category=serum');
  assert.deepEqual(serum.recommendations.map((p) => p.id), ['SRM-001', 'SRM-002']);
  assert.deepEqual(await get('?category=SERUM'), serum, 'case-insensitive');
  assert.deepEqual(await get('?category=all'), await get(), '"all" means no category');
  assert.deepEqual(await get('?category=perfume'), { count: 0, recommendations: [] });
  for (const c of ROUTINE) assert.ok((await get(`?category=${c}`)).recommendations.every((p) => p.category === c), c);
});

test('AC-3: /recommendations.html serves the curated-picks page and renders the experience', async () => {
  const res = await fetch(`${base}/recommendations.html`);
  assert.equal(res.status, 200);
  const page = await res.text();
  assert.match(page, /<h2>Three picks for a simple routine<\/h2>/);
  assert.match(page, /id="recommendations-grid"/);
  assert.deepEqual([...page.matchAll(/data-category="([a-z]+)"/g)].map((m) => m[1]), ['all', 'foundation', 'serum', 'mascara', 'lipstick']);
  assert.match(page, /<script type="module" src="\/recommendations\.js"><\/script>/);
  assert.equal((await fetch(`${base}/recommendations.js`)).status, 200);
  // The copy claims nothing the picking rule does not do (BR-REC-3).
  const words = page + (await source('public/recommendations.js')) + (await source('src/lib/recommendations.js'));
  assert.doesNotMatch(words, /perfect|best match|best[- ]sell|favou?rite|top choice|most popular|hand-picked/i);
});

test('AC-4: the default picks are one each of serum, foundation and lipstick, in the order they are applied', async () => {
  const { recommendations } = await get();
  assert.deepEqual(recommendations.map((p) => [p.id, p.category]), [['SRM-001', 'serum'], ['FDN-001', 'foundation'], ['LIP-001', 'lipstick']]);
  assert.deepEqual(ROUTINE, ['serum', 'foundation', 'lipstick', 'mascara']);
  assert.deepEqual(getRecommendations(), recommendations);
  assert.deepEqual(getRecommendations(null), recommendations);
});

test('AC-5: a foundation is never added to the bag from this page', async () => {
  const picks = [...(await get()).recommendations, ...(await get('?category=mascara')).recommendations];
  assert.deepEqual(picks.map((p) => [p.category, p.needsShade]), [['serum', false], ['foundation', true], ['lipstick', false], ['mascara', false]]);
  const js = await source('public/recommendations.js');
  // The only addToBag call sits in the branch for products without shades.
  assert.match(js, /if \(item\.needsShade\) \{[\s\S]*link\.href = '\/shade-finder\.html';[\s\S]*\} else \{[\s\S]*addToBag\(\{ productId: item\.id, name: item\.name \}, add\)/);
  assert.equal([...js.matchAll(/addToBag\(/g)].length, 1);
});

test('AC-6: the page is reachable, has the shared header, and requests only /api/recommendations', async () => {
  assert.match(await text('/'), /<a class="quiet-link" href="\/recommendations\.html">/);
  const header = (html) => html.match(/<header>[\s\S]*?<\/header>/)[0].replace(/ aria-current="page"/g, '');
  assert.equal(header(await text('/recommendations.html')), header(await text('/credits.html')));
  const js = await source('public/recommendations.js');
  assert.deepEqual([...js.matchAll(/fetch\(([^)]*)\)/g)].map((m) => m[1]), ['`/api/recommendations${query}`']);
  assert.match(js, /const query = category === 'all' \? '' : `\?category=\$\{encodeURIComponent\(category\)\}`;/);
  assert.doesNotMatch(js + (await source('src/lib/recommendations.js')) + (await source('src/routes/recommendations.js')), /localStorage|sessionStorage|document\.cookie|console\.|innerHTML/);
});
