import React from 'react';

const Radio = ({
  name,
  label,
  value,
  selectedValue,
  onChange,
  required = false,
  disabled = false,
  error,
  className = '',
  ...props
}) => {
  const isChecked = value === selectedValue;

  return (
    <div className="flex items-center">
      <input
        type="radio"
        id={`${name}-${value}`}
        name={name}
        value={value}
        checked={isChecked}
        onChange={onChange}
        disabled={disabled}
        className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 ${className}`}
        required={required}
        {...props}
      />
      {label && (
        <label htmlFor={`${name}-${value}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default Radio;