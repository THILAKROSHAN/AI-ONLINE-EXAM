import React from 'react';

const Input = ({
  type = 'text',
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
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
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
        required={required}
        {...props}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default Input;