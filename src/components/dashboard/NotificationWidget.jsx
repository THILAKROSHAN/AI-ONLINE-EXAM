import React from 'react';

const NotificationWidget = ({ notifications }) => {
  const getTypeStyles = (type) => {
    const styles = {
      success: 'bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-800 text-green-800 dark:text-green-400',
      warning: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400',
      error: 'bg-red-100 dark:bg-red-900/30 border-red-400 dark:border-red-800 text-red-800 dark:text-red-400',
      info: 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-800 text-blue-800 dark:text-blue-400',
    };
    return styles[type] || styles.info;
  };

  const getTypeIcon = (type) => {
    const icons = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      info: 'ℹ️',
    };
    return icons[type] || '📢';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Notifications
      </h3>

      {notifications && notifications.length > 0 ? (
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {notifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start p-3 rounded-lg border ${getTypeStyles(notification.type)}`}
            >
              <span className="text-xl mr-3">{getTypeIcon(notification.type)}</span>
              <div className="flex-1">
                <p className="text-sm">{notification.message}</p>
                {notification.time && (
                  <p className="text-xs opacity-75 mt-1">
                    {notification.time}
                  </p>
                )}
              </div>
            </div>
          ))}
          {notifications.length > 5 && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              +{notifications.length - 5} more notifications
            </p>
          )}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
          No new notifications
        </p>
      )}
    </div>
  );
};

export default NotificationWidget;