import React from 'react';

const TextArea = ({
  name,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  disabled = false,
  error,
  className = '',
  ...props
}) => {
  const textareaClasses = `input-field ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={textareaClasses}
        required={required}
        {...props}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default TextArea;