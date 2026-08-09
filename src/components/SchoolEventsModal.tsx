import React from 'react';
import { X, Calendar, MapPin, Sparkles, Sun, BookOpen, Coffee, CloudRain, Book, Moon } from 'lucide-react';
import { SchoolEvent } from '../types';
import { ALL_SCHOOL_EVENTS } from '../data/schoolEvents';

interface SchoolEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEvent: SchoolEvent;
  onSelectEvent: (event: SchoolEvent) => void;
}

export const SchoolEventsModal: React.FC<SchoolEventsModalProps> = ({
  isOpen,
  onClose,
  currentEvent,
  onSelectEvent,
}) => {
  if (!isOpen) return null;

  const getEventIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-5 h-5 text-amber-500" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-indigo-500" />;
      case 'Coffee': return <Coffee className="w-5 h-5 text-amber-600" />;
      case 'CloudRain': return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'Book': return <Book className="w-5 h-5 text-purple-500" />;
      case 'Moon': return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-pink-500" />;
      default: return <Calendar className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/40 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative bg-slate-100 dark:bg-zinc-800 p-4 border-b border-slate-200 dark:border-zinc-700 flex items-center justify-between text-slate-900 dark:text-zinc-100">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold block">
                Kehidupan SMA Garuda
              </span>
              <h2 className="text-base font-bold">Pilih Suasana & Event Sekolah</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-3 text-slate-800 dark:text-slate-200 text-sm">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pilih momen sekolah yang ingin kamu jalani bersama Karim. Karim akan merespons langsung sesuai suasana event tersebut!
          </p>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {ALL_SCHOOL_EVENTS.map((evt) => {
              const isSelected = evt.id === currentEvent.id;

              return (
                <div
                  key={evt.id}
                  onClick={() => {
                    onSelectEvent(evt);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 hover:scale-[1.01] ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-400 dark:border-indigo-700 ring-2 ring-indigo-500/20'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                  }`}
                >
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 mt-0.5">
                    {getEventIcon(evt.iconName)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                        {evt.title}
                      </h3>
                      {isSelected && (
                        <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full">
                          Aktif
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-indigo-500" />
                        {evt.location}
                      </span>
                      <span>•</span>
                      <span>{evt.weather}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
