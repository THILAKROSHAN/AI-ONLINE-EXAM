import React from 'react';

const ProgressBar = ({ 
  value, 
  max = 100, 
  label, 
  showValue = true, 
  className = '', 
  color = 'primary' 
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colorClasses = {
    primary: 'bg-primary-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
  };

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          {label && <span>{label}</span>}
          {showValue && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;