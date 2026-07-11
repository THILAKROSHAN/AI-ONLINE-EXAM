// Exam Validation
const admin = require('firebase-admin');

exports.validateExam = (examData) => {
  const errors = [];

  if (!examData.title || examData.title.trim().length < 3) {
    errors.push('Exam title must be at least 3 characters');
  }

  if (examData.duration && (examData.duration < 1 || examData.duration > 999)) {
    errors.push('Duration must be between 1 and 999 minutes');
  }

  if (examData.passingMarks !== undefined && (examData.passingMarks < 0 || examData.passingMarks > 100)) {
    errors.push('Passing marks must be between 0 and 100');
  }

  if (examData.negativeMarking && examData.negativeMarkValue !== undefined) {
    if (examData.negativeMarkValue < 0 || examData.negativeMarkValue > 10) {
      errors.push('Negative mark value must be between 0 and 10');
    }
  }

  if (examData.questionIds && examData.questionIds.length === 0) {
    errors.push('At least one question is required');
  }

  if (examData.assignedStudents && examData.assignedStudents.length === 0) {
    errors.push('At least one student must be assigned');
  }

  if (examData.startDate && examData.endDate) {
    const start = new Date(examData.startDate);
    const end = new Date(examData.endDate);
    if (start >= end) {
      errors.push('End date must be after start date');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = exports;