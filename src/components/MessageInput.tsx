import React, { useState, KeyboardEvent } from 'react';
import { Send, Sparkles, Clock, MessageSquarePlus } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
  onOpenEvents: () => void;
  currentPeriodName: string;
}

const QUICK_SUGGESTIONS = [
  'Udah makan belum?',
  'Hari ini pelajaran apa aja sih?',
  'Tadi PR matematika kamu udah selesai?',
  'Ajak makan bakso di kantin yuk!',
  'Bukan berarti aku kangen ya wkwk',
  'Kamu kok perhatian banget sih hari ini?',
];

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled,
  onOpenEvents,
  currentPeriodName,
}) => {
  const [text, setText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setText(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="sticky bottom-0 z-10 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 p-2.5 sm:p-3 shadow-2xs">
      <div className="max-w-5xl mx-auto space-y-2">
        {/* Quick Suggestion Chips */}
        {showSuggestions && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 whitespace-nowrap px-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Topik:
            </span>
            {QUICK_SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(s)}
                className="text-xs bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 px-3 py-1 rounded-full border border-slate-200 dark:border-zinc-700 transition-colors whitespace-nowrap"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Action Row & Input Bar */}
        <div className="flex items-center gap-2">
          {/* Quick Topics Toggle button */}
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className={`p-2 rounded-full transition-colors ${
              showSuggestions
                ? 'bg-indigo-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
            title="Ide Topik Obrolan"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>

          {/* Time & Event Jump button */}
          <button
            type="button"
            onClick={onOpenEvents}
            className="p-2 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-full transition-colors flex items-center gap-1 text-xs font-medium"
            title="Ganti Waktu / Suasana Sekolah"
          >
            <Clock className="w-5 h-5 text-slate-500 dark:text-zinc-400" />
            <span className="hidden sm:inline">{currentPeriodName}</span>
          </button>

          {/* Main Free Text Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={disabled ? 'Karim sedang mengetik...' : 'Tulis pesan...'}
              className="w-full bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 text-sm px-4 py-2 rounded-full border border-slate-200 dark:border-zinc-700 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors disabled:opacity-60"
            />
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!text.trim() || disabled}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 active:scale-95"
            title="Kirim Pesan"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
