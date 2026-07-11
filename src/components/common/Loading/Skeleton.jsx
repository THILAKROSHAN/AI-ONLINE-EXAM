import React from 'react';

const Skeleton = ({ 
  variant = 'text', 
  width = 'w-full', 
  height = 'h-4', 
  className = '', 
  count = 1 
}) => {
  const variants = {
    text: 'h-4',
    title: 'h-8',
    subtitle: 'h-6',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-48 rounded-lg',
    button: 'h-10 rounded-lg',
    input: 'h-10 rounded-lg',
  };

  const baseClasses = `animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`;

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variants[variant] || height} ${width}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${variants[variant] || height} ${width}`} />
  );
};

export default Skeleton;