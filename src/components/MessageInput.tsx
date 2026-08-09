import React, { useState, KeyboardEvent } from 'react';
import { Send, Clock, MessageSquarePlus } from 'lucide-react';

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

  return (
    <div className="shrink-0 bg-[#fffdf9] dark:bg-[#171719] border-t border-[#e8e1d8] dark:border-zinc-800 px-3 sm:px-5 py-3">
      <div className="max-w-2xl mx-auto">
        {showSuggestions && (
          <div className="flex gap-1.5 overflow-x-auto pb-2.5 scrollbar-none">
            {QUICK_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setText(suggestion);
                  setShowSuggestions(false);
                }}
                className="shrink-0 text-[12px] text-[#655d56] dark:text-zinc-300 bg-[#f4eee8] dark:bg-zinc-800 hover:bg-[#ece4dc] dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
              showSuggestions
                ? 'bg-[#eee7df] dark:bg-zinc-800 text-[#6f6259] dark:text-zinc-200'
                : 'text-[#8d847c] dark:text-zinc-500 hover:bg-[#f5efe9] dark:hover:bg-zinc-800'
            }`}
            title="Ide obrolan"
          >
            <MessageSquarePlus className="w-[17px] h-[17px]" />
          </button>

          <button
            type="button"
            onClick={onOpenEvents}
            className="hidden sm:flex h-9 items-center gap-1.5 px-2 text-[11px] text-[#8d847c] dark:text-zinc-500 hover:bg-[#f5efe9] dark:hover:bg-zinc-800 rounded-lg transition-colors"
            title="Ganti suasana"
          >
            <Clock className="w-4 h-4" />
            <span>{currentPeriodName}</span>
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              placeholder={disabled ? 'Karim sedang mengetik...' : 'Tulis pesan...'}
              className="w-full h-9 bg-[#f4f0eb] dark:bg-[#222225] text-[#2c2926] dark:text-zinc-100 placeholder-[#aaa199] dark:placeholder-zinc-600 text-[14px] px-3.5 rounded-lg border border-transparent focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-[#d8cec3] dark:focus:border-zinc-700 transition-colors disabled:opacity-60"
            />
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={!text.trim() || disabled}
            className="w-9 h-9 flex items-center justify-center bg-[#756579] hover:bg-[#685a6d] text-white rounded-lg transition-colors disabled:opacity-25 disabled:cursor-not-allowed active:scale-95"
            title="Kirim pesan"
          >
            <Send className="w-[15px] h-[15px]" />
          </button>
        </div>
      </div>
    </div>
  );
};
