# post-implement
Run tests and update docs.

Wired as: `.claude/settings.json` → PostToolUse hook → `hooks/run-tests.mjs`.
Runs `npm test` after every Edit/Write. On failure it exits 2 and Claude must fix the break.
