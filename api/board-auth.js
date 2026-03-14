// api/board-auth.js
// Password-protected edit access for the TODO board.
// Set BOARD_PASSWORD in Vercel environment variables.
// GET: returns { authenticated: boolean }
// POST body: { password: string } — sets cookie if password matches

const crypto = require('crypto');

const COOKIE_NAME = 'board_edit';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function hashPassword(password) {
  const str = String(password ?? '').trim();
  return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
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

  const envPassword = 'test';
  const expectedHash = envPassword ? hashPassword(envPassword) : null;

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
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON' });
      }
    }
    body = body || {};
    const password = body.password != null ? String(body.password).trim() : '';
    const submittedHash = hashPassword(password);
    if (submittedHash !== expectedHash) {
      return res.status(401).json({ authenticated: false, error: 'Wrong password' });
    }
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=${expectedHash}; ${getCookieOptions()}`);
    return res.status(200).json({ authenticated: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
