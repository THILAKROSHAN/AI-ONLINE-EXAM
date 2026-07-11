import React from 'react';

const Checkbox = ({
  name,
  label,
  checked,
  onChange,
  required = false,
  disabled = false,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${className}`}
          required={required}
          {...props}
        />
      </div>
      {label && (
        <label htmlFor={name} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default Checkbox;