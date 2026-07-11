// Question Validation
exports.validateQuestion = (questionData) => {
  const errors = [];

  if (!questionData.text || questionData.text.trim().length < 5) {
    errors.push('Question text must be at least 5 characters');
  }

  if (!questionData.type) {
    errors.push('Question type is required');
  }

  if (!questionData.difficulty) {
    errors.push('Difficulty level is required');
  }

  if (!questionData.correctAnswer) {
    errors.push('Correct answer is required');
  }

  if (questionData.type === 'mcq') {
    if (!questionData.options || questionData.options.length < 2) {
      errors.push('MCQ requires at least 2 options');
    }
    if (questionData.options && questionData.options.some(opt => !opt || opt.trim() === '')) {
      errors.push('All options must have text');
    }
    if (!questionData.options?.includes(questionData.correctAnswer)) {
      errors.push('Correct answer must be one of the options');
    }
  }

  if (questionData.type === 'true_false') {
    if (!['true', 'false'].includes(questionData.correctAnswer?.toLowerCase())) {
      errors.push('Correct answer must be "true" or "false"');
    }
  }

  if (questionData.marks !== undefined && (questionData.marks < 0.5 || questionData.marks > 100)) {
    errors.push('Marks must be between 0.5 and 100');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = exports;