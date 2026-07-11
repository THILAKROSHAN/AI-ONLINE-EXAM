// Organization Validation
exports.validateOrganization = (orgData) => {
  const errors = [];

  if (!orgData.name || orgData.name.trim().length < 2) {
    errors.push('Organization name must be at least 2 characters');
  }

  if (!orgData.email) {
    errors.push('Email is required');
  } else if (!isValidEmail(orgData.email)) {
    errors.push('Invalid email format');
  }

  if (orgData.phone && !isValidPhone(orgData.phone)) {
    errors.push('Invalid phone number');
  }

  if (orgData.website && !isValidUrl(orgData.website)) {
    errors.push('Invalid website URL');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
  return phoneRegex.test(phone);
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

module.exports = exports;