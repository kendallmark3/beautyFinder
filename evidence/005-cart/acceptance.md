# Evidence: Feature 005 Bag

Run: `npm test` (full output in `tests.txt`) · Result: **32 / 32 passing** (23 from Features 001 to 004, 9 from Feature 005)

| AC | Test | Result | Implemented in |
|----|------|--------|----------------|
| AC-1 | `AC-1: every product has a priceCents that is a positive whole number` | PASS | `src/data/products.json` (BR-CART-1) |
| AC-2 | `AC-2: pricing returns each line with unit price and line total, a subtotal, and a total` | PASS | `src/lib/pricing.js` → `priceCart()`, `src/routes/cart.js` (BR-CART-4) |
| AC-3 | `AC-3: a price supplied in the request is ignored` | PASS | `src/lib/pricing.js` → `priceCart()` (BR-CART-2) |
| AC-4 | `AC-4: invalid input returns 400 with a message per invalid field` | PASS | `src/lib/pricing.js` → `validateCart()` (SEC-1, BR-CART-3) |
| AC-5 | `AC-5: same product and shade raises quantity, another shade is a new line, quantity stays 1 to 10, lines can be removed` | PASS | `public/cart.js` → `addItem()`, `setQuantity()`, `removeLine()` |
| AC-6 | `AC-6: the bag is kept in session storage only, the pricing request has no shade, and the server keeps nothing` | PASS | `public/cart.js` → `saveBag()`, `pricingRequest()`; `src/lib/pricing.js`, `src/routes/cart.js` (SEC-4) |
| AC-7 | `AC-7: /cart.html shows lines, quantity controls and total, and every page header has a Bag link with a count` | PASS | `public/cart.html`, headers in `public/index.html`, `public/shade-finder.html` |
| AC-8 | `AC-8: checkout says it is a demo and sends nothing` | PASS | `public/cart.html` |
| AC-9 | `AC-9: add to bag is offered on the catalog, the hero try-on, and Shade Finder results` | PASS | `public/index.html`, `public/shade-finder.html` |

Scope check: every file touched is listed under Scope. `src/server.js` is unchanged. No new dependencies.

## Checked in a real browser

Headless Chrome, 1280 px wide, against the running app, in one tab:

1. Catalog showed a price on all five products; the foundation offered "Find my shade", the other four "Add to bag".
2. Added the lipstick from the catalog and 230 Honey Beige from the hero try-on: header count went to 2.
3. On the Shade Finder the count was still 2; added the first result (230 Honey Beige): count 3.
4. The bag listed two lines (lipstick × 1, foundation shade 230 × 2) with a total of $108.00.
5. One more lipstick: total $132.00, count 4.
6. Checkout showed "This is a demo. No order is placed and no payment is taken."
7. Storage afterwards: one session-storage key (`beauty-advisor.bag`), nothing in local storage, no cookies.
8. Removing both lines showed the empty-bag message and a count of 0.

## Limits of this evidence

- AC-7, AC-8 and AC-9 are tested by matching page source, not by clicking. The clicks were done once, by the browser run above.
- Two foundation shades at 10 each is allowed in the bag and prices correctly; the bag cannot exceed the server's limit of 999 per product.
- A bag is lost when the tab closes. That is the rule (SEC-4), not a defect.
- Prices are fictional and were chosen for this demo.
- The phone-width layout of the bag page is not verified.
- Tests were run on Node 25.6.1. `npm test` does not run on Node 20.
