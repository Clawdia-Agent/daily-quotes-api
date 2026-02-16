import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { getAll, getRandom, getById, create, remove } from './lib/quotes.js';

const PORT = process.env.PORT || 3000;
const PUBLIC = join(new URL('.', import.meta.url).pathname, 'public');

const MIME = {
  '.html': 'text/html', '.css': 'text/css',
  '.js': 'application/javascript', '.json': 'application/json',
  '.png': 'image/png', '.svg': 'image/svg+xml',
};

function json(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { reject(new Error('Invalid JSON')); }
    });
  });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // ── API Routes ──
  if (path === '/api/quotes/random' && req.method === 'GET') {
    const q = getRandom();
    return q ? json(res, 200, q) : json(res, 404, { error: 'No quotes available' });
  }

  if (path === '/api/quotes' && req.method === 'GET') {
    const category = url.searchParams.get('category');
    let quotes = getAll();
    if (category) quotes = quotes.filter(q => q.category === category);
    return json(res, 200, { quotes, total: quotes.length });
  }

  if (path === '/api/quotes' && req.method === 'POST') {
    try {
      const { text, author, category } = await parseBody(req);
      const q = create(text, author, category);
      return json(res, 201, q);
    } catch (err) {
      return json(res, 400, { error: err.message });
    }
  }

  const idMatch = path.match(/^\/api\/quotes\/([\w-]+)$/);
  if (idMatch && req.method === 'GET') {
    const q = getById(idMatch[1]);
    return q ? json(res, 200, q) : json(res, 404, { error: 'Quote not found' });
  }
  if (idMatch && req.method === 'DELETE') {
    return remove(idMatch[1])
      ? json(res, 200, { ok: true })
      : json(res, 404, { error: 'Quote not found' });
  }

  // ── Static files ──
  const file = path === '/' ? join(PUBLIC, 'index.html') : join(PUBLIC, path);
  if (existsSync(file)) {
    const mime = MIME[extname(file)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    return res.end(readFileSync(file));
  }

  json(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => console.log(`Daily Quotes API → http://localhost:${PORT}`));
