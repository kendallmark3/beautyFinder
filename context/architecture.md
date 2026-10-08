# Architecture

```
public/            static UI (HTML + CSS + small ES modules)
src/server.js      Node http server. Serves public/, auto-loads src/routes/*.js
src/routes/        one file per feature; exports [{ method, path, handler }]
src/lib/           domain logic (pure functions, easy to test)
src/data/          catalog JSON (stands in for the product master system)
tests/             node:test, one file per feature
```

- Routes import helpers from `src/lib/http.js`, never from `server.js` (avoids a circular import).
- Handlers receive `{ req, res, query, body }`. `body` is parsed JSON for POST.
- No database. No external calls. No runtime dependencies.
