import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db/index.js';
import { v4 as uuid } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

export function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// Middleware
export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = verifyToken(header.slice(7));
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export async function register(req, res) {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const exists = await query('SELECT id FROM users WHERE email=$1', [email]);
  if (exists.rows.length) return res.status(409).json({ error: 'Email already registered' });

  const hash = await bcrypt.hash(password, 10);
  const { rows } = await query(
    'INSERT INTO users(email,password,name) VALUES($1,$2,$3) RETURNING id,email,name,credits',
    [email, hash, name || email.split('@')[0]]
  );

  // Free ₹50 credit
  await query(
    'INSERT INTO transactions(user_id,type,amount,description) VALUES($1,$2,$3,$4)',
    [rows[0].id, 'free_credit', 5000, 'Welcome bonus ₹50']
  );

  const token = signToken(rows[0].id);
  res.json({ token, user: rows[0] });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const { rows } = await query('SELECT * FROM users WHERE email=$1', [email]);
  if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, rows[0].password || '');
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signToken(rows[0].id);
  const { password: _, ...user } = rows[0];
  res.json({ token, user });
}

export async function me(req, res) {
  const { rows } = await query(
    'SELECT id,email,name,timezone,credits,created_at FROM users WHERE id=$1',
    [req.userId]
  );
  if (!rows.length) return res.status(404).json({ error: 'User not found' });
  res.json(rows[0]);
}

export async function updateMe(req, res) {
  const { name, timezone } = req.body;
  const { rows } = await query(
    'UPDATE users SET name=COALESCE($1,name), timezone=COALESCE($2,timezone) WHERE id=$3 RETURNING id,email,name,timezone,credits',
    [name, timezone, req.userId]
  );
  res.json(rows[0]);
}
