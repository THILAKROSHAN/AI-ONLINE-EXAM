// Encryption Utility
export const encryptText = (text, salt = 'default-salt') => {
  try {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const saltChar = salt.charCodeAt(i % salt.length);
      result += String.fromCharCode(charCode ^ saltChar);
    }
    return btoa(result);
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

export const decryptText = (encryptedText, salt = 'default-salt') => {
  try {
    const decoded = atob(encryptedText);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i);
      const saltChar = salt.charCodeAt(i % salt.length);
      result += String.fromCharCode(charCode ^ saltChar);
    }
    return result;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

export const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const hashText = async (text) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const generateToken = (length = 32) => {
  return generateRandomString(length);
};

export const obfuscateEmail = (email) => {
  if (!email) return '';
  const [localPart, domain] = email.split('@');
  if (!domain) return email;
  const localLength = localPart.length;
  const visible = Math.min(2, Math.floor(localLength / 2));
  const obfuscated = localPart.slice(0, visible) + '*'.repeat(localLength - visible * 2) + localPart.slice(-visible);
  return `${obfuscated}@${domain}`;
};

export const obfuscatePhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return phone;
  const visible = 4;
  return '*'.repeat(cleaned.length - visible) + cleaned.slice(-visible);
};

export const maskString = (str, start = 0, end = 0, maskChar = '*') => {
  if (!str) return '';
  if (start >= str.length) return str;
  const maskLength = str.length - start - end;
  if (maskLength <= 0) return str;
  return str.slice(0, start) + maskChar.repeat(maskLength) + str.slice(-end || undefined);
};

export const isValidHash = (text, hash) => {
  // This is a simple comparison - in production, use a proper hash comparison
  return hashText(text) === hash;
};

export default {
  encryptText,
  decryptText,
  generateRandomString,
  hashText,
  generateToken,
  obfuscateEmail,
  obfuscatePhone,
  maskString,
  isValidHash,
};