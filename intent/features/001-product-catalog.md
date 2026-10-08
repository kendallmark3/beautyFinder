# Feature 001: Product Catalog

**Status:** Done · Evidence: `evidence/001-product-catalog/`

## Goal
A shopper can browse the product range and filter it by category.

## Scope
- In: `src/lib/catalog.js`, `src/routes/products.js`, `src/data/products.json`, `public/index.html`, `tests/catalog.test.js`
- Out: search, pricing, cart, accounts.

## Context to read
- `context/architecture.md`

## Feature rules
- Category filter is case-insensitive.
- Foundation products carry their full shade list (code, name, depth, undertone). Feature 002 depends on it.

## Acceptance criteria
- **AC-1** `GET /api/products` returns every product with a `count`.
- **AC-2** `?category=` filters by category, case-insensitive.
- **AC-3** An unknown category returns `200` with an empty list (not an error).
- **AC-4** Every foundation shade has `code`, `name`, `depth` (1–10) and `undertone` (cool / neutral / warm).
