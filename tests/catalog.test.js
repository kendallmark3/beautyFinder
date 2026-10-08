// Feature 001 tests. Each test name starts with the acceptance criterion it proves.
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

test('AC-1: GET /api/products returns the full catalog', async () => {
  const res = await fetch(`${base}/api/products`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.count, 5);
  assert.equal(body.products.length, body.count);
});

test('AC-2: ?category= filters products (case-insensitive)', async () => {
  const body = await (await fetch(`${base}/api/products?category=Serum`)).json();
  assert.equal(body.count, 2);
  assert.ok(body.products.every((p) => p.category === 'serum'));
});

test('AC-3: unknown category returns 200 with an empty list', async () => {
  const res = await fetch(`${base}/api/products?category=perfume`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { count: 0, products: [] });
});

test('AC-4: every foundation shade has code, name, depth (1-10) and undertone', async () => {
  const body = await (await fetch(`${base}/api/products?category=foundation`)).json();
  const shades = body.products[0].shades;
  assert.ok(shades.length >= 15);
  for (const s of shades) {
    assert.ok(s.code && s.name);
    assert.ok(s.depth >= 1 && s.depth <= 10);
    assert.ok(['cool', 'neutral', 'warm'].includes(s.undertone));
  }
});
