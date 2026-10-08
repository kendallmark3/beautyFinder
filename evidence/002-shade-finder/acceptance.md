# Evidence: Feature 002 Shade Finder

Run: `npm test` (full output in `tests.txt`) · Result: **10 / 10 passing** (4 from Feature 001, 6 from Feature 002)

| AC | Test | Result | Implemented in |
|----|------|--------|----------------|
| AC-1 | `AC-1: a valid request returns exactly 3 shades, best match first` | PASS | `src/lib/shadeMatch.js` → `matchShades()` (BR-SM-1, BR-SM-3, BR-SM-4) |
| AC-2 | `AC-2: at equal depth distance, the shopper's undertone ranks first` | PASS | `src/lib/shadeMatch.js` → `undertonePenalty()` (BR-SM-2) |
| AC-3 | `AC-3: invalid input returns 400 with a message per invalid field` | PASS | `src/lib/shadeMatch.js` → `validateInput()`, `src/routes/shade-match.js` (SEC-1) |
| AC-4 | `AC-4: when the best match scores above 1.5, consultation is true` | PASS | `src/lib/shadeMatch.js` → `CONSULTATION_ABOVE` (BR-SM-5) |
| AC-5 | `AC-5: skin inputs are never written to logs or storage` | PASS | `src/lib/shadeMatch.js`, `src/routes/shade-match.js` (no logging, no file access, SEC-2) |
| AC-6 | `AC-6: /shade-finder.html offers depth and undertone and shows results and the consultation notice` | PASS | `public/shade-finder.html` |

Scope check: only the four files under **In (create)** were added. No changes to `src/server.js`, the catalog data, or the read-only files. No new dependencies.

## Limits of this evidence

- **AC-4 is proven on an injected shade list, not the shipped catalog.** The catalog has a shade every half step of depth with undertones cycling cool, neutral, warm, so for any valid input (depth 1 to 10) the best score is at most 1.0. `consultation: true` cannot occur through the API or the page with the current data.
- **AC-6's consultation notice is proven present in the page, not seen displayed**, for the same reason. The three result cards were checked in a real browser (headless Chrome, depth 7, warm → 260, 320, 330); the automated test checks the page's markup only.
- Tests were run on Node 25.6.1. `npm test` does not run on Node 20.
