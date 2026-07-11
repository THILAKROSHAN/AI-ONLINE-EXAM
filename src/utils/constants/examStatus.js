// Exam Status Constants
export const EXAM_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

export const EXAM_STATUS_LABELS = {
  [EXAM_STATUS.DRAFT]: 'Draft',
  [EXAM_STATUS.SCHEDULED]: 'Scheduled',
  [EXAM_STATUS.ONGOING]: 'Ongoing',
  [EXAM_STATUS.COMPLETED]: 'Completed',
  [EXAM_STATUS.ARCHIVED]: 'Archived',
};

export const EXAM_STATUS_COLORS = {
  [EXAM_STATUS.DRAFT]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  [EXAM_STATUS.SCHEDULED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [EXAM_STATUS.ONGOING]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [EXAM_STATUS.COMPLETED]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [EXAM_STATUS.ARCHIVED]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

export const EXAM_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

export const EXAM_LEVEL_LABELS = {
  [EXAM_LEVELS.EASY]: 'Easy',
  [EXAM_LEVELS.MEDIUM]: 'Medium',
  [EXAM_LEVELS.HARD]: 'Hard',
};

export const EXAM_LEVEL_COLORS = {
  [EXAM_LEVELS.EASY]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [EXAM_LEVELS.MEDIUM]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [EXAM_LEVELS.HARD]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export const EXAM_ATTEMPT_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  COMPLETED: 'completed',
  AUTO_SUBMITTED: 'auto_submitted',
};

export const EXAM_ATTEMPT_STATUS_LABELS = {
  [EXAM_ATTEMPT_STATUS.NOT_STARTED]: 'Not Started',
  [EXAM_ATTEMPT_STATUS.IN_PROGRESS]: 'In Progress',
  [EXAM_ATTEMPT_STATUS.SUBMITTED]: 'Submitted',
  [EXAM_ATTEMPT_STATUS.COMPLETED]: 'Completed',
  [EXAM_ATTEMPT_STATUS.AUTO_SUBMITTED]: 'Auto-Submitted',
};

export const EXAM_ATTEMPT_STATUS_COLORS = {
  [EXAM_ATTEMPT_STATUS.NOT_STARTED]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  [EXAM_ATTEMPT_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [EXAM_ATTEMPT_STATUS.SUBMITTED]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [EXAM_ATTEMPT_STATUS.COMPLETED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [EXAM_ATTEMPT_STATUS.AUTO_SUBMITTED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};