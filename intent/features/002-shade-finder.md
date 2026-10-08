# Feature 002: Shade Finder

**Status:** In progress (Day 04 lab) · **Team:** Complexion squad

## Story
As a shopper choosing a foundation online, I want to enter my skin depth and undertone
and see my three closest shades, so that I buy the right shade the first time.

## Goal
Given a skin depth (1–10) and an undertone, recommend the 3 closest foundation shades,
ranked, with a confidence label. When nothing is close, recommend a consultation.

## Scope
- **In (create):** `src/lib/shadeMatch.js`, `src/routes/shade-match.js`, `public/shade-finder.html`, `tests/shade-match.test.js`
- **In (read only):** `src/lib/catalog.js` (use `getFoundationShades()`), `public/styles.css`, `public/shade-color.js`
- **Out:** `src/server.js`, the catalog data, photo-based matching, saving results, accounts.

## Context to read
- `context/business-rules.md`: BR-SM-1 to BR-SM-5 (ranking and thresholds)
- `context/security.md`: SEC-2 (no logging of skin inputs)
- Skill: `.claude/skills/shade-science/` (vocabulary and customer copy)

## Feature rules
- Ranking follows BR-SM-1/2 exactly. Do not invent a different scoring model.
- Customer copy follows the shade-science skill ("match", never "perfect").
- No new dependencies. No changes outside Scope.

## API
`POST /api/shade-match`
```json
// request
{ "depth": 5, "undertone": "warm" }
// 200 response
{ "matches": [ { "code": "230", "name": "230 Honey Beige", "depth": 5, "undertone": "warm",
                 "productId": "FDN-001", "productName": "Radiance Skin Foundation",
                 "score": 0, "confidence": "excellent" } ],
  "consultation": false }
// 400 response
{ "error": "Invalid input", "fields": { "depth": "...", "undertone": "..." } }
```

## Acceptance criteria
- **AC-1** A valid request returns exactly 3 shades, best match first (lowest score first).
- **AC-2** At equal depth distance, a shade with the shopper's undertone ranks above one without it.
- **AC-3** Invalid input (depth outside 1–10 or not a number; unknown undertone) returns `400` with a message per invalid field.
- **AC-4** When the best match scores above 1.5, the response includes `"consultation": true`.
- **AC-5** Skin inputs are never written to logs or storage.
- **AC-6** `/shade-finder.html` lets a shopper pick depth and undertone and see the 3 results, plus the consultation notice when flagged.

## Done when
`npm test` passes, every AC maps to a passing test, and `evidence/002-shade-finder/` is complete.
