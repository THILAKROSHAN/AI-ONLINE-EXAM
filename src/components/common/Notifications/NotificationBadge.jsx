import React from 'react';

const NotificationBadge = ({ 
  count, 
  max = 99, 
  className = '', 
  children,
  onClick,
}) => {
  const displayCount = count > max ? `${max}+` : count;

  if (count === 0) {
    return children || null;
  }

  return (
    <div className="relative inline-block" onClick={onClick}>
      {children}
      <span className={`absolute -top-2 -right-2 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse-slow ${className}`}>
        {displayCount}
      </span>
    </div>
  );
};

export default NotificationBadge;