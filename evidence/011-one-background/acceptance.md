# Evidence: Feature 011 One Background

Run: `npm test` (full output in `tests.txt`) · Result: **72 / 72 passing** (68 from Features 001 to 010, 4 from Feature 011)

| AC | Test | Result | Implemented in |
|----|------|--------|----------------|
| AC-1 | `AC-1: the page background is defined once, on body, and is the deeper blush` | PASS | `public/styles.css` → `body` |
| AC-2 | `AC-2: no page or section sets a page background of its own` | PASS | `public/styles.css` → `.hero`; `public/discover.css` |
| AC-3 | `AC-3: every page loads the shared stylesheet` | PASS | all five pages |
| AC-4 | `AC-4: page headings use one typeface on every page` | PASS | `public/styles.css` → `h2` |

Scope check: only `public/styles.css` and `public/discover.css` changed, plus the new test. No HTML file and nothing under `src/` changed. No new dependencies. No earlier test needed changing.

This feature adds no API endpoint, so there is no `api-responses.md`.

## Checked in a real browser

Headless Chrome, 1280 px wide, against the running app:

1. The computed background of `body` was identical on all five pages (Home, Discover, Shade Finder, Bag, Credits): a centred radial gradient from `rgb(249, 228, 214)` through `rgb(243, 213, 196)` to `rgb(236, 198, 178)`.
2. No section had a background of its own except the dark photo band on the front screen, which is meant to.
3. The main heading on every page rendered in Didot.
4. Shade Finder (with three results showing) and the empty bag were looked at on the new background.

## Limits of this evidence

- Whether the pages now feel consistent is a judgement; the browser check shows only that the same background and heading face are applied.
- The heading face is Didot or Bodoni where the system has it and Georgia otherwise, so headings look different on Windows.
- Checked at 1280 px wide only.
- Tests were run on Node 25.6.1. `npm test` does not run on Node 20.
