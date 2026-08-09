import React from 'react';
import { Calendar, Heart, Settings, Sparkles, User, Volume2, VolumeX } from 'lucide-react';
import { RelationshipState, SchoolEvent } from '../types';
import { RELATIONSHIP_STAGES } from '../data/karimData';
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
    <header className="sticky top-0 z-20 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-3 sm:px-4 py-2.5 shadow-2xs">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Karim Info & Status */}
        <div
          onClick={onOpenProfile}
          className="flex items-center gap-3 cursor-pointer group p-1 -ml-1 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <KarimAvatar
            customArtworkUrl={karimArtworkUrl}
            size="md"
            isOnline={true}
          />

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 dark:text-zinc-100 text-base sm:text-lg leading-tight truncate">
                Karim
              </h1>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                • {relationship.stageName}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {isTyping ? (
                <span className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                  sedang mengetik...
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  online
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions Bar */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Current Event pill badge */}
          <button
            onClick={onOpenEvents}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700 transition-colors"
            title="Ganti Suasana & Event Sekolah"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate max-w-[120px]">{currentEvent.period}</span>
          </button>

          {/* Relationship Progress button */}
          <button
            onClick={onOpenRelationship}
            className="p-2 text-rose-600 dark:text-rose-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors relative"
            title="Progress Hubungan"
          >
            <Heart className="w-5 h-5 fill-rose-500/20" />
          </button>

          {/* Sound Toggle button */}
          <button
            onClick={onToggleAudio}
            className="p-2 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            title={audioEnabled ? 'Matikan Suara' : 'Aktifkan Suara'}
          >
            {audioEnabled ? <Volume2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          {/* Profile & Artwork button */}
          <button
            onClick={onOpenProfile}
            className="p-2 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            title="Biodata & Artwork Karim"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            title="Pengaturan"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
