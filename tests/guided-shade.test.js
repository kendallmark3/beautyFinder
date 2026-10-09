// Guided Shade Experience tests (intent/features/013-guided-shade-experience.md, filed as 013).
// The intent's six functional success criteria are taken, in order, as AC-1 to AC-6.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from '../src/server.js';
import { matchShades } from '../src/lib/shadeMatch.js';
import { PHOTO_MODELS, nearestModel } from '../public/models.js';
import { DEPTH_STOPS, UNDERTONES, complexion, complexionLabel, confidenceLine, depthWord, difference, presentMatches } from '../public/guided-shade.js';

let server, base, page, css;
before(async () => {
  server = await createServer();
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
  page = await (await fetch(`${base}/shade-finder.html`)).text();
  css = await (await fetch(`${base}/shade-finder.css`)).text();
});
after(() => server.close());

const post = async (body) => (await fetch(`${base}/api/shade-match`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
})).json();

test('AC-1: existing shade matching produces the same recommendations, and the page keeps their order', async () => {
  // Known answers from Feature 002's rules (BR-SM-1 to BR-SM-3).
  assert.deepEqual((await post({ depth: 5, undertone: 'warm' })).matches.map((m) => m.code), ['230', '220', '250']);
  assert.deepEqual((await post({ depth: 2, undertone: 'cool' })).matches.map((m) => m.code), ['140', '120', '110']);
  assert.deepEqual((await post({ depth: 8.5, undertone: 'warm' })).matches.map((m) => m.code), ['340', '330', '360']);
  // For every choice the page offers, the API answers as the rules library does, and the page shows that order.
  for (const depth of DEPTH_STOPS) {
    for (const { id: undertone } of UNDERTONES) {
      const api = await post({ depth, undertone });
      assert.deepEqual(api, matchShades({ depth, undertone }), `${depth} ${undertone}`);
      const shown = presentMatches(api);
      assert.deepEqual([shown.primary, ...shown.alternatives], api.matches);
      assert.equal(shown.consultation, api.consultation);
    }
  }
  // The page asks the existing endpoint with depth and undertone, and nothing else.
  assert.match(page, /fetch\('\/api\/shade-match', \{[\s\S]*?body: JSON\.stringify\(\{ depth: state\.depth, undertone: state\.undertone \}\),/);
});

test('AC-2: a shopper can complete discovery and identify the primary recommended shade', async () => {
  const steps = [...page.matchAll(/<li class="gs-step[^"]*" id="(step-[a-z]+)">\s*<h3><span>(\d)<\/span>/g)].map((m) => [m[2], m[1]]);
  assert.deepEqual(steps, [['1', 'step-depth'], ['2', 'step-undertone'], ['3', 'step-match']]);
  // Steps 2 and 3 start locked; nothing is chosen for the shopper.
  assert.match(page, /<li class="gs-step locked" id="step-undertone">/);
  assert.match(page, /<li class="gs-step locked" id="step-match">/);
  assert.match(page, /const state = \{ depth: null, undertone: null, revealed: false \};/);
  assert.match(page, /<button class="cta" type="button" id="reveal">Reveal my match<\/button>/);
  // Exactly one shade is presented as the recommendation; the others are labelled alternatives.
  const shown = presentMatches(await post({ depth: 5, undertone: 'warm' }));
  assert.equal(shown.primary.code, '230');
  assert.equal(shown.alternatives.length, 2);
  assert.match(page, /el\('span', 'eyebrow', 'Your closest match'\)/);
  assert.match(page, /el\('div', 'gs-alts-title', 'Also close'\)/);
  assert.equal(confidenceLine('excellent'), 'An excellent match');
  assert.match(confidenceLine('fair'), /worth trying in person/);
});

test('AC-3: the shopper can see the effect of her selection', () => {
  // Every depth and undertone the page offers gives its own complexion colour.
  const colours = DEPTH_STOPS.flatMap((d) => UNDERTONES.map((u) => complexion(d, u.id)));
  assert.equal(colours.length, 57);
  assert.equal(new Set(colours).size, 57);
  assert.equal(complexion(5, null), complexion(5, 'neutral'), 'neutral until an undertone is chosen');
  // Depths run lighter to deeper, and the words and model follow.
  assert.deepEqual([DEPTH_STOPS[0], DEPTH_STOPS.at(-1), DEPTH_STOPS.length], [1, 10, 19]);
  assert.deepEqual([1, 3.5, 4, 6.5, 7, 10].map(depthWord), ['lighter', 'lighter', 'medium', 'medium', 'deeper', 'deeper']);
  assert.equal(complexionLabel(8.5, 'warm'), 'deeper depth · golden undertone');
  assert.equal(new Set(DEPTH_STOPS.map((d) => nearestModel(d).id)).size, PHOTO_MODELS.length, 'all four models appear across the range');
  // The page shows the shopper's complexion and the matched shade side by side.
  assert.match(page, /id="you-disc"/);
  assert.match(page, /id="match-disc"/);
  assert.match(page, /you\.style\.background = complexion\(state\.depth, tone\);/);
  // An alternative says how it differs from what she chose.
  const me = { depth: 5, undertone: 'warm' };
  assert.equal(difference(me, { depth: 5, undertone: 'warm' }), 'your depth, your undertone');
  assert.equal(difference(me, { depth: 4.5, undertone: 'neutral' }), 'a touch lighter, neutral undertone');
  assert.equal(difference(me, { depth: 6, undertone: 'neutral' }), 'a little deeper, neutral undertone');
  assert.equal(difference(me, { depth: 7, undertone: 'cool' }), 'noticeably deeper, cool undertone');
});

test('AC-4: product and bag functionality continue to work from the recommendation', async () => {
  assert.match(page, /const add = \(m, button\) => addToBag\(\{ productId: m\.productId, name: m\.productName, shadeCode: m\.code, shadeName: m\.name, depth: m\.depth, undertone: m\.undertone \}, button\);/);
  assert.match(page, /b\.onclick = \(\) => add\(m, b\);[\s\S]*b\.onclick = \(\) => add\(m, b\);/, 'both the recommendation and the alternatives can be added');
  assert.match(page, /<a class="cta" href="\/cart\.html">View my bag<\/a>/);
  assert.match(page, /<a class="quiet-link" href="\/#collection">/);
  assert.match(page, /updateBagCount\(\);/);
  // The price shown comes from the catalog.
  const { products } = await (await fetch(`${base}/api/products?category=foundation`)).json();
  assert.equal(products[0].priceCents, 4200);
  assert.match(page, /formatMoney\(priceCents\)/);
});

test('AC-5: what earlier features require of this page still holds', async () => {
  // Feature 002 AC-5 and AC-6, Feature 005 AC-7, SEC-2.
  for (const needle of ['id="depth"', 'name="undertone"', 'id="results"', 'id="consultation"', '/api/shade-match', 'Shade Finder']) assert.ok(page.includes(needle), needle);
  const js = await readFile(new URL('../public/guided-shade.js', import.meta.url), 'utf8');
  assert.doesNotMatch(page + js, /perfect/i);
  assert.doesNotMatch(page + js, /localStorage|sessionStorage|indexedDB|document\.cookie|sendBeacon|console\.|location\.(search|hash)|history\./);
  assert.doesNotMatch(js, /fetch\(/);
  assert.deepEqual([...page.matchAll(/fetch\(([^,)]*)/g)].map((m) => m[1]).sort(), ["'/api/products?category=foundation'", "'/api/shade-match'"]);
  assert.match(page, /A photo cannot show a shade exactly\./);
  // The page's undertone labels are the ones the logic uses.
  for (const u of UNDERTONES) assert.ok(page.includes(`value="${u.id}" aria-pressed="false"><i></i><b>${u.label}</b><small>${u.hint}</small>`), u.id);
});

test('AC-6: the experience is laid out for desktop and for mobile', () => {
  assert.match(css, /(?:^|\n)\.gs \{ display: grid; grid-template-columns: minmax\(0, 1fr\) minmax\(0, 1\.1fr\);/);
  const narrow = css.slice(css.indexOf('@media (max-width: 860px) {'));
  assert.match(narrow, /\.gs \{ grid-template-columns: 1fr;/);
  assert.match(narrow, /\.gs-stage \{ position: static; \}/);
  // Controls are native buttons and a range input, so they work by touch and by keyboard.
  assert.match(page, /<input type="range" id="depth"[^>]*aria-label="[^"]+"/);
  assert.match(page, /b\.setAttribute\('aria-label', `Depth \$\{d\}`\);/);
  assert.equal([...page.matchAll(/<button type="button" name="undertone"/g)].length, 3);
});
