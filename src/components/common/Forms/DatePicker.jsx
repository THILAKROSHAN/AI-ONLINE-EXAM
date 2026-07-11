import React from 'react';

const DatePicker = ({
  name,
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  min,
  max,
  className = '',
  ...props
}) => {
  const inputClasses = `input-field ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={inputClasses}
        required={required}
        min={min}
        max={max}
        {...props}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default DatePicker;