// Feature 012 tests. Each test name starts with the acceptance criterion it proves.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createServer, listenAddress } from '../src/server.js';
import { MIN_NODE, nodeProblem } from '../scripts/check-node.mjs';

let server, base;
before(async () => {
  server = await createServer();
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

const repo = (p) => readFile(new URL(`../${p}`, import.meta.url), 'utf8');
const text = async (p) => (await fetch(`${base}${p}`)).text();
// The rules inside the stylesheet's narrow-screen block.
const narrow = (css, width) => {
  const start = css.indexOf(`@media (max-width: ${width}px) {`);
  assert.ok(start >= 0, `no ${width}px block`);
  return css.slice(start, css.indexOf('\n}', start));
};

test('AC-1: photographs are served as image/jpeg', async () => {
  for (const f of ['group', 'model-lighter', 'model-light-medium', 'model-medium-deep', 'model-deeper']) {
    const res = await fetch(`${base}/photos/${f}.jpg`);
    assert.equal(res.status, 200, f);
    assert.equal(res.headers.get('content-type'), 'image/jpeg', f);
  }
  assert.equal((await fetch(`${base}/styles.css`)).headers.get('content-type'), 'text/css');
});

test('AC-2: the server listens on 127.0.0.1 port 3000 by default; HOST and PORT override', async () => {
  assert.deepEqual(listenAddress({}), { port: 3000, host: '127.0.0.1' });
  assert.deepEqual(listenAddress({ PORT: '4100', HOST: '0.0.0.0' }), { port: 4100, host: '0.0.0.0' });
  assert.deepEqual(listenAddress({ PORT: 'nonsense' }), { port: 3000, host: '127.0.0.1' });
  assert.match(await repo('src/server.js'), /server\.listen\(port, host,/);
});

test('AC-3: an old Node stops npm test and the edit hook with a message naming both versions', async () => {
  assert.equal(MIN_NODE, 22);
  assert.equal(nodeProblem('22.0.0'), null);
  assert.equal(nodeProblem('25.6.1'), null);
  const message = nodeProblem('20.20.2');
  assert.match(message, /Node 22 or newer/);
  assert.match(message, /Node 20\.20\.2/);
  assert.match(message, /Nothing was tested/);
  assert.equal(JSON.parse(await repo('package.json')).scripts.pretest, 'node scripts/check-node.mjs');
  assert.match(await repo('hooks/run-tests.mjs'), /const problem = nodeProblem\(\);\nif \(problem\) \{\n  console\.error\(problem\);\n  process\.exit\(2\);/);
  assert.equal((await repo('.nvmrc')).trim(), '22');
  // On the Node running these tests, the check passes quietly.
  const run = spawnSync(process.execPath, [fileURLToPath(new URL('../scripts/check-node.mjs', import.meta.url))], { encoding: 'utf8' });
  assert.equal(run.status, 0);
  assert.equal(run.stderr, '');
});

test('AC-4: CI runs on push and pull request and can be started by hand', async () => {
  const yml = await repo('.github/workflows/ci.yml');
  assert.match(yml, /^on: \[push, pull_request, workflow_dispatch\]$/m);
  assert.match(yml, /node-version: 22/);
  assert.match(yml, /run: npm test/);
});

test('AC-5: at phone width the header stacks the brand above the links and splits no label', async () => {
  const block = narrow(await text('/styles.css'), 760);
  assert.match(block, /header \{ flex-direction: column;/);
  assert.match(block, /header h1 \{[^}]*white-space: nowrap;/);
  assert.match(block, /header nav \{ display: flex; flex-wrap: wrap; justify-content: center;/);
  assert.match(block, /header nav a \{[^}]*white-space: nowrap;/);
});

test('AC-6: at phone width a bag line is two rows', async () => {
  const block = narrow(await text('/styles.css'), 760);
  assert.match(block, /\.bag-line \{[^}]*grid-template-areas: "dot info total" "dot qty remove";/);
  for (const [sel, area] of [['.qty', 'qty'], ['.line-total', 'total'], ['.remove', 'remove']]) {
    assert.match(block, new RegExp(`\\.bag-line \\${sel} \\{ grid-area: ${area};`));
  }
});

test('AC-7: at phone width the Discover studio and look fit the screen', async () => {
  const block = narrow(await text('/discover.css'), 800);
  assert.match(block, /\.studio, \.look \{ grid-template-columns: 1fr;[^}]*padding-left: 16px; padding-right: 16px;/);
  assert.match(block, /\.stage \{[^}]*width: 100%; max-width: 340px;/);
});
