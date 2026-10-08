// Shared HTTP helpers. Routes import from here (never from server.js) to avoid a circular import.
export function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}
