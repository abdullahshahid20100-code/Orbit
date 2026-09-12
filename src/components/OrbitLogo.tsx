import React from 'react';

interface OrbitLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBackground?: boolean;
  className?: string;
}

export const OrbitLogo: React.FC<OrbitLogoProps> = ({
  size = 'md',
  showBackground = true,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(139,92,246,0.5)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={`bg-${size}`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#1e2235" />
            <stop offset="100%" stopColor="#0d0f17" />
          </radialGradient>
          <linearGradient id={`ringCore-${size}`} x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#c4b5fd" />
            <stop offset="60%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id={`orbitGlow-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0e7ff" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>

        {showBackground && (
          <rect
            x="12"
            y="12"
            width="176"
            height="176"
            rx="46"
            fill={`url(#bg-${size})`}
            stroke="#2b3149"
            strokeWidth="3"
          />
        )}

        <g transform="translate(100, 100) rotate(-26)">
          {/* Back outer orbit ellipse */}
          <ellipse
            cx="0"
            cy="0"
            rx="68"
            ry="22"
            fill="none"
            stroke={`url(#orbitGlow-${size})`}
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.65"
          />

          {/* Central O-body torus */}
          <path
            d="M 0 -48 C 30 -48 42 -24 42 0 C 42 24 30 48 0 48 C -30 48 -42 24 -42 0 C -42 -24 -30 -48 0 -48 Z"
            fill="none"
            stroke={`url(#ringCore-${size})`}
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Core rim highlight */}
          <ellipse
            cx="0"
            cy="0"
            rx="18"
            ry="30"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            opacity="0.9"
          />

          {/* Front crossing dynamic ring */}
          <path
            d="M -66 4 C -54 22 -18 26 0 26 C 28 26 58 18 68 -2"
            fill="none"
            stroke={`url(#orbitGlow-${size})`}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M -56 8 C -42 20 -14 24 0 24 C 22 24 46 18 56 4"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.95"
          />
        </g>
      </svg>
    </div>
  );
};
