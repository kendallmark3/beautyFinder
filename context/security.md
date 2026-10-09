# Security & Privacy

- **SEC-1** Validate every request body. Reject bad input with `400` and field-level messages; never echo raw input into HTML.
- **SEC-2** Skin depth, undertone, and any image or personal attribute are customer personal data. Never log them, never write them to disk, never send them to a third party.
- **SEC-3** Static file serving must not escape `public/` (path traversal check in `server.js`).
- **SEC-4** A shopper's bag is kept only in their own browser for the session (`sessionStorage`), and only for items they chose to add. The server never stores a bag. Pricing requests carry product ids and quantities only; shade codes never leave the browser.
- **SEC-5** The server listens on `127.0.0.1` only. `HOST=0.0.0.0` exposes it to the network; there is no sign-in, so do that only on a network you trust.
