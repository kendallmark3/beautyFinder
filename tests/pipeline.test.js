// Feature 018 tests. Each test name starts with the acceptance criterion it proves.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { CHECKED_DIRS, checkSyntax, scriptFiles } from '../scripts/check-syntax.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(path.join(root, p), 'utf8');
const pkg = JSON.parse(read('package.json'));
const ci = read('.github/workflows/ci.yml');
const codeql = read('.github/workflows/codeql.yml');
// A child test run must not report into, or write coverage for, the run that started it.
const cleanEnv = () => { const { NODE_TEST_CONTEXT, NODE_V8_COVERAGE, ...env } = process.env; return env; };

test('AC-1: the pipeline fails when a script file does not parse', () => {
  assert.deepEqual(CHECKED_DIRS, ['src', 'public', 'scripts', 'hooks', 'tests']);
  const files = scriptFiles(root);
  for (const f of ['src/server.js', 'public/cart.js', 'scripts/check-syntax.mjs', 'hooks/run-tests.mjs', 'tests/pipeline.test.js', 'src/routes/cart.js']) assert.ok(files.includes(f), f);
  assert.deepEqual(checkSyntax(root, files), [], 'every script file in the repo parses');

  // A file that does not parse is reported, with the parser's message.
  const dir = mkdtempSync(path.join(tmpdir(), 'syntax-'));
  try {
    mkdirSync(path.join(dir, 'src'));
    // As in this repo: Node only checks `export` syntax in a file it knows to be a module.
    writeFileSync(path.join(dir, 'package.json'), '{ "type": "module" }\n');
    writeFileSync(path.join(dir, 'src', 'good.js'), 'export const ok = 1;\n');
    writeFileSync(path.join(dir, 'src', 'bad.js'), 'export const broken = ;\n');
    const failures = checkSyntax(dir, scriptFiles(dir, ['src']));
    assert.deepEqual(failures.map((f) => f.file), ['src/bad.js']);
    assert.match(failures[0].message, /SyntaxError/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  assert.equal(pkg.type, 'module', 'the check relies on the repo declaring its files as modules');
  assert.equal(pkg.scripts.check, 'node scripts/check-syntax.mjs');
  assert.match(ci, /^  syntax:[\s\S]*?- run: npm run check$/m);
});

test('AC-2: the pipeline measures coverage and fails below the floor; tests are not counted', () => {
  const script = pkg.scripts['test:coverage'];
  for (const flag of ['--experimental-test-coverage', '--test-coverage-exclude="tests/**"', '--test-coverage-lines=88', '--test-coverage-branches=85', '--test-coverage-functions=90']) assert.ok(script.includes(flag), flag);
  assert.match(ci, /^  test:[\s\S]*?- run: npm run test:coverage$/m);

  // The gate is real: one test file alone cannot reach a 100% floor, and the run fails.
  const run = (lines) => spawnSync(process.execPath, ['--test', '--experimental-test-coverage', '--test-coverage-exclude=tests/**', `--test-coverage-lines=${lines}`, 'tests/catalog.test.js'], { cwd: root, encoding: 'utf8', env: cleanEnv() });
  const tooHigh = run(100);
  assert.notEqual(tooHigh.status, 0);
  assert.match(tooHigh.stdout + tooHigh.stderr, /does not meet threshold|threshold of 100/);
  assert.equal(run(1).status, 0, 'the same run passes a floor it meets');
});

test('AC-3: CodeQL scans the JavaScript on pull requests, pushes to main and weekly', () => {
  assert.match(codeql, /^  pull_request:\n    branches: \[main\]$/m);
  assert.match(codeql, /^  push:\n    branches: \[main\]$/m);
  assert.match(codeql, /^  schedule:\n    - cron: '\d+ \d+ \* \* \d'$/m);
  assert.match(codeql, /uses: github\/codeql-action\/init@v\d+\n        with:\n          languages: javascript-typescript\n          queries: security-and-quality/);
  assert.match(codeql, /paths-ignore:\n              - reference\n              - evidence/);
  assert.match(codeql, /uses: github\/codeql-action\/analyze@v\d+/);
});

test('AC-4: both workflows are read-only by default, only the scan may write results, and neither uses a secret', () => {
  for (const [name, yml] of [['ci.yml', ci], ['codeql.yml', codeql]]) {
    assert.match(yml, /^permissions:\n  contents: read$/m, name);
    assert.doesNotMatch(yml, /secrets\.|SONAR_|_TOKEN|password:/, name);
    assert.doesNotMatch(yml, /: write-all|permissions: write/, name);
  }
  assert.deepEqual([...ci.matchAll(/^\s+([a-z-]+): write$/gm)].map((m) => m[1]), []);
  assert.deepEqual([...codeql.matchAll(/^\s+([a-z-]+): write$/gm)].map((m) => m[1]), ['security-events']);
  // Only actions published by GitHub are used.
  for (const yml of [ci, codeql]) for (const [, action] of yml.matchAll(/uses: ([^\s@]+)@/g)) assert.match(action, /^(actions|github)\//, action);
});

test('AC-5: a pull request is tested once', () => {
  assert.match(ci, /^on:\n  push:\n    branches: \[main\]\n  pull_request:\n  workflow_dispatch:$/m);
  assert.match(ci, /^concurrency:\n  group: ci-\$\{\{ github\.ref \}\}\n  cancel-in-progress: true$/m);
});

test('AC-6: the repo still has no dependencies, and the checks run locally by name', () => {
  assert.equal(pkg.dependencies, undefined);
  assert.equal(pkg.devDependencies, undefined);
  for (const f of ['package-lock.json', 'node_modules', 'eslint.config.js', 'sonar-project.properties']) assert.equal(existsSync(path.join(root, f)), false, f);
  for (const yml of [ci, codeql]) assert.doesNotMatch(yml, /npm (ci|install)|npx /);
  assert.deepEqual(Object.keys(pkg.scripts).filter((s) => ['check', 'test', 'test:coverage'].includes(s)), ['check', 'test', 'test:coverage']);
});
