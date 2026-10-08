# API responses: Feature 005 Bag

Captured from the running app (`POST /api/cart/price`). Inputs are made-up test values.

## Valid request

`{"items":[{"productId":"FDN-001","quantity":1},{"productId":"LIP-001","quantity":2}]}`

```
{"lines":[{"productId":"FDN-001","name":"Radiance Skin Foundation","category":"foundation","unitPriceCents":4200,"quantity":1,"lineTotalCents":4200},{"productId":"LIP-001","name":"Velvet Matte Lipstick","category":"lipstick","unitPriceCents":2400,"quantity":2,"lineTotalCents":4800}],"subtotalCents":9000,"totalCents":9000}

HTTP 200
```

## Invalid request

`{"items":[{"productId":"NOPE","quantity":1},{"productId":"LIP-001","quantity":0}]}`

```
{"error":"Invalid input","fields":{"items[0].productId":"Unknown product.","items[1].quantity":"Quantity must be a whole number from 1 to 999."}}

HTTP 400
```

## Price supplied by the browser is ignored

`{"items":[{"productId":"SRM-002","quantity":1,"unitPriceCents":1}]}`

```
{"lines":[{"productId":"SRM-002","name":"Night Renewal Serum","category":"serum","unitPriceCents":5400,"quantity":1,"lineTotalCents":5400}],"subtotalCents":5400,"totalCents":5400}

HTTP 200
```
