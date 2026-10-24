'use strict';
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const scrapr = require('./scrapr-core');
const path = require('path');
const app = express();
const PORT = Number(process.env.PORT || 3000);

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '20kb' }));
app.use('/api/', rateLimit({ windowMs: 60_000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false, message: { status: false, message: 'Terlalu banyak permintaan. Coba lagi sebentar.' } }));
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.use(express.static(path.join(__dirname, 'public')));

const METHODS = {};
for (const [platform, group] of Object.entries(scrapr)) {
  METHODS[platform] = Object.keys(group).filter(method => typeof group[method] === 'function');
}

const BLOCKED_HOSTS = /(^localhost$|\.localhost$|\.local$|\.internal$|^127\.|^10\.|^192\.168\.|^169\.254\.|^172\.(1[6-9]|2\d|3[01])\.|^0\.|^::1$|^fc[0-9a-f]{2}:|^fe80:)/i;
function isPublicHttpUrl(raw) {
  try {
    const u = new URL(raw);
    if (!['http:', 'https:'].includes(u.protocol)) return false;
    if (!u.hostname || u.hostname.startsWith('[') || BLOCKED_HOSTS.test(u.hostname)) return false;
    if (u.username || u.password) return false;
    return true;
  } catch { return false; }
}
function jsonSafe(value) {
  const seen = new WeakSet();
  return JSON.parse(JSON.stringify(value, (key, val) => {
    if (typeof val === 'string' && val.length > 5000) return val.slice(0, 5000);
    if (val && typeof val === 'object') {
      if (seen.has(val)) return '[Circular]';
      seen.add(val);
    }
    return val;
  }));
}
app.get('/api/health', (_req, res) => res.json({ status: true, name: 'VELAX', version: '1.0.0', platforms: Object.keys(METHODS).length }));
app.get('/api/methods', (_req, res) => res.json({ status: true, methods: METHODS }));
app.post('/api/extract', async (req, res) => {
  const { platform, method, url } = req.body || {};
  if (typeof platform !== 'string' || typeof method !== 'string' || typeof url !== 'string') {
    return res.status(400).json({ status: false, message: 'Platform, method, dan URL wajib diisi.' });
  }
  if (!METHODS[platform] || !METHODS[platform].includes(method)) {
    return res.status(400).json({ status: false, message: 'Metode tidak tersedia pada library ini.' });
  }
  if (url.length > 3000 || !isPublicHttpUrl(url)) {
    return res.status(400).json({ status: false, message: 'URL tidak valid. Gunakan tautan HTTP/HTTPS publik.' });
  }
  const fn = scrapr[platform][method];
  let timer;
  try {
    const timeoutMs = 45_000;
    const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Permintaan melewati batas waktu 45 detik.')), timeoutMs); });
    const result = await Promise.race([fn(url), timeout]);
    clearTimeout(timer);
    if (!result || typeof result !== 'object') return res.status(502).json({ status: false, message: 'Sumber mengembalikan respons yang tidak dikenali.' });
    return res.json(jsonSafe(result));
  } catch (err) {
    clearTimeout(timer);
    return res.status(502).json({ status: false, message: err?.message || 'Ekstraksi gagal. Coba metode lain atau periksa tautannya.' });
  }
});
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, '0.0.0.0', () => console.log(`VELAX berjalan di port ${PORT}`));
