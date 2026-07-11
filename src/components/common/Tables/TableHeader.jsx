import React from 'react';

const TableHeader = ({ children, className = '' }) => {
  return (
    <thead className={`bg-gray-50 dark:bg-gray-700/50 ${className}`}>
      <tr>
        {children}
      </tr>
    </thead>
  );
};

export default TableHeader;