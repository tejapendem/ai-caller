import fetch from 'node-fetch';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const MODEL = process.env.OLLAMA_MODEL || 'qwen3:1.7b';

export async function chat(systemPrompt, messages) {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      stream: false,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    }),
  });
  if (!res.ok) throw new Error(`Ollama error: ${res.statusText}`);
  const data = await res.json();
  return data.message?.content || '';
}

export async function generateSystemPrompt({ brief, call_type, language, industry }) {
  const meta = `Call type: ${call_type}. Language: ${language || 'English'}. Industry: ${industry || 'General'}.`;
  const prompt = `You are a prompt engineer for an AI phone agent system.
Create a concise system prompt (max 300 words) for an AI phone agent based on this brief:
"${brief}"
${meta}
The agent must:
- Be natural, warm, and conversational
- Speak in ${language || 'English'} primarily
- Stay on topic per the brief
- Capture key info (name, requirement, contact)
- Handle objections gracefully
- End with a clear next step
Output ONLY the system prompt text, no explanation.`;

  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, prompt, stream: false }),
  });
  const data = await res.json();
  return data.response?.trim() || `You are an AI phone agent. ${brief}`;
}
