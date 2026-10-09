# Evidence: Feature 010 Balanced Layout

Run: `npm test` (full output in `tests.txt`) · Result: **68 / 68 passing** (62 from Features 001 to 009, 6 from Feature 010)

| AC | Test | Result | Implemented in |
|----|------|--------|----------------|
| AC-1 | `AC-1: the header and every section share one page width and gutter` | PASS | `public/styles.css` → `:root`, `header`, `main`, `.bundles`, `.site-footer`; `public/discover.css` → `.studio`, `.look` |
| AC-2 | `AC-2: the hero headline, text, button and links are centred` | PASS | `public/styles.css` → `.hero-inner`, `.hero-copy`; `public/index.html` |
| AC-3 | `AC-3: all four models are side by side across the window, and the closest one is wider` | PASS | `public/styles.css` → `.hero-art.photo` |
| AC-4 | `AC-4: the shade card is below the photographs, never over one` | PASS | `public/index.html` → `.tryon`; `public/styles.css` → `.shade-card` |
| AC-5 | `AC-5: the swatches, bundle heading, band text, collection heading and footer are centred` | PASS | `public/styles.css` |
| AC-6 | `AC-6: a row of products that does not fill the width is centred` | PASS | `public/styles.css` → `.grid`, `.card` |

Scope check: every file touched is listed under Scope. Nothing under `src/` changed. No new dependencies. No earlier test needed changing.

This feature adds no API endpoint, so there is no `api-responses.md`.

## Measured in a real browser

Headless Chrome against the running app. Each figure is the gap in pixels from the left edge of the window to the element, and from the element to the right edge.

| Element | 1280 px window | 1728 px window |
|---------|----------------|----------------|
| Brand name (left) / Bag link (right) | 100 / 100 | 324 / 324 |
| Headline | 220 / 220 | 444 / 444 |
| Main button | 532 / 532 | 756 / 756 |
| Row of four models | 0 / 0 | 0 / 0 |
| Shade swatches | 391 / 391 | 615 / 615 |
| Shade card | 430 / 430 | 654 / 654 |
| Bundle cards | 100 / 100 | 324 / 324 |
| Band photograph | 0 / 0 | 0 / 0 |
| Category filters | 100 / 100 | 324 / 324 |
| Product row (five cards) | 100 / 100 | 324 / 324 |

Before this feature, at 1728 px, the brand name sat 40 px from the left while the hero text began at 354 px and the catalog at 404 px.

Also seen: with 250 True Beige picked, the four photos were 368, 368, 625 and 368 px wide (the medium-to-deep model widened); the shade card did not overlap the photographs; no page scrolled sideways; on Discover, Shade Finder and the bag page the brand name and the content shared the same left edge.

## Limits of this evidence

- The automated tests read the stylesheet and page source. They prove the rules are present, not that the page looks balanced; that judgement rests on the measurements and screenshots above.
- Only 1280 and 1728 px windows were measured. Phone and tablet widths were not checked; below 760 px only the matching model's photo is shown.
- Wide crops of portrait photographs cut into foreheads and chins. Focus points were adjusted by eye for one photo.
- The header's menu is still on the right and the brand name on the left, as is usual; they are now the same distance from their edges.
- Tests were run on Node 25.6.1. `npm test` does not run on Node 20.
