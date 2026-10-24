import { query } from '../db/index.js';
import { initiateCall } from '../telephony/caller.js';

// ── Campaigns ──────────────────────────────────────────────────────────────

export async function listCampaigns(req, res) {
  const { rows } = await query(
    `SELECT c.*, e.name as employee_name
     FROM campaigns c LEFT JOIN employees e ON e.id=c.employee_id
     WHERE c.user_id=$1 ORDER BY c.created_at DESC`,
    [req.userId]
  );
  res.json(rows);
}

export async function getCampaign(req, res) {
  const { rows } = await query(
    'SELECT * FROM campaigns WHERE id=$1 AND user_id=$2',
    [req.params.id, req.userId]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
}

export async function createCampaign(req, res) {
  const { name, employee_id, leads } = req.body;
  if (!name || !employee_id) return res.status(400).json({ error: 'name and employee_id required' });

  const { rows } = await query(
    'INSERT INTO campaigns(user_id,employee_id,name,total_leads) VALUES($1,$2,$3,$4) RETURNING *',
    [req.userId, employee_id, name, (leads || []).length]
  );
  const campaign = rows[0];

  // Insert leads
  if (leads?.length) {
    for (const l of leads) {
      await query(
        'INSERT INTO leads(user_id,campaign_id,employee_id,name,phone,channel) VALUES($1,$2,$3,$4,$5,$6)',
        [req.userId, campaign.id, employee_id, l.name || null, l.phone, 'bulk']
      );
    }
  }

  res.status(201).json(campaign);
}

export async function startCampaign(req, res) {
  const { rows } = await query(
    'UPDATE campaigns SET status=$1, started_at=NOW() WHERE id=$2 AND user_id=$3 RETURNING *',
    ['running', req.params.id, req.userId]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });

  // Kick off async dialing
  dialCampaign(rows[0]).catch(console.error);
  res.json(rows[0]);
}

export async function pauseCampaign(req, res) {
  const { rows } = await query(
    'UPDATE campaigns SET status=$1 WHERE id=$2 AND user_id=$3 RETURNING *',
    ['paused', req.params.id, req.userId]
  );
  res.json(rows[0]);
}

async function dialCampaign(campaign) {
  const { rows: pendingLeads } = await query(
    `SELECT l.* FROM leads l
     LEFT JOIN calls c ON c.lead_id=l.id
     WHERE l.campaign_id=$1 AND c.id IS NULL`,
    [campaign.id]
  );

  const emp = await query('SELECT * FROM employees WHERE id=$1', [campaign.employee_id]);
  const employee = emp.rows[0];

  for (const lead of pendingLeads) {
    // Check campaign still running
    const { rows } = await query('SELECT status FROM campaigns WHERE id=$1', [campaign.id]);
    if (rows[0]?.status !== 'running') break;

    await initiateCall({ lead, employee, channel: 'bulk', campaignId: campaign.id });
    await query('UPDATE campaigns SET called=called+1 WHERE id=$1', [campaign.id]);

    // Rate limiting — 1 call per 2 sec by default
    await new Promise(r => setTimeout(r, 2000));
  }

  await query(
    'UPDATE campaigns SET status=$1, completed_at=NOW() WHERE id=$2',
    ['completed', campaign.id]
  );
}

// ── Instant leads (webhook) ────────────────────────────────────────────────

export async function listWebhooks(req, res) {
  const { rows } = await query(
    'SELECT w.*,e.name as employee_name FROM webhooks w JOIN employees e ON e.id=w.employee_id WHERE w.user_id=$1',
    [req.userId]
  );
  res.json(rows);
}

export async function createWebhook(req, res) {
  const { employee_id, name } = req.body;
  const { rows } = await query(
    'INSERT INTO webhooks(user_id,employee_id,name) VALUES($1,$2,$3) RETURNING *',
    [req.userId, employee_id, name]
  );
  const w = rows[0];
  res.status(201).json({
    ...w,
    url: `${process.env.PUBLIC_URL}/webhook/${w.secret}`,
  });
}

// Called by external systems to trigger instant call
export async function handleWebhook(req, res) {
  const { secret } = req.params;
  const { rows } = await query(
    'SELECT w.*,e.* FROM webhooks w JOIN employees e ON e.id=w.employee_id WHERE w.secret=$1 AND w.active=true',
    [secret]
  );
  if (!rows.length) return res.status(404).json({ error: 'Webhook not found' });

  const wh = rows[0];
  const { phone, name, ...captured } = req.body;
  if (!phone) return res.status(400).json({ error: 'phone required' });

  const { rows: lr } = await query(
    'INSERT INTO leads(user_id,employee_id,name,phone,channel,captured_data) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
    [wh.user_id, wh.employee_id, name, phone, 'instant', JSON.stringify(captured)]
  );

  initiateCall({ lead: lr[0], employee: wh, channel: 'instant' }).catch(console.error);
  res.json({ ok: true, lead_id: lr[0].id });
}
