# pre-pr
Verify checks before PR.

Wired as: the `/evidence` command. No PR until `evidence/<feature-id>/acceptance.md`
shows every acceptance criterion with a passing test. CI (`.github/workflows/ci.yml`) re-runs `npm test`.
