# API responses: Feature 015 Curated Recommendations

Captured from the running app (`GET /api/recommendations`).

## `GET /api/recommendations`

```
{"count":3,"recommendations":[{"id":"SRM-001","name":"Hydra Glow Serum","category":"serum","description":"Lightweight hyaluronic serum for daily hydration.","priceCents":3800,"needsShade":false,"reason":"Skin prep, before foundation."},{"id":"FDN-001","name":"Radiance Skin Foundation","category":"foundation","description":"Medium-coverage serum foundation with a natural finish.","priceCents":4200,"needsShade":true,"reason":"The base. Find your shade first."},{"id":"LIP-001","name":"Velvet Matte Lipstick","category":"lipstick","description":"Long-wear matte lipstick in 12 shades.","priceCents":2400,"needsShade":false,"reason":"Colour to finish the look."}]}

HTTP 200
```

## `GET /api/recommendations?category=serum`

```
{"count":2,"recommendations":[{"id":"SRM-001","name":"Hydra Glow Serum","category":"serum","description":"Lightweight hyaluronic serum for daily hydration.","priceCents":3800,"needsShade":false,"reason":"Skin prep, before foundation."},{"id":"SRM-002","name":"Night Renewal Serum","category":"serum","description":"Overnight serum for smoother-looking skin.","priceCents":5400,"needsShade":false,"reason":"Skin prep, before foundation."}]}

HTTP 200
```

## `GET /api/recommendations?category=Mascara`

```
{"count":1,"recommendations":[{"id":"MSC-001","name":"Volume Lift Mascara","category":"mascara","description":"Buildable volume with a curved brush.","priceCents":2600,"needsShade":false,"reason":"Definition for the eyes."}]}

HTTP 200
```

## `GET /api/recommendations?category=perfume`

```
{"count":0,"recommendations":[]}

HTTP 200
```
