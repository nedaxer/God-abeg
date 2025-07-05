import React from 'react';

interface VerificationBadgeProps {
  size?: number;
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  size = 20, 
  className = "ml-2 inline-block" 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`orangeGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff8c00" />
          <stop offset="100%" stopColor="#ff6600" />
        </linearGradient>
      </defs>
      {/* Star-shaped verification badge */}
      <path 
        d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" 
        fill={`url(#orangeGradient-${size})`}
        stroke="#ff6600"
        strokeWidth="0.5"
      />
      {/* Checkmark */}
      <path 
        d="M8.5 12L11 14.5L15.5 9.5" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
      />
    </svg>
  );
};

export default VerificationBadge;