import { generateKarimResponse } from '../src/server/geminiService';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method tidak diizinkan.' });
  try {
    const { userMessage, playerProfile, relationship, memories, recentMessages, currentEvent } = req.body || {};
    if (!userMessage || typeof userMessage !== 'string') return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
    if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'GEMINI_API_KEY belum dikonfigurasi di Vercel.' });
    const response = await generateKarimResponse({
      userMessage,
      playerProfile: playerProfile || { name: 'Kamu' },
      relationship: relationship || { affection: 15, trust: 25, closeness: 20, stage: 1, stageName: 'Teman Dekat' },
      memories: Array.isArray(memories) ? memories : [],
      recentMessages: Array.isArray(recentMessages) ? recentMessages : [],
      currentEvent: currentEvent || { title: 'Sekolah', period: 'Pagi Hari', location: 'Kelas' },
    });
    return res.status(200).json(response);
  } catch (err: any) {
    console.error('Vercel /api/chat error:', err);
    return res.status(502).json({ error: 'Karim sedang tidak bisa tersambung ke layanan AI.', detail: err?.message || 'Unknown error' });
  }
}
