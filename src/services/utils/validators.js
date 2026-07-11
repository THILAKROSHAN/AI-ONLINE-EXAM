// Validators Utility
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
  return phoneRegex.test(phone);
};

export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

export const isValidNumber = (value) => {
  return !isNaN(value) && value !== null && value !== undefined;
};

export const isValidString = (value, minLength = 0, maxLength = Infinity) => {
  if (!value || typeof value !== 'string') return false;
  return value.length >= minLength && value.length <= maxLength;
};

export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!isValidEmail(email)) return 'Invalid email format';
  return null;
};

export const validatePhone = (phone) => {
  if (phone && !isValidPhone(phone)) return 'Invalid phone number';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};

export const validateRequired = (value, fieldName = 'Field') => {
  if (!isRequired(value)) return `${fieldName} is required`;
  return null;
};

export const validateMinLength = (value, minLength, fieldName = 'Field') => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  return null;
};

export const validateMaxLength = (value, maxLength, fieldName = 'Field') => {
  if (value && value.length > maxLength) {
    return `${fieldName} must be at most ${maxLength} characters`;
  }
  return null;
};

export const validateNumber = (value, min = null, max = null, fieldName = 'Field') => {
  if (!isValidNumber(value)) return `${fieldName} must be a number`;
  if (min !== null && value < min) return `${fieldName} must be at least ${min}`;
  if (max !== null && value > max) return `${fieldName} must be at most ${max}`;
  return null;
};

export default {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidUrl,
  isValidDate,
  isValidNumber,
  isValidString,
  isRequired,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumber,
};