# Feature 016: Happy Checkout

**Status:** Done · Evidence: `evidence/016-happy-checkout/` · **Team:** Commerce squad

## Story
As a shopper about to check out, I want the bag to feel warm and the checkout moment to feel
like good news, so that finishing is a pleasure rather than a form on a white box.

## Goal
The bag's boxes are no longer plain white: they are warm-tinted, and the order summary is a
dark card with a gold Checkout button. The checkout preview opens with one of the app's
photographs scaled across its top, a cheerful heading, and a little gold sparkle.

## Scope
- **In (create):** `tests/happy-checkout.test.js`
- **In (change):** `public/cart.html`, `public/cart.css`, `public/shade-finder.html` (photo credit footer only),
  `tests/bag-experience.test.js` (014 AC-8's pattern for the preview's phone padding only)
- **In (read only):** `public/photos/`, `public/credits.html`, `public/cart.js`, `public/bag-view.js`
- **Out:** `src/`, the pricing answer and the receipt's contents, new photographs, any other page's layout,
  taking payment or placing an order.

## Feature rules
- The photograph is one already in `public/photos/` and listed on the credits page. It is scaled and cropped only:
  not recoloured, filtered, or covered with text (Feature 008).
- A page that shows a photograph carries the stock-model line and the link to the credits page.
- The cheerful copy says the bag is ready. It does not say an order was placed: checkout is still a demo stop,
  and the demo sentence stays.
- The sparkle is decoration: hidden from screen readers and still for shoppers who ask for reduced motion.
- No new dependencies. No changes outside Scope.

## Acceptance criteria
- **AC-1** The bag's boxes are warm-tinted, not white, and the order summary is a dark card with a gold Checkout button.
- **AC-2** The checkout preview shows one of the app's photographs, scaled to the width of the box, with alternative text.
- **AC-3** The preview greets the shopper cheerfully and still says no order is placed.
- **AC-4** The sparkle is decorative only and stops under reduced motion.
- **AC-5** The bag page and the Shade Finder, which both show photographs, carry the stock-model line and credits link.
- **AC-6** The photograph is not recoloured, filtered, or overlaid.

## Done when
`npm test` passes, every AC maps to a passing test, and `evidence/016-happy-checkout/` is complete.
