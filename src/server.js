// Beauty Advisor: zero-dependency Node server.
// Routes are auto-loaded from src/routes/*.js, so a new feature adds a file, not a server edit.
import http from 'node:http';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { sendJson } from './lib/http.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(here, '..', 'public');
const ROUTES_DIR = path.join(here, 'routes');
const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
};

export async function loadRoutes() {
  const files = (await readdir(ROUTES_DIR)).filter((f) => f.endsWith('.js')).sort();
  const routes = [];
  for (const f of files) {
    const mod = await import(pathToFileURL(path.join(ROUTES_DIR, f)).href);
    routes.push(...mod.default);
  }
  return routes;
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return null; }
}

async function serveStatic(res, urlPath) {
  const rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  const file = path.normalize(path.join(PUBLIC_DIR, rel));
  if (!file.startsWith(PUBLIC_DIR)) return sendJson(res, 403, { error: 'Forbidden' });
  try {
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    sendJson(res, 404, { error: 'Not found' });
  }
}

export async function createServer() {
  const routes = await loadRoutes();
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const route = routes.find((r) => r.method === req.method && r.path === url.pathname);
    if (!route) return serveStatic(res, url.pathname);
    const body = req.method === 'POST' ? await readJsonBody(req) : undefined;
    if (body === null) return sendJson(res, 400, { error: 'Request body must be valid JSON' });
    try {
      await route.handler({ req, res, query: url.searchParams, body });
    } catch (err) {
      console.error('Unhandled route error:', err.message);
      sendJson(res, 500, { error: 'Internal error' });
    }
  });
}

// SEC-5: this machine only, unless HOST says otherwise. There is no sign-in.
export function listenAddress(env = process.env) {
  return { port: Number(env.PORT) || 3000, host: env.HOST || '127.0.0.1' };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { port, host } = listenAddress();
  const server = await createServer();
  server.listen(port, host, () => console.log(`Beauty Advisor running at http://${host === '127.0.0.1' ? 'localhost' : host}:${port}`));
}
