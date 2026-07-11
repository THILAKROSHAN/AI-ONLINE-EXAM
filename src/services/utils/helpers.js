// Helpers Utility
export const debounce = (fn, delay = 500) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = (fn, limit = 500) => {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return { success: true };
  } catch (error) {
    console.error('Copy to clipboard error:', error);
    return { success: false, error: error.message };
  }
};

export const downloadFile = (content, filename, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateId = (prefix = 'id') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
};

export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

export const getNestedValue = (obj, path, defaultValue = null) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : defaultValue;
  }, obj);
};

export const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
  return obj;
};

export const isObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

export const isArray = (value) => {
  return Array.isArray(value);
};

export const isFunction = (value) => {
  return typeof value === 'function';
};

export const isString = (value) => {
  return typeof value === 'string';
};

export const isNumber = (value) => {
  return typeof value === 'number' && !isNaN(value);
};

export const isBoolean = (value) => {
  return typeof value === 'boolean';
};

export default {
  debounce,
  throttle,
  sleep,
  copyToClipboard,
  downloadFile,
  formatFileSize,
  truncateText,
  generateId,
  deepClone,
  isEmpty,
  getNestedValue,
  setNestedValue,
  isObject,
  isArray,
  isFunction,
  isString,
  isNumber,
  isBoolean,
};