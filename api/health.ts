export default function handler(_req: any, res: any) {
  return res.status(200).json({
    status: 'ok',
    game: 'KARIM Interactive AI Romance',
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
}
