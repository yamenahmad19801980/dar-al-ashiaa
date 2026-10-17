import React from 'react';

interface CornerBracketsProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  bracketColor?: string;
  size?: number;
}

export const CornerBrackets: React.FC<CornerBracketsProps> = ({
  children,
  className = '',
  animate = true,
  bracketColor = '#D0AE29', // gold-500
  size = 14,
}) => {
  const strokeWidth = 2.5;

  return (
    <div className={`relative p-3 ${className}`}>
      {/* Top Left Bracket */}
      <svg
        className={`absolute top-0 start-0 pointer-events-none ${animate ? 'animate-bracket' : ''}`}
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M1 15V1H15"
          stroke={bracketColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Top Right Bracket */}
      <svg
        className={`absolute top-0 end-0 pointer-events-none ${animate ? 'animate-bracket' : ''}`}
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M15 15V1H1"
          stroke={bracketColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Bottom Left Bracket */}
      <svg
        className={`absolute bottom-0 start-0 pointer-events-none ${animate ? 'animate-bracket' : ''}`}
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M1 1V15H15"
          stroke={bracketColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Bottom Right Bracket */}
      <svg
        className={`absolute bottom-0 end-0 pointer-events-none ${animate ? 'animate-bracket' : ''}`}
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M15 1V15H1"
          stroke={bracketColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {children}
    </div>
  );
};
