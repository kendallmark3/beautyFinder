// Feature 018: fails when a script file does not parse. Uses `node --check`; nothing is installed.
// Run with `npm run check`. The pipeline runs the same command.
// This relies on package.json saying "type": "module": without it, Node does not report a
// syntax error in a .js file that uses `export`.
import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const CHECKED_DIRS = ['src', 'public', 'scripts', 'hooks', 'tests'];

export function scriptFiles(root, dirs = CHECKED_DIRS) {
  return dirs
    .flatMap((dir) => readdirSync(path.join(root, dir), { recursive: true }).map((f) => path.join(dir, String(f))))
    .filter((f) => /\.(js|mjs)$/.test(f))
    .sort();
}

// Returns the files that failed, each with the parser's message.
export function checkSyntax(root, files = scriptFiles(root)) {
  return files.flatMap((file) => {
    const run = spawnSync(process.execPath, ['--check', path.join(root, file)], { encoding: 'utf8' });
    return run.status === 0 ? [] : [{ file, message: run.stderr.trim() }];
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
  const files = scriptFiles(root);
  const failures = checkSyntax(root, files);
  for (const f of failures) console.error(`${f.file}\n${f.message}\n`);
  console.log(`Syntax check: ${files.length - failures.length} of ${files.length} files parse.`);
  process.exit(failures.length ? 1 : 0);
}
