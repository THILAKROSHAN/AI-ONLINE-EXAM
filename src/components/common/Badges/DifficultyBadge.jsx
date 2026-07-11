import React from 'react';

const DifficultyBadge = ({ difficulty, className = '' }) => {
  const difficultyConfig = {
    easy: { label: 'Easy', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    hard: { label: 'Hard', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  };

  const config = difficultyConfig[difficulty] || { label: difficulty, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${config.color} ${className}`}>
      {config.label}
    </span>
  );
};

export default DifficultyBadge;