// Security Utility
export const sanitizeInput = (input) => {
  if (!input) return '';
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const result = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'string') {
        result[key] = sanitizeInput(value);
      } else if (typeof value === 'object' && value !== null) {
        result[key] = sanitizeObject(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
};

export const validateEmailDomain = (email, allowedDomains = []) => {
  if (!email) return false;
  const domain = email.split('@')[1];
  if (!domain) return false;
  if (allowedDomains.length === 0) return true;
  return allowedDomains.includes(domain);
};

export const validatePasswordStrength = (password) => {
  if (!password) {
    return { score: 0, strength: 'weak', message: 'Password is required' };
  }

  let score = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password),
  };

  score += checks.length ? 1 : 0;
  score += checks.uppercase ? 1 : 0;
  score += checks.lowercase ? 1 : 0;
  score += checks.numbers ? 1 : 0;
  score += checks.special ? 1 : 0;

  let strength = 'weak';
  let message = 'Weak password';
  
  if (score >= 4) {
    strength = 'strong';
    message = 'Strong password';
  } else if (score >= 3) {
    strength = 'medium';
    message = 'Medium strength password';
  }

  return {
    score,
    strength,
    message,
    checks,
  };
};

export const isXSSAttempt = (input) => {
  if (!input) return false;
  const patterns = [
    /<script/i,
    /javascript:/i,
    /onerror/i,
    /onload/i,
    /onclick/i,
    /onmouseover/i,
    /eval\(/i,
    /document\./i,
    /window\./i,
    /alert\(/i,
    /confirm\(/i,
    /prompt\(/i,
  ];
  return patterns.some(pattern => pattern.test(input));
};

export const isSQLInjectionAttempt = (input) => {
  if (!input) return false;
  const patterns = [
    /SELECT.*FROM/i,
    /INSERT.*INTO/i,
    /UPDATE.*SET/i,
    /DELETE.*FROM/i,
    /DROP.*TABLE/i,
    /ALTER.*TABLE/i,
    /UNION.*SELECT/i,
    /--/,
    /;/,
    /' OR '1'='1/i,
    /' OR 1=1/i,
  ];
  return patterns.some(pattern => pattern.test(input));
};

export const validateFileType = (file, allowedTypes) => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file, maxSize) => {
  if (!file) return false;
  return file.size <= maxSize;
};

export const validateImageDimensions = (file, maxWidth, maxHeight) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve(false);
      return;
    }
    const img = new Image();
    img.onload = () => {
      resolve(img.width <= maxWidth && img.height <= maxHeight);
    };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
};

export const generateCSRFToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const validateCSRFToken = (token, storedToken) => {
  return token === storedToken;
};

export default {
  sanitizeInput,
  sanitizeObject,
  validateEmailDomain,
  validatePasswordStrength,
  isXSSAttempt,
  isSQLInjectionAttempt,
  validateFileType,
  validateFileSize,
  validateImageDimensions,
  generateCSRFToken,
  validateCSRFToken,
};