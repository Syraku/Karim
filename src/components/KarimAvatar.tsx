import React from 'react';

interface KarimAvatarProps {
  customArtworkUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatusDot?: boolean;
  isOnline?: boolean;
  className?: string;
}

export const KarimAvatar: React.FC<KarimAvatarProps> = ({
  customArtworkUrl,
  size = 'md',
  showStatusDot = true,
  isOnline = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  }[size];

  const dotSizeClasses = {
    sm: 'w-2 h-2 ring-1',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3.5 h-3.5 ring-2',
    xl: 'w-5 h-5 ring-3',
  }[size];

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      <div
        className={`${sizeClasses} rounded-full overflow-hidden border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center`}
      >
        {customArtworkUrl ? (
          <img
            src={customArtworkUrl}
            alt="Karim"
            className="w-full h-full object-cover object-center"
            draggable={false}
          />
        ) : (
          <div
            aria-label="Artwork Karim belum diatur"
            className="w-full h-full flex items-center justify-center text-slate-400 dark:text-zinc-500 font-semibold select-none"
          >
            K
          </div>
        )}
      </div>

      {showStatusDot && (
        <span
          className={`absolute bottom-0 right-0 ${dotSizeClasses} rounded-full ring-white dark:ring-zinc-900 ${
            isOnline ? 'bg-emerald-500' : 'bg-slate-400'
          }`}
          title={isOnline ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
};
