# Business Rules

## Catalog
- **BR-CAT-1** Categories: foundation, serum, mascara, lipstick.

## Shade matching (Feature 002)
- **BR-SM-1** Score = |shopper depth − shade depth| + undertone penalty. Lower is better.
- **BR-SM-2** Undertone penalty: same = 0 · neutral vs cool or warm = 0.5 · cool vs warm = 1.5.
- **BR-SM-3** Tie-break: smaller depth gap first, then shade code ascending.
- **BR-SM-4** Return at most 3 shades. Confidence: score ≤ 0.5 excellent · ≤ 1.0 good · otherwise fair.
- **BR-SM-5** If the best score is above 1.5, set `consultation: true` and suggest an in-store beauty advisor.
