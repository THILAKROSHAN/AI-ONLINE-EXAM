import { validateRequired, validateMinLength, validateNumber } from '../../services/utils/validators';

export const validateExam = (data) => {
  const errors = {};

  const titleError = validateRequired(data.title, 'Exam title');
  if (titleError) errors.title = titleError;
  else {
    const minLengthError = validateMinLength(data.title, 3, 'Exam title');
    if (minLengthError) errors.title = minLengthError;
  }

  if (data.description) {
    const minLengthError = validateMinLength(data.description, 10, 'Description');
    if (minLengthError) errors.description = minLengthError;
  }

  const durationError = validateNumber(data.duration, 1, 999, 'Duration');
  if (durationError) errors.duration = durationError;

  const passingMarksError = validateNumber(data.passingMarks, 0, 100, 'Passing marks');
  if (passingMarksError) errors.passingMarks = passingMarksError;

  if (data.negativeMarking && data.negativeMarkValue !== undefined) {
    const negativeMarksError = validateNumber(data.negativeMarkValue, 0, 10, 'Negative marks');
    if (negativeMarksError) errors.negativeMarkValue = negativeMarksError;
  }

  if (data.totalQuestions !== undefined) {
    const questionsError = validateNumber(data.totalQuestions, 1, 1000, 'Total questions');
    if (questionsError) errors.totalQuestions = questionsError;
  }

  if (data.questionIds && data.questionIds.length === 0) {
    errors.questionIds = 'At least one question is required';
  }

  if (data.assignedStudents && data.assignedStudents.length === 0) {
    errors.assignedStudents = 'At least one student must be assigned';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateExamSchedule = (data) => {
  const errors = {};

  if (!data.startDate) {
    errors.startDate = 'Start date is required';
  }

  if (!data.endDate) {
    errors.endDate = 'End date is required';
  }

  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (start >= end) {
      errors.endDate = 'End date must be after start date';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateExamAttempt = (data) => {
  const errors = {};

  if (!data.examId) {
    errors.examId = 'Exam ID is required';
  }

  if (!data.studentId) {
    errors.studentId = 'Student ID is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateExam,
  validateExamSchedule,
  validateExamAttempt,
};