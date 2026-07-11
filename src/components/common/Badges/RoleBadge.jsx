import React from 'react';
import { ROLE_COLORS, ROLE_LABELS } from '../../../utils/constants/roles';

const RoleBadge = ({ role, className = '' }) => {
  const color = ROLE_COLORS[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  const label = ROLE_LABELS[role] || role;

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${color} ${className}`}>
      {label}
    </span>
  );
};

export default RoleBadge;