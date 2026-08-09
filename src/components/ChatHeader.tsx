import React from 'react';
import { Calendar, Heart, Settings, Volume2, VolumeX } from 'lucide-react';
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
    <header className="relative z-20 shrink-0 border-b-2 border-[#dfc79f] bg-[#fff5df] shadow-[0_3px_0_rgba(94,70,47,.08)]">
      <div className="mx-auto flex h-[74px] max-w-3xl items-center gap-3 px-4">
        <button onClick={onOpenProfile} className="relative shrink-0 rounded-full transition-transform hover:rotate-2" title="Profil Karim">
          <KarimAvatar customArtworkUrl={karimArtworkUrl} size="md" isOnline={true} />
        </button>

        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-[23px] font-extrabold leading-none text-[#4b3b42]">Karim</h1>
            <span className="rounded-full bg-[#e7f0c8] px-2 py-0.5 text-[11px] font-bold text-[#66734b]">
              {isTyping ? 'ngetik...' : 'online'}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-[#9a806c]">
            <span>{currentEvent.period}</span><span>·</span><span>SMA Garuda</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={onOpenEvents} className="hidden h-10 items-center justify-center rounded-xl px-2.5 text-[#806d60] transition hover:bg-[#f7e8ca] sm:flex" title="Suasana sekolah">
            <Calendar size={18} />
          </button>
          <button onClick={onOpenRelationship} className="flex h-10 w-10 items-center justify-center rounded-xl text-[#bb687c] transition hover:bg-[#fae1e3]" title="Hubungan">
            <Heart size={18} fill="currentColor" />
          </button>
          <button onClick={onToggleAudio} className="flex h-10 w-10 items-center justify-center rounded-xl text-[#806d60] transition hover:bg-[#f7e8ca]" title={audioEnabled ? 'Matikan suara' : 'Aktifkan suara'}>
            {audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button onClick={onOpenSettings} className="flex h-10 w-10 items-center justify-center rounded-xl text-[#806d60] transition hover:bg-[#f7e8ca]" title="Pengaturan">
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
