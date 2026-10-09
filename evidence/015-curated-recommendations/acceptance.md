# Evidence: Feature 015 Curated Recommendations

Run: `npm test` (full output in `tests.txt`) · Result: **99 / 99 passing** (93 before, 6 from Feature 015)

| AC | Test | Result | Implemented in |
|----|------|--------|----------------|
| AC-1 | `AC-1: GET /api/recommendations returns exactly three curated picks by default` | PASS | `src/routes/recommendations.js`, `src/lib/recommendations.js` → `getRecommendations()` |
| AC-2 | `AC-2: ?category= filters the recommendations to a single product category` | PASS | `src/lib/recommendations.js` (BR-REC-2) |
| AC-3 | `AC-3: /recommendations.html serves the curated-picks page and renders the experience` | PASS | `public/recommendations.html`, `public/recommendations.js` |
| AC-4 | `AC-4: the default picks are one each of serum, foundation and lipstick, in the order they are applied` | PASS | `src/lib/recommendations.js` → `ROUTINE` (BR-REC-1) |
| AC-5 | `AC-5: a foundation is never added to the bag from this page` | PASS | `src/lib/recommendations.js` → `needsShade`, `public/recommendations.js` |
| AC-6 | `AC-6: the page is reachable, has the shared header, and requests only /api/recommendations` | PASS | `public/index.html`, `public/recommendations.html`, `public/recommendations.js` |

Scope check: every file touched is listed under Scope in the intent as amended. `src/server.js` and the catalog data are unchanged. No new dependencies.

## How this feature arrived, and what review changed

The feature was found already built in the working folder, with an intent of three acceptance criteria, three passing tests, and an evidence file that mapped criteria to tests without results. Before it was merged it was read and run, and these were changed:

| Found | Changed to |
|-------|------------|
| "Add to bag" put a foundation in the bag with no shade, against Feature 005's rule | A product with shades links to the Shade Finder instead (AC-5) |
| The default three were the foundation and both serums, while the page said the picks ran "from the first step to the final swipe" | One product per routine step, in the order applied: serum, foundation, lipstick (BR-REC-1, AC-4) |
| Reasons and headings said "a best match", "a top choice", "favorites", "hand-picked"; nothing ranks products | Each reason says what the product is for; "curated" is defined as the fixed rule (BR-REC-3) |
| Nothing linked to the page | One link above the collection filters on the front screen (AC-6) |
| The header's Bag link had its attributes in a different order from every other page | Identical header; the page is now in the navigation, theme and photo consistency tests |
| Product text was written into the page with `innerHTML` | Built with text nodes |
| The page test passed for any page containing "Beauty Advisor" | Tests for all six criteria |
| The picking rule was written nowhere | BR-REC-1 to BR-REC-3 in `context/business-rules.md` |

A `.github/agents/beauty-advisor-feature.agent.md` file arrived with the feature. It is a description for another coding tool; it was read, changes no behaviour, and is included unchanged.

## Checked in a real browser

Headless Chrome against the running app (`screens/`):

1. On the front screen, "Not sure where to start? See three picks for a simple routine" led to `/recommendations.html`.
2. Default picks: Hydra Glow Serum $38.00 (Add to bag), Radiance Skin Foundation $42.00 (Find my shade), Velvet Matte Lipstick $24.00 (Add to bag). `desktop-1-default.jpg`
3. Adding the serum took the bag count to 1; the bag held one line, the serum.
4. The Serum filter showed both serums. `desktop-2-serum.jpg`
5. The foundation's "Find my shade" link went to `/shade-finder.html`.
6. At phone width (390 px, emulated) three cards showed and the page did not scroll sideways. `mobile-1-default.jpg`

Real API responses are in `api-responses.md`.

## Limits of this evidence

- **"Curated" is a fixed rule, not a judgement or a ranking.** With five products it always gives the same three.
- The reasons are one sentence per category, written in review. They are not from the shade-science skill or any product source.
- The page is linked from the front screen only. It is not in the main navigation.
- Page behaviour is tested by matching source; the clicks were done once, by the browser run above.
- Tests were run on Node 25.6.1.
