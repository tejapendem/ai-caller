/**
 * Real-time call handler via WebSocket (Twilio Media Streams / Plivo AudioSocket)
 * Each active call gets its own WS session, running the STT → LLM → TTS loop
 */
import { transcribe } from '../voice/stt.js';
import { synthesize } from '../voice/tts.js';
import { chat } from '../voice/llm.js';
import { query } from '../db/index.js';

// Cost: 1 rupee per minute = 100 paise/min = ~1.67 paise/sec
const PAISE_PER_SEC = 2;

export function setupCallWebSocket(app) {
  // Twilio calls this URL when the call connects — returns TwiML to open media stream
  app.post('/telephony/stream/:callId', async (req, res) => {
    const { callId } = req.params;
    const wsUrl = `wss://${req.headers.host}/telephony/ws/${callId}`;
    res.set('Content-Type', 'text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${wsUrl}" />
  </Connect>
</Response>`);
  });

  // Twilio/Plivo posts call status updates here
  app.post('/telephony/status/:callId', async (req, res) => {
    const { callId } = req.params;
    const status = req.body.CallStatus || req.body.status || 'completed';
    await query(
      'UPDATE calls SET status=$1, ended_at=NOW() WHERE id=$2',
      [status, callId]
    );
    res.sendStatus(204);
  });

  // WebSocket endpoint — media stream from Twilio
  app.ws('/telephony/ws/:callId', async (ws, req) => {
    const { callId } = req.params;
    const { rows } = await query(
      `SELECT c.*, e.system_prompt, e.voice_id, e.language
       FROM calls c JOIN employees e ON e.id=c.employee_id
       WHERE c.id=$1`,
      [callId]
    );
    if (!rows.length) { ws.close(); return; }

    const call = rows[0];
    const conversation = [];
    const audioChunks = [];
    let startTime = Date.now();

    await query('UPDATE calls SET status=$1, started_at=NOW() WHERE id=$2', ['in_progress', callId]);

    // Greet the caller
    const greeting = await chat(call.system_prompt, [{ role: 'user', content: 'START_CALL' }]);
    conversation.push({ role: 'assistant', text: greeting, ts: Date.now() });
    const greetAudio = await synthesize(greeting, call.voice_id);
    ws.send(JSON.stringify({ event: 'tts', audio: greetAudio.toString('base64') }));

    ws.on('message', async (raw) => {
      try {
        const msg = JSON.parse(raw);

        if (msg.event === 'media' && msg.media?.payload) {
          // Accumulate audio chunks (mulaw from Twilio)
          audioChunks.push(Buffer.from(msg.media.payload, 'base64'));
        }

        if (msg.event === 'user_speech_end' || (msg.event === 'media' && audioChunks.length > 40)) {
          if (!audioChunks.length) return;
          const audio = Buffer.concat(audioChunks);
          audioChunks.length = 0;

          const userText = await transcribe(audio, call.language);
          if (!userText.trim()) return;

          conversation.push({ role: 'user', text: userText, ts: Date.now() });

          const history = conversation.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text }));
          const reply = await chat(call.system_prompt, history);
          conversation.push({ role: 'assistant', text: reply, ts: Date.now() });

          const replyAudio = await synthesize(reply, call.voice_id);
          ws.send(JSON.stringify({ event: 'tts', audio: replyAudio.toString('base64') }));

          // Detect call end keywords
          if (/bye|thank you|goodbye|धन्यवाद|ok bye/i.test(reply)) {
            ws.close();
          }
        }

        if (msg.event === 'stop') {
          ws.close();
        }
      } catch (e) {
        console.error('WS error:', e.message);
      }
    });

    ws.on('close', async () => {
      const durationSec = Math.round((Date.now() - startTime) / 1000);
      const creditsUsed = durationSec * PAISE_PER_SEC;

      // Summarise conversation
      let summary = '', outcome = 'completed', sentiment = 'neutral', hot = false;
      if (conversation.length > 1) {
        try {
          const summaryText = await chat(
            'Summarise this call in 2 sentences. Determine outcome (qualified/interested/callback/not_interested/no_response) and sentiment (positive/neutral/negative). Output JSON: {"summary":"...","outcome":"...","sentiment":"...","hot":bool,"captured":{}}',
            conversation.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text }))
          );
          const j = JSON.parse(summaryText);
          summary = j.summary; outcome = j.outcome; sentiment = j.sentiment; hot = !!j.hot;
          // Update lead captured data
          if (j.captured && Object.keys(j.captured).length) {
            await query(
              'UPDATE leads SET captured_data=$1, outcome=$2, hot=$3 WHERE id=$4',
              [JSON.stringify(j.captured), outcome, hot, call.lead_id]
            );
          }
        } catch { summary = conversation.map(m => `${m.role}: ${m.text}`).join('\n'); }
      }

      await query(
        `UPDATE calls SET
           status='completed', ended_at=NOW(), duration_sec=$1,
           credits_used=$2, transcript=$3, summary=$4, outcome=$5, sentiment=$6
         WHERE id=$7`,
        [durationSec, creditsUsed, JSON.stringify(conversation), summary, outcome, sentiment, callId]
      );

      // Deduct credits from user
      await query('UPDATE users SET credits=credits-$1 WHERE id=$2', [creditsUsed, call.user_id]);
      await query(
        'INSERT INTO transactions(user_id,type,amount,description) VALUES($1,$2,$3,$4)',
        [call.user_id, 'call_debit', -creditsUsed, `Call ${callId} – ${durationSec}s`]
      );

      // Daily perf rollup
      await query(
        `INSERT INTO perf_daily(user_id,employee_id,date,total_calls,qualified,avg_duration,credits_used)
         VALUES($1,$2,CURRENT_DATE,1,$3,$4,$5)
         ON CONFLICT(employee_id,date) DO UPDATE SET
           total_calls=perf_daily.total_calls+1,
           qualified=perf_daily.qualified+$3,
           avg_duration=(perf_daily.avg_duration+$4)/2,
           credits_used=perf_daily.credits_used+$5`,
        [call.user_id, call.employee_id, outcome === 'qualified' ? 1 : 0, durationSec, creditsUsed]
      );
    });
  });
}
