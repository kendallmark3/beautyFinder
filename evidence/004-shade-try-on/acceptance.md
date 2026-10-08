# Evidence: Feature 004 Shade Try-On

Run: `npm test` (full output in `tests.txt`) · Result: **23 / 23 passing** (16 from Features 001 to 003, 7 from Feature 004)

| AC | Test | Result | Implemented in |
|----|------|--------|----------------|
| AC-1 | `AC-1: every foundation shade is offered as a button labelled with its name` | PASS | `public/try-on.js` → `swatchButtons()`, `mountTryOn()` |
| AC-2 | `AC-2: picking a shade paints the model with that shade's shadeColor and names it` | PASS | `public/try-on.js` → `createTryOn().pick()`, `skinColors()`, `previewText()` |
| AC-3 | `AC-3: until a shade is picked the model steps lighter to deeper and wraps; picking stops it` | PASS | `public/try-on.js` → `createTryOn().start()`, `nextIndex()` |
| AC-4 | `AC-4: with reduced motion nothing auto-cycles or animates, and picking still works` | PASS | `public/try-on.js` → `reducedMotion`, `public/styles.css` → `prefers-reduced-motion` rule |
| AC-5 | `AC-5: /hero.svg keeps its original colours as defaults when no script runs` | PASS | `public/hero.svg` |
| AC-6 | `AC-6: the picked shade is never logged, stored, or sent` | PASS | `public/try-on.js` (no request, storage, or logging), `public/index.html` (fixed request addresses) |
| AC-7 | `AC-7: try-on copy calls itself a preview and never uses "perfect"` | PASS | `public/index.html`, `public/try-on.js` → `previewText()` |

Scope check: created `public/try-on.js` and `tests/try-on.test.js`; changed `public/index.html`, `public/styles.css`, `public/hero.svg`. Nothing under `src/` and nothing in `public/shade-finder.html` changed. No new dependencies.

This feature adds no API endpoint, so there is no `api-responses.md`.

## Checked in a real browser

Headless Chrome, 1280 px wide, against the running app:

| Moment | Shade shown | Model's skin (computed fill) |
|--------|-------------|------------------------------|
| On arrival | 110 Porcelain | `rgb(236, 220, 213)` |
| 2.4 s later | 120 Ivory | `rgb(232, 213, 198)` |
| 4.7 s later | 130 Alabaster | `rgb(231, 207, 180)` |
| After clicking 350 Mahogany | 350 Mahogany | `rgb(103, 63, 46)` |
| 3.6 s after the click | 350 Mahogany (cycle stopped) | `rgb(103, 63, 46)` |

This check found a defect the tests had missed: a comment in `hero.svg` contained a double hyphen, which made the file invalid XML. It was fixed and AC-5's test now guards against it.

## Limits of this evidence

- The automated tests exercise the try-on logic with a stand-in timer and check markup and CSS text. They do not click, and they do not see colour or motion.
- Reduced motion was tested in the logic and the CSS rule only, not in a browser with the setting switched on.
- Keyboard use relies on the swatches being native buttons; it was not exercised by hand.
- The phone-width layout is not verified.
- Tests were run on Node 25.6.1. `npm test` does not run on Node 20.
