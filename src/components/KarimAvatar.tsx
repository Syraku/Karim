import React from 'react';

// Canonical Karim artwork committed to the repository.
// This is the only default character artwork used by the app.
export const KARIM_ARTWORK = new URL('../../assets/.aistudio/Karim.jpg', import.meta.url).href;

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

  // Only a real user-uploaded raster image may override the canonical artwork.
  // SVG/data-URL generated avatars are intentionally rejected.
  const isValidCustomArtwork =
    !!customArtworkUrl &&
    /^(data:image\/(png|jpeg|jpg|webp);base64,|https?:\/\/)/i.test(customArtworkUrl);

  const artworkUrl = isValidCustomArtwork ? customArtworkUrl! : KARIM_ARTWORK;

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      <div
        className={`${sizeClasses} rounded-full overflow-hidden border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center`}
      >
        <img
          src={artworkUrl}
          alt="Karim"
          className="w-full h-full object-cover object-center"
          draggable={false}
          onError={(event) => {
            const img = event.currentTarget;
            if (img.src !== KARIM_ARTWORK) img.src = KARIM_ARTWORK;
          }}
        />
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
