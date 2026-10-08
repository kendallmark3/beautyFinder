# Evidence: Feature 003 Beauty Home

Run: `npm test` (full output in `tests.txt`) · Result: **16 / 16 passing** (4 from Feature 001, 6 from Feature 002, 6 from Feature 003)

| AC | Test | Result | Implemented in |
|----|------|--------|----------------|
| AC-1 | `AC-1: / shows a hero with a headline and a link to the Shade Finder` | PASS | `public/index.html` → `<section class="hero">` |
| AC-2 | `AC-2: /hero.svg is served as an SVG image and shown with alternative text` | PASS | `public/hero.svg`, `public/index.html` |
| AC-3 | `AC-3: the shared stylesheet fills the page with a new background colour` | PASS | `public/styles.css` → `body` |
| AC-4 | `AC-4: the catalog filters and product grid are still on the front screen` | PASS | `public/index.html`; Feature 001's four tests also pass |
| AC-5 | `AC-5: the front screen and the illustration load nothing from another site` | PASS | `public/index.html`, `public/styles.css`, `public/hero.svg` |
| AC-6 | `AC-6: hero copy never uses "perfect"` | PASS | `public/index.html`, `public/hero.svg` |

Scope check: created `public/hero.svg` and `tests/home.test.js`; changed `public/index.html` and `public/styles.css`. Nothing under `src/` changed. No new dependencies.

This feature adds no API endpoint, so there is no `api-responses.md`.

## Limits of this evidence

- **The tests check markup and CSS text, not appearance.** Whether the screen looks appealing is a judgement; it was checked by eye in Chrome at 1280 px wide (home) and 1100 px wide (Shade Finder).
- **The phone-width layout is not verified.** The stylesheet has a single-column rule below 760 px, but the headless browser used for checking would not render narrower than about 500 px, so that screenshot was not a fair test.
- Heading type uses the system's Didot or Bodoni where present and falls back to Georgia, so the headline looks different on Windows.
- Tests were run on Node 25.6.1. `npm test` does not run on Node 20.
