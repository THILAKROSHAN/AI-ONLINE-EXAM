// Student Validation
exports.validateStudent = (studentData) => {
  const errors = [];

  if (!studentData.name || studentData.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!studentData.email) {
    errors.push('Email is required');
  } else if (!isValidEmail(studentData.email)) {
    errors.push('Invalid email format');
  }

  if (studentData.phone && !isValidPhone(studentData.phone)) {
    errors.push('Invalid phone number');
  }

  if (studentData.dateOfBirth) {
    const dob = new Date(studentData.dateOfBirth);
    const age = new Date().getFullYear() - dob.getFullYear();
    if (age < 5 || age > 100) {
      errors.push('Invalid date of birth');
    }
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

module.exports = exports;