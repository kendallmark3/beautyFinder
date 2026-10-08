# Feature 003: Beauty Home

**Status:** Done · Evidence: `evidence/003-beauty-home/` · **Team:** Complexion squad

## Story
As a shopper arriving at Beauty Advisor, I want the front screen to look and feel like a
beauty site and point me at the Shade Finder, so that I want to start finding my shade.

## Goal
The front screen opens with a full-width hero on a warm, page-filling background: an
illustration of women across skin depths, a headline, and a clear way into the Shade Finder.
The catalog stays on the same page, below the hero.

## Scope
- **In (create):** `public/hero.svg`, `tests/home.test.js`
- **In (change):** `public/index.html`, `public/styles.css`
- **In (read only):** `public/shade-color.js`, `GET /api/products` (Feature 001)
- **Out:** `src/` (server, routes, lib, data), `public/shade-finder.html` (it picks up the new
  background through the shared stylesheet only), photographs, web fonts, and any asset or
  script loaded from another site.

## Context to read
- `intent/project-intent.md`: constraints (zero dependencies, inclusive by design)
- `context/architecture.md`: static files are served from `public/`
- Skill: `.claude/skills/shade-science/` (customer copy)

## Feature rules
- The image is an illustration drawn for this app and kept in the repo. No stock photos, no hotlinked images.
- The illustration shows more than one skin depth, lighter to deeper.
- Customer copy follows the shade-science skill ("match", never "perfect"; "lighter" / "deeper").
- The hero makes no promise the app cannot keep (no claims about time, accuracy, or results).
- No new dependencies. No changes outside Scope.

## Acceptance criteria
- **AC-1** `/` shows a hero with a headline and a link to `/shade-finder.html`.
- **AC-2** `/hero.svg` is served as an SVG image, and the page shows it with alternative text.
- **AC-3** The shared stylesheet gives the whole page a background colour other than the old `#fafaf8`.
- **AC-4** The catalog (category filters and product grid) is still on the front screen, and Feature 001's tests still pass.
- **AC-5** The front screen and the illustration load nothing from another site.
- **AC-6** Hero copy never uses "perfect".

## Done when
`npm test` passes, every AC maps to a passing test, and `evidence/003-beauty-home/` is complete.
