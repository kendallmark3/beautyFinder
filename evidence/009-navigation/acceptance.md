# Evidence: Feature 009 Navigation Home

Run: `npm test` (full output in `tests.txt`) · Result: **62 / 62 passing** (57 from Features 001 to 008, 5 from Feature 009)

| AC | Test | Result | Implemented in |
|----|------|--------|----------------|
| AC-1 | `AC-1: on every page the brand name is a link home` | PASS | `<header>` of all five pages |
| AC-2 | `AC-2: every page lists Home, Discover, Shade Finder and Bag in that order` | PASS | `<header>` of all five pages |
| AC-3 | `AC-3: only the link for the current page is marked current` | PASS | `<header>` of all five pages, `public/styles.css` |
| AC-4 | `AC-4: the header stays at the top of the window while the page scrolls` | PASS | `public/styles.css` → `header` |
| AC-5 | `AC-5: the Shade Finder link is always shown on the front screen` | PASS | `public/index.html` |

Scope check: every file touched is listed under Scope. Nothing under `src/` changed. No new dependencies. Two earlier tests (`tests/cart.test.js`, `tests/discover.test.js`) had their header patterns loosened to allow the new attributes.

This feature adds no API endpoint, so there is no `api-responses.md`.

## Checked in a real browser

Headless Chrome, 1280 px wide, against the running app:

1. Front screen scrolled 1,200 px down: the header was still at the top of the window, with Home marked.
2. On the completed-look screen of Discover, scrolled down: the header was still at the top, with Discover marked. Clicking the brand name went to the front screen.
3. On the bag page, Bag was marked; clicking Home went to the front screen.
4. On the credits page no link was marked.

## Limits of this evidence

- AC-4 is tested by reading the stylesheet; the scrolling itself was checked once, by the browser run above.
- At phone width the brand and four links share one row and were not checked for fit. A mobile menu is out of scope.
- Tests were run on Node 25.6.1. `npm test` does not run on Node 20.
