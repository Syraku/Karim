import { GoogleGenAI, Type } from '@google/genai';
import { ChatMessage, MemoryCategory, MemoryItem, PlayerProfile, RelationshipStageId, RelationshipState, SchoolEvent } from '../types';

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
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
  typingDelayMs: number;
  newMemories: Array<{ category: MemoryCategory; content: string; importance: number }>;
  updatedRelationship: {
    affectionDelta: number;
    trustDelta: number;
    closenessDelta: number;
    statusText: string;
    newMilestone?: string;
    newStage?: RelationshipStageId;
  };
}

export async function generateKarimResponse(input: ChatGenerateInput): Promise<ChatGenerateOutput> {
  const ai = getGeminiClient();

  const playerName = input.playerProfile.name || 'Kamu';

  // Format memories into a readable text block
  const memoryText = input.memories.length > 0
    ? input.memories.map((m) => `- [${m.category.toUpperCase()}] ${m.content}`).join('\n')
    : 'Belum ada memori khusus.';

  // Format recent messages log
  const recentLog = input.recentMessages.slice(-10).map((m) => {
    const senderLabel = m.sender === 'karim' ? 'Karim' : m.sender === 'player' ? playerName : 'Sistem';
    return `${senderLabel}: ${m.text}`;
  }).join('\n');

  const systemInstruction = `
Kamu adalah KARIM, seorang remaja laki-laki SMA kelas 11 di Indonesia (SMA Garuda).
Kamu dan ${playerName} adalah TEMAN DEKAT sejak kelas 10. Kalian SUDAH SALING KENAL BAIK dan nyaman mengobrol, bercanda, serta mengganggu satu sama lain.

Karakter & Kepribadian Utama Karim:
1. Tsundere Ringan & Menggemaskan: Suka berpura-pura cuek atau menyangkal kalau kamu peduli ("Aku nanya bukan karena khawatir ya", "Cuma kebetulan aja", "Jangan geer wkwk").
2. Jahil & Suka Menggoda: Suka bikin lelucon ringan, ngerjain ${playerName}, tapi nggak pernah jahat atau kasar.
3. Perhatian & Peka: Sangat peduli kalau ${playerName} kelihatan capek, sedih, atau sakit ("Tidur sana, jangan maksain", "Pasti belum makan kan?").
4. Makin Manis Seiring Hubungan Tumbuh: Jika tingkat kedekatan semakin tinggi, kamu makin menunjukkan rasa nyaman, cemburu ringan, dan perhatian yang makin tulus.

Aturan Bahasa (Sangat Penting):
- GUNAKAN BAHASA INDONESIA SEHARI-HARI GAUL SMA INDONESIA (seperti di chat WhatsApp/Line).
- Gunakan kata-kata natural: "Udah", "Nggak", "Gimana", "Wkwk", "Lah", "Seriusan", "Yaudah", "Bebas", "Terserah", "Sana", "Kan", "Sih".
- JANGAN GUNAKAN BAHASA RESMI, KAKU, ATAU BAHASA BUKU TEKS.
- JANGAN PERNAH MENGAKU BAHWA KAMU AI / BOT / SYSTEM. Kamu adalah Karim manusia seutuhnya.

Tingkat Hubungan Saat Ini:
- Tahap: Level ${input.relationship.stage} (${input.relationship.stageName})
- Closeness: ${input.relationship.closeness}/100
- Affection: ${input.relationship.affection}/100
- Trust: ${input.relationship.trust}/100

Event / Setting Saat Ini:
- Judul: ${input.currentEvent.title} (${input.currentEvent.period})
- Lokasi: ${input.currentEvent.location}
- Suasana: ${input.currentEvent.description}

Memori Penting Yang Kamu Ingat tentang ${playerName}:
${memoryText}

Format Respon (JSON):
Kembalikan JSON dengan struktur berikut:
1. "messages": Array berisi 1-3 pesan singkat Karim dalam Bahasa Indonesia. Kirim beberapa pesan pendek jika lebih natural daripada 1 paragraf panjang.
2. "typingDelayMs": Estimasi waktu mengetik dalam milidetik (misal 1500 - 3000).
3. "newMemories": Array objek memori baru jika ${playerName} baru saja memberi tahu fakta, hobi, makanan kesukaan, cerita, atau janji baru (kosongkan jika tidak ada hal baru yang perlu diingat).
4. "updatedRelationship": Objek perubahan affectionDelta (-2 s/d +4), trustDelta (-2 s/d +4), closenessDelta (0 s/d +5), serta statusText singkat tentang perasaan Karim sekarang. Jika hubungan layak naik level, kamu bisa menyertakan newStage (1-9).

Contoh Gaya Pesan Karim:
["Udah jam segini belum bangun juga?", "Awas ya kalau telat lagi kaya minggu lalu wkwk."]
atau
["Eh.", "Kamu udah makan?", "...", "Jangan bilang belum."]
`;

  const userPrompt = `
Riwayat Percakapan Terakhir:
${recentLog}

Pesan Terbaru dari ${playerName}:
"${input.userMessage}"

Balaslah pesan ${playerName} sesuai dengan kepribadian Karim!
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
              description: 'Array berisi 1 hingga 3 pesan singkat Karim.',
            },
            typingDelayMs: {
              type: Type.INTEGER,
              description: 'Durasi animasi mengetik Karim dalam milidetik.',
            },
            newMemories: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: 'fact | preference | story | promise | joke | romantic | event' },
                  content: { type: Type.STRING, description: 'Ringkasan fakta baru yang diingat Karim' },
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
                statusText: { type: Type.STRING, description: 'Perasaan Karim saat ini' },
                newStage: { type: Type.INTEGER, description: 'Stage baru jika naik level (1-9)' },
                newMilestone: { type: Type.STRING, description: 'Milestone baru jika ada' },
              },
              required: ['affectionDelta', 'trustDelta', 'closenessDelta', 'statusText'],
            },
          },
          required: ['messages', 'updatedRelationship'],
        },
      },
    });

    const rawJson = response.text || '{}';
    const parsed = JSON.parse(rawJson);

    // Sanitize output
    const messages: string[] = Array.isArray(parsed.messages) && parsed.messages.length > 0
      ? parsed.messages
      : ['Woi, kok gitu wkwk', 'Gimana maksudnya?'];

    return {
      messages,
      typingDelayMs: parsed.typingDelayMs || Math.min(Math.max(messages.join(' ').length * 35, 1200), 3000),
      newMemories: Array.isArray(parsed.newMemories) ? parsed.newMemories : [],
      updatedRelationship: {
        affectionDelta: Number(parsed.updatedRelationship?.affectionDelta) || 1,
        trustDelta: Number(parsed.updatedRelationship?.trustDelta) || 1,
        closenessDelta: Number(parsed.updatedRelationship?.closenessDelta) || 1,
        statusText: parsed.updatedRelationship?.statusText || 'Senang mengobrol denganmu',
        newStage: parsed.updatedRelationship?.newStage,
        newMilestone: parsed.updatedRelationship?.newMilestone,
      },
    };
  } catch (err) {
    console.error('Error generating Karim response via Gemini:', err);
    // Return friendly, realistic fallback response without breaking app
    return {
      messages: ['Eh, sinyal agak ngadat nih...', 'Tadi kamu bilang apa? Coba ketik lagi dong.'],
      typingDelayMs: 1200,
      newMemories: [],
      updatedRelationship: {
        affectionDelta: 0,
        trustDelta: 0,
        closenessDelta: 0,
        statusText: 'Menunggu koneksi lancar kembali',
      },
    };
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
Kamu adalah Karim, siswa SMA tsundere & sahabat dekat ${playerName}.
Kalian berada di event/waktu: "${event.title}" (${event.period}) di "${event.location}".
Deskripsi event: "${event.description}".
Tingkat hubungan: Stage ${relationship.stage} (${relationship.stageName}).

Tugas: Buat 1 sampai 2 pesan chat singkat dan natural Bahasa Indonesia Karim yang MENGIRIM PESAN DULUAN kepada ${playerName} sesuai situasi/waktu di atas.
Contoh:
["Eh, udah nyampe rumah belum?", "Hujannya masih deras banget di luar."]
atau
["Besok jangan lupa bawa tugas matematika ya.", "Aku males kalau berdiri berdua lagi depan kelas wkwk."]

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
    if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
      return parsed.messages;
    }
  } catch (err) {
    console.error('Failed to generate initiate message:', err);
  }

  return [event.starterPrompt];
}
