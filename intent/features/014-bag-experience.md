# Feature 014: Bag Experience

**Status:** Done · Evidence: `evidence/014-bag-experience/` · **Team:** Commerce squad

## Story
As a shopper who has added products, I want my bag to look and feel like the rest of the
site and to show me clearly where I am on the way to checking out, so that finishing feels
as considered as discovering.

## Goal
The bag page becomes a designed page: lines with a visual each, beside an order summary;
bundles shown as unlocked or one product away; and, when the shopper presses Checkout, a
checkout preview at the bottom of the page with a journey graphic and an order receipt.

## Scope
- **In (create):** `public/bag-view.js`, `public/cart.css`, `tests/bag-experience.test.js`
- **In (change):** `public/cart.html`; `tests/cart.test.js` (005 AC-8's pattern for the Checkout handler only)
- **In (read only):** `public/cart.js`, `POST /api/cart/price` (Features 005 and 006), `public/shade-color.js`
- **Out:** `src/`, any other page, taking payment, placing an order, collecting a name, address, email or card,
  delivery options or prices, tax, promo codes, saving a bag on the server.

## Context to read
- `context/business-rules.md`: BR-CART-1 to BR-CART-4, BR-BN-1 to BR-BN-5
- `context/security.md`: SEC-4
- `intent/features/005-cart.md`: "Checkout is a demo stop"

## Feature rules
- Checkout is still a demo stop. The preview shows the journey a real checkout would take, marks every step after
  Bag as not part of this demo, and keeps the sentence "This is a demo. No order is placed and no payment is taken."
- Every amount shown comes from the server's pricing answer. The page adds nothing up that the server did not.
- Bundles are shown as the server reports them: applied, or one product away. The page does not work out bundles itself.
- The page makes no request other than `POST /api/cart/price`, and has no input for personal or payment details (SEC-4).
- No new dependencies. No changes outside Scope.

## Acceptance criteria
- **AC-1** The bag shows its lines beside an order summary, and says how many items it holds.
- **AC-2** Every line has a visual: its shade's colour, or a tile for its category.
- **AC-3** A bundle the bag has earned is shown as unlocked with its products and saving; a bundle one product away is shown with what to add.
- **AC-4** Pressing Checkout opens a preview at the bottom of the page: a journey with Bag complete and Delivery, Payment and Confirmation marked as not in this demo.
- **AC-5** The preview's receipt lists every line, each bundle saving, and a total equal to the server's total.
- **AC-6** Checkout still places no order and sends nothing: one request address, no form, no personal or payment fields, and the demo sentence is shown.
- **AC-7** An empty bag offers three ways on: Discover, Shade Finder, and the collection.
- **AC-8** The bag and the preview fit a phone-width screen.

## Done when
`npm test` passes, every AC maps to a passing test, and `evidence/014-bag-experience/` is complete.
