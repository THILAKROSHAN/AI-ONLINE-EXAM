import React from 'react';

const TableRow = ({ children, onClick, className = '', hoverable = true }) => {
  return (
    <tr
      className={`${hoverable ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

export default TableRow;