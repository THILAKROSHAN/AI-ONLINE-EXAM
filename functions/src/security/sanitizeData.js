// Data Sanitization
exports.sanitizeInput = (input) => {
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

exports.sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  const result = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === 'string') {
        result[key] = exports.sanitizeInput(value);
      } else if (typeof value === 'object' && value !== null) {
        result[key] = exports.sanitizeObject(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
};

exports.isXSSAttempt = (input) => {
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

exports.isSQLInjectionAttempt = (input) => {
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

exports.sanitizeEmail = (email) => {
  if (!email) return '';
  return email.trim().toLowerCase();
};

exports.sanitizePhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/[^0-9+\-]/g, '');
};

exports.sanitizeName = (name) => {
  if (!name) return '';
  return name.trim().replace(/\s+/g, ' ');
};

exports.sanitizeUrl = (url) => {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    return parsed.toString();
  } catch {
    return '';
  }
};

module.exports = exports;