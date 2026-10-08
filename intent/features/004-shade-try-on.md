# Feature 004: Shade Try-On

**Status:** Done · Evidence: `evidence/004-shade-try-on/` · **Team:** Complexion squad

## Story
As a shopper on the front screen, I want to pick a foundation shade and watch the model
take on that shade, so that finding my shade feels like play and I want to keep going.

## Goal
The hero illustration becomes interactive. Picking any shade swatch repaints the centre
model's skin in that shade with a smooth transition and names the shade. Until the shopper
picks one, the model cycles through the range on its own, so the screen is moving on arrival.

## Scope
- **In (create):** `public/try-on.js`, `tests/try-on.test.js`
- **In (change):** `public/index.html`, `public/styles.css`, `public/hero.svg`
- **In (read only):** `public/shade-color.js`, `GET /api/products` (Feature 001)
- **Out:** `src/` (server, routes, lib, data), `public/shade-finder.html`, cart, pricing,
  bundles, saving or sending the picked shade anywhere, photographs, and any asset or script
  loaded from another site.

## Context to read
- `intent/project-intent.md`: constraints (zero dependencies, inclusive by design)
- `context/security.md`: SEC-2 (a picked shade is treated as a skin input: never logged, stored, or sent)
- Skill: `.claude/skills/shade-science/` (customer copy)

## Feature rules
- Colours come from `shadeColor()` in `public/shade-color.js`. Do not invent a second colour model.
- Only the centre model changes. The other two stay, so the range of skin depths is always on screen.
- The page still shows the illustration when scripts do not run (Feature 003's AC-2 keeps passing).
- Motion stops for shoppers who ask for reduced motion (`prefers-reduced-motion`): no auto-cycle, no animation.
- The auto-cycle stops for good the first time the shopper picks a shade.
- The picked shade stays in the page. It is not put in a URL, a cookie, storage, or a request.
- Customer copy follows the shade-science skill. The try-on is a preview, and says so; it does not claim a match.
- No new dependencies. No changes outside Scope.

## Acceptance criteria
- **AC-1** Every foundation shade is offered in the hero as a button a shopper can pick with mouse or keyboard, labelled with the shade's name.
- **AC-2** Picking a shade sets the centre model's skin to that shade's `shadeColor()` and shows the shade's name and undertone.
- **AC-3** Until a shade is picked, the model steps through the shades in order, lighter to deeper, and wraps around; picking one stops it.
- **AC-4** With reduced motion requested, nothing auto-cycles or animates, and picking a shade still works.
- **AC-5** `/hero.svg` still renders as a plain image with its original colours when no script runs.
- **AC-6** The picked shade is never logged, stored, or sent: the try-on code makes no request and uses no storage.
- **AC-7** Try-on copy calls itself a preview and never uses "perfect".

## Done when
`npm test` passes, every AC maps to a passing test, and `evidence/004-shade-try-on/` is complete.
