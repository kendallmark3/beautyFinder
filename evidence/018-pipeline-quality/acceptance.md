# Evidence: Feature 018 Pipeline Quality Gates

Run: `npm test` (full output in `tests.txt`) · Result: **117 / 117 passing** (111 before, 6 from Feature 018)

| AC | Test | Result | Implemented in |
|----|------|--------|----------------|
| AC-1 | `AC-1: the pipeline fails when a script file does not parse` | PASS | `scripts/check-syntax.mjs`, `package.json` → `check`, `.github/workflows/ci.yml` → `syntax` |
| AC-2 | `AC-2: the pipeline measures coverage and fails below the floor; tests are not counted` | PASS | `package.json` → `test:coverage`, `.github/workflows/ci.yml` → `test` |
| AC-3 | `AC-3: CodeQL scans the JavaScript on pull requests, pushes to main and weekly` | PASS | `.github/workflows/codeql.yml` |
| AC-4 | `AC-4: both workflows are read-only by default, only the scan may write results, and neither uses a secret` | PASS | both workflow files |
| AC-5 | `AC-5: a pull request is tested once` | PASS | `.github/workflows/ci.yml` → `on`, `concurrency` |
| AC-6 | `AC-6: the repo still has no dependencies, and the checks run locally by name` | PASS | `package.json` |

Scope check: every file touched is listed under Scope. No application code changed. One pattern in `tests/platform.test.js` (012 AC-4) was updated for the rewritten workflow triggers. No npm packages, no secrets.

This feature adds no API endpoint, so there is no `api-responses.md`.

## Success, shown on GitHub

Pull request #20, first push of this branch. Every check passed:

| Workflow | Check | Result | What its log showed |
|----------|-------|--------|---------------------|
| CI | Syntax | success | "Syntax check: 42 of 42 files parse." |
| CI | Tests and coverage | success | Node v22.23.3; 117 tests, 117 pass, 0 fail; all files 90.86% lines, 92.28% branches, 95.83% functions |
| CodeQL | Scan | success | CodeQL 2.27.2, 201 rules, **0 results** |
| CodeQL | CodeQL (results) | success | no new alerts |

- **One run per pull request:** the branch produced one CI run and one CodeQL run, both from the `pull_request` event. Before this feature each pull request ran CI twice.
- **Coverage per file** as measured locally is in `coverage.txt`.

## Checked locally

- `npm run check`: 42 of 42 files parse.
- `npm run test:coverage`: passes at 90.86 / 92.28 / 95.83 against floors of 88 / 85 / 90.
- The gate fails when it should: AC-2's test runs one test file against a 100% floor and gets a failing exit; AC-1's test writes a file with a syntax error and gets it reported.

## Found while building

`node --check` exits 0 for a `.js` file that uses `export` and contains a syntax error **when Node cannot tell the file is a module**. It reports the error correctly when `package.json` says `"type": "module"`, as this repo's does, and for `.mjs` files. The check therefore depends on that line of `package.json`; the script says so and AC-1's test asserts it.

## Limits of this evidence

- **Zero CodeQL results is not proof of no weaknesses.** It means none of 201 rules matched.
- **This is not SonarQube and not a linter.** `node --check` finds what cannot parse; it says nothing about style, unused code, or complexity.
- Scripts written inside the HTML pages are not covered by the syntax job (CodeQL does read them).
- The pushes-to-`main` and weekly triggers have not fired yet; they will first run after this is merged. Only the pull-request trigger has been seen working.
- Nothing on GitHub yet requires these checks before a merge. Branch protection is a repository setting.
- The coverage floor sits about three points under today's figures, so a small drop passes.
