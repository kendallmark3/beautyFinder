# Feature 005: Bag

**Status:** Done · Evidence: `evidence/005-cart/` · **Team:** Commerce squad

## Story
As a shopper who has found a shade or a product I like, I want to add it to a bag and see
what it costs, so that I can go from discovering to buying.

## Goal
Every product has a price. A shopper can add products to a bag from the catalog, the hero
try-on, and Shade Finder results, see the bag count in the header on every page, and open a
bag page that lists the lines, lets them change quantities, and shows a total priced by the server.

## Scope
- **In (create):** `src/lib/pricing.js`, `src/routes/cart.js`, `public/cart.js`, `public/cart.html`, `tests/cart.test.js`
- **In (change):** `src/data/products.json` (add `priceCents`), `public/index.html`, `public/shade-finder.html`,
  `public/try-on.js` (an `onShow` callback only), `public/styles.css`, `context/business-rules.md` (BR-CART-*),
  `context/security.md` (SEC-4)
- **In (read only):** `src/lib/catalog.js`, `public/shade-color.js`
- **Out:** `src/server.js`, payment, placing an order, accounts, addresses, tax, shipping, stock,
  bundles and discounts (Feature 006), saving a bag on the server.

## Context to read
- `context/business-rules.md`: BR-CART-1 to BR-CART-4
- `context/security.md`: SEC-1, SEC-2, SEC-4
- Skill: `.claude/skills/shade-science/` (customer copy)

## Feature rules
- The server owns prices. A price sent by the browser is ignored.
- The bag lives only in the shopper's browser for the session (SEC-4). The server never stores one.
- Pricing requests carry product ids and quantities only. Shade codes never leave the browser.
- This changes one Feature 004 rule: a shade the shopper **adds to the bag** is now kept in session
  storage. A shade that is only previewed is still kept nowhere.
- Checkout is a demo stop: it says so, places no order, and takes no payment or personal details.
- Prices are fictional class data, in US dollars.
- No new dependencies. No changes outside Scope.

## API
`POST /api/cart/price`
```json
// request
{ "items": [ { "productId": "FDN-001", "quantity": 1 }, { "productId": "LIP-001", "quantity": 2 } ] }
// 200 response
{ "lines": [ { "productId": "FDN-001", "name": "Radiance Skin Foundation", "category": "foundation",
               "unitPriceCents": 4200, "quantity": 1, "lineTotalCents": 4200 } ],
  "subtotalCents": 9000, "totalCents": 9000 }
// 400 response
{ "error": "Invalid input", "fields": { "items[0].quantity": "..." } }
```

## Acceptance criteria
- **AC-1** Every product returned by `GET /api/products` has a `priceCents` that is a positive whole number.
- **AC-2** `POST /api/cart/price` returns each line with its unit price and line total, a subtotal, and a total.
- **AC-3** A price supplied in the request is ignored; the catalog price is used.
- **AC-4** Invalid input (no items, unknown product, a product listed twice, quantity not a whole number from 1 to 999) returns `400` with a message per invalid field.
- **AC-5** In the bag, adding the same product and shade again raises its quantity; a different shade is a separate line; quantity stays between 1 and 10; a line can be removed.
- **AC-6** The bag is kept in session storage only; the pricing request contains no shade; the server neither logs nor stores a bag.
- **AC-7** `/cart.html` shows the lines, quantity controls, and total, and every page's header shows a Bag link with the item count.
- **AC-8** Checkout says it is a demo and sends nothing.
- **AC-9** Add to bag is offered on catalog products that have no shades, on the hero try-on, and on each Shade Finder result. A foundation is always added with its shade.

## Done when
`npm test` passes, every AC maps to a passing test, and `evidence/005-cart/` is complete.
