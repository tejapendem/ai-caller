import { query } from '../db/index.js';

export async function listLeads(req, res) {
  const { channel, outcome, employee_id, hot, q, limit = 50, offset = 0 } = req.query;

  let sql = `SELECT l.*, e.name as employee_name, c.name as campaign_name
             FROM leads l
             LEFT JOIN employees e ON e.id=l.employee_id
             LEFT JOIN campaigns c ON c.id=l.campaign_id
             WHERE l.user_id=$1`;
  const params = [req.userId];
  let p = 2;

  if (channel) { sql += ` AND l.channel=$${p++}`; params.push(channel); }
  if (outcome) { sql += ` AND l.outcome=$${p++}`; params.push(outcome); }
  if (employee_id) { sql += ` AND l.employee_id=$${p++}`; params.push(employee_id); }
  if (hot === 'true') { sql += ` AND l.hot=true`; }
  if (q) {
    sql += ` AND (l.name ILIKE $${p} OR l.phone ILIKE $${p})`;
    params.push(`%${q}%`); p++;
  }

  sql += ` ORDER BY l.created_at DESC LIMIT $${p++} OFFSET $${p++}`;
  params.push(parseInt(limit), parseInt(offset));

  const { rows } = await query(sql, params);
  const total = await query('SELECT COUNT(*) FROM leads WHERE user_id=$1', [req.userId]);

  res.json({ leads: rows, total: parseInt(total.rows[0].count) });
}

export async function getLead(req, res) {
  const { rows } = await query('SELECT * FROM leads WHERE id=$1 AND user_id=$2', [req.params.id, req.userId]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });

  const calls = await query('SELECT * FROM calls WHERE lead_id=$1 ORDER BY started_at DESC', [req.params.id]);
  res.json({ ...rows[0], calls: calls.rows });
}

export async function getLeadStats(req, res) {
  const { rows } = await query(
    `SELECT
       COUNT(*) as total,
       COUNT(*) FILTER (WHERE outcome='qualified') as qualified,
       COUNT(*) FILTER (WHERE outcome='callback') as pending_callback,
       COUNT(*) FILTER (WHERE hot=true AND created_at > NOW()-INTERVAL '7d') as hot
     FROM leads WHERE user_id=$1`,
    [req.userId]
  );
  res.json(rows[0]);
}
