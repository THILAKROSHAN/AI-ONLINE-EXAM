// Firebase Cloud Functions Service
import { getFunctions, httpsCallable } from 'firebase/functions';
import { functions } from './config';

export const callFunction = async (functionName, data = {}) => {
  try {
    const functionRef = httpsCallable(functions, functionName);
    const result = await functionRef(data);
    return { success: true, data: result.data };
  } catch (error) {
    console.error(`❌ Error calling function ${functionName}:`, error);
    return { 
      success: false, 
      error: error.message,
      code: error.code,
      details: error.details,
    };
  }
};

// Email Functions
export const sendStudentCredentials = async (studentId, email, password, organizationId) => {
  return await callFunction('sendStudentCredentials', {
    studentId,
    email,
    password,
    organizationId,
  });
};

export const sendExamReminder = async (examId, studentIds) => {
  return await callFunction('sendExamReminder', { examId, studentIds });
};

export const sendResultNotification = async (resultId, studentId, examId) => {
  return await callFunction('sendResultNotification', { resultId, studentId, examId });
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  return await callFunction('sendPasswordResetEmail', { email, resetLink });
};

// Student Functions
export const generateStudentId = async (organizationId) => {
  return await callFunction('generateStudentId', { organizationId });
};

export const generateSecurePassword = async () => {
  return await callFunction('generateSecurePassword');
};

export const createStudentAccount = async (studentData) => {
  return await callFunction('createStudentAccount', studentData);
};

export const importStudentsFromExcel = async (fileUrl, organizationId) => {
  return await callFunction('importStudentsFromExcel', { fileUrl, organizationId });
};

export const exportStudentsToExcel = async (organizationId, filters = {}) => {
  return await callFunction('exportStudentsToExcel', { organizationId, filters });
};

// Exam Functions
export const autoSubmitExam = async (examAttemptId) => {
  return await callFunction('autoSubmitExam', { examAttemptId });
};

export const evaluateExamResults = async (examAttemptId) => {
  return await callFunction('evaluateExamResults', { examAttemptId });
};

export const publishExamResults = async (examId, studentIds) => {
  return await callFunction('publishExamResults', { examId, studentIds });
};

// Report Functions
export const generateStudentReport = async (studentId, organizationId) => {
  return await callFunction('generateStudentReport', { studentId, organizationId });
};

export const generateExamReport = async (examId, organizationId) => {
  return await callFunction('generateExamReport', { examId, organizationId });
};

export const generateOrganizationReport = async (organizationId, dateRange) => {
  return await callFunction('generateOrganizationReport', { organizationId, dateRange });
};

// Import/Export Functions
export const importQuestions = async (fileUrl, organizationId) => {
  return await callFunction('importQuestions', { fileUrl, organizationId });
};

export const exportQuestions = async (organizationId, filters = {}) => {
  return await callFunction('exportQuestions', { organizationId, filters });
};

export { functions };