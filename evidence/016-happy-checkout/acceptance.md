# Evidence: Feature 016 Happy Checkout

Run: `npm test` (full output in `tests.txt`) · Result: **105 / 105 passing** (99 before, 6 from Feature 016)

| AC | Test | Result | Implemented in |
|----|------|--------|----------------|
| AC-1 | `AC-1: the bag's boxes are warm-tinted and the order summary is a dark card with a gold Checkout button` | PASS | `public/cart.css` → `.bag-page .panel`, `.bag-layout .summary`, `.checkout-preview` |
| AC-2 | `AC-2: the checkout preview shows one of the app's photographs, scaled to the box, with alternative text` | PASS | `public/cart.html`, `public/cart.css` → `.preview-photo` |
| AC-3 | `AC-3: the preview greets the shopper cheerfully and still says no order is placed` | PASS | `public/cart.html` |
| AC-4 | `AC-4: the sparkle is decorative only and stops under reduced motion` | PASS | `public/cart.css` → `.sparkles`; `public/styles.css` (reduced-motion rule) |
| AC-5 | `AC-5: the bag page and the Shade Finder carry the stock-model line and credits link` | PASS | `public/cart.html`, `public/shade-finder.html` |
| AC-6 | `AC-6: the photograph is not recoloured, filtered, or overlaid` | PASS | `public/cart.css`, `public/cart.html` |

Scope check: changed `public/cart.html`, `public/cart.css`, and the footer of `public/shade-finder.html`; created `tests/happy-checkout.test.js`. One pattern in `tests/bag-experience.test.js` (014 AC-8) now looks for the preview's phone padding on `.preview-body`, where it moved. Nothing under `src/` changed. No new photographs and no new dependencies.

This feature adds no API endpoint, so there is no `api-responses.md`.

## Checked in a real browser

Headless Chrome against the running app, at 1280 × 900 and emulating a 390 × 844 phone, with a bag of a foundation, a mascara and a lipstick. Screenshots are in `screens/`.

| Seen at both sizes | File |
|--------------------|------|
| Empty bag on a warm-tinted box | `desktop-1-empty.jpg`, `mobile-1-empty.jpg` |
| Lines on a cream-to-blush box; order summary on black with a gold total and a gold Checkout button (`rgb(201, 163, 106)`) | `desktop-2-bag.jpg`, `mobile-2-bag.jpg` |
| After Checkout: `photos/group.jpg` (1400 × 931) scaled to the full width of the box, then "You're all set", "Your bag is ready, and it looks good.", the journey, gold dots down both margins | `desktop-3-checkout.jpg`, `mobile-3-checkout.jpg` |
| The receipt on white inside the tinted box, total $78.20 matching the summary, and "This is a demo. No order is placed and no payment is taken." | `desktop-4-receipt.jpg`, `mobile-4-receipt.jpg` |

No page scrolled sideways at either size. The stock-model line and credits link showed at the foot of the bag page.

## Limits of this evidence

- **The women in the photograph are not smiling.** The cheer comes from the heading, the tick, the colour and the sparkle. None of the five photographs in the app shows a smile; a happier image would be a new photograph, which is out of scope.
- The photograph is cropped to a wide strip, which cuts the tops and bottoms of the faces.
- Whether it now looks happy is a judgement; the evidence shows what is on the page.
- The screenshots are stills, so the twinkle of the dots is not captured. Reduced motion was checked through the stylesheet rule, not in a browser with the setting on.
- Checkout still places no order.
- Tests were run on Node 25.6.1.
