import React from 'react';

const FormGroup = ({
  children,
  label,
  error,
  className = '',
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="label">{label}</label>
      )}
      {children}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default FormGroup;