// Subject Constants
export const SUBJECT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

export const SUBJECT_STATUS_LABELS = {
  [SUBJECT_STATUS.DRAFT]: 'Draft',
  [SUBJECT_STATUS.PUBLISHED]: 'Published',
  [SUBJECT_STATUS.ARCHIVED]: 'Archived',
};

export const SUBJECT_STATUS_COLORS = {
  [SUBJECT_STATUS.DRAFT]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  [SUBJECT_STATUS.PUBLISHED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [SUBJECT_STATUS.ARCHIVED]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

export const DEPARTMENTS = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Engineering',
  'Business Administration',
  'Economics',
  'Psychology',
  'Sociology',
  'Political Science',
  'History',
  'English Literature',
  'Arts',
  'Music',
  'Physical Education',
  'Other',
];

export const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const YEARS = ['1', '2', '3', '4', '5'];

export const CREDIT_RANGES = {
  min: 1,
  max: 6,
};

export const SUBJECT_TYPES = {
  CORE: 'core',
  ELECTIVE: 'elective',
  LABORATORY: 'laboratory',
  PROJECT: 'project',
  INTERNSHIP: 'internship',
};

export const SUBJECT_TYPE_LABELS = {
  [SUBJECT_TYPES.CORE]: 'Core',
  [SUBJECT_TYPES.ELECTIVE]: 'Elective',
  [SUBJECT_TYPES.LABORATORY]: 'Laboratory',
  [SUBJECT_TYPES.PROJECT]: 'Project',
  [SUBJECT_TYPES.INTERNSHIP]: 'Internship',
};

export const SUBJECT_TYPE_COLORS = {
  [SUBJECT_TYPES.CORE]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [SUBJECT_TYPES.ELECTIVE]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [SUBJECT_TYPES.LABORATORY]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [SUBJECT_TYPES.PROJECT]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  [SUBJECT_TYPES.INTERNSHIP]: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
};