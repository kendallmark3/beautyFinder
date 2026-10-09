# Evidence: Feature 014 Bag Experience

Run: `npm test` (full output in `tests.txt`) · Result: **93 / 93 passing** (85 before, 8 from Feature 014)

| AC | Test | Result | Implemented in |
|----|------|--------|----------------|
| AC-1 | `AC-1: the bag shows its lines beside an order summary and says how many items it holds` | PASS | `public/cart.html`, `public/cart.css` → `.bag-layout` |
| AC-2 | `AC-2: every line has a visual: its shade's colour or a tile for its category` | PASS | `public/cart.html` → `row()`, `public/bag-view.js` → `categoryLetter()` |
| AC-3 | `AC-3: an earned bundle is shown as unlocked with its saving, and a bundle one product away with what to add` | PASS | `public/cart.html` → `render()` (from the server's answer) |
| AC-4 | `AC-4: Checkout opens a preview at the bottom with Bag complete and the later steps marked not in this demo` | PASS | `public/cart.html` → `drawPreview()`, `public/bag-view.js` → `JOURNEY` |
| AC-5 | `AC-5: the receipt lists every line, each bundle saving, and the server's total` | PASS | `public/bag-view.js` → `receiptRows()` |
| AC-6 | `AC-6: checkout places no order and sends nothing` | PASS | `public/cart.html` |
| AC-7 | `AC-7: an empty bag offers Discover, the Shade Finder, and the collection` | PASS | `public/cart.html` |
| AC-8 | `AC-8: the bag and the preview fit a phone-width screen` | PASS | `public/cart.css` (narrow-screen block) |

Scope check: created `public/bag-view.js`, `public/cart.css`, `tests/bag-experience.test.js`; changed `public/cart.html`. In `tests/cart.test.js` one assertion in 005's AC-8 was replaced: it pinned the exact old Checkout handler, and now checks that the handler shows the demo sentence and makes no request. Nothing under `src/` changed. No new dependencies.

This feature adds no API endpoint, so there is no `api-responses.md`.

## Checked in a real browser

Headless Chrome against the running app, at 1280 × 860 and emulating a 390 × 844 phone. Screenshots are in `screens/`. The bag was filled by writing four lines into session storage, then the page was loaded.

| Step | Seen at both sizes | File |
|------|--------------------|------|
| Empty bag | "Your bag is waiting" with Discover my look, Find my shade, Shop the collection | `desktop-1-empty.jpg`, `mobile-1-empty.jpg` |
| Bag with four lines | "4 items"; two shade lines with colour swatches, mascara and lipstick with M and L tiles; "Complete Look unlocked −$13.80"; a prompt to add a serum for a Glow Duo; subtotal $134.00, total $120.20 | `desktop-2-bag.jpg`, `mobile-2-bag.jpg` |
| Press Checkout | Preview opened below and scrolled into view: journey of Bag (complete), Delivery, Payment, Confirmation (each "Not in this demo"); receipt of four lines, subtotal $134.00, Complete Look −$13.80, total $120.20; "This is a demo. No order is placed and no payment is taken." | `desktop-3-checkout-preview.jpg`, `mobile-3-checkout-preview.jpg`, `mobile-4-receipt.jpg` |
| One more of the first line, preview open | Summary total and receipt total both $162.20; receipt title "Order preview · 5 items" | not captured as an image |

No page scrolled sideways at either size. Storage afterwards: one session-storage key (`beauty-advisor.bag`), nothing in local storage, no cookies.

## Limits of this evidence

- **Checkout still does nothing real.** Delivery, payment and confirmation are drawn as steps and labelled "Not in this demo". There is no order, no payment, and no field to type into.
- Whether the bag now looks "cooler" is a judgement; the evidence shows what is on the page.
- The screenshots are stills; the entrance animations and the scroll to the preview are not captured.
- Page behaviour is tested by matching page source; the clicks were done once, by the browser run above.
- Category tiles are a letter on a dark square. The catalog has no product images.
- Mobile was one emulated size, not a real phone.
- Tests were run on Node 25.6.1.
