# Evidence: Feature 002 Shade Finder (reference build)

Run: `npm test` (full output in `tests.txt`) · Result: **10 / 10 passing** (4 from Feature 001, 6 from Feature 002)

| AC | Test | Result | Implemented in |
|----|------|--------|----------------|
| AC-1 | `AC-1: valid input returns exactly 3 shades, best match first` | PASS | `src/lib/shadeMatch.js` → `matchShades()` |
| AC-2 | `AC-2: at equal depth distance, the matching undertone ranks higher` | PASS | `src/lib/shadeMatch.js` → `UNDERTONE_PENALTY` (BR-SM-2) |
| AC-3 | `AC-3: invalid input returns 400 with a message per field` | PASS | `src/lib/shadeMatch.js` → `validateInput()`, `src/routes/shade-match.js` |
| AC-4 | `AC-4: when the best score is above 1.5, consultation is true` | PASS | `src/lib/shadeMatch.js` → `CONSULTATION_THRESHOLD` (BR-SM-5) |
| AC-5 | `AC-5: skin inputs are never written to the console` | PASS | `src/routes/shade-match.js` (no logging, SEC-2) |
| AC-6 | `AC-6: the Shade Finder page is served` | PASS | `public/shade-finder.html` |

Scope check: no changes to `src/server.js` or catalog data. No new dependencies.
