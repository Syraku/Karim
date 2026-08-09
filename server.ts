import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { generateKarimInitiateMessage, generateKarimResponse } from "./src/server/geminiService";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "5mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", game: "KARIM Interactive AI Romance", aiConfigured: Boolean(process.env.GEMINI_API_KEY) });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { userMessage, playerProfile, relationship, memories, recentMessages, currentEvent } = req.body;
      if (!userMessage || typeof userMessage !== "string") {
        return res.status(400).json({ error: "Pesan tidak boleh kosong." });
      }
      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({ error: "GEMINI_API_KEY belum dikonfigurasi di server." });
      }

      const response = await generateKarimResponse({
        userMessage,
        playerProfile: playerProfile || { name: "Kamu" },
        relationship: relationship || { affection: 15, trust: 25, closeness: 20, stage: 1, stageName: "Teman Dekat" },
        memories: Array.isArray(memories) ? memories : [],
        recentMessages: Array.isArray(recentMessages) ? recentMessages : [],
        currentEvent: currentEvent || { title: "Sekolah", period: "Pagi Hari", location: "Kelas" },
      });
      return res.json(response);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan pada server.";
      console.error("API /api/chat error:", errorMessage);
      return res.status(502).json({ error: "Karim sedang tidak bisa tersambung ke layanan AI.", detail: errorMessage });
    }
  });

  app.post("/api/initiate", async (req, res) => {
    try {
      const { playerProfile, currentEvent, relationship } = req.body;
      if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: "GEMINI_API_KEY belum dikonfigurasi di server." });
      const messages = await generateKarimInitiateMessage(
        playerProfile || { name: "Kamu" },
        currentEvent || { title: "Sekolah", period: "Pagi Hari", location: "Kelas", description: "Pagi di SMA" },
        relationship || { stage: 1, stageName: "Teman Dekat" }
      );
      return res.json({ messages });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error initiating message";
      console.error("API /api/initiate error:", errorMessage);
      return res.status(502).json({ error: "Karim sedang tidak bisa mengirim pesan sekarang.", detail: errorMessage });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`[KARIM Server] Running on http://0.0.0.0:${PORT}`));
}

startServer();
