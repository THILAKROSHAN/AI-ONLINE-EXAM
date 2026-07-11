// Constants Utility
export const APP_NAME = 'AI Examination Portal';
export const APP_VERSION = '1.0.0';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  STUDENTS: {
    BASE: '/api/students',
    IMPORT: '/api/students/import',
    EXPORT: '/api/students/export',
  },
  EXAMS: {
    BASE: '/api/exams',
    PUBLISH: '/api/exams/:id/publish',
    RESULTS: '/api/exams/:id/results',
  },
  QUESTIONS: {
    BASE: '/api/questions',
    IMPORT: '/api/questions/import',
    EXPORT: '/api/questions/export',
  },
  AI: {
    GENERATE: '/api/ai/generate',
    VALIDATE: '/api/ai/validate',
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  SESSION: 'session',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

export const MESSAGES = {
  ERRORS: {
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied.',
    NOT_FOUND: 'Resource not found.',
    SERVER: 'Server error. Please try again later.',
    VALIDATION: 'Please check your input and try again.',
    UNKNOWN: 'An unexpected error occurred.',
  },
  SUCCESS: {
    CREATED: 'Created successfully.',
    UPDATED: 'Updated successfully.',
    DELETED: 'Deleted successfully.',
    SAVED: 'Saved successfully.',
    SENT: 'Sent successfully.',
  },
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 25, 50, 100],
};

export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_TIME: 'MMM DD, YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_TIME: 'YYYY-MM-DDTHH:mm:ss',
  TIME: 'HH:mm',
};

export const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  SPREADSHEET: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
  ALLOWED_IMAGES: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'],
  ALLOWED_DOCUMENTS: ['.pdf', '.doc', '.docx'],
  ALLOWED_SPREADSHEETS: ['.xls', '.xlsx', '.csv'],
};

export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  SPREADSHEET: 10 * 1024 * 1024, // 10MB
  IMPORT: 20 * 1024 * 1024, // 20MB
};

export const ROUTES = {
  PUBLIC: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    UNAUTHORIZED: '/unauthorized',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    STUDENTS: '/admin/students',
    ADD_STUDENT: '/admin/students/add',
    SUBJECTS: '/admin/subjects',
    QUESTIONS: '/admin/questions',
    AI_GENERATOR: '/admin/ai-generator',
    EXAMS: '/admin/exams',
    RESULTS: '/admin/results',
    REPORTS: '/admin/reports',
    AUDIT: '/admin/audit',
    SETTINGS: '/admin/settings',
  },
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    EXAMS: '/student/exams',
    EXAM: '/student/exam/:id',
    RESULTS: '/student/results',
    PROFILE: '/student/profile',
    SETTINGS: '/student/settings',
  },
};

export default {
  APP_NAME,
  APP_VERSION,
  API_ENDPOINTS,
  STORAGE_KEYS,
  HTTP_STATUS,
  MESSAGES,
  PAGINATION,
  DATE_FORMATS,
  FILE_TYPES,
  FILE_SIZE_LIMITS,
  ROUTES,
};