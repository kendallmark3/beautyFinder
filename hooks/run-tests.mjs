// Claude Code PostToolUse hook: runs the test suite after every file edit.
// Exit code 2 sends the failure back to Claude so it fixes the break before moving on.
// Deterministic: this runs every time, whatever the model decides.
import { spawnSync } from 'node:child_process';
import { nodeProblem } from '../scripts/check-node.mjs';

// An old Node fails before any test runs. Say so, rather than report failing tests.
const problem = nodeProblem();
if (problem) {
  console.error(problem);
  process.exit(2);
}

const run = spawnSync('npm', ['test', '--silent'], { encoding: 'utf8', shell: true });
if (run.status !== 0) {
  const tail = (run.stdout + run.stderr).split('\n').filter((l) => /not ok|fail|Error/i.test(l)).slice(0, 15).join('\n');
  console.error(`Tests are failing after this edit. Fix before continuing:\n${tail}`);
  process.exit(2);
}
process.exit(0);
