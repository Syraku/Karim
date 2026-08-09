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
  'Ayo beli jajan di kantin yuk!',
  'Kamu tadi masuk jam berapa?',
  'Besok ada tugas apa?',
];

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled, onOpenEvents, currentPeriodName }) => {
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
    <div className="shrink-0 border-t-2 border-[#dfc79f] bg-[#fff5df] px-3 py-3 sm:px-5">
      <div className="mx-auto max-w-2xl">
        {showSuggestions && (
          <div className="flex gap-2 overflow-x-auto pb-2.5 scrollbar-none">
            {QUICK_SUGGESTIONS.map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => { setText(suggestion); setShowSuggestions(false); }} className="shrink-0 rounded-full border border-[#dfc79f] bg-[#fff8e9] px-3 py-1.5 text-[12px] font-semibold text-[#75635a] transition hover:-translate-y-0.5 hover:bg-white">
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowSuggestions(!showSuggestions)} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 transition ${showSuggestions ? 'border-[#caa979] bg-[#f4dfb7] text-[#69574d]' : 'border-[#ead7b6] bg-[#fffaf0] text-[#8d7769] hover:bg-white'}`} title="Ide obrolan">
            <MessageSquarePlus size={18} />
          </button>

          <button type="button" onClick={onOpenEvents} className="hidden h-10 items-center gap-1.5 rounded-xl border-2 border-[#ead7b6] bg-[#fffaf0] px-3 text-[11px] font-bold text-[#8d7769] transition hover:bg-white sm:flex" title="Info sekolah">
            <Clock size={16} />
            <span>{currentPeriodName}</span>
          </button>

          <div className="relative flex-1">
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown} disabled={disabled} placeholder={disabled ? 'Karim lagi ngetik...' : 'Tulis sesuatu ke Karim...'} className="h-10 w-full rounded-2xl border-2 border-[#ead7b6] bg-[#fffaf0] px-4 text-[14px] font-semibold text-[#4b4145] placeholder-[#b4a091] shadow-[0_2px_0_rgba(101,76,51,.05)] outline-none transition focus:border-[#cba875] focus:bg-white disabled:opacity-60" />
          </div>

          <button type="button" onClick={handleSend} disabled={!text.trim() || disabled} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8d7288] text-white shadow-[0_3px_0_rgba(75,54,70,.18)] transition hover:-translate-y-0.5 hover:bg-[#7d6479] disabled:cursor-not-allowed disabled:opacity-30" title="Kirim pesan">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
