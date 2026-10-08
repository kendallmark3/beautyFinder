# Business Rules

## Catalog
- **BR-CAT-1** Categories: foundation, serum, mascara, lipstick.

## Bag and pricing (Feature 005)
- **BR-CART-1** Every product has a `priceCents`: a whole number of US cents. Prices are fictional class data.
- **BR-CART-2** The server prices the bag from the catalog. A price sent by the browser is ignored.
- **BR-CART-3** A pricing request lists each product once with a whole-number quantity from 1 to 999, and at most 20 products. In the bag, one line holds at most 10.
- **BR-CART-4** Line total = unit price × quantity. Subtotal = sum of line totals. Tax and shipping are not modelled.

## Bundles (Feature 006)
- **BR-BN-1** Bundles are sets of product categories, one unit of each. Complete Look: foundation + mascara + lipstick, 15% off the three. Glow Duo: foundation + serum, 10% off the two. Bundles are fictional class data.
- **BR-BN-2** Each unit counts toward at most one bundle. Complete Look sets are formed first, then Glow Duo sets, until no further set can be formed. Within a category the highest priced unit is used first.
- **BR-BN-3** A bundle's saving is its percentage of the sum of its units' prices, rounded to the nearest cent, half up.
- **BR-BN-4** Savings = sum of bundle savings. Total = subtotal − savings.
- **BR-BN-5** After sets are formed, a bundle is suggested when the units left over cover all but exactly one of its categories. The suggestion names the missing category.

## Shade matching (Feature 002)
- **BR-SM-1** Score = |shopper depth − shade depth| + undertone penalty. Lower is better.
- **BR-SM-2** Undertone penalty: same = 0 · neutral vs cool or warm = 0.5 · cool vs warm = 1.5.
- **BR-SM-3** Tie-break: smaller depth gap first, then shade code ascending.
- **BR-SM-4** Return at most 3 shades. Confidence: score ≤ 0.5 excellent · ≤ 1.0 good · otherwise fair.
- **BR-SM-5** If the best score is above 1.5, set `consultation: true` and suggest an in-store beauty advisor.
