// Student Validators
export const validateStudent = (studentData) => {
  const errors = {};

  // Name validation
  if (!studentData.name || studentData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Email validation
  if (!studentData.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentData.email)) {
    errors.email = 'Invalid email format';
  }

  // Phone validation (optional)
  if (studentData.phone && !/^[0-9+\-\s()]{10,15}$/.test(studentData.phone)) {
    errors.phone = 'Invalid phone number';
  }

  // Password validation (for new students)
  if (studentData.password) {
    if (studentData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (studentData.password !== studentData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }

  // Date of birth validation
  if (studentData.dateOfBirth) {
    const dob = new Date(studentData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (age < 5 || age > 100) {
      errors.dateOfBirth = 'Invalid date of birth';
    }
  }

  // Department validation (if provided)
  if (studentData.department && studentData.department.length < 2) {
    errors.department = 'Department must be at least 2 characters';
  }

  // Semester validation (if provided)
  if (studentData.semester) {
    const semester = parseInt(studentData.semester);
    if (isNaN(semester) || semester < 1 || semester > 12) {
      errors.semester = 'Semester must be between 1 and 12';
    }
  }

  // Year validation (if provided)
  if (studentData.year) {
    const year = parseInt(studentData.year);
    if (isNaN(year) || year < 1 || year > 10) {
      errors.year = 'Year must be between 1 and 10';
    }
  }

  // Postal code validation (if provided)
  if (studentData.postalCode) {
    if (!/^[0-9]{5,10}$/.test(studentData.postalCode)) {
      errors.postalCode = 'Invalid postal code';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateStudentImport = (importData) => {
  const errors = [];
  const validRows = [];

  importData.forEach((row, index) => {
    const rowErrors = [];
    
    // Required fields
    if (!row.Name || row.Name.trim().length < 2) {
      rowErrors.push('Name is required and must be at least 2 characters');
    }
    
    if (!row.Email) {
      rowErrors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.Email)) {
      rowErrors.push('Invalid email format');
    }

    // Optional fields validation
    if (row.Phone && !/^[0-9+\-\s()]{10,15}$/.test(row.Phone)) {
      rowErrors.push('Invalid phone number');
    }

    if (row['Date of Birth']) {
      const dob = new Date(row['Date of Birth']);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (isNaN(dob.getTime()) || age < 5 || age > 100) {
        rowErrors.push('Invalid date of birth');
      }
    }

    if (row.Semester) {
      const semester = parseInt(row.Semester);
      if (isNaN(semester) || semester < 1 || semester > 12) {
        rowErrors.push('Semester must be between 1 and 12');
      }
    }

    if (row['Postal Code'] && !/^[0-9]{5,10}$/.test(row['Postal Code'])) {
      rowErrors.push('Invalid postal code');
    }

    if (rowErrors.length > 0) {
      errors.push({
        row: index + 2, // +2 for header and 0-index
        errors: rowErrors,
        data: row,
      });
    } else {
      validRows.push(row);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    validRows,
    totalRows: importData.length,
    validCount: validRows.length,
    errorCount: errors.length,
  };
};

export const formatStudentData = (studentData) => {
  return {
    name: studentData.Name?.trim() || '',
    email: studentData.Email?.trim() || '',
    phone: studentData.Phone?.trim() || '',
    department: studentData.Department?.trim() || '',
    semester: studentData.Semester?.toString() || '',
    year: studentData.Year?.toString() || '',
    course: studentData.Course?.trim() || '',
    batch: studentData.Batch?.trim() || '',
    rollNumber: studentData['Roll Number']?.trim() || '',
    dateOfBirth: studentData['Date of Birth'] || '',
    gender: studentData.Gender?.toLowerCase() || '',
    address: studentData.Address?.trim() || '',
    city: studentData.City?.trim() || '',
    state: studentData.State?.trim() || '',
    country: studentData.Country?.trim() || '',
    postalCode: studentData['Postal Code']?.trim() || '',
    parentName: studentData['Parent Name']?.trim() || '',
    parentPhone: studentData['Parent Phone']?.trim() || '',
    parentEmail: studentData['Parent Email']?.trim() || '',
  };
};

export const generateStudentCredentials = () => {
  const generateId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  return {
    studentId: `STU${generateId()}`,
    password: generatePassword(),
  };
};