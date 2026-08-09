const KARIM_WORKER_URL = 'https://karim-worker.karim-siraku.workers.dev/chat';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method tidak diizinkan.' });

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const upstream = await fetch(KARIM_WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {}),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const text = await upstream.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: 'Respons AI tidak valid.', detail: text.slice(0, 300) };
    }

    return res.status(upstream.status).json(data);
  } catch (err: any) {
    console.error('Karim Worker proxy error:', err);
    return res.status(502).json({
      error: 'Karim lagi susah nyambung. Coba lagi sebentar.',
      detail: err?.name === 'AbortError' ? 'AI timeout' : (err?.message || 'Worker unavailable'),
    });
  }
}
