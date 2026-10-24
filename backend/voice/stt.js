import { execFile } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

const execFileAsync = promisify(execFile);

// Uses faster-whisper via Python wrapper
// pip install faster-whisper
// The Python script below is written to disk on first run

const WHISPER_SCRIPT = `
import sys, json
from faster_whisper import WhisperModel

audio_path = sys.argv[1]
lang = sys.argv[2] if len(sys.argv) > 2 else None

model = WhisperModel("small", device="cpu", compute_type="int8")
segments, info = model.transcribe(audio_path, language=lang, beam_size=5)
text = " ".join(s.text for s in segments).strip()
print(json.dumps({"text": text, "language": info.language}))
`.trim();

const scriptPath = join(tmpdir(), 'whisper_transcribe.py');
let scriptWritten = false;

async function ensureScript() {
  if (!scriptWritten) {
    await writeFile(scriptPath, WHISPER_SCRIPT);
    scriptWritten = true;
  }
}

export async function transcribe(audioBuffer, language = null) {
  await ensureScript();
  const audioPath = join(tmpdir(), `stt_${Date.now()}.wav`);
  await writeFile(audioPath, audioBuffer);
  try {
    const langArg = language ? language.slice(0, 2).toLowerCase() : 'auto';
    const { stdout } = await execFileAsync('python3', [scriptPath, audioPath, langArg]);
    const result = JSON.parse(stdout.trim());
    return result.text || '';
  } finally {
    unlink(audioPath).catch(() => {});
  }
}
