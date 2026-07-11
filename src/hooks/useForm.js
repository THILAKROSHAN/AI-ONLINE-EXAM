import { useState, useCallback, useMemo } from 'react';

export const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback((fieldValues = null) => {
    const fieldsToValidate = fieldValues || values;
    const newErrors = {};

    Object.entries(validationRules).forEach(([field, rules]) => {
      const value = fieldsToValidate[field];
      const fieldErrors = [];

      if (rules.required && (!value || value.trim() === '')) {
        fieldErrors.push(`${field} is required`);
      }

      if (rules.minLength && value && value.length < rules.minLength) {
        fieldErrors.push(`${field} must be at least ${rules.minLength} characters`);
      }

      if (rules.maxLength && value && value.length > rules.maxLength) {
        fieldErrors.push(`${field} must be at most ${rules.maxLength} characters`);
      }

      if (rules.pattern && value && !rules.pattern.test(value)) {
        fieldErrors.push(rules.message || `${field} is invalid`);
      }

      if (rules.custom && typeof rules.custom === 'function') {
        const customError = rules.custom(value, values);
        if (customError) {
          fieldErrors.push(customError);
        }
      }

      if (fieldErrors.length > 0) {
        newErrors[field] = fieldErrors;
      }
    });

    if (fieldValues) {
      return newErrors;
    }

    setErrors(newErrors);
    return newErrors;
  }, [values, validationRules]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({ ...prev, [name]: val }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate on blur
    const fieldErrors = validate({ [name]: values[name] });
    if (fieldErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }
  }, [values, validate]);

  const handleSubmit = useCallback(async (onSubmit) => {
    const validationErrors = validate();
    const hasErrors = Object.keys(validationErrors).length > 0;

    if (hasErrors) {
      setErrors(validationErrors);
      return false;
    }

    setIsSubmitting(true);
    try {
      const result = await onSubmit(values);
      return result;
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate]);

  const setFieldValue = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const setFieldError = useCallback((field, error) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0 && Object.keys(values).length > 0;
  }, [errors, values]);

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    validate,
  };
};

export default useForm;