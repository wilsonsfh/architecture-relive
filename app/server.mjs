// Minimal static server for the prototype. Loopback only, no writes, no uploads.
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { readFileSync, createReadStream } from 'node:fs';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveBuilding, cachedById, scenePhotos, anyRecord } from './lib/resolve.mjs';
import { ping, hasKey, MODELS } from './lib/llm.mjs';

const PORT = Number(process.env.PORT || 4817);
const HOST = '127.0.0.1';
const PUBLIC = fileURLToPath(new URL('./public/', import.meta.url));

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.jpg': 'image/jpeg',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.mp4': 'video/mp4',
};

// The inline import map is allowed by hash, so script-src stays free of 'unsafe-inline'.
function importMapHash() {
  try {
    const html = readFileSync(new URL('./public/index.html', import.meta.url), 'utf8');
    const m = /<script type="importmap">([\s\S]*?)<\/script>/.exec(html);
    return m ? `'sha256-${createHash('sha256').update(m[1]).digest('base64')}'` : '';
  } catch { return ''; }
}
const HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': `default-src 'self'; img-src 'self' data:; media-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' ${importMapHash()}; connect-src 'self'; frame-ancestors 'self' http://127.0.0.1:* http://localhost:*`,
};

export function resolvePath(urlPath) {
  let p;
  try { p = decodeURIComponent(urlPath.split('?')[0]); } catch { return null; }
  if (p.includes('\0')) return null;
  if (p.endsWith('/')) p += 'index.html';
  const full = normalize(join(PUBLIC, p));
  if (!full.startsWith(PUBLIC.endsWith(sep) ? PUBLIC : PUBLIC + sep)) return null;
  return full;
}


// ---- API: read-only for the browser. The server (not the browser) writes the local cache. ----
const json = (res, code, obj) => res.writeHead(code, { ...HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }).end(JSON.stringify(obj));
const hits = []; // sliding-window limit on lookups that may reach Wikipedia or the model
const allow = () => { const now = Date.now(); while (hits.length && now - hits[0] > 60000) hits.shift(); if (hits.length >= 20) return false; hits.push(now); return true; };
const inflight = new Map();
async function api(req, res) {
  const u = new URL(req.url, 'http://x');
  try {
    if (u.pathname === '/api/status') return json(res, 200, { model_enabled: hasKey(), models: hasKey() ? MODELS : [] });
    if (u.pathname === '/api/ping') { const p = await ping(); return json(res, 200, p); } // status + model name only
    if (u.pathname === '/api/b') { // /api/b?id=slug  -> cached record only
      const b = await cachedById(u.searchParams.get('id') || '');
      return b ? json(res, 200, b) : json(res, 404, { error: 'unknown id' });
    }
    if (u.pathname === '/api/scene-photos') { // one photo per scene (or null), closest open match
      const rec = await anyRecord((u.searchParams.get('id') || '').slice(0, 80).replace(/[^a-z0-9-]/gi, ''));
      if (!rec) return json(res, 404, { error: 'unknown id' });
      return json(res, 200, { photos: await scenePhotos(rec) });
    }
    if (u.pathname === '/api/resolve') {
      const q = (u.searchParams.get('q') || '').slice(0, 80);
      if (q.trim().length < 3) return json(res, 200, { refusal: 'Type at least three letters.' });
      if (!allow()) return json(res, 429, { refusal: 'Slow down a little and try again in a minute.' });
      const k = q.toLowerCase();
      if (!inflight.has(k)) inflight.set(k, resolveBuilding(q).finally(() => inflight.delete(k)));
      try { return json(res, 200, { building: await inflight.get(k) }); }
      catch (e) { if (e.refusal) return json(res, 200, { refusal: e.message }); throw e; }
    }
    return json(res, 404, { error: 'not found' });
  } catch (e) { console.error('api error:', e.message); return json(res, 502, { refusal: 'Could not reach the sources just now. The built-in buildings still work.' }); }
}
export const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, HEADERS).end(); return; }
  if (req.url === '/healthz') { res.writeHead(200, { ...HEADERS, 'Content-Type': 'text/plain' }).end('ok'); return; }
  if (req.url.startsWith('/api/')) return api(req, res);
  const full = resolvePath(req.url);
  if (!full) { res.writeHead(400, HEADERS).end('bad path'); return; }
  try {
    const s = await stat(full);
    if (!s.isFile()) throw new Error('not file');
    const type = TYPES[extname(full)] || 'application/octet-stream';
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (range && (range[1] || range[2])) { // Range support: Safari and Chrome need 206 to play and seek video
      let a = range[1] ? Number(range[1]) : Math.max(0, s.size - Number(range[2])), z = range[1] && range[2] ? Number(range[2]) : s.size - 1;
      z = Math.min(z, s.size - 1);
      if (a > z || a >= s.size) { res.writeHead(416, { ...HEADERS, 'Content-Range': `bytes */${s.size}` }).end(); return; }
      res.writeHead(206, { ...HEADERS, 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${a}-${z}/${s.size}`, 'Content-Length': z - a + 1, 'Cache-Control': 'no-cache' });
      if (req.method === 'HEAD') return void res.end();
      createReadStream(full, { start: a, end: z }).pipe(res); return;
    }
    res.writeHead(200, { ...HEADERS, 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Length': s.size, 'Cache-Control': 'no-cache' });
    if (req.method === 'HEAD') return void res.end();
    createReadStream(full).pipe(res);
  } catch {
    res.writeHead(404, { ...HEADERS, 'Content-Type': 'text/plain' }).end('not found');
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.listen(PORT, HOST, () => console.log(`Architecture Relive listening on http://${HOST}:${PORT}`));
}
