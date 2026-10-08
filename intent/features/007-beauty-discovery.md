# Feature 007: Beauty Discovery Experience

Beauty Finder leads with discovery. `/discover.html` guides a shopper through choosing a model, undertone, finish, eyes, lips and cheeks. The model repaints on every choice; the foundation shade comes from the existing `/api/shade-match` rules. A completed look names the look, explains why, lists products, and adds products or the whole look to the bag.

Boundaries: no AR, camera, accounts, persistence. Selections are never logged or stored (SEC-2); the bag stays in session storage (SEC-4). Copy never calls a shade "perfect".
