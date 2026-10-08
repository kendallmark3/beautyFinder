# API responses: Feature 002 Shade Finder

Captured from the running app (`npm start`).

## Valid: depth 5, warm → 200
```json
{
  "matches": [
    {
      "code": "230",
      "name": "230 Honey Beige",
      "depth": 5,
      "undertone": "warm",
      "productId": "FDN-001",
      "productName": "Radiance Skin Foundation",
      "score": 0,
      "confidence": "excellent"
    },
    {
      "code": "220",
      "name": "220 Natural Buff",
      "depth": 4.5,
      "undertone": "neutral",
      "productId": "FDN-001",
      "productName": "Radiance Skin Foundation",
      "score": 1,
      "confidence": "good"
    },
    {
      "code": "250",
      "name": "250 True Beige",
      "depth": 6,
      "undertone": "neutral",
      "productId": "FDN-001",
      "productName": "Radiance Skin Foundation",
      "score": 1.5,
      "confidence": "fair"
    }
  ],
  "consultation": false
}
```

## Invalid: depth 14, undertone "olive" → 400 (AC-3)
```json
{
  "error": "Invalid input",
  "fields": {
    "depth": "depth must be a number from 1 (lightest) to 10 (deepest)",
    "undertone": "undertone must be one of: cool, neutral, warm"
  }
}
```

## Deepest cool: depth 10, cool → 200
```json
{
  "matches": [
    {
      "code": "350",
      "name": "350 Mahogany",
      "depth": 9,
      "undertone": "cool",
      "productId": "FDN-001",
      "productName": "Radiance Skin Foundation",
      "score": 1,
      "confidence": "good"
    },
    {
      "code": "360",
      "name": "360 Espresso",
      "depth": 9.5,
      "undertone": "warm",
      "productId": "FDN-001",
      "productName": "Radiance Skin Foundation",
      "score": 2,
      "confidence": "fair"
    },
    {
      "code": "340",
      "name": "340 Cocoa",
      "depth": 8.5,
      "undertone": "neutral",
      "productId": "FDN-001",
      "productName": "Radiance Skin Foundation",
      "score": 2,
      "confidence": "fair"
    }
  ],
  "consultation": false
}
```
