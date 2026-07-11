// Validation Helpers
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

export const isEmail = (value) => {
  if (!value) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export const isPhone = (value) => {
  if (!value) return false;
  const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
  return phoneRegex.test(value);
};

export const isUrl = (value) => {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const isNumber = (value) => {
  if (value === null || value === undefined) return false;
  return !isNaN(value) && isFinite(value);
};

export const isInteger = (value) => {
  if (!isNumber(value)) return false;
  return Number.isInteger(Number(value));
};

export const isPositiveNumber = (value) => {
  if (!isNumber(value)) return false;
  return Number(value) > 0;
};

export const isNegativeNumber = (value) => {
  if (!isNumber(value)) return false;
  return Number(value) < 0;
};

export const isNonNegativeNumber = (value) => {
  if (!isNumber(value)) return false;
  return Number(value) >= 0;
};

export const isBetween = (value, min, max) => {
  if (!isNumber(value)) return false;
  const num = Number(value);
  return num >= min && num <= max;
};

export const isMinLength = (value, minLength) => {
  if (!value) return false;
  return String(value).length >= minLength;
};

export const isMaxLength = (value, maxLength) => {
  if (!value) return true;
  return String(value).length <= maxLength;
};

export const isExactLength = (value, length) => {
  if (!value) return false;
  return String(value).length === length;
};

export const isAlphanumeric = (value) => {
  if (!value) return false;
  return /^[a-zA-Z0-9]+$/.test(value);
};

export const isAlphabetic = (value) => {
  if (!value) return false;
  return /^[a-zA-Z]+$/.test(value);
};

export const isNumeric = (value) => {
  if (!value) return false;
  return /^[0-9]+$/.test(value);
};

export const isDate = (value) => {
  if (!value) return false;
  const date = new Date(value);
  return date instanceof Date && !isNaN(date);
};

export const isPastDate = (value) => {
  if (!isDate(value)) return false;
  return new Date(value) < new Date();
};

export const isFutureDate = (value) => {
  if (!isDate(value)) return false;
  return new Date(value) > new Date();
};

export const isToday = (value) => {
  if (!isDate(value)) return false;
  const date = new Date(value);
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

export const isInArray = (value, array) => {
  if (!array || !Array.isArray(array)) return false;
  return array.includes(value);
};

export const isUniqueInArray = (value, array) => {
  if (!array || !Array.isArray(array)) return true;
  return array.filter(item => item === value).length <= 1;
};

export const validateField = (value, rules = {}) => {
  const errors = [];

  if (rules.required && !isRequired(value)) {
    errors.push(rules.requiredMessage || 'This field is required');
  }

  if (rules.email && value && !isEmail(value)) {
    errors.push(rules.emailMessage || 'Invalid email format');
  }

  if (rules.phone && value && !isPhone(value)) {
    errors.push(rules.phoneMessage || 'Invalid phone number');
  }

  if (rules.url && value && !isUrl(value)) {
    errors.push(rules.urlMessage || 'Invalid URL format');
  }

  if (rules.number && value && !isNumber(value)) {
    errors.push(rules.numberMessage || 'Must be a number');
  }

  if (rules.min !== undefined && value && !isBetween(value, rules.min, Infinity)) {
    errors.push(rules.minMessage || `Must be at least ${rules.min}`);
  }

  if (rules.max !== undefined && value && !isBetween(value, -Infinity, rules.max)) {
    errors.push(rules.maxMessage || `Must be at most ${rules.max}`);
  }

  if (rules.minLength && value && !isMinLength(value, rules.minLength)) {
    errors.push(rules.minLengthMessage || `Must be at least ${rules.minLength} characters`);
  }

  if (rules.maxLength && value && !isMaxLength(value, rules.maxLength)) {
    errors.push(rules.maxLengthMessage || `Must be at most ${rules.maxLength} characters`);
  }

  if (rules.pattern && value && !rules.pattern.test(value)) {
    errors.push(rules.patternMessage || 'Invalid format');
  }

  if (rules.custom && typeof rules.custom === 'function') {
    const customError = rules.custom(value);
    if (customError) {
      errors.push(customError);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export default {
  isRequired,
  isEmail,
  isPhone,
  isUrl,
  isNumber,
  isInteger,
  isPositiveNumber,
  isNegativeNumber,
  isNonNegativeNumber,
  isBetween,
  isMinLength,
  isMaxLength,
  isExactLength,
  isAlphanumeric,
  isAlphabetic,
  isNumeric,
  isDate,
  isPastDate,
  isFutureDate,
  isToday,
  isInArray,
  isUniqueInArray,
  validateField,
};