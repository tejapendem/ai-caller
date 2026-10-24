import { query } from '../db/index.js';

const PLANS = [
  { id: 'starter', label: 'Starter',  mins: 60,   price: 49900,  credits: 49900 },
  { id: 'growth',  label: 'Growth',   mins: 300,  price: 199900, credits: 199900 },
  { id: 'scale',   label: 'Scale',    mins: 1000, price: 599900, credits: 599900 },
];

export function getPlans(req, res) {
  res.json(PLANS);
}

export async function getBalance(req, res) {
  const { rows } = await query('SELECT credits FROM users WHERE id=$1', [req.userId]);
  res.json({ credits: rows[0]?.credits ?? 0 });
}

export async function getTransactions(req, res) {
  const { rows } = await query(
    'SELECT * FROM transactions WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50',
    [req.userId]
  );
  res.json(rows);
}

// In production plug in Razorpay/Stripe here
export async function topup(req, res) {
  const { plan_id } = req.body;
  const plan = PLANS.find(p => p.id === plan_id);
  if (!plan) return res.status(400).json({ error: 'Invalid plan' });

  await query('UPDATE users SET credits=credits+$1 WHERE id=$2', [plan.credits, req.userId]);
  await query(
    'INSERT INTO transactions(user_id,type,amount,description) VALUES($1,$2,$3,$4)',
    [req.userId, 'topup', plan.credits, `${plan.label} plan – ${plan.mins} min`]
  );

  const { rows } = await query('SELECT credits FROM users WHERE id=$1', [req.userId]);
  res.json({ credits: rows[0].credits });
}

// Numbers
export async function listNumbers(req, res) {
  const { rows } = await query(
    'SELECT n.*,e.name as employee_name FROM phone_numbers n LEFT JOIN employees e ON e.id=n.employee_id WHERE n.user_id=$1',
    [req.userId]
  );
  res.json(rows);
}

export async function assignNumber(req, res) {
  const { employee_id } = req.body;
  const { rows } = await query(
    'UPDATE phone_numbers SET employee_id=$1 WHERE id=$2 AND user_id=$3 RETURNING *',
    [employee_id, req.params.id, req.userId]
  );
  res.json(rows[0]);
}

// Settings
export async function getSettings(req, res) {
  const { rows } = await query(
    'SELECT id,email,name,timezone,created_at FROM users WHERE id=$1',
    [req.userId]
  );
  res.json(rows[0]);
}

export async function updateSettings(req, res) {
  const { name, timezone } = req.body;
  const { rows } = await query(
    'UPDATE users SET name=COALESCE($1,name),timezone=COALESCE($2,timezone) WHERE id=$3 RETURNING id,email,name,timezone',
    [name, timezone, req.userId]
  );
  res.json(rows[0]);
}

// API keys
export async function listApiKeys(req, res) {
  const { rows } = await query(
    'SELECT id,name,last_used,created_at FROM api_keys WHERE user_id=$1',
    [req.userId]
  );
  res.json(rows);
}

export async function createApiKey(req, res) {
  const { name } = req.body;
  const raw = `sk_live_${crypto.randomUUID().replace(/-/g,'')}`;
  const hash = raw; // In production: bcrypt hash but return raw once
  await query('INSERT INTO api_keys(user_id,name,key_hash) VALUES($1,$2,$3)', [req.userId, name, hash]);
  res.json({ key: raw, note: 'Store this key — it will not be shown again.' });
}
