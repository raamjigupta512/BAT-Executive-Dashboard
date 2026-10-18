import React from 'react';

interface BATLogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  showTagline?: boolean;
}

export const BATLogo: React.FC<BATLogoProps> = ({
  className = '',
  variant = 'dark',
  showTagline = true,
}) => {
  const isDark = variant === 'dark';
  const textColor = isDark ? '#071F3D' : '#FFFFFF';
  const subTextColor = isDark ? '#071F3D' : '#E2E8F0';
  const arcColor = '#008FCB';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official BAT stylized SVG mark */}
      <svg
        viewBox="0 0 160 52"
        className="h-9 w-auto overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dynamic dynamic swoosh curve above the T and across the letters */}
        <path
          d="M 64 8 C 88 4, 126 5, 148 18 C 132 12, 102 12, 74 15 Z"
          fill={arcColor}
        />
        <path
          d="M 98 4 C 122 6, 142 12, 156 22 C 144 14, 120 10, 100 8 Z"
          fill="#002D62"
          opacity="0.85"
        />

        {/* 'B' letter */}
        <path
          d="M 12 14 L 32 14 C 40 14, 45 17, 45 22 C 45 26, 42 28, 38 29 C 43 30, 46 33, 46 38 C 46 44, 40 48, 31 48 L 12 48 Z M 22 21 L 22 27 L 31 27 C 34 27, 36 26, 36 24 C 36 22, 34 21, 31 21 Z M 22 34 L 22 41 L 32 41 C 35 41, 37 39, 37 37 C 37 35, 35 34, 32 34 Z"
          fill={textColor}
        />

        {/* 'A' letter */}
        <path
          d="M 62 14 L 75 48 L 65 48 L 62.5 40 L 51.5 40 L 49 48 L 39 48 L 52 14 Z M 57 23 L 53.5 33 L 60.5 33 Z"
          fill={textColor}
        />

        {/* 'T' letter */}
        <path
          d="M 76 14 L 104 14 L 104 22 L 95 22 L 95 48 L 85 48 L 85 22 L 76 22 Z"
          fill={textColor}
        />
      </svg>

      {showTagline && (
        <div className="flex flex-col justify-center leading-tight tracking-wider pl-2 border-l border-gray-300">
          <span
            className="text-[10px] font-bold tracking-[0.16em]"
            style={{ color: subTextColor }}
          >
            A BETTER
          </span>
          <span
            className="text-[10px] font-bold tracking-[0.16em]"
            style={{ color: subTextColor }}
          >
            TOMORROW
          </span>
        </div>
      )}
    </div>
  );
};
