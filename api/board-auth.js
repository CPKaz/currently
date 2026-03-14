// api/board-auth.js
// Password-protected edit access for the TODO board.
// Set BOARD_PASSWORD in Vercel environment variables.
// GET: returns { authenticated: boolean }
// POST body: { password: string } — sets cookie if password matches

const crypto = require('crypto');

const COOKIE_NAME = 'board_edit';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password)).digest('hex');
}

function getCookieOptions() {
  const isProd = process.env.VERCEL_ENV === 'production';
  return [
    `Path=/`,
    `Max-Age=${COOKIE_MAX_AGE}`,
    `SameSite=Strict`,
    ...(isProd ? ['Secure'] : [])
  ].join('; ');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  const expectedHash = process.env.BOARD_PASSWORD
    ? hashPassword(process.env.BOARD_PASSWORD)
    : null;

  if (req.method === 'GET') {
    if (!expectedHash) {
      return res.status(200).json({ authenticated: false, configured: false });
    }
    const cookie = (req.headers.cookie || '')
      .split(';')
      .map((s) => s.trim())
      .find((s) => s.startsWith(COOKIE_NAME + '='));
    const value = cookie ? cookie.slice(COOKIE_NAME.length + 1).trim() : '';
    const authenticated = value === expectedHash;
    return res.status(200).json({ authenticated, configured: true });
  }

  if (req.method === 'POST') {
    if (!expectedHash) {
      return res.status(500).json({ error: 'Board password not configured' });
    }
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
    const password = body.password;
    if (hashPassword(password) !== expectedHash) {
      return res.status(401).json({ authenticated: false, error: 'Wrong password' });
    }
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=${expectedHash}; ${getCookieOptions()}`);
    return res.status(200).json({ authenticated: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
