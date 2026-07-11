import React from 'react';

const StatusBadge = ({ status, label, className = '' }) => {
  const statusConfig = {
    active: { label: 'Active', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    inactive: { label: 'Inactive', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    approved: { label: 'Approved', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
    published: { label: 'Published', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    archived: { label: 'Archived', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    failed: { label: 'Failed', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  };

  const config = statusConfig[status] || { label: label || status, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${config.color} ${className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;