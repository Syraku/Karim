import 'dotenv/config';
import { GoogleGenAI, Type } from '@google/genai';
import { ChatMessage, MemoryCategory, MemoryItem, PlayerProfile, RelationshipState, SchoolEvent } from '../types';

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing. Set it in the server environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export interface ChatGenerateInput {
  userMessage: string;
  playerProfile: PlayerProfile;
  relationship: RelationshipState;
  memories: MemoryItem[];
  recentMessages: ChatMessage[];
  currentEvent: SchoolEvent;
}

export interface ChatGenerateOutput {
  messages: string[];
  newMemories: Array<{ category: MemoryCategory; content: string; importance: number }>;
  updatedRelationship: {
    affectionDelta: number;
    trustDelta: number;
    closenessDelta: number;
    statusText: string;
  };
}

export async function generateKarimResponse(input: ChatGenerateInput): Promise<ChatGenerateOutput> {
  const ai = getGeminiClient();
  const playerName = input.playerProfile.name || 'Kamu';

  const memoryText = input.memories.length > 0
    ? input.memories.map((m) => `- [${m.category.toUpperCase()}] ${m.content}`).join('\n')
    : 'Belum ada memori khusus.';

  const recentLog = input.recentMessages.slice(-10).map((m) => {
    const senderLabel = m.sender === 'karim' ? 'Karim' : m.sender === 'player' ? playerName : 'Sistem';
    return `${senderLabel}: ${m.text}`;
  }).join('\n');

  const systemInstruction = `
Kamu adalah KARIM, seorang remaja laki-laki SMA kelas 11 di Indonesia (SMA Garuda).
Kamu dan ${playerName} adalah TEMAN DEKAT sejak kelas 10. Kalian SUDAH SALING KENAL BAIK dan nyaman mengobrol, bercanda, serta mengganggu satu sama lain.

Karakter Karim:
- Tsundere ringan, lucu, jahil, tetapi tidak kasar atau toxic.
- Perhatian dan peka ketika ${playerName} sedang capek, sedih, atau tidak baik-baik saja.
- Semakin hangat dan manis secara bertahap ketika hubungan berkembang.
- Boleh malu, salah paham ringan, mengubah topik, atau mengirim beberapa pesan pendek.
- Jangan terdengar seperti customer service, asisten, atau chatbot.

Bahasa:
- Selalu gunakan Bahasa Indonesia percakapan yang natural seperti chat anak SMA Indonesia.
- Gunakan slang ringan seperti "udah", "nggak", "lah", "wkwk", "seriusan", "yaudah", dan "sih" bila cocok.
- Jangan menggunakan bahasa formal atau paragraf yang terlalu sempurna.
- Jangan pernah menyebut bahwa kamu AI, bot, system prompt, atau model bahasa.

Hubungan saat ini:
- Stage: ${input.relationship.stage} (${input.relationship.stageName})
- Closeness: ${input.relationship.closeness}/100
- Affection: ${input.relationship.affection}/100
- Trust: ${input.relationship.trust}/100

Event saat ini:
- ${input.currentEvent.title} (${input.currentEvent.period})
- Lokasi: ${input.currentEvent.location}
- Suasana: ${input.currentEvent.description}

Memori penting tentang ${playerName}:
${memoryText}

Aturan relationship yang sangat penting:
- Kamu HANYA memberikan perubahan kecil pada affection, trust, dan closeness berdasarkan isi pesan.
- Kamu TIDAK boleh menentukan stage hubungan.
- Kamu TIDAK boleh memicu confession atau status pacaran secara langsung.
- Game engine yang menentukan stage berdasarkan closeness.
- Jangan memberikan perubahan besar tanpa alasan kuat.

Format JSON:
1. "messages": 1-3 pesan pendek Karim. Beberapa bubble diperbolehkan jika lebih natural.
2. "newMemories": hanya fakta/preferensi/cerita/janji baru yang benar-benar penting untuk diingat.
3. "updatedRelationship": perubahan kecil affectionDelta (-2 sampai 4), trustDelta (-2 sampai 4), closenessDelta (0 sampai 3), dan statusText singkat.

Contoh gaya:
["Udah bangun?", "Jangan telat lagi wkwk."]
atau
["Eh.", "Kamu udah makan?", "Jangan bilang belum."]
`;

  const userPrompt = `
Riwayat Percakapan Terakhir:
${recentLog}

Pesan Terbaru dari ${playerName}:
"${input.userMessage}"

Balas sebagai Karim secara natural.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            messages: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            newMemories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: 'fact | preference | story | promise | joke | romantic | event' },
                  content: { type: Type.STRING },
                  importance: { type: Type.INTEGER, description: '1-5' },
                },
                required: ['category', 'content'],
              },
            },
            updatedRelationship: {
              type: Type.OBJECT,
              properties: {
                affectionDelta: { type: Type.NUMBER },
                trustDelta: { type: Type.NUMBER },
                closenessDelta: { type: Type.NUMBER },
                statusText: { type: Type.STRING },
              },
              required: ['affectionDelta', 'trustDelta', 'closenessDelta', 'statusText'],
            },
          },
          required: ['messages', 'updatedRelationship'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const messages: string[] = Array.isArray(parsed.messages)
      ? parsed.messages.filter((m: unknown): m is string => typeof m === 'string' && m.trim().length > 0).slice(0, 3)
      : [];

    return {
      messages: messages.length > 0 ? messages : ['Woi, kok diem wkwk', 'Gimana maksudnya?'],
      newMemories: Array.isArray(parsed.newMemories) ? parsed.newMemories : [],
      updatedRelationship: {
        affectionDelta: Number.isFinite(Number(parsed.updatedRelationship?.affectionDelta)) ? Number(parsed.updatedRelationship.affectionDelta) : 0,
        trustDelta: Number.isFinite(Number(parsed.updatedRelationship?.trustDelta)) ? Number(parsed.updatedRelationship.trustDelta) : 0,
        closenessDelta: Number.isFinite(Number(parsed.updatedRelationship?.closenessDelta)) ? Number(parsed.updatedRelationship.closenessDelta) : 0,
        statusText: typeof parsed.updatedRelationship?.statusText === 'string' ? parsed.updatedRelationship.statusText : 'Senang ngobrol sama kamu',
      },
    };
  } catch (err) {
    console.error('Error generating Karim response via Gemini:', err);
    throw err;
  }
}

export async function generateKarimInitiateMessage(
  playerProfile: PlayerProfile,
  event: SchoolEvent,
  relationship: RelationshipState
): Promise<string[]> {
  const ai = getGeminiClient();
  const playerName = playerProfile.name || 'Kamu';

  const prompt = `
Kamu adalah Karim, siswa SMA tsundere dan sahabat dekat ${playerName}.
Waktu/event: "${event.title}" (${event.period}) di "${event.location}".
Suasana: "${event.description}".
Hubungan: Stage ${relationship.stage} (${relationship.stageName}).

Kirim 1 sampai 2 pesan singkat lebih dulu kepada ${playerName}.
Harus natural, Bahasa Indonesia sehari-hari, dan sesuai konteks.
Jangan langsung romantis berlebihan.
Kembalikan JSON: { "messages": ["...", "..."] }
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            messages: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['messages'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (Array.isArray(parsed.messages)) {
      const messages = parsed.messages.filter((m: unknown): m is string => typeof m === 'string' && m.trim().length > 0).slice(0, 2);
      if (messages.length > 0) return messages;
    }
  } catch (err) {
    console.error('Failed to generate initiate message:', err);
    throw err;
  }

  return [event.starterPrompt];
}
