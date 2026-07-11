import { validateRequired, validateMinLength, validateNumber } from '../../services/utils/validators';

export const validateQuestion = (data) => {
  const errors = {};

  const textError = validateRequired(data.text, 'Question text');
  if (textError) errors.text = textError;
  else {
    const minLengthError = validateMinLength(data.text, 5, 'Question text');
    if (minLengthError) errors.text = minLengthError;
  }

  const typeError = validateRequired(data.type, 'Question type');
  if (typeError) errors.type = typeError;

  const difficultyError = validateRequired(data.difficulty, 'Difficulty');
  if (difficultyError) errors.difficulty = difficultyError;

  const correctAnswerError = validateRequired(data.correctAnswer, 'Correct answer');
  if (correctAnswerError) errors.correctAnswer = correctAnswerError;

  if (data.type === 'mcq') {
    if (!data.options || data.options.length < 2) {
      errors.options = 'MCQ requires at least 2 options';
    } else if (data.options.some(opt => !opt || opt.trim() === '')) {
      errors.options = 'All options must have text';
    }
    if (!data.options?.includes(data.correctAnswer)) {
      errors.correctAnswer = 'Correct answer must be one of the options';
    }
  }

  if (data.type === 'true_false') {
    if (!['true', 'false'].includes(data.correctAnswer?.toLowerCase())) {
      errors.correctAnswer = 'Correct answer must be "true" or "false"';
    }
  }

  if (data.marks !== undefined) {
    const marksError = validateNumber(data.marks, 0.5, 100, 'Marks');
    if (marksError) errors.marks = marksError;
  }

  if (data.negativeMarks !== undefined) {
    const negativeError = validateNumber(data.negativeMarks, 0, 10, 'Negative marks');
    if (negativeError) errors.negativeMarks = negativeError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateQuestionsBulk = (questions) => {
  const errors = [];
  const validQuestions = [];

  questions.forEach((question, index) => {
    const result = validateQuestion(question);
    if (result.isValid) {
      validQuestions.push(question);
    } else {
      errors.push({
        index,
        errors: result.errors,
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    validQuestions,
  };
};

export const validateQuestionImport = (data) => {
  const errors = [];
  const validRows = [];

  data.forEach((row, index) => {
    const rowErrors = [];

    if (!row.text || row.text.trim().length < 5) {
      rowErrors.push('Question text must be at least 5 characters');
    }

    if (!row.type) {
      rowErrors.push('Question type is required');
    }

    if (!row.difficulty) {
      rowErrors.push('Difficulty is required');
    }

    if (!row.correctAnswer) {
      rowErrors.push('Correct answer is required');
    }

    if (row.type === 'mcq') {
      const options = [row.option1, row.option2, row.option3, row.option4].filter(Boolean);
      if (options.length < 2) {
        rowErrors.push('MCQ requires at least 2 options');
      }
      if (!options.includes(row.correctAnswer)) {
        rowErrors.push('Correct answer must be one of the options');
      }
    }

    if (row.type === 'true_false') {
      if (!['true', 'false'].includes(row.correctAnswer?.toLowerCase())) {
        rowErrors.push('Correct answer must be "true" or "false"');
      }
    }

    if (rowErrors.length > 0) {
      errors.push({
        row: index + 1,
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
  };
};

export default {
  validateQuestion,
  validateQuestionsBulk,
  validateQuestionImport,
};