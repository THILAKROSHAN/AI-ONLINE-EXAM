import React from 'react';
import Button from './Button';

const ActionButton = ({
  label,
  icon,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  className = '',
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      className={className}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </Button>
  );
};

export default ActionButton;