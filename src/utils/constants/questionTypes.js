// Question Types Constants
export const QUESTION_TYPES = {
  MCQ: 'mcq',
  TRUE_FALSE: 'true_false',
  FILL_BLANK: 'fill_blank',
  DESCRIPTIVE: 'descriptive',
  PARAGRAPH: 'paragraph',
};

export const QUESTION_TYPE_LABELS = {
  [QUESTION_TYPES.MCQ]: 'Multiple Choice',
  [QUESTION_TYPES.TRUE_FALSE]: 'True/False',
  [QUESTION_TYPES.FILL_BLANK]: 'Fill in the Blank',
  [QUESTION_TYPES.DESCRIPTIVE]: 'Descriptive',
  [QUESTION_TYPES.PARAGRAPH]: 'Paragraph',
};

export const QUESTION_TYPE_COLORS = {
  [QUESTION_TYPES.MCQ]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [QUESTION_TYPES.TRUE_FALSE]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [QUESTION_TYPES.FILL_BLANK]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [QUESTION_TYPES.DESCRIPTIVE]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [QUESTION_TYPES.PARAGRAPH]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

export const QUESTION_DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

export const QUESTION_DIFFICULTY_LABELS = {
  [QUESTION_DIFFICULTIES.EASY]: 'Easy',
  [QUESTION_DIFFICULTIES.MEDIUM]: 'Medium',
  [QUESTION_DIFFICULTIES.HARD]: 'Hard',
};

export const QUESTION_DIFFICULTY_COLORS = {
  [QUESTION_DIFFICULTIES.EASY]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [QUESTION_DIFFICULTIES.MEDIUM]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [QUESTION_DIFFICULTIES.HARD]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export const QUESTION_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

export const QUESTION_STATUS_LABELS = {
  [QUESTION_STATUS.DRAFT]: 'Draft',
  [QUESTION_STATUS.PUBLISHED]: 'Published',
  [QUESTION_STATUS.ARCHIVED]: 'Archived',
};

export const QUESTION_STATUS_COLORS = {
  [QUESTION_STATUS.DRAFT]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  [QUESTION_STATUS.PUBLISHED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [QUESTION_STATUS.ARCHIVED]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};