# Feature 012: Hardening

**Status:** Done · Evidence: `evidence/012-hardening/` · **Team:** Platform

## Story
As the team that owns this repo, we want the loose ends found while building Features 002 to 011
closed, so that the next developer does not trip over them.

## Goal
The server listens on this machine only and serves photographs with the right type. An old Node
is reported plainly instead of as failing tests. CI can be started by hand. Every page fits a
phone-width screen.

## Scope
- **In (create):** `scripts/check-node.mjs`, `.nvmrc`, `tests/platform.test.js`
- **In (change):** `src/server.js` (file types and listen address only), `package.json` (`pretest`), `hooks/run-tests.mjs`,
  `.github/workflows/ci.yml` (manual trigger), `public/styles.css` and `public/discover.css` (rules for narrow screens only),
  `context/security.md` (SEC-5), `context/architecture.md`, `.claude/CLAUDE.md`
- **Out:** routing and request handling in `src/server.js`, any page's content, the photographs and their licence,
  installing or switching Node on a developer's machine, a mobile menu.

## Context to read
- `context/security.md`: SEC-3, SEC-5
- `.claude/CLAUDE.md`: Stack ("it never edits `server.js`" is about features; this is a platform change)

## Feature rules
- `src/server.js` changes are limited to the file-type table and the listen address. Features still add a route file and leave it alone.
- The server never listens beyond `127.0.0.1` unless `HOST` is set (SEC-5).
- The Node check reports and stops. It does not install or switch anything.
- No new dependencies. No changes outside Scope.

## Acceptance criteria
- **AC-1** Photographs are served as `image/jpeg`.
- **AC-2** The server listens on `127.0.0.1` port 3000 by default; `HOST` and `PORT` override them.
- **AC-3** On Node older than 22, `npm test` and the edit hook stop with a message that names the version found and the version needed.
- **AC-4** The CI workflow runs on push and pull request and can also be started by hand.
- **AC-5** At phone width the header puts the brand on one line and the four links on the next, with no label split.
- **AC-6** At phone width a bag line shows name and total on one row and quantity and remove on the next.
- **AC-7** At phone width the Discover studio and look fit the screen.

## Done when
`npm test` passes, every AC maps to a passing test, and `evidence/012-hardening/` is complete.
