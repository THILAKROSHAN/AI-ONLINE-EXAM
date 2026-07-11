import {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  validateRequired,
  validateMinLength,
  validateMaxLength,
} from '../../services/utils/validators';

export const validateLogin = (data) => {
  const errors = {};

  const emailError = validateRequired(data.email, 'Email');
  if (emailError) errors.email = emailError;
  else if (!isValidEmail(data.email)) errors.email = 'Invalid email format';

  const passwordError = validateRequired(data.password, 'Password');
  if (passwordError) errors.password = passwordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegister = (data) => {
  const errors = {};

  const nameError = validateRequired(data.name, 'Name');
  if (nameError) errors.name = nameError;
  else {
    const minLengthError = validateMinLength(data.name, 2, 'Name');
    if (minLengthError) errors.name = minLengthError;
  }

  const emailError = validateRequired(data.email, 'Email');
  if (emailError) errors.email = emailError;
  else if (!isValidEmail(data.email)) errors.email = 'Invalid email format';

  const passwordError = validateRequired(data.password, 'Password');
  if (passwordError) errors.password = passwordError;
  else if (!isValidPassword(data.password)) errors.password = 'Password must be at least 6 characters';

  if (data.confirmPassword && data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = 'Invalid phone number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateResetPassword = (data) => {
  const errors = {};

  const passwordError = validateRequired(data.password, 'Password');
  if (passwordError) errors.password = passwordError;
  else if (!isValidPassword(data.password)) errors.password = 'Password must be at least 6 characters';

  if (data.confirmPassword && data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateChangePassword = (data) => {
  const errors = {};

  const currentPasswordError = validateRequired(data.currentPassword, 'Current password');
  if (currentPasswordError) errors.currentPassword = currentPasswordError;

  const newPasswordError = validateRequired(data.newPassword, 'New password');
  if (newPasswordError) errors.newPassword = newPasswordError;
  else if (!isValidPassword(data.newPassword)) errors.newPassword = 'Password must be at least 6 characters';

  if (data.confirmPassword && data.newPassword !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateForgotPassword = (data) => {
  const errors = {};

  const emailError = validateRequired(data.email, 'Email');
  if (emailError) errors.email = emailError;
  else if (!isValidEmail(data.email)) errors.email = 'Invalid email format';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateLogin,
  validateRegister,
  validateResetPassword,
  validateChangePassword,
  validateForgotPassword,
};