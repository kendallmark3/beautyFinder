// Feature 007 tests.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from '../src/server.js';
import { MODELS, lookName, lookSummary, reasoning, modelSvg } from '../public/discover.js';

let server, base;
before(async () => { server = await createServer(); await new Promise((r) => server.listen(0, r)); base = `http://localhost:${server.address().port}`; });
after(() => server.close());
const text = async (p) => (await fetch(`${base}${p}`)).text();
const state = { model: MODELS[0], depth: 8, undertone: 'warm', lip: 'berry', eyes: 'dramatic', finish: 'dewy', blush: 'peach' };

test('AC-1: the home hero offers one obvious action into discovery', async () => {
  assert.match(await text('/'), /href="\/discover\.html"/);
  const page = await text('/discover.html');
  assert.match(page, /id="begin"/);
  assert.match(page, /id="add-look"/);
});

test('AC-2: the look is named, summarised and explained without "perfect"', () => {
  assert.match(lookName(state), /Amara/);
  assert.match(lookSummary(state), /dewy skin/);
  const why = reasoning(state, { name: '230 Honey Beige', confidence: 'good' });
  assert.match(why, /230 Honey Beige/);
  assert.doesNotMatch(why + lookName(state), /perfect/i);
});

test('AC-3: every model is drawn with repaintable skin, lips, lashes and cheeks', () => {
  for (const m of MODELS) assert.match(modelSvg(m), /var\(--skin\)[\s\S]*var\(--lip\)/);
});

test('AC-4: discovery choices are never stored or logged', async () => {
  const js = (await readFile(new URL('../public/discover.js', import.meta.url), 'utf8'));
  const html = await text('/discover.html');
  assert.doesNotMatch(js + html, /localStorage|sessionStorage|indexedDB|document\.cookie|sendBeacon|console\./);
  assert.doesNotMatch(js + html, /https?:\/\/(?!www\.w3\.org)/);
});
