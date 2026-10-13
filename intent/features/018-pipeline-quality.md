# Feature 018: Pipeline Quality Gates

**Status:** Done · Evidence: `evidence/018-pipeline-quality/` · **Team:** Platform

## Story
As the team that owns this repo, we want the pipeline to tell us more than "the tests ran",
so that a change that lowers quality or introduces a security weakness is stopped before it
is merged.

## Outcome
The pipeline moves up one level: from "runs the tests" to "runs the tests, measures them,
checks the code parses, and scans it for weaknesses". Using only what we already have.

## Inputs
- The existing workflow, `.github/workflows/ci.yml`, and the 111 tests.
- Node 22's own test runner, which can measure coverage and enforce a floor.
- GitHub's own code scanner (CodeQL), which is free for a public repository and needs no account or token.
- No SonarQube credentials, and the repo's rule: zero dependencies, no npm packages.

## Decisions
- **Not SonarQube, yet.** It needs a server or a SonarCloud account, and a token stored as a secret. We have neither.
  CodeQL covers the security half of what Sonar would report, with no credentials; a coverage floor covers the
  number people most often read off a Sonar dashboard.
- **Not a linter, yet.** ESLint is an npm package, and this repo forbids them. `node --check` on every script file
  catches what cannot parse, with nothing installed. A linter is the natural next step once the team accepts one
  development-only dependency; that is its own intent.

## Scope
- **In (create):** `.github/workflows/codeql.yml`, `scripts/check-syntax.mjs`, `tests/pipeline.test.js`
- **In (change):** `.github/workflows/ci.yml`, `package.json` (scripts only), `tests/platform.test.js` (012 AC-4's pattern for the workflow only),
  `.claude/CLAUDE.md` (Commands)
- **Out:** application code, SonarQube or SonarCloud, ESLint or any npm package, deployment, branch protection settings
  on GitHub (a repository setting, not a file), fixing anything the scanner finds (each finding is its own change).

## Feature rules
- No secrets and no accounts. Everything runs with the token GitHub gives every workflow.
- No npm packages. Every check uses Node itself or an action published by GitHub.
- Workflows ask for the least access they need: read-only by default; the scanner alone may write its results.
- The coverage floor is set a little under today's figures (lines 91%, branches 92%, functions 96%), so it stops
  a real drop and does not fail on noise. Raising it is a deliberate change.
- A pull request is tested once, not twice: pushes run the pipeline on `main` only.
- Every check can be run on a laptop with one command, the same one the pipeline uses.

## Acceptance criteria
- **AC-1** The pipeline fails when a script file does not parse: `npm run check` runs `node --check` over every `.js` and `.mjs` file in `src/`, `public/`, `scripts/`, `hooks/` and `tests/`.
- **AC-2** The pipeline measures test coverage and fails below 88% of lines, 85% of branches, or 90% of functions; the tests themselves are not counted.
- **AC-3** CodeQL scans the JavaScript on every pull request to `main`, every push to `main`, and weekly, using the security-and-quality queries, without scanning `reference/` or `evidence/`.
- **AC-4** Both workflows are read-only by default; only the scan job may write security results. Neither uses a secret.
- **AC-5** A pull request is tested once: the pipeline runs on pull requests, on pushes to `main`, and by hand.
- **AC-6** The repo still has no dependencies, and the same checks run locally with `npm run check` and `npm run test:coverage`.

## Success, shown on GitHub
- A pull request for this feature shows three checks, and all pass: syntax, tests with coverage, CodeQL.
- The coverage figures appear in the test job's log.
- Any CodeQL findings are listed in the evidence, not fixed here.

## Done when
`npm test` passes, every AC maps to a passing test, the three checks have run on GitHub, and
`evidence/018-pipeline-quality/` is complete.
