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

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
  karimArtworkUrl,
  playerName,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#faf7f2] dark:bg-[#141416] px-4 sm:px-8 py-5 sm:py-7">
      <div className="max-w-2xl mx-auto space-y-2">
        <div className="flex justify-center py-1 mb-4">
          <span className="text-[11px] text-[#a49b91] dark:text-zinc-500">Hari ini · SMA Garuda</span>
        </div>

        {messages.map((msg, index) => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id || index} className="flex justify-center py-2">
                <div className="text-[11px] text-[#968d84] dark:text-zinc-500 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>{msg.text}</span>
                </div>
              </div>
            );
          }

          const isKarim = msg.sender === 'karim';

          return (
            <div
              key={msg.id || index}
              className={`flex items-end gap-2.5 ${isKarim ? 'justify-start' : 'justify-end'} ${isKarim ? 'pl-0' : 'pr-0'}`}
            >
              {isKarim && (
                <KarimAvatar customArtworkUrl={karimArtworkUrl} size="sm" showStatusDot={false} className="mb-5" />
              )}

              <div className={`max-w-[82%] sm:max-w-[68%] ${isKarim ? 'items-start' : 'items-end'} flex flex-col`}>
                <div
                  className={`px-3.5 py-2.5 text-[14px] sm:text-[15px] leading-[1.5] ${
                    isKarim
                      ? 'bg-white dark:bg-[#202023] text-[#2c2926] dark:text-zinc-100 border border-[#e8e1d8] dark:border-zinc-800 rounded-[17px] rounded-bl-[5px]'
                      : 'bg-[#756579] text-white rounded-[17px] rounded-br-[5px]'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words font-normal">{msg.text}</p>
                </div>
                <div className={`flex items-center gap-1 mt-1 px-1 text-[10px] ${isKarim ? 'text-[#aaa199] dark:text-zinc-600' : 'text-[#aaa199] dark:text-zinc-600'}`}>
                  <span>{msg.timestamp}</span>
                  {!isKarim && <CheckCheck className="w-3 h-3" />}
                </div>
              </div>

              {!isKarim && (
                <div
                  className="w-7 h-7 rounded-full bg-[#eee8e1] dark:bg-zinc-800 text-[#766d65] dark:text-zinc-300 text-[11px] font-semibold flex items-center justify-center shrink-0 mb-5"
                  title={playerName}
                >
                  {playerName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-end gap-2.5 justify-start">
            <KarimAvatar customArtworkUrl={karimArtworkUrl} size="sm" showStatusDot={false} className="mb-1" />
            <div className="bg-white dark:bg-[#202023] border border-[#e8e1d8] dark:border-zinc-800 rounded-[17px] rounded-bl-[5px] px-3.5 py-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9e9289] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#9e9289] animate-bounce" style={{ animationDelay: '140ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#9e9289] animate-bounce" style={{ animationDelay: '280ms' }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
