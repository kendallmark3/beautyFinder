// Feature 009 tests. Each test name starts with the acceptance criterion it proves.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';

let server, base;
const PAGES = { '/': '/', '/discover.html': '/discover.html', '/shade-finder.html': '/shade-finder.html', '/cart.html': '/cart.html', '/credits.html': null, '/recommendations.html': null };
const headers = {};
before(async () => {
  server = await createServer();
  await new Promise((r) => server.listen(0, r));
  base = `http://localhost:${server.address().port}`;
  for (const p of Object.keys(PAGES)) headers[p] = (await (await fetch(`${base}${p}`)).text()).match(/<header>[\s\S]*?<\/header>/)[0];
});
after(() => server.close());

const links = (header) => [...header.match(/<nav[\s\S]*<\/nav>/)[0].matchAll(/<a ([^>]*)>(.*?)<\/a>/g)]
  .map(([, attrs, label]) => ({ href: attrs.match(/href="([^"]+)"/)[1], current: /aria-current="page"/.test(attrs), label: label.replace(/<[^>]+>/g, '') }));

test('AC-1: on every page the brand name is a link home', () => {
  for (const [p, h] of Object.entries(headers)) assert.match(h, /<h1><a class="brand" href="\/">Beauty Advisor<\/a><\/h1>/, p);
});

test('AC-2: every page lists Home, Discover, Shade Finder and Bag in that order', () => {
  for (const [p, h] of Object.entries(headers)) {
    assert.deepEqual(links(h).map((l) => [l.label, l.href]), [
      ['Home', '/'], ['Discover', '/discover.html'], ['Shade Finder', '/shade-finder.html'], ['Bag (0)', '/cart.html'],
    ], p);
    assert.doesNotMatch(h, / hidden/, p);
  }
});

test('AC-3: only the link for the current page is marked current', () => {
  for (const [p, current] of Object.entries(PAGES)) {
    assert.deepEqual(links(headers[p]).filter((l) => l.current).map((l) => l.href), current ? [current] : [], p);
  }
});

test('AC-4: the header stays at the top of the window while the page scrolls', async () => {
  const css = await (await fetch(`${base}/styles.css`)).text();
  const rule = css.match(/(?:^|\n)header \{[^}]*\}/)[0];
  assert.match(rule, /position: sticky;/);
  assert.match(rule, /top: 0;/);
  assert.match(rule, /z-index: \d+;/);
});

test('AC-5: the Shade Finder link is always shown on the front screen', async () => {
  const home = await (await fetch(`${base}/`)).text();
  assert.doesNotMatch(home, /shade-link|method: 'HEAD'/);
  assert.ok(links(headers['/']).some((l) => l.href === '/shade-finder.html'));
});
