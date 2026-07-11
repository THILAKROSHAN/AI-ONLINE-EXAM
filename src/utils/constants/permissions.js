// Permission Constants
export const PERMISSIONS = {
  // Student Management
  VIEW_STUDENTS: 'view_students',
  ADD_STUDENTS: 'add_students',
  EDIT_STUDENTS: 'edit_students',
  DELETE_STUDENTS: 'delete_students',
  IMPORT_STUDENTS: 'import_students',
  EXPORT_STUDENTS: 'export_students',

  // Subject Management
  VIEW_SUBJECTS: 'view_subjects',
  ADD_SUBJECTS: 'add_subjects',
  EDIT_SUBJECTS: 'edit_subjects',
  DELETE_SUBJECTS: 'delete_subjects',

  // Question Management
  VIEW_QUESTIONS: 'view_questions',
  ADD_QUESTIONS: 'add_questions',
  EDIT_QUESTIONS: 'edit_questions',
  DELETE_QUESTIONS: 'delete_questions',
  IMPORT_QUESTIONS: 'import_questions',
  EXPORT_QUESTIONS: 'export_questions',
  USE_AI_GENERATOR: 'use_ai_generator',

  // Exam Management
  VIEW_EXAMS: 'view_exams',
  ADD_EXAMS: 'add_exams',
  EDIT_EXAMS: 'edit_exams',
  DELETE_EXAMS: 'delete_exams',
  PUBLISH_EXAMS: 'publish_exams',

  // Result Management
  VIEW_RESULTS: 'view_results',
  EVALUATE_RESULTS: 'evaluate_results',
  PUBLISH_RESULTS: 'publish_results',
  EXPORT_RESULTS: 'export_results',

  // Report Management
  VIEW_REPORTS: 'view_reports',
  GENERATE_REPORTS: 'generate_reports',
  EXPORT_REPORTS: 'export_reports',

  // Admin Management
  VIEW_ADMINS: 'view_admins',
  ADD_ADMINS: 'add_admins',
  EDIT_ADMINS: 'edit_admins',
  DELETE_ADMINS: 'delete_admins',

  // Settings
  VIEW_SETTINGS: 'view_settings',
  EDIT_SETTINGS: 'edit_settings',

  // Audit
  VIEW_AUDIT_LOGS: 'view_audit_logs',
};

export const PERMISSION_LABELS = {
  [PERMISSIONS.VIEW_STUDENTS]: 'View Students',
  [PERMISSIONS.ADD_STUDENTS]: 'Add Students',
  [PERMISSIONS.EDIT_STUDENTS]: 'Edit Students',
  [PERMISSIONS.DELETE_STUDENTS]: 'Delete Students',
  [PERMISSIONS.IMPORT_STUDENTS]: 'Import Students',
  [PERMISSIONS.EXPORT_STUDENTS]: 'Export Students',
  [PERMISSIONS.VIEW_SUBJECTS]: 'View Subjects',
  [PERMISSIONS.ADD_SUBJECTS]: 'Add Subjects',
  [PERMISSIONS.EDIT_SUBJECTS]: 'Edit Subjects',
  [PERMISSIONS.DELETE_SUBJECTS]: 'Delete Subjects',
  [PERMISSIONS.VIEW_QUESTIONS]: 'View Questions',
  [PERMISSIONS.ADD_QUESTIONS]: 'Add Questions',
  [PERMISSIONS.EDIT_QUESTIONS]: 'Edit Questions',
  [PERMISSIONS.DELETE_QUESTIONS]: 'Delete Questions',
  [PERMISSIONS.IMPORT_QUESTIONS]: 'Import Questions',
  [PERMISSIONS.EXPORT_QUESTIONS]: 'Export Questions',
  [PERMISSIONS.USE_AI_GENERATOR]: 'Use AI Generator',
  [PERMISSIONS.VIEW_EXAMS]: 'View Exams',
  [PERMISSIONS.ADD_EXAMS]: 'Add Exams',
  [PERMISSIONS.EDIT_EXAMS]: 'Edit Exams',
  [PERMISSIONS.DELETE_EXAMS]: 'Delete Exams',
  [PERMISSIONS.PUBLISH_EXAMS]: 'Publish Exams',
  [PERMISSIONS.VIEW_RESULTS]: 'View Results',
  [PERMISSIONS.EVALUATE_RESULTS]: 'Evaluate Results',
  [PERMISSIONS.PUBLISH_RESULTS]: 'Publish Results',
  [PERMISSIONS.EXPORT_RESULTS]: 'Export Results',
  [PERMISSIONS.VIEW_REPORTS]: 'View Reports',
  [PERMISSIONS.GENERATE_REPORTS]: 'Generate Reports',
  [PERMISSIONS.EXPORT_REPORTS]: 'Export Reports',
  [PERMISSIONS.VIEW_ADMINS]: 'View Admins',
  [PERMISSIONS.ADD_ADMINS]: 'Add Admins',
  [PERMISSIONS.EDIT_ADMINS]: 'Edit Admins',
  [PERMISSIONS.DELETE_ADMINS]: 'Delete Admins',
  [PERMISSIONS.VIEW_SETTINGS]: 'View Settings',
  [PERMISSIONS.EDIT_SETTINGS]: 'Edit Settings',
  [PERMISSIONS.VIEW_AUDIT_LOGS]: 'View Audit Logs',
};

export const DEFAULT_PERMISSIONS = {
  super_admin: Object.values(PERMISSIONS),
  admin: [
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.ADD_STUDENTS,
    PERMISSIONS.EDIT_STUDENTS,
    PERMISSIONS.DELETE_STUDENTS,
    PERMISSIONS.IMPORT_STUDENTS,
    PERMISSIONS.EXPORT_STUDENTS,
    PERMISSIONS.VIEW_SUBJECTS,
    PERMISSIONS.ADD_SUBJECTS,
    PERMISSIONS.EDIT_SUBJECTS,
    PERMISSIONS.DELETE_SUBJECTS,
    PERMISSIONS.VIEW_QUESTIONS,
    PERMISSIONS.ADD_QUESTIONS,
    PERMISSIONS.EDIT_QUESTIONS,
    PERMISSIONS.DELETE_QUESTIONS,
    PERMISSIONS.IMPORT_QUESTIONS,
    PERMISSIONS.EXPORT_QUESTIONS,
    PERMISSIONS.USE_AI_GENERATOR,
    PERMISSIONS.VIEW_EXAMS,
    PERMISSIONS.ADD_EXAMS,
    PERMISSIONS.EDIT_EXAMS,
    PERMISSIONS.DELETE_EXAMS,
    PERMISSIONS.PUBLISH_EXAMS,
    PERMISSIONS.VIEW_RESULTS,
    PERMISSIONS.EVALUATE_RESULTS,
    PERMISSIONS.PUBLISH_RESULTS,
    PERMISSIONS.EXPORT_RESULTS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.VIEW_ADMINS,
    PERMISSIONS.ADD_ADMINS,
    PERMISSIONS.EDIT_ADMINS,
    PERMISSIONS.DELETE_ADMINS,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.EDIT_SETTINGS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
  ],
  sub_admin: [
    PERMISSIONS.VIEW_STUDENTS,
    PERMISSIONS.ADD_STUDENTS,
    PERMISSIONS.EDIT_STUDENTS,
    PERMISSIONS.VIEW_SUBJECTS,
    PERMISSIONS.ADD_SUBJECTS,
    PERMISSIONS.EDIT_SUBJECTS,
    PERMISSIONS.VIEW_QUESTIONS,
    PERMISSIONS.ADD_QUESTIONS,
    PERMISSIONS.EDIT_QUESTIONS,
    PERMISSIONS.USE_AI_GENERATOR,
    PERMISSIONS.VIEW_EXAMS,
    PERMISSIONS.ADD_EXAMS,
    PERMISSIONS.EDIT_EXAMS,
    PERMISSIONS.VIEW_RESULTS,
    PERMISSIONS.EVALUATE_RESULTS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORTS,
  ],
  student: [],
};

export const hasPermission = (userPermissions, permission) => {
  if (!userPermissions) return false;
  if (userPermissions.includes('*')) return true;
  return userPermissions.includes(permission);
};

export const hasAnyPermission = (userPermissions, permissions) => {
  if (!userPermissions) return false;
  if (userPermissions.includes('*')) return true;
  return permissions.some(p => userPermissions.includes(p));
};

export const hasAllPermissions = (userPermissions, permissions) => {
  if (!userPermissions) return false;
  if (userPermissions.includes('*')) return true;
  return permissions.every(p => userPermissions.includes(p));
};

export default {
  PERMISSIONS,
  PERMISSION_LABELS,
  DEFAULT_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
};