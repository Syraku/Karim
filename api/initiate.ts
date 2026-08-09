import { generateKarimInitiateMessage } from '../src/server/geminiService';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method tidak diizinkan.' });
  try {
    const { playerProfile, currentEvent, relationship } = req.body || {};
    if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'GEMINI_API_KEY belum dikonfigurasi di Vercel.' });
    const messages = await generateKarimInitiateMessage(
      playerProfile || { name: 'Kamu' },
      currentEvent || { title: 'Sekolah', period: 'Pagi Hari', location: 'Kelas', description: 'Pagi di SMA' },
      relationship || { stage: 1, stageName: 'Teman Dekat' }
    );
    return res.status(200).json({ messages });
  } catch (err: any) {
    console.error('Vercel /api/initiate error:', err);
    return res.status(502).json({ error: 'Karim sedang tidak bisa mengirim pesan sekarang.', detail: err?.message || 'Unknown error' });
  }
}
