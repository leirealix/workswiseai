
import React from 'react';

interface LawyerIconProps {
  size?: number;
  className?: string;
}

const LawyerIcon: React.FC<LawyerIconProps> = ({ size = 24, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      {/* Simple lawyer figure with tie and suit */}
      <path d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      <path d="M12 21v-5" />
      <path d="M9 21h6" />
      <path d="M8 12c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v4c0 1 0 2-2 2h-4c-2 0-2-1-2-2v-4z" />
      <path d="M10 7h4v5" />
      <path d="M12 7v5" />
      <path d="M10 12h4" />
    </svg>
  );
};

export default LawyerIcon;
