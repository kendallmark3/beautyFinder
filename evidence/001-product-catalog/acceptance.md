# Evidence: Feature 001 Product Catalog

Run: `npm test` (full output in `tests.txt`) · Result: **4 / 4 passing**

| AC | Test | Result | Implemented in |
|----|------|--------|----------------|
| AC-1 | `AC-1: GET /api/products returns the full catalog` | PASS | `src/routes/products.js`, `src/lib/catalog.js` |
| AC-2 | `AC-2: ?category= filters products (case-insensitive)` | PASS | `src/lib/catalog.js` → `listProducts()` |
| AC-3 | `AC-3: unknown category returns 200 with an empty list` | PASS | `src/lib/catalog.js` → `listProducts()` |
| AC-4 | `AC-4: every foundation shade has code, name, depth (1-10) and undertone` | PASS | `src/data/products.json` |
