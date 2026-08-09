import { DEFAULT_SCHOOL_EVENT, INITIAL_MEMORIES, INITIAL_RELATIONSHIP_STATE } from '../data/karimData';
import { ChatMessage, GameSaveData, MemoryItem, PlayerProfile, RelationshipState, SchoolEvent } from '../types';

const SAVE_KEY = 'karim_romance_game_save_v1';

export const DEFAULT_PLAYER_PROFILE: PlayerProfile = {
  name: 'Kamu',
  nickname: 'Kamu',
};

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-system',
    sender: 'system',
    text: '☀️ Pagi Hari di SMA Garuda — Notifikasi dari Karim',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    systemType: 'event',
  },
  {
    id: 'msg-init-1',
    sender: 'karim',
    text: 'Udah bangun belum?',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'read',
  },
  {
    id: 'msg-init-2',
    sender: 'karim',
    text: 'Awas ya kalau telat lagi kaya minggu lalu, pak Hendra udah ngincer kamu tuh wkwk.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'read',
  },
];

export function loadGameState(): GameSaveData {
  if (typeof window === 'undefined') {
    return getInitialSaveData();
  }

  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return getInitialSaveData();

    const parsed: GameSaveData = JSON.parse(raw);
    if (!parsed || !parsed.playerProfile || !parsed.messages) {
      return getInitialSaveData();
    }
    return parsed;
  } catch (err) {
    console.warn('Failed to load game save, using default:', err);
    return getInitialSaveData();
  }
}

export function saveGameState(data: Partial<GameSaveData>) {
  if (typeof window === 'undefined') return;

  try {
    const current = loadGameState();
    const updated: GameSaveData = {
      ...current,
      ...data,
      lastSavedAt: new Date().toISOString(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save game state to localStorage:', err);
  }
}

export function resetGameState(): GameSaveData {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      // Ignore
    }
  }
  return getInitialSaveData();
}

export function getInitialSaveData(): GameSaveData {
  return {
    version: 1,
    playerProfile: DEFAULT_PLAYER_PROFILE,
    messages: INITIAL_MESSAGES,
    memories: INITIAL_MEMORIES,
    relationship: INITIAL_RELATIONSHIP_STATE,
    currentEvent: DEFAULT_SCHOOL_EVENT,
    audioEnabled: true,
    autoInitiateEnabled: true,
    lastSavedAt: new Date().toISOString(),
  };
}
