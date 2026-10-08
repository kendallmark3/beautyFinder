# Evidence: Feature 007 Beauty Discovery Experience

Run: `npm test` (full output in `tests.txt`) · Result: **49 / 49 passing** (41 from Features 001 to 006, 8 from Feature 007)

| AC | Test | Result | Implemented in |
|----|------|--------|----------------|
| AC-1 | `AC-1: the hero has one primary button, to discovery, and every page links to Discover` | PASS | `public/index.html`, headers in all four pages |
| AC-2 | `AC-2: the look is named, summarised and explained without "perfect"` | PASS | `public/discover.js` → `lookName()`, `lookSummary()`, `reasoning()` |
| AC-3 | `AC-3: every model has repaintable skin, lips, lashes and cheeks, and its own glow` | PASS | `public/discover.js` → `modelSvg()` |
| AC-4 | `AC-4: discovery choices are never stored or logged, and only two addresses are requested` | PASS | `public/discover.js`, `public/discover.html` (SEC-2) |
| AC-5 | `AC-5: the look's products follow the choices` | PASS | `public/discover.js` → `lookItems()` |
| AC-6 | `AC-6: with no shade match the look says so and lists no foundation` | PASS | `public/discover.js` → `reasoning()`, `NO_MATCH`, `lookItems()` |
| AC-7 | `AC-7: the page says what is sent and that lip, cheek and eye colours are a preview` | PASS | `public/discover.html`, `public/discover.js` → `reasoning()` |
| AC-8 | `AC-8: the discovery page uses the app's name and navigation, and its product buttons are readable` | PASS | `public/discover.html`, `public/discover.css` |

Scope check: every file touched is listed under Scope. Nothing under `src/` changed. No new dependencies.

This feature adds no API endpoint, so there is no `api-responses.md`.

## What the review found and what changed

The feature arrived through pull request #6 with four passing tests. A review in a real browser found:

| Found | Fix |
|-------|-----|
| The per-product "Add" buttons had white text on a white background | Dark text on those buttons |
| Dewy, soft and matte finishes looked identical on the model: every drawing defined its glow under the same id, and the first copy sat in a hidden section | Each drawing gets its own glow id |
| "Your choices stay on this device" although depth and undertone are sent to the server for matching | The page now says what is sent, that it is not logged or stored, and where the bag is kept |
| "Take home exactly what created it", and "Your berry lip", although the bag gets a lipstick with no colour and there are no cheek or eye colour products | The copy now says lip, cheek and eye colours are a preview |
| The page was headed "Beauty Finder" with its own navigation | Same name and navigation as every other page, and every page now links to Discover |
| The hero had two equal buttons and a wrapping link | One primary button; the other two are links on their own line |
| Cheek choice missing from the summary chips | Added |
| A look revealed before or without a shade match had an empty explanation and silently no foundation | The reveal waits for the match, retries once, and says so if there is none |
| A five-line intent with no scope or criteria, no evidence pack, and not listed in the intent index | This pack, a full intent file, and the index updated |

## Checked in a real browser

Headless Chrome, 1280 px wide, against the running app, after the fixes:

1. The model's face rendered as three different images for Dewy glow, Soft natural and Velvet matte (before the fix all three were identical).
2. A full run (Amara, Golden, Dewy glow, Dramatic, Berry, Pink) revealed "Amara's Evening Berry Glow" with 330 Warm Amber, Hydra Glow Serum, Volume Lift Mascara and Velvet Matte Lipstick, six summary chips, and visible "Add" buttons (dark text on white).
3. Before the fixes, "Add the whole look to my bag" put those four products in the bag and the bag priced them at $116.20 with the Complete Look saving. That path was not re-run after the fixes; its logic is unchanged apart from moving into `lookItems()`, which AC-5 tests.
4. On the front screen the hero showed one button and two single-line links, and the navigation read Catalog, Discover, Shade Finder, Bag.

## Limits of this evidence

- The no-match message (AC-6) is tested in the logic only. It was not seen in a browser, because the matching endpoint did not fail.
- Page behaviour is otherwise tested by matching page source; the clicks were done once, by the browser run above.
- The shopper still cannot choose a lipstick colour to buy. That needs lip shades in the catalog, which is outside this feature.
- The phone-width layout is not verified.
- Tests were run on Node 25.6.1. `npm test` does not run on Node 20.
