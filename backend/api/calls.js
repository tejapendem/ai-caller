import { query } from '../db/index.js';

export async function listCalls(req, res) {
  const { channel, outcome, employee_id, direction, q, limit = 50, offset = 0 } = req.query;

  let sql = `SELECT c.*, e.name as employee_name, l.name as lead_name
             FROM calls c
             LEFT JOIN employees e ON e.id=c.employee_id
             LEFT JOIN leads l ON l.id=c.lead_id
             WHERE c.user_id=$1`;
  const params = [req.userId];
  let p = 2;

  if (channel)      { sql += ` AND c.channel=$${p++}`;      params.push(channel); }
  if (outcome)      { sql += ` AND c.outcome=$${p++}`;      params.push(outcome); }
  if (employee_id)  { sql += ` AND c.employee_id=$${p++}`;  params.push(employee_id); }
  if (direction)    { sql += ` AND c.direction=$${p++}`;    params.push(direction); }
  if (q) {
    sql += ` AND (l.name ILIKE $${p} OR c.phone_to ILIKE $${p} OR c.phone_from ILIKE $${p})`;
    params.push(`%${q}%`); p++;
  }

  sql += ` ORDER BY c.started_at DESC LIMIT $${p++} OFFSET $${p++}`;
  params.push(parseInt(limit), parseInt(offset));

  const { rows } = await query(sql, params);
  const total = await query('SELECT COUNT(*) FROM calls WHERE user_id=$1', [req.userId]);
  res.json({ calls: rows, total: parseInt(total.rows[0].count) });
}

export async function getCall(req, res) {
  const { rows } = await query('SELECT * FROM calls WHERE id=$1 AND user_id=$2', [req.params.id, req.userId]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
}

export async function getCallStats(req, res) {
  const { rows } = await query(
    `SELECT
       COUNT(*) as total_calls,
       SUM(duration_sec) as total_duration,
       AVG(duration_sec) as avg_duration,
       SUM(credits_used) as total_credits,
       COUNT(*) FILTER (WHERE outcome='qualified') as qualified
     FROM calls WHERE user_id=$1`,
    [req.userId]
  );
  res.json(rows[0]);
}

export async function getDailyPerf(req, res) {
  const { days = 30 } = req.query;
  const { rows } = await query(
    `SELECT date, SUM(total_calls) as calls, SUM(qualified) as qualified, SUM(credits_used) as credits
     FROM perf_daily WHERE user_id=$1 AND date > NOW()-($2::int * INTERVAL '1 day')
     GROUP BY date ORDER BY date`,
    [req.userId, parseInt(days)]
  );
  res.json(rows);
}
