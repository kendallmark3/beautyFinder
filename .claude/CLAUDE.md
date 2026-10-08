# Beauty Advisor: Team CLAUDE.md (root layer)

Owned by the platform team. Feature developers: put your personal habits in
`~/.claude/CLAUDE.md` (see `docs/personal-CLAUDE.md.example`), and put feature
details in `intent/features/`. Don't edit this file for one feature.

## Stack
- Node.js 22+, ES modules, **zero runtime dependencies**. Do not add npm packages.
- Server: `src/server.js` auto-loads every file in `src/routes/`. A new feature adds a route file; it never edits `server.js`.
- Domain logic: `src/lib/`. Routes stay thin.
- UI: static HTML in `public/`, shared styles in `public/styles.css`.
- Tests: `node:test` in `tests/`, one file per feature.

## Commands
- Run app: `npm start` → http://localhost:3000 (`PORT` overrides it). There is no `npm install`, build step, or linter.
- Run tests: `npm test`
- Run one test: `node --test --test-name-pattern="AC-2" tests/catalog.test.js`
- `npm test` needs Node 22+ on `PATH`: on Node 20 the quoted glob is not expanded and it fails with "Could not find 'tests/**/*.test.js'" before any test runs. Check `node --version` first if every edit reports failing tests.
- `npm run lab:reference` copies the instructor's Feature 002 build from `reference/` over `src/`, `public/`, and `tests/`. It is the class fallback; run it only when asked.

## Architecture
- A route file default-exports an array of `{ method, path, handler }`. `server.js` matches on method and exact pathname only: there are no path parameters or wildcards, so variable input goes in the query string or the body.
- Handlers receive `{ req, res, query, body }`. `query` is a `URLSearchParams`. `body` is parsed only for POST (an empty body is `{}`), and `server.js` already answers `400` for malformed JSON, so a handler validates fields, not syntax.
- Routes import `sendJson` from `src/lib/http.js`, never from `server.js` (circular import).
- Any request that matches no route is served from `public/`, so a new page needs no registration. `public/index.html` reveals the Shade Finder nav link by sending `HEAD /shade-finder.html`; the link appears once that file exists.
- Tests import `createServer()` from `src/server.js`, listen on port 0, and call the API with real `fetch`. No mocks.
- `src/lib/catalog.js` is the only reader of `src/data/products.json`. Other features go through its functions (`getFoundationShades()` for shade matching).
- Shade ranking rules exist in two places that must agree: `context/business-rules.md` (BR-SM-1 to BR-SM-5, the source of truth) and `.claude/skills/shade-science/SKILL.md`.

## What is wired and what is only described
- Wired: `.claude/settings.json` (PostToolUse hook → `hooks/run-tests.mjs`, which runs `npm test` after every Edit/Write and exits 2 on failure), `.claude/commands/` (`/run-intent`, `/evidence`), `.claude/skills/shade-science/`, and CI (`npm test` on Node 22).
- Because tests are written first, the hook reports failures until the code that satisfies them lands. That is expected mid-feature; it must be green before the feature is called done.
- Descriptive only, inherited from the starter repo: `agents/*.md`, `skills/feature-planner.md`, `hooks/*.md`, and `templates/`. Editing them changes no behaviour.
- `reference/feature-002-shade-finder/` is the instructor's solution and example evidence, not part of the app. Nothing loads it.

## How we work
1. Read `intent/current-feature.md`, then the feature file it points to. Do not start without it.
2. Read the `context/` files the feature lists (business rules, security).
3. Propose a plan and wait for approval before writing code.
4. Stay inside the feature's **Scope**. If a change is needed outside scope, stop and ask.
5. Write a test for every acceptance criterion. Test names start with the AC id: `AC-3: ...`.
6. Never log or persist customer skin or personal inputs (see `context/security.md`).

## Definition of done
- `npm test` passes.
- Every acceptance criterion maps to a passing test.
- Evidence written to `evidence/<feature-id>/` with `/evidence`.
