// String Helpers
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeAll = (str) => {
  if (!str) return '';
  return str.split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

export const toCamelCase = (str) => {
  if (!str) return '';
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

export const toSnakeCase = (str) => {
  if (!str) return '';
  return str
    .replace(/\s+/g, '_')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase();
};

export const toKebabCase = (str) => {
  if (!str) return '';
  return str
    .replace(/\s+/g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
};

export const truncate = (str, maxLength = 100, suffix = '...') => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + suffix;
};

export const truncateMiddle = (str, maxLength = 100, suffix = '...') => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  const half = Math.floor((maxLength - suffix.length) / 2);
  return str.substring(0, half) + suffix + str.substring(str.length - half);
};

export const removeWhitespace = (str) => {
  if (!str) return '';
  return str.replace(/\s/g, '');
};

export const removeSpecialChars = (str) => {
  if (!str) return '';
  return str.replace(/[^a-zA-Z0-9\s]/g, '');
};

export const countWords = (str) => {
  if (!str) return 0;
  return str.trim().split(/\s+/).length;
};

export const countSentences = (str) => {
  if (!str) return 0;
  return str.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
};

export const extractEmails = (str) => {
  if (!str) return [];
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  return str.match(emailRegex) || [];
};

export const extractUrls = (str) => {
  if (!str) return [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return str.match(urlRegex) || [];
};

export const extractHashtags = (str) => {
  if (!str) return [];
  const hashtagRegex = /#\w+/g;
  return str.match(hashtagRegex) || [];
};

export const extractMentions = (str) => {
  if (!str) return [];
  const mentionRegex = /@\w+/g;
  return str.match(mentionRegex) || [];
};

export const isEmail = (str) => {
  if (!str) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
};

export const isUrl = (str) => {
  if (!str) return false;
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

export const isPhoneNumber = (str) => {
  if (!str) return false;
  const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
  return phoneRegex.test(str);
};

export default {
  capitalize,
  capitalizeAll,
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  truncate,
  truncateMiddle,
  removeWhitespace,
  removeSpecialChars,
  countWords,
  countSentences,
  extractEmails,
  extractUrls,
  extractHashtags,
  extractMentions,
  isEmail,
  isUrl,
  isPhoneNumber,
};