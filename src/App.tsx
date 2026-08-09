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

export default function App() {
  const initialData = loadGameState();

  const [messages, setMessages] = useState<ChatMessage[]>(initialData.messages);
  const [memories, setMemories] = useState<MemoryItem[]>(initialData.memories);
  const [relationship, setRelationship] = useState<RelationshipState>(initialData.relationship);
  const [currentEvent, setCurrentEvent] = useState<SchoolEvent>(initialData.currentEvent);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(initialData.playerProfile);
  const [karimArtworkUrl, setKarimArtworkUrl] = useState<string | undefined>(initialData.karimArtworkUrl);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(initialData.audioEnabled);
  const [autoInitiateEnabled, setAutoInitiateEnabled] = useState<boolean>(initialData.autoInitiateEnabled);

  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isRelationshipOpen, setIsRelationshipOpen] = useState<boolean>(false);
  const [isEventsOpen, setIsEventsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Auto save ref sync
  const lastInteractionTimeRef = useRef<number>(Date.now());

  // Update sound engine preference
  useEffect(() => {
    soundEngine.enabled = audioEnabled;
  }, [audioEnabled]);

  // Persist state updates
  useEffect(() => {
    saveGameState({
      messages,
      memories,
      relationship,
      currentEvent,
      playerProfile,
      karimArtworkUrl,
      audioEnabled,
      autoInitiateEnabled,
    });
  }, [messages, memories, relationship, currentEvent, playerProfile, karimArtworkUrl, audioEnabled, autoInitiateEnabled]);

  // Helper for humanlike sequential message delivery with typing delays
  const deliverKarimMessages = async (msgs: string[]) => {
    for (let i = 0; i < msgs.length; i++) {
      setIsTyping(true);

      const text = msgs[i];
      const chars = text.length;
      // Calculate realistic delay: 1500ms min up to 5500ms for long text, with random variation
      const baseDelay = Math.min(Math.max(1200 + chars * 35, 1500), 5500);
      const randomJitter = Math.floor(Math.random() * 600) - 300;
      const delay = Math.max(baseDelay + randomJitter, 1200);

      await new Promise((resolve) => setTimeout(resolve, delay));
      setIsTyping(false);

      const karimMsg: ChatMessage = {
        id: `msg-karim-${Date.now()}-${i}`,
        sender: 'karim',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      };
      setMessages((prev) => [...prev, karimMsg]);
      soundEngine.playMessageReceive();

      // Pause briefly between consecutive bubbles if there are more coming
      if (i < msgs.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  };

  // Handle Player sending message
  const handleSendMessage = async (text: string) => {
    lastInteractionTimeRef.current = Date.now();

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const playerMsg: ChatMessage = {
      id: `msg-player-${Date.now()}`,
      sender: 'player',
      text,
      timestamp: timeStr,
      status: 'sent',
    };

    setMessages((prev) => [...prev, playerMsg]);
    soundEngine.playMessageSend();
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: text,
          playerProfile,
          relationship,
          memories,
          recentMessages: [...messages, playerMsg],
          currentEvent,
        }),
      });

      const data = await res.json();
      const responseMessages: string[] = data.messages || ['Woi, sinyal agak lemot nih...'];

      // Deliver messages sequentially with typing indicators
      await deliverKarimMessages(responseMessages);

      // Handle new extracted memories
      if (Array.isArray(data.newMemories) && data.newMemories.length > 0) {
        const formattedNew: MemoryItem[] = data.newMemories.map((m: { category: string; content: string; importance?: number }, i: number) => ({
          id: `mem-${Date.now()}-${i}`,
          category: (m.category as MemoryItem['category']) || 'fact',
          content: m.content,
          createdAt: new Date().toISOString(),
          importance: m.importance || 3,
        }));

        setMemories((prev) => {
          const existingContents = new Set(prev.map((p) => p.content));
          const filtered = formattedNew.filter((n) => !existingContents.has(n.content));
          return [...prev, ...filtered];
        });
      }

      // Handle Relationship Progress
      if (data.updatedRelationship) {
        const { affectionDelta, trustDelta, closenessDelta, statusText, newStage } = data.updatedRelationship;

        setRelationship((prev) => {
          const newCloseness = Math.min(Math.max(prev.closeness + (closenessDelta || 1), 0), 100);
          const newAffection = Math.min(Math.max(prev.affection + (affectionDelta || 1), 0), 100);
          const newTrust = Math.min(Math.max(prev.trust + (trustDelta || 1), 0), 100);

          let calculatedStage: RelationshipStageId = prev.stage;
          if (newStage && newStage > prev.stage && newStage <= 9) {
            calculatedStage = newStage as RelationshipStageId;
          } else {
            for (const stageDef of RELATIONSHIP_STAGES) {
              if (newCloseness >= stageDef.minCloseness) {
                calculatedStage = stageDef.id;
              }
            }
          }

          const stageInfo = RELATIONSHIP_STAGES.find((s) => s.id === calculatedStage) || RELATIONSHIP_STAGES[0];

          if (calculatedStage > prev.stage) {
            soundEngine.playRelationshipUp();
            setTimeout(() => {
              setMessages((m) => [
                ...m,
                {
                  id: `sys-milestone-${Date.now()}`,
                  sender: 'system',
                  text: `💕 Level Hubungan Naik! Stage ${calculatedStage}: ${stageInfo.name}`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  systemType: 'relationship',
                },
              ]);
            }, 800);
          }

          return {
            ...prev,
            closeness: newCloseness,
            affection: newAffection,
            trust: newTrust,
            stage: calculatedStage,
            stageName: stageInfo.name,
            statusText: statusText || prev.statusText,
          };
        });
      }
    } catch (err) {
      console.error('Failed to chat with Karim:', err);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'karim',
          text: 'Eh, koneksi agak terputus nih. Coba bales lagi dong.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  // Handle Changing Event / Time Travel
  const handleSelectEvent = useCallback(async (event: SchoolEvent) => {
    setCurrentEvent(event);

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const systemBanner: ChatMessage = {
      id: `sys-evt-${Date.now()}`,
      sender: 'system',
      text: `📍 Suasana Berubah: ${event.title} (${event.location})`,
      timestamp: timeStr,
      systemType: 'event',
    };

    setMessages((prev) => [...prev, systemBanner]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerProfile,
          currentEvent: event,
          relationship,
        }),
      });

      const data = await res.json();
      const initMsgs: string[] = data.messages || [event.starterPrompt];

      setTimeout(() => {
        setIsTyping(false);
        initMsgs.forEach((msgText, idx) => {
          setTimeout(() => {
            const karimMsg: ChatMessage = {
              id: `msg-initiate-${Date.now()}-${idx}`,
              sender: 'karim',
              text: msgText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'read',
            };
            setMessages((prev) => [...prev, karimMsg]);
            soundEngine.playMessageReceive();
          }, idx * 500);
        });
      }, 1200);
    } catch (err) {
      console.error('Failed to fetch initiate message:', err);
      setIsTyping(false);
    }
  }, [playerProfile, relationship]);

  // Handle Resetting Game State
  const handleResetGame = () => {
    const defaultData = resetGameState();
    setMessages(defaultData.messages);
    setMemories(defaultData.memories);
    setRelationship(defaultData.relationship);
    setCurrentEvent(defaultData.currentEvent);
    setPlayerProfile(defaultData.playerProfile);
    setKarimArtworkUrl(undefined);
    setAudioEnabled(true);
    setAutoInitiateEnabled(true);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 dark:bg-zinc-950 font-sans antialiased text-slate-900 dark:text-zinc-100 overflow-hidden select-none">
      {/* Top Navigation & Status Bar */}
      <ChatHeader
        karimArtworkUrl={karimArtworkUrl}
        isTyping={isTyping}
        relationship={relationship}
        currentEvent={currentEvent}
        audioEnabled={audioEnabled}
        onToggleAudio={() => setAudioEnabled(!audioEnabled)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenRelationship={() => setIsRelationshipOpen(true)}
        onOpenEvents={() => setIsEventsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Chat Screen Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto flex flex-col justify-between overflow-hidden bg-white dark:bg-zinc-900 border-x border-slate-200 dark:border-zinc-800 shadow-sm">
        <MessageList
          messages={messages}
          isTyping={isTyping}
          karimArtworkUrl={karimArtworkUrl}
          playerName={playerProfile.name}
        />

        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isTyping}
          onOpenEvents={() => setIsEventsOpen(true)}
          currentPeriodName={currentEvent.period}
        />
      </main>

      {/* Modals */}
      <KarimProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        karimArtworkUrl={karimArtworkUrl}
        onUpdateArtwork={(url) => setKarimArtworkUrl(url)}
        memories={memories}
        relationship={relationship}
      />

      <RelationshipModal
        isOpen={isRelationshipOpen}
        onClose={() => setIsRelationshipOpen(false)}
        relationship={relationship}
      />

      <SchoolEventsModal
        isOpen={isEventsOpen}
        onClose={() => setIsEventsOpen(false)}
        currentEvent={currentEvent}
        onSelectEvent={handleSelectEvent}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        playerProfile={playerProfile}
        onUpdateProfile={(p) => setPlayerProfile(p)}
        audioEnabled={audioEnabled}
        onToggleAudio={() => setAudioEnabled(!audioEnabled)}
        autoInitiateEnabled={autoInitiateEnabled}
        onToggleAutoInitiate={() => setAutoInitiateEnabled(!autoInitiateEnabled)}
        onResetGame={handleResetGame}
      />
    </div>
  );
}
