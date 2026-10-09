// Says plainly when Node is too old, instead of the test runner's "Could not find 'tests/**/*.test.js'".
// Runs before `npm test` (pretest) and from the edit hook.
import { fileURLToPath } from 'node:url';

export const MIN_NODE = 22;

export function nodeProblem(version = process.versions.node) {
  const major = Number(String(version).split('.')[0]);
  if (major >= MIN_NODE) return null;
  return `Tests need Node ${MIN_NODE} or newer; this shell runs Node ${version}. Switch Node (the repo's .nvmrc says ${MIN_NODE}) and run again. Nothing was tested.`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problem = nodeProblem();
  if (problem) {
    console.error(problem);
    process.exit(1);
  }
}
