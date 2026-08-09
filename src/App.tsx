import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { KarimProfileModal } from './components/KarimProfileModal';
import { RelationshipModal } from './components/RelationshipModal';
import { SchoolEventsModal } from './components/SchoolEventsModal';
import { SettingsModal } from './components/SettingsModal';
import { ChatMessage, MemoryItem, PlayerProfile, RelationshipStageId, RelationshipState, SchoolEvent } from './types';
import { loadGameState, saveGameState, resetGameState } from './utils/storage';
import { soundEngine } from './utils/audio';
import { RELATIONSHIP_STAGES } from './data/karimData';
import { KARIM_ARTWORK } from './components/KarimAvatar';

const KARIM_WORKER_URL = 'https://karim-worker.karim-siraku.workers.dev/chat';

const isRasterArtwork = (url?: string): url is string =>
  !!url && /^(data:image\/(png|jpeg|jpg|webp);base64,|https?:\/\/)/i.test(url);

export default function App() {
  const initialData = loadGameState();
  const [messages, setMessages] = useState<ChatMessage[]>(initialData.messages);
  const [memories, setMemories] = useState<MemoryItem[]>(initialData.memories);
  const [relationship, setRelationship] = useState<RelationshipState>(initialData.relationship);
  const [currentEvent, setCurrentEvent] = useState<SchoolEvent>(initialData.currentEvent);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(initialData.playerProfile);
  const [karimArtworkUrl, setKarimArtworkUrl] = useState<string | undefined>(
    isRasterArtwork(initialData.karimArtworkUrl) ? initialData.karimArtworkUrl : undefined,
  );
  const [audioEnabled, setAudioEnabled] = useState<boolean>(initialData.audioEnabled);
  const [autoInitiateEnabled, setAutoInitiateEnabled] = useState<boolean>(initialData.autoInitiateEnabled);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isRelationshipOpen, setIsRelationshipOpen] = useState<boolean>(false);
  const [isEventsOpen, setIsEventsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashLeaving, setSplashLeaving] = useState(false);
  const lastInteractionTimeRef = useRef<number>(Date.now());

  useEffect(() => { soundEngine.enabled = audioEnabled; }, [audioEnabled]);
  useEffect(() => {
    saveGameState({ messages, memories, relationship, currentEvent, playerProfile, karimArtworkUrl, audioEnabled, autoInitiateEnabled });
  }, [messages, memories, relationship, currentEvent, playerProfile, karimArtworkUrl, audioEnabled, autoInitiateEnabled]);

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setSplashLeaving(true), 1050);
    const hideTimer = window.setTimeout(() => setShowSplash(false), 1500);
    return () => { window.clearTimeout(leaveTimer); window.clearTimeout(hideTimer); };
  }, []);

  const deliverKarimMessages = async (msgs: string[]) => {
    for (let i = 0; i < msgs.length; i++) {
      const text = String(msgs[i] || '').trim();
      if (!text) continue;
      setIsTyping(true);
      const chars = text.length;
      const baseDelay = Math.min(Math.max(420 + chars * 14, 600), 1800);
      const randomJitter = Math.floor(Math.random() * 260) - 130;
      await new Promise((resolve) => setTimeout(resolve, Math.max(baseDelay + randomJitter, 450)));
      setIsTyping(false);
      setMessages((prev) => [...prev, {
        id: `msg-karim-${Date.now()}-${i}`,
        sender: 'karim', text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      }]);
      soundEngine.playMessageReceive();
      if (i < msgs.length - 1) await new Promise((resolve) => setTimeout(resolve, 180 + Math.floor(Math.random() * 280)));
    }
    setIsTyping(false);
  };

  const handleSendMessage = async (text: string) => {
    lastInteractionTimeRef.current = Date.now();
    const playerMsg: ChatMessage = {
      id: `msg-player-${Date.now()}`, sender: 'player', text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'sent',
    };
    setMessages((prev) => [...prev, playerMsg]);
    soundEngine.playMessageSend();
    setIsTyping(true);

    try {
      const res = await fetch(KARIM_WORKER_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: text, playerProfile, relationship, memories, recentMessages: [...messages, playerMsg], currentEvent }),
      });
      if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try { const errorBody = await res.json(); if (errorBody?.error) detail = errorBody.error; } catch { /* ignore */ }
        throw new Error(detail);
      }
      const data = await res.json();
      const responseMessages: string[] = Array.isArray(data.messages)
        ? data.messages.filter((message: unknown): message is string => typeof message === 'string' && message.trim().length > 0)
        : [];
      if (!responseMessages.length) throw new Error('Server returned no messages.');
      await deliverKarimMessages(responseMessages);

      if (Array.isArray(data.newMemories) && data.newMemories.length > 0) {
        const formattedNew: MemoryItem[] = data.newMemories.map((m: { category: string; content: string; importance?: number }, i: number) => ({
          id: `mem-${Date.now()}-${i}`, category: (m.category as MemoryItem['category']) || 'fact', content: m.content,
          createdAt: new Date().toISOString(), importance: m.importance ?? 3,
        }));
        setMemories((prev) => {
          const existingContents = new Set(prev.map((p) => p.content));
          return [...prev, ...formattedNew.filter((n) => !existingContents.has(n.content))];
        });
      }

      if (data.updatedRelationship) {
        const { affectionDelta, trustDelta, closenessDelta, statusText } = data.updatedRelationship;
        setRelationship((prev) => {
          const affectionChange = Number.isFinite(Number(affectionDelta)) ? Number(affectionDelta) : 0;
          const trustChange = Number.isFinite(Number(trustDelta)) ? Number(trustDelta) : 0;
          const closenessChange = Number.isFinite(Number(closenessDelta)) ? Number(closenessDelta) : 0;
          const newCloseness = Math.min(Math.max(prev.closeness + closenessChange, 0), 100);
          const newAffection = Math.min(Math.max(prev.affection + affectionChange, 0), 100);
          const newTrust = Math.min(Math.max(prev.trust + trustChange, 0), 100);
          let calculatedStage: RelationshipStageId = RELATIONSHIP_STAGES[0].id;
          for (const stageDef of RELATIONSHIP_STAGES) if (newCloseness >= stageDef.minCloseness) calculatedStage = stageDef.id;
          const stageInfo = RELATIONSHIP_STAGES.find((s) => s.id === calculatedStage) || RELATIONSHIP_STAGES[0];
          if (calculatedStage > prev.stage) soundEngine.playRelationshipUp();
          return { ...prev, closeness: newCloseness, affection: newAffection, trust: newTrust, stage: calculatedStage, stageName: stageInfo.name,
            statusText: typeof statusText === 'string' && statusText.trim() ? statusText : prev.statusText };
        });
      }
    } catch (err) {
      console.error('Failed to chat with Karim:', err);
      setIsTyping(false);
      setMessages((prev) => [...prev, {
        id: `msg-err-${Date.now()}`, sender: 'karim',
        text: 'Karim lagi susah nyambung. Coba beberapa saat lagi ya.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  };

  const handleSelectEvent = useCallback(async (event: SchoolEvent) => {
    setCurrentEvent(event); setIsEventsOpen(false); setIsTyping(true);
    try {
      const res = await fetch('/api/initiate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerProfile, currentEvent: event, relationship }),
      });
      if (!res.ok) throw new Error(`Initiate API returned ${res.status}`);
      const data = await res.json();
      const initMsgs: string[] = Array.isArray(data.messages)
        ? data.messages.filter((message: unknown): message is string => typeof message === 'string' && message.trim().length > 0)
        : [event.starterPrompt];
      await deliverKarimMessages(initMsgs);
    } catch (err) {
      console.error('Failed to fetch initiate message:', err); setIsTyping(false);
    }
  }, [playerProfile, relationship]);

  const handleResetGame = () => {
    const defaultData = resetGameState();
    setMessages(defaultData.messages); setMemories(defaultData.memories); setRelationship(defaultData.relationship);
    setCurrentEvent(defaultData.currentEvent); setPlayerProfile(defaultData.playerProfile); setKarimArtworkUrl(undefined);
    setAudioEnabled(true); setAutoInitiateEnabled(true);
  };

  if (showSplash) {
    return (
      <div className={`karim-splash ${splashLeaving ? 'is-leaving' : ''} fixed inset-0 z-50 flex items-center justify-center bg-[#f6e7c7]`}>
        <div className="relative flex h-[78vh] max-h-[760px] w-[min(390px,88vw)] flex-col items-center justify-center overflow-hidden rounded-[34px] border-[7px] border-[#4c4145] bg-[#fff5df] shadow-[0_16px_0_rgba(76,65,69,.18)]">
          <div className="absolute inset-3 rounded-[27px] border-2 border-[#ead7b6]" />
          <div className="relative z-10 flex flex-col items-center gap-5 px-8 text-center">
            <div className="rounded-full border-4 border-[#dfc79f] bg-[#fffaf0] p-2 shadow-[0_5px_0_rgba(101,76,51,.12)]">
              <img src={KARIM_ARTWORK} alt="Karim" className="h-32 w-32 rounded-full object-cover sm:h-36 sm:w-36" />
            </div>
            <div>
              <p className="mb-1 text-[12px] font-extrabold uppercase tracking-[.3em] text-[#a1846c]">a message from</p>
              <h1 className="text-5xl font-black tracking-tight text-[#4b3b42]">KARIM</h1>
              <p className="mt-2 text-sm font-bold text-[#9a806c]">SMKN 2 Cilaku · online</p>
            </div>
          </div>
          <div className="absolute bottom-7 text-[11px] font-bold text-[#b39a82]">tap into the conversation</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#f6e7c7] font-sans antialiased text-[#493f43] select-none">
      <ChatHeader karimArtworkUrl={karimArtworkUrl} isTyping={isTyping} relationship={relationship} currentEvent={currentEvent}
        audioEnabled={audioEnabled} onToggleAudio={() => setAudioEnabled(!audioEnabled)} onOpenProfile={() => setIsProfileOpen(true)}
        onOpenRelationship={() => setIsRelationshipOpen(true)} onOpenEvents={() => setIsEventsOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} />
      <main className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
        <MessageList messages={messages} isTyping={isTyping} karimArtworkUrl={karimArtworkUrl} playerName={playerProfile.name} />
        <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} onOpenEvents={() => setIsEventsOpen(true)} currentPeriodName={currentEvent.period} />
      </main>
      <KarimProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} karimArtworkUrl={karimArtworkUrl} onUpdateArtwork={(url) => setKarimArtworkUrl(isRasterArtwork(url) ? url : undefined)} memories={memories} relationship={relationship} />
      <RelationshipModal isOpen={isRelationshipOpen} onClose={() => setIsRelationshipOpen(false)} relationship={relationship} />
      <SchoolEventsModal isOpen={isEventsOpen} onClose={() => setIsEventsOpen(false)} currentEvent={currentEvent} onSelectEvent={handleSelectEvent} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} playerProfile={playerProfile} onUpdateProfile={(p) => setPlayerProfile(p)} audioEnabled={audioEnabled} onToggleAudio={() => setAudioEnabled(!audioEnabled)} autoInitiateEnabled={autoInitiateEnabled} onToggleAutoInitiate={() => setAutoInitiateEnabled(!autoInitiateEnabled)} onResetGame={handleResetGame} />
    </div>
  );
}
