import React from 'react';

const Alert = ({ 
  children, 
  type = 'info', 
  title, 
  dismissible = false, 
  onDismiss,
  className = '',
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const styles = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-800 text-green-800 dark:text-green-400',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-800 text-red-800 dark:text-red-400',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-800 text-blue-800 dark:text-blue-400',
  };

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <div className={`rounded-lg border p-4 ${styles[type]} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-xl">{icons[type]}</span>
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;