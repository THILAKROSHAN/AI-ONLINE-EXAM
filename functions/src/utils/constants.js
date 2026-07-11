// Add these constants to the existing constants.js file

// Audit Action Types
exports.AUDIT_ACTION_TYPES = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LOGIN: 'login',
  LOGOUT: 'logout',
  PASSWORD_CHANGE: 'password_change',
  EXAM_CREATE: 'exam_create',
  EXAM_UPDATE: 'exam_update',
  EXAM_DELETE: 'exam_delete',
  QUESTION_CREATE: 'question_create',
  QUESTION_UPDATE: 'question_update',
  QUESTION_DELETE: 'question_delete',
  RESULT_PUBLISH: 'result_publish',
  STUDENT_CREATE: 'student_create',
  STUDENT_UPDATE: 'student_update',
  STUDENT_DELETE: 'student_delete',
  ADMIN_CREATE: 'admin_create',
  ADMIN_UPDATE: 'admin_update',
  ADMIN_DELETE: 'admin_delete',
  SUBJECT_CREATE: 'subject_create',
  SUBJECT_UPDATE: 'subject_update',
  SUBJECT_DELETE: 'subject_delete',
};

// Audit Target Types
exports.AUDIT_TARGET_TYPES = {
  STUDENT: 'student',
  ADMIN: 'admin',
  EXAM: 'exam',
  QUESTION: 'question',
  SUBJECT: 'subject',
  RESULT: 'result',
  ORGANIZATION: 'organization',
  USER: 'user',
};

// Audit Statuses
exports.AUDIT_STATUSES = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  PENDING: 'pending',
};