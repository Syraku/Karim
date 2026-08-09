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
        className={`${sizeClasses} rounded-full overflow-hidden border-2 border-indigo-200 dark:border-indigo-700 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 shadow-sm flex items-center justify-center`}
      >
        {customArtworkUrl ? (
          <img
            src={customArtworkUrl}
            alt="Karim"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              // Fallback if custom artwork URL breaks
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <DefaultKarimIllustration />
        )}
      </div>

      {showStatusDot && (
        <span
          className={`absolute bottom-0 right-0 ${dotSizeClasses} rounded-full ring-white dark:ring-slate-900 ${
            isOnline ? 'bg-emerald-500' : 'bg-slate-400'
          }`}
          title={isOnline ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
};

// Cute default vector avatar representing Karim (Navy cat ears, purple hair, cozy blue sweater)
function DefaultKarimIllustration() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#312e81" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffedd5" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
      </defs>

      {/* Background fill */}
      <circle cx="50" cy="50" r="48" fill="url(#bgGrad)" />

      {/* Cat ears */}
      <path d="M 22 35 L 34 12 L 44 28 Z" fill="#312e81" />
      <path d="M 25 33 L 34 16 L 41 28 Z" fill="#f472b6" />

      <path d="M 78 35 L 66 12 L 56 28 Z" fill="#312e81" />
      <path d="M 75 33 L 66 16 L 59 28 Z" fill="#f472b6" />

      {/* Body / Sweater */}
      <path d="M 20 85 C 20 68, 80 68, 80 85 L 80 100 L 20 100 Z" fill="#1e3a8a" />
      <path d="M 38 72 L 50 82 L 62 72 L 50 90 Z" fill="#ffffff" opacity="0.9" />

      {/* Head & Skin */}
      <ellipse cx="50" cy="52" rx="24" ry="22" fill="url(#skinGrad)" />

      {/* Hair front bangs */}
      <path
        d="M 25 45 C 25 30, 35 22, 50 22 C 65 22, 75 30, 75 45 C 70 38, 62 36, 56 42 C 52 36, 45 36, 40 43 C 35 38, 28 39, 25 45 Z"
        fill="url(#hairGrad)"
      />

      {/* Eyes & Wink */}
      <ellipse cx="40" cy="52" rx="3" ry="4" fill="#1e1b4b" />
      <circle cx="41" cy="51" r="1" fill="#ffffff" />

      {/* Winking eye */}
      <path d="M 57 52 Q 62 47 65 52" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Cute blush */}
      <ellipse cx="35" cy="57" rx="4" ry="2" fill="#fb7185" opacity="0.6" />
      <ellipse cx="65" cy="57" rx="4" ry="2" fill="#fb7185" opacity="0.6" />

      {/* Smug / Tsundere Smile */}
      <path d="M 45 61 Q 50 65 55 60" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
