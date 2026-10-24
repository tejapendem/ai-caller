import { execFile } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

const execFileAsync = promisify(execFile);

// Uses edge-tts (pip install edge-tts)
// Returns raw MP3 buffer
export async function synthesize(text, voiceId = 'hi-IN-MadhurNeural') {
  const outPath = join(tmpdir(), `tts_${Date.now()}.mp3`);
  try {
    await execFileAsync('edge-tts', [
      '--voice', voiceId,
      '--text', text,
      '--write-media', outPath,
    ]);
    const { readFile } = await import('fs/promises');
    const buf = await readFile(outPath);
    return buf;
  } finally {
    unlink(outPath).catch(() => {});
  }
}

// Voice options by language
export const VOICES = {
  Hindi:     [
    { id: 'hi-IN-MadhurNeural',  label: 'Madhur (Male)' },
    { id: 'hi-IN-SwaraNeural',   label: 'Swara (Female)' },
  ],
  Telugu:    [
    { id: 'te-IN-MohanNeural',   label: 'Mohan (Male)' },
    { id: 'te-IN-ShrutiNeural',  label: 'Shruti (Female)' },
  ],
  Tamil:     [
    { id: 'ta-IN-ValluvarNeural',label: 'Valluvar (Male)' },
    { id: 'ta-IN-PallaviNeural', label: 'Pallavi (Female)' },
  ],
  Kannada:   [
    { id: 'kn-IN-GaganNeural',   label: 'Gagan (Male)' },
    { id: 'kn-IN-SapnaNeural',   label: 'Sapna (Female)' },
  ],
  Malayalam: [
    { id: 'ml-IN-MidhunNeural',  label: 'Midhun (Male)' },
    { id: 'ml-IN-SobhanaNeural', label: 'Sobhana (Female)' },
  ],
  Marathi:   [
    { id: 'mr-IN-ManoharNeural', label: 'Manohar (Male)' },
    { id: 'mr-IN-AarohiNeural',  label: 'Aarohi (Female)' },
  ],
  English:   [
    { id: 'en-IN-NeerjaNeural',  label: 'Neerja (Female)' },
    { id: 'en-IN-PrabhatNeural', label: 'Prabhat (Male)' },
  ],
};

export function getVoicesRoute(req, res) {
  res.json(VOICES);
}
