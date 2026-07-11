import React, { useRef } from 'react';

const FileUpload = ({
  name,
  label,
  onFileSelect,
  accept = 'image/*',
  multiple = false,
  required = false,
  disabled = false,
  error,
  className = '',
  ...props
}) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(multiple ? files : files[0]);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div
        onClick={handleClick}
        className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors ${className}`}
      >
        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Click or drag to upload
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {accept.split(',').join(', ')}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
          required={required}
          {...props}
        />
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default FileUpload;