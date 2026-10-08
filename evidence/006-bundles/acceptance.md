# Evidence: Feature 006 Bundles

Run: `npm test` (full output in `tests.txt`) · Result: **41 / 41 passing** (32 from Features 001 to 005, 9 from Feature 006)

| AC | Test | Result | Implemented in |
|----|------|--------|----------------|
| AC-1 | `AC-1: GET /api/bundles lists both bundles with name, categories, and percentage` | PASS | `src/routes/bundles.js`, `src/lib/bundles.js` → `BUNDLES` (BR-BN-1) |
| AC-2 | `AC-2: foundation, mascara and lipstick get the Complete Look, 15% off those three` | PASS | `src/lib/bundles.js` → `applyBundles()`, `src/lib/pricing.js` (BR-BN-4) |
| AC-3 | `AC-3: foundation and serum get the Glow Duo, 10% off those two` | PASS | `src/lib/bundles.js` → `applyBundles()` |
| AC-4 | `AC-4: a unit is in at most one bundle, Complete Look forms first, and the highest priced unit is used first` | PASS | `src/lib/bundles.js` → `applyBundles()` (BR-BN-2) |
| AC-5 | `AC-5: a saving is rounded to the nearest cent, half up` | PASS | `src/lib/bundles.js` → `savingFor()` (BR-BN-3) |
| AC-6 | `AC-6: a bag with no bundle has no savings and a total equal to its subtotal` | PASS | `src/lib/pricing.js` → `priceCart()` |
| AC-7 | `AC-7: a bundle is suggested only when leftover units cover all but one of its categories` | PASS | `src/lib/bundles.js` → `applyBundles()` (BR-BN-5) |
| AC-8 | `AC-8: the bag page shows savings and suggestions, and the front screen shows the bundles` | PASS | `public/cart.html`, `public/index.html` |
| AC-9 | `AC-9: bundle code neither logs nor stores a bag` | PASS | `src/lib/bundles.js`, `src/routes/bundles.js` (SEC-4) |

Scope check: every file touched is listed under Scope. `src/server.js` and `src/data/products.json` are unchanged. The one change to an earlier feature's test (`tests/try-on.test.js`) adds `/api/bundles` to the list of fixed addresses the front screen may request. No new dependencies.

## Checked in a real browser

Headless Chrome, 1280 px wide, against the running app:

1. The front screen showed both bundles: "15% off Complete Look" and "10% off Glow Duo".
2. Bag with foundation (260 Golden Tan) and lipstick: no saving, total $66.00, and two suggestions (add a mascara for a Complete Look; add a serum for a Glow Duo).
3. After adding the mascara and the Night Renewal Serum: subtotal $146.00, "Complete Look · 15% off the set −$13.80", total $132.20, and one suggestion (add a foundation for a Glow Duo).

## Limits of this evidence

- AC-8 is tested by matching page source, not by clicking. The clicks were done once, by the browser run above.
- Forming Complete Look sets first is the rule, not a search for the cheapest total. With these prices a Complete Look always saves more than a Glow Duo for the same foundation ($13.80 against at most $9.60), so the order does not cost a shopper anything today. A price change could alter that.
- Bundle names, contents, and percentages are fictional and were chosen for this demo.
- Tests were run on Node 25.6.1. `npm test` does not run on Node 20.
