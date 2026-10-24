/**
 * Telephony caller — supports Twilio and Plivo
 * Set TWILIO_* or PLIVO_* env vars to choose provider
 */
import { query } from '../db/index.js';

export async function initiateCall({ lead, employee, channel, campaignId }) {
  const provider = process.env.TWILIO_ACCOUNT_SID ? 'twilio' : 'plivo';

  // Insert call record first to get the ID
  const { rows } = await query(
    `INSERT INTO calls(user_id,lead_id,employee_id,campaign_id,direction,channel,phone_to,status)
     VALUES($1,$2,$3,$4,'outbound',$5,$6,'initiated') RETURNING id`,
    [lead.user_id, lead.id, employee.id, campaignId || null, channel, lead.phone]
  );
  const callId = rows[0].id;

  const callbackUrl = `${process.env.PUBLIC_URL}/telephony/stream/${callId}`;
  const statusUrl   = `${process.env.PUBLIC_URL}/telephony/status/${callId}`;

  if (provider === 'twilio') {
    await callViaTwilio(lead.phone, callbackUrl, statusUrl);
  } else {
    await callViaPlivo(lead.phone, callbackUrl, statusUrl);
  }

  return callId;
}

async function callViaTwilio(to, callbackUrl, statusUrl) {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from  = process.env.TWILIO_PHONE_NUMBER;

  const body = new URLSearchParams({
    To: to, From: from,
    Url: callbackUrl,
    StatusCallback: statusUrl,
    StatusCallbackMethod: 'POST',
  });

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Calls.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  if (!res.ok) throw new Error(`Twilio error: ${await res.text()}`);
}

async function callViaPlivo(to, callbackUrl, statusUrl) {
  const id    = process.env.PLIVO_AUTH_ID;
  const token = process.env.PLIVO_AUTH_TOKEN;
  const from  = process.env.PLIVO_NUMBER;

  const res = await fetch(`https://api.plivo.com/v1/Account/${id}/Call/`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${token}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to, from,
      answer_url: callbackUrl,
      hangup_url: statusUrl,
    }),
  });
  if (!res.ok) throw new Error(`Plivo error: ${await res.text()}`);
}
