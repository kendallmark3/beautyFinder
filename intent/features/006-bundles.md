# Feature 006: Bundles

**Status:** Done · Evidence: `evidence/006-bundles/` · **Team:** Commerce squad

## Story
As a shopper with products in my bag, I want a better price when I buy products that go
together, and I want to be told when I am one product away from that price, so that
building a complete look is worth it.

## Goal
Two bundles give a percentage off the products in them. The server works out which bundles
a bag qualifies for, the bag page shows each saving and the new total, and it tells the
shopper when one more product would complete a bundle. The front screen shows the bundles on offer.

## Scope
- **In (create):** `src/lib/bundles.js`, `src/routes/bundles.js`, `tests/bundles.test.js`
- **In (change):** `src/lib/pricing.js` (add bundle results to the priced bag), `public/cart.html`, `public/index.html`,
  `public/styles.css`, `context/business-rules.md` (BR-BN-*), `tests/try-on.test.js` (add `/api/bundles` to the
  list of fixed addresses the front screen may request; nothing else)
- **In (read only):** `src/lib/catalog.js`, `public/cart.js`
- **Out:** `src/server.js`, `src/data/products.json`, coupon codes, per-shopper offers, time-limited offers,
  stacking a bundle with another discount, tax, shipping, payment.

## Context to read
- `context/business-rules.md`: BR-BN-1 to BR-BN-5, BR-CART-1 to BR-CART-4
- `context/security.md`: SEC-1, SEC-4

## Feature rules
- Bundle membership and savings follow BR-BN-1 to BR-BN-4 exactly. The server decides; the page only displays.
- A bundle is defined by product category, so any shade of the foundation qualifies.
- Everything Feature 005's pricing response returned is still returned, unchanged, for a bag with no bundle.
- Bundle names, contents, and percentages are fictional class data.
- Suggestions state the saving as a percentage of the set. They make no other promise.
- No new dependencies. No changes outside Scope.

## API
`GET /api/bundles`
```json
{ "bundles": [ { "id": "complete-look", "name": "Complete Look",
                 "categories": ["foundation", "mascara", "lipstick"], "percentOff": 15 } ] }
```
`POST /api/cart/price` adds to its 200 response:
```json
{ "bundles": [ { "id": "complete-look", "name": "Complete Look", "percentOff": 15,
                 "items": [ { "productId": "FDN-001", "name": "Radiance Skin Foundation", "unitPriceCents": 4200 } ],
                 "savingCents": 1380 } ],
  "savingsCents": 1380,
  "suggestions": [ { "bundleId": "glow-duo", "name": "Glow Duo", "percentOff": 10, "missingCategory": "serum" } ] }
```
`totalCents` becomes `subtotalCents − savingsCents`.

## Acceptance criteria
- **AC-1** `GET /api/bundles` lists both bundles with name, categories, and percentage.
- **AC-2** A bag with a foundation, a mascara, and a lipstick gets the Complete Look: 15% off those three, and the total is the subtotal less the saving.
- **AC-3** A bag with a foundation and a serum gets the Glow Duo: 10% off those two.
- **AC-4** Each unit counts toward at most one bundle; Complete Look sets form before Glow Duo sets; within a category the highest priced unit is used first.
- **AC-5** A saving is rounded to the nearest cent, half up.
- **AC-6** A bag with no bundle has no savings, a total equal to its subtotal, and empty bundle and suggestion lists.
- **AC-7** A suggestion is made for a bundle only when the units left over cover all but one of its categories.
- **AC-8** The bag page shows each bundle's saving and each suggestion with a link to the collection, and the front screen shows the bundles on offer.
- **AC-9** Bundle code neither logs nor stores a bag.

## Done when
`npm test` passes, every AC maps to a passing test, and `evidence/006-bundles/` is complete.
