import { query } from '../db/index.js';
import { generateSystemPrompt } from '../voice/llm.js';

export async function listEmployees(req, res) {
  const { rows } = await query(
    'SELECT * FROM employees WHERE user_id=$1 ORDER BY created_at DESC',
    [req.userId]
  );
  res.json(rows);
}

export async function getEmployee(req, res) {
  const { rows } = await query(
    'SELECT * FROM employees WHERE id=$1 AND user_id=$2',
    [req.params.id, req.userId]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
}

export async function createEmployee(req, res) {
  const { name, call_type, language, industry, brief } = req.body;
  if (!call_type || !brief) return res.status(400).json({ error: 'call_type and brief required' });

  // Pick best voice for the language
  const voiceMap = {
    Hindi: 'hi-IN-MadhurNeural',
    Telugu: 'te-IN-MohanNeural',
    Tamil: 'ta-IN-ValluvarNeural',
    Kannada: 'kn-IN-GaganNeural',
    Malayalam: 'ml-IN-MidhunNeural',
    Marathi: 'mr-IN-ManoharNeural',
    English: 'en-IN-NeerjaNeural',
  };
  const voice_id = voiceMap[language] || 'en-IN-NeerjaNeural';

  // Generate system prompt via Ollama
  let system_prompt = null;
  try {
    system_prompt = await generateSystemPrompt({ brief, call_type, language, industry });
  } catch (e) {
    console.error('LLM error:', e.message);
    system_prompt = `You are an AI phone agent. ${brief}`;
  }

  const empName = name || `${call_type} Agent`;
  const { rows } = await query(
    `INSERT INTO employees(user_id,name,call_type,language,industry,brief,system_prompt,voice_id)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [req.userId, empName, call_type, language || 'English', industry, brief, system_prompt, voice_id]
  );
  res.status(201).json(rows[0]);
}

export async function updateEmployee(req, res) {
  const { name, language, industry, brief, status, voice_id } = req.body;

  let system_prompt;
  if (brief) {
    try {
      system_prompt = await generateSystemPrompt({
        brief, call_type: req.body.call_type, language, industry,
      });
    } catch { system_prompt = `You are an AI phone agent. ${brief}`; }
  }

  const { rows } = await query(
    `UPDATE employees SET
      name=COALESCE($1,name),
      language=COALESCE($2,language),
      industry=COALESCE($3,industry),
      brief=COALESCE($4,brief),
      system_prompt=COALESCE($5,system_prompt),
      status=COALESCE($6,status),
      voice_id=COALESCE($7,voice_id)
     WHERE id=$8 AND user_id=$9 RETURNING *`,
    [name, language, industry, brief, system_prompt, status, voice_id, req.params.id, req.userId]
  );
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
}

export async function deleteEmployee(req, res) {
  await query('DELETE FROM employees WHERE id=$1 AND user_id=$2', [req.params.id, req.userId]);
  res.json({ ok: true });
}
