# Feature 015: Curated Recommendations

**Status:** Done · Evidence: `evidence/015-curated-recommendations/` · **Team:** Product squad

This feature arrived built, with three passing tests. A review before it was merged changed the
picking rule, the copy, and how a foundation is offered, and added AC-4 to AC-6. See the evidence pack.

## Story
As a shopper browsing the store, I want a short list of curated picks that matches how I
shop for beauty so that I can discover products quickly without leaving the catalog flow.

## Goal
Add a lightweight recommendation page and API that turns the catalog into a tidy list of hand-picked products with a clear reason for each pick.

## Scope
- **In (create):** `src/lib/recommendations.js`, `src/routes/recommendations.js`, `public/recommendations.html`, `public/recommendations.js`, `public/recommendations.css`, `tests/recommendations.test.js`
- **In (change):** `intent/current-feature.md`, `intent/project-intent.md`, `context/business-rules.md` (BR-REC-*), `public/index.html` and `public/styles.css` (one link to the page), and the page lists in `tests/nav.test.js`, `tests/theme.test.js`, `tests/photos.test.js`
- **Out:** payment, sign-in, new dependencies, extra persistence, or catalog changes outside the recommendations experience

## Context to read
- `src/lib/catalog.js`
- `src/lib/http.js`
- `public/cart.js`
- `context/business-rules.md`: BR-REC-1 to BR-REC-3
- `intent/features/005-cart.md`: a foundation is always added with its shade

## Feature rules
- The recommendation list is server-generated from the catalog; the page does not invent prices or product data.
- The default result is three products, chosen by BR-REC-1. "Curated" means that fixed rule; nothing is ranked by sales or popularity, and the copy does not say otherwise.
- A product that has shades is not added to the bag from this page. It links to the Shade Finder.
- Recommendations can be filtered by category, but never by personal data.
- The page is a demo experience only and does not store or log customer data.

## Acceptance criteria
- **AC-1** `GET /api/recommendations` returns exactly three curated picks by default.
- **AC-2** `?category=` filters the recommendations to a single product category.
- **AC-3** `/recommendations.html` serves the curated-picks page and renders the experience.
- **AC-4** The default picks are one product from each of serum, foundation and lipstick, in the order they are applied. (Added in review.)
- **AC-5** A foundation is never added to the bag from this page; it is offered through the Shade Finder. (Added in review.)
- **AC-6** The page can be reached from the front screen, has the same header as every other page, and requests only `/api/recommendations`. (Added in review.)

## Done when
`npm test` passes, every AC maps to a passing test, and `evidence/015-curated-recommendations/` is complete.
