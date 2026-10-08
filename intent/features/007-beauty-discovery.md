# Feature 007: Beauty Discovery Experience

**Status:** Done · Evidence: `evidence/007-beauty-discovery/` · **Team:** Complexion squad

This feature was first built from a five-line intent with no scope or acceptance criteria
(pull request #6). A review found defects, and this file was then written out in full to
match the other features. The original text is kept under Goal.

**Later changes:** Feature 008 replaced the drawn, named models with unnamed photographs and the repainted drawing with a palette, and changed AC-3. See `intent/features/008-real-photography.md`. The text below is as written at the time.

## Story
As a shopper who does not know where to start, I want to build a look on a model who feels
like me and see which products make it, so that I can put the whole look in my bag.

## Goal
Beauty Finder leads with discovery. `/discover.html` guides a shopper through choosing a
model, undertone, finish, eyes, lips and cheeks. The model repaints on every choice; the
foundation shade comes from the existing `/api/shade-match` rules. A completed look names
the look, explains why, lists products, and adds products or the whole look to the bag.

## Scope
- **In (create):** `public/discover.html`, `public/discover.js`, `public/discover.css`, `tests/discover.test.js`
- **In (change):** `public/index.html` (hero button and nav link), `public/shade-finder.html` and `public/cart.html` (nav link only),
  `public/styles.css` (hero button layout only)
- **In (read only):** `POST /api/shade-match` (Feature 002), `GET /api/products` (Feature 001), `public/cart.js` (Feature 005), `public/shade-color.js`
- **Out:** `src/` (server, routes, lib, data), AR, camera, photos, accounts, saving a look,
  lip, cheek or eye colour products (the catalog has none), renaming the app.

## Context to read
- `context/security.md`: SEC-2, SEC-4
- `context/business-rules.md`: BR-SM-1 to BR-SM-5 (through the existing endpoint only)
- Skill: `.claude/skills/shade-science/` (customer copy)

## Feature rules
- The foundation shade is the first result of `/api/shade-match`. Discovery has no matching rules of its own.
- Selections are never logged or stored (SEC-2). Depth and undertone are sent to this app's own server for
  matching, and the page says so. The bag stays in session storage (SEC-4).
- Lip, cheek and eye colours are a preview on the model. The page says they are not products, and never
  implies the bag will contain a chosen colour.
- The header and navigation are the same as on every other page.
- Copy never calls a shade "perfect".
- No new dependencies. No changes outside Scope.

## Acceptance criteria
- **AC-1** The front-screen hero has one primary button, and it leads to `/discover.html`; every page's navigation links to Discover.
- **AC-2** A completed look is named, summarised, and explained, without the word "perfect".
- **AC-3** Every model is drawn with repaintable skin, lips, lashes and cheeks, and each drawing has its own glow, so the finish choice shows on the model.
- **AC-4** Discovery code never stores or logs a choice, and the page requests only `/api/products` and `/api/shade-match`.
- **AC-5** The look's products follow the choices: the matched foundation shade; a serum only for a dewy finish; a mascara unless eyes are natural; a lipstick always.
- **AC-6** When no foundation shade could be matched, the look says so and lists no foundation.
- **AC-7** The page states what is sent to the server and that lip, cheek and eye colours are a preview only.
- **AC-8** The discovery page uses the app's name and navigation, and its product buttons have readable text.

## Done when
`npm test` passes, every AC maps to a passing test, and `evidence/007-beauty-discovery/` is complete.
