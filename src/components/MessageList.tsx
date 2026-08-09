import React, { useEffect, useRef } from 'react';
import { CheckCheck, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { KarimAvatar } from './KarimAvatar';

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  karimArtworkUrl?: string;
  playerName: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isTyping, karimArtworkUrl, playerName }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="bg-chat-wallpaper flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-7">
      <div className="mx-auto max-w-2xl space-y-2">
        <div className="mb-4 flex justify-center py-1">
          <span className="rounded-full border border-[#dec79f] bg-[#fff3d8]/80 px-3 py-1 text-[11px] font-bold text-[#9a806c] shadow-sm">
            Hari ini · SMA Garuda
          </span>
        </div>

        {messages.map((msg, index) => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id || index} className="flex justify-center py-2">
                <div className="flex items-center gap-1.5 rounded-full bg-[#fff3d8]/70 px-3 py-1 text-[11px] font-semibold text-[#96806f]">
                  <Sparkles className="h-3 w-3" />
                  <span>{msg.text}</span>
                </div>
              </div>
            );
          }

          const isKarim = msg.sender === 'karim';

          return (
            <div key={msg.id || index} className={`karim-message-pop flex items-end gap-2.5 ${isKarim ? 'justify-start' : 'justify-end'}`}>
              {isKarim && <KarimAvatar customArtworkUrl={karimArtworkUrl} size="sm" showStatusDot={false} className="mb-5" />}

              <div className={`flex max-w-[84%] flex-col sm:max-w-[70%] ${isKarim ? 'items-start' : 'items-end'}`}>
                <div className={`px-3.5 py-2.5 text-[14px] leading-[1.5] sm:text-[15px] ${
                  isKarim
                    ? 'border-2 border-[#ead7b6] bg-[#fffaf0] text-[#4b4145] rounded-[18px] rounded-bl-[6px] shadow-[0_3px_0_rgba(101,76,51,.08)]'
                    : 'bg-[#8d7288] text-white rounded-[18px] rounded-br-[6px] shadow-[0_3px_0_rgba(75,54,70,.15)]'
                }`}>
                  <p className="whitespace-pre-wrap break-words font-medium">{msg.text}</p>
                </div>
                <div className="mt-1 flex items-center gap-1 px-1 text-[10px] font-semibold text-[#aa9686]">
                  <span>{msg.timestamp}</span>
                  {!isKarim && <CheckCheck className="h-3 w-3" />}
                </div>
              </div>

              {!isKarim && (
                <div className="mb-5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[#dfc79f] bg-[#fff1d4] text-[11px] font-extrabold text-[#76605a]" title={playerName}>
                  {playerName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-end gap-2.5 justify-start">
            <KarimAvatar customArtworkUrl={karimArtworkUrl} size="sm" showStatusDot={false} className="mb-1" />
            <div className="border-2 border-[#ead7b6] bg-[#fffaf0] rounded-[18px] rounded-bl-[6px] px-3.5 py-3 flex items-center gap-1 shadow-[0_3px_0_rgba(101,76,51,.08)]">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#b19a86]" style={{ animationDelay: '0ms' }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#b19a86]" style={{ animationDelay: '140ms' }} />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#b19a86]" style={{ animationDelay: '280ms' }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
