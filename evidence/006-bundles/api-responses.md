# API responses: Feature 006 Bundles

Captured from the running app. Inputs are made-up test values.

## GET /api/bundles

```
{"bundles":[{"id":"complete-look","name":"Complete Look","categories":["foundation","mascara","lipstick"],"percentOff":15},{"id":"glow-duo","name":"Glow Duo","categories":["foundation","serum"],"percentOff":10}]}

HTTP 200
```

## POST /api/cart/price: a Complete Look

`{"items":[{"productId":"FDN-001","quantity":1},{"productId":"MSC-001","quantity":1},{"productId":"LIP-001","quantity":1}]}`

```
{"lines":[{"productId":"FDN-001","name":"Radiance Skin Foundation","category":"foundation","unitPriceCents":4200,"quantity":1,"lineTotalCents":4200},{"productId":"MSC-001","name":"Volume Lift Mascara","category":"mascara","unitPriceCents":2600,"quantity":1,"lineTotalCents":2600},{"productId":"LIP-001","name":"Velvet Matte Lipstick","category":"lipstick","unitPriceCents":2400,"quantity":1,"lineTotalCents":2400}],"subtotalCents":9200,"bundles":[{"id":"complete-look","name":"Complete Look","percentOff":15,"items":[{"productId":"FDN-001","name":"Radiance Skin Foundation","unitPriceCents":4200},{"productId":"MSC-001","name":"Volume Lift Mascara","unitPriceCents":2600},{"productId":"LIP-001","name":"Velvet Matte Lipstick","unitPriceCents":2400}],"savingCents":1380}],"savingsCents":1380,"totalCents":7820,"suggestions":[]}

HTTP 200
```

## POST /api/cart/price: one product short of each bundle

`{"items":[{"productId":"FDN-001","quantity":1},{"productId":"LIP-001","quantity":1}]}`

```
{"lines":[{"productId":"FDN-001","name":"Radiance Skin Foundation","category":"foundation","unitPriceCents":4200,"quantity":1,"lineTotalCents":4200},{"productId":"LIP-001","name":"Velvet Matte Lipstick","category":"lipstick","unitPriceCents":2400,"quantity":1,"lineTotalCents":2400}],"subtotalCents":6600,"bundles":[],"savingsCents":0,"totalCents":6600,"suggestions":[{"bundleId":"complete-look","name":"Complete Look","percentOff":15,"missingCategory":"mascara"},{"bundleId":"glow-duo","name":"Glow Duo","percentOff":10,"missingCategory":"serum"}]}

HTTP 200
```

## POST /api/cart/price: invalid request

`{"items":[{"productId":"FDN-001","quantity":"two"}]}`

```
{"error":"Invalid input","fields":{"items[0].quantity":"Quantity must be a whole number from 1 to 999."}}

HTTP 400
```
