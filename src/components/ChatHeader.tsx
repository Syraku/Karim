import React from 'react';
import { Calendar, Heart, Settings, User, Volume2, VolumeX } from 'lucide-react';
import { RelationshipState, SchoolEvent } from '../types';
import { KarimAvatar } from './KarimAvatar';

interface ChatHeaderProps {
  karimArtworkUrl?: string;
  isTyping: boolean;
  relationship: RelationshipState;
  currentEvent: SchoolEvent;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onOpenProfile: () => void;
  onOpenRelationship: () => void;
  onOpenEvents: () => void;
  onOpenSettings: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  karimArtworkUrl,
  isTyping,
  relationship,
  currentEvent,
  audioEnabled,
  onToggleAudio,
  onOpenProfile,
  onOpenRelationship,
  onOpenEvents,
  onOpenSettings,
}) => {
  return (
    <header className="shrink-0 bg-[#fffdf9]/95 dark:bg-[#171719]/95 backdrop-blur-sm border-b border-[#e8e1d8] dark:border-zinc-800 px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-3 min-w-0 text-left rounded-lg -ml-1 px-1 py-1 hover:bg-[#f6f1eb] dark:hover:bg-zinc-800/70 transition-colors"
        >
          <KarimAvatar customArtworkUrl={karimArtworkUrl} size="md" isOnline={true} />
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <h1 className="text-[16px] font-semibold tracking-[-0.01em] text-[#252320] dark:text-zinc-100 truncate">Karim</h1>
              <span className="hidden sm:inline text-[11px] text-[#9b938a] dark:text-zinc-500">{currentEvent.period}</span>
            </div>
            <div className="text-[12px] text-[#8f877f] dark:text-zinc-400 mt-0.5">
              {isTyping ? 'sedang mengetik...' : 'online'}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={onOpenEvents}
            className="hidden sm:flex items-center gap-1.5 h-9 px-2.5 text-[#817971] dark:text-zinc-400 hover:bg-[#f6f1eb] dark:hover:bg-zinc-800 rounded-lg transition-colors"
            title="Suasana sekolah"
          >
            <Calendar className="w-[17px] h-[17px]" />
            <span className="text-[12px]">{currentEvent.period}</span>
          </button>
          <button
            onClick={onOpenRelationship}
            className="w-9 h-9 flex items-center justify-center text-[#9b6f79] dark:text-rose-300 hover:bg-[#f8eeee] dark:hover:bg-zinc-800 rounded-lg transition-colors"
            title="Hubungan"
          >
            <Heart className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={onToggleAudio}
            className="w-9 h-9 flex items-center justify-center text-[#817971] dark:text-zinc-400 hover:bg-[#f6f1eb] dark:hover:bg-zinc-800 rounded-lg transition-colors"
            title={audioEnabled ? 'Matikan suara' : 'Aktifkan suara'}
          >
            {audioEnabled ? <Volume2 className="w-[17px] h-[17px]" /> : <VolumeX className="w-[17px] h-[17px]" />}
          </button>
          <button
            onClick={onOpenProfile}
            className="w-9 h-9 flex items-center justify-center text-[#817971] dark:text-zinc-400 hover:bg-[#f6f1eb] dark:hover:bg-zinc-800 rounded-lg transition-colors"
            title="Profil Karim"
          >
            <User className="w-[17px] h-[17px]" />
          </button>
          <button
            onClick={onOpenSettings}
            className="w-9 h-9 flex items-center justify-center text-[#817971] dark:text-zinc-400 hover:bg-[#f6f1eb] dark:hover:bg-zinc-800 rounded-lg transition-colors"
            title="Pengaturan"
          >
            <Settings className="w-[17px] h-[17px]" />
          </button>
        </div>
      </div>
    </header>
  );
};
