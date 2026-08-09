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
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-3 sm:space-y-4">
      {/* Date / Day Indicator Banner */}
      <div className="text-center my-2">
        <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 px-3 py-1 rounded-full border border-slate-200 dark:border-zinc-700 shadow-2xs">
          Hari Ini • SMA Garuda
        </span>
      </div>

      {messages.map((msg, index) => {
        if (msg.sender === 'system') {
          return (
            <div key={msg.id || index} className="flex justify-center my-3">
              <div className="max-w-md bg-indigo-50 dark:bg-zinc-800/80 border border-indigo-100 dark:border-zinc-700 rounded-xl px-3.5 py-1.5 text-center text-xs text-indigo-900 dark:text-indigo-200 shadow-2xs flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span className="font-medium">{msg.text}</span>
              </div>
            </div>
          );
        }

        const isKarim = msg.sender === 'karim';

        return (
          <div
            key={msg.id || index}
            className={`flex items-end gap-2 my-1 ${isKarim ? 'justify-start' : 'justify-end'}`}
          >
            {/* Karim Avatar on Left */}
            {isKarim && (
              <KarimAvatar
                customArtworkUrl={karimArtworkUrl}
                size="sm"
                showStatusDot={false}
                className="mb-0.5"
              />
            )}

            {/* Message Bubble Container */}
            <div
              className={`max-w-[82%] sm:max-w-[70%] rounded-2xl px-3.5 py-2 text-sm sm:text-[15px] leading-relaxed transition-colors ${
                isKarim
                  ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 rounded-bl-xs border border-slate-200 dark:border-zinc-700/80 shadow-2xs'
                  : 'bg-indigo-600 text-white rounded-br-xs shadow-2xs'
              }`}
            >
              {/* Message Content */}
              <p className="whitespace-pre-wrap break-words font-normal">{msg.text}</p>

              {/* Timestamp & Read Indicator */}
              <div
                className={`flex items-center justify-end gap-1 mt-0.5 text-[10px] ${
                  isKarim ? 'text-slate-400 dark:text-zinc-400' : 'text-indigo-200'
                }`}
              >
                <span>{msg.timestamp}</span>
                {!isKarim && (
                  <CheckCheck className="w-3.5 h-3.5 text-indigo-200 inline-block" />
                )}
              </div>
            </div>

            {/* Player Avatar placeholder on Right */}
            {!isKarim && (
              <div
                className="w-7 h-7 rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-semibold text-xs flex items-center justify-center flex-shrink-0 mb-0.5 border border-slate-300 dark:border-zinc-600"
                title={playerName}
              >
                {playerName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        );
      })}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex items-end gap-2 justify-start my-1">
          <KarimAvatar
            customArtworkUrl={karimArtworkUrl}
            size="sm"
            showStatusDot={false}
            className="mb-0.5"
          />
          <div className="bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700/80 rounded-2xl rounded-bl-xs px-3.5 py-2.5 shadow-2xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="text-xs text-slate-400 dark:text-zinc-400 font-normal ml-1">Karim sedang mengetik...</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
