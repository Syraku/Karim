export type SenderType = 'karim' | 'player' | 'system';

export interface ChatMessage {
  id: string;
  sender: SenderType;
  text: string;
  timestamp: string; // ISO string or format "07:15"
  status?: 'sending' | 'sent' | 'read';
  systemType?: 'event' | 'relationship' | 'memory' | 'info';
}

export type RelationshipStageId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface RelationshipStage {
  id: RelationshipStageId;
  name: string;
  description: string;
  badgeColor: string;
  minCloseness: number;
}

export interface RelationshipState {
  affection: number; // 0 - 100
  trust: number;     // 0 - 100
  closeness: number; // 0 - 100
  stage: RelationshipStageId;
  stageName: string;
  statusText: string;
  unlockedMilestones: string[];
}

export type MemoryCategory = 'fact' | 'preference' | 'story' | 'promise' | 'joke' | 'romantic' | 'event';

export interface MemoryItem {
  id: string;
  category: MemoryCategory;
  content: string;
  createdAt: string;
  importance: number; // 1 - 5
}

export type TimePeriod =
  | 'Pagi Hari'
  | 'Jam Pelajaran'
  | 'Istirahat Siang'
  | 'Pulang Sekolah'
  | 'Sore / Belajar'
  | 'Malam Hari'
  | 'Akhir Pekan'
  | 'Festival Sekolah';

export interface SchoolEvent {
  id: string;
  title: string;
  period: TimePeriod;
  location: string;
  description: string;
  weather: string;
  starterPrompt: string;
  iconName: string;
}

export interface PlayerProfile {
  name: string;
  nickname: string;
}

export interface GameSaveData {
  version: number;
  playerProfile: PlayerProfile;
  messages: ChatMessage[];
  memories: MemoryItem[];
  relationship: RelationshipState;
  currentEvent: SchoolEvent;
  karimArtworkUrl?: string;
  audioEnabled: boolean;
  autoInitiateEnabled: boolean;
  lastSavedAt: string;
}

export interface ChatResponsePayload {
  messages: string[];
  typingDelayMs: number;
  newMemories: Array<{ category: MemoryCategory; content: string; importance?: number }>;
  updatedRelationship: {
    affectionDelta: number;
    trustDelta: number;
    closenessDelta: number;
    newStage?: RelationshipStageId;
    statusText?: string;
    newMilestone?: string;
  };
  eventReaction?: string;
}
