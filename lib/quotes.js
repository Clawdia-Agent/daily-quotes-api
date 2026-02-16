import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { randomUUID } from 'crypto';

const DATA_FILE = join(dirname(new URL(import.meta.url).pathname), '..', 'data', 'quotes.json');

function ensureDir() {
  const dir = dirname(DATA_FILE);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function load() {
  ensureDir();
  if (!existsSync(DATA_FILE)) return [];
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
}

function save(quotes) {
  ensureDir();
  writeFileSync(DATA_FILE, JSON.stringify(quotes, null, 2));
}

export function getAll() { return load(); }

export function getRandom() {
  const quotes = load();
  if (quotes.length === 0) return null;
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export function getById(id) {
  return load().find(q => q.id === id) || null;
}

export function create(text, author, category) {
  if (!text || !author) throw new Error('text and author are required');
  const quotes = load();
  const quote = {
    id: randomUUID(),
    text: text.trim(),
    author: author.trim(),
    category: category || 'general',
    createdAt: new Date().toISOString(),
  };
  quotes.push(quote);
  save(quotes);
  return quote;
}

export function remove(id) {
  const quotes = load();
  const idx = quotes.findIndex(q => q.id === id);
  if (idx === -1) return false;
  quotes.splice(idx, 1);
  save(quotes);
  return true;
}
