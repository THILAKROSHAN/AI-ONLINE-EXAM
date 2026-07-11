// User Roles Constants
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ORGANIZATION_ADMIN: 'organization_admin',
  SUB_ADMIN: 'sub_admin',
  STUDENT: 'student',
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ORGANIZATION_ADMIN]: 'Organization Admin',
  [ROLES.SUB_ADMIN]: 'Sub Admin',
  [ROLES.STUDENT]: 'Student',
};

export const ROLE_COLORS = {
  [ROLES.SUPER_ADMIN]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [ROLES.ORGANIZATION_ADMIN]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [ROLES.SUB_ADMIN]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [ROLES.STUDENT]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

export const ADMIN_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.ORGANIZATION_ADMIN,
  ROLES.SUB_ADMIN,
];

export const ORGANIZATION_ROLES = [
  ROLES.ORGANIZATION_ADMIN,
  ROLES.SUB_ADMIN,
];

export const ALL_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.ORGANIZATION_ADMIN,
  ROLES.SUB_ADMIN,
  ROLES.STUDENT,
];

// Role hierarchy (higher number = higher level)
export const ROLE_LEVELS = {
  [ROLES.SUPER_ADMIN]: 3,
  [ROLES.ORGANIZATION_ADMIN]: 2,
  [ROLES.SUB_ADMIN]: 1,
  [ROLES.STUDENT]: 0,
};

// Default permissions by role
export const DEFAULT_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    'view_students', 'add_students', 'edit_students', 'delete_students', 
    'import_students', 'export_students',
    'view_subjects', 'add_subjects', 'edit_subjects', 'delete_subjects',
    'view_questions', 'add_questions', 'edit_questions', 'delete_questions',
    'import_questions', 'export_questions', 'use_ai_generator',
    'view_exams', 'add_exams', 'edit_exams', 'delete_exams', 'publish_exams',
    'view_results', 'evaluate_results', 'publish_results', 'export_results',
    'view_reports', 'generate_reports', 'export_reports',
    'view_admins', 'add_admins', 'edit_admins', 'delete_admins',
    'view_settings', 'edit_settings',
    'view_audit_logs',
  ],
  [ROLES.ORGANIZATION_ADMIN]: [
    'view_students', 'add_students', 'edit_students', 'delete_students', 
    'import_students', 'export_students',
    'view_subjects', 'add_subjects', 'edit_subjects', 'delete_subjects',
    'view_questions', 'add_questions', 'edit_questions', 'delete_questions',
    'import_questions', 'export_questions', 'use_ai_generator',
    'view_exams', 'add_exams', 'edit_exams', 'delete_exams', 'publish_exams',
    'view_results', 'evaluate_results', 'publish_results', 'export_results',
    'view_reports', 'generate_reports', 'export_reports',
    'view_admins', 'add_admins', 'edit_admins', 'delete_admins',
    'view_settings', 'edit_settings',
    'view_audit_logs',
  ],
  [ROLES.SUB_ADMIN]: [
    'view_students', 'add_students', 'edit_students',
    'view_subjects', 'add_subjects', 'edit_subjects',
    'view_questions', 'add_questions', 'edit_questions',
    'view_exams', 'add_exams', 'edit_exams',
    'view_results', 'evaluate_results',
    'view_reports', 'generate_reports',
  ],
  [ROLES.STUDENT]: [],
};

// Permission labels for UI
export const PERMISSION_LABELS = {
  view_students: 'View Students',
  add_students: 'Add Students',
  edit_students: 'Edit Students',
  delete_students: 'Delete Students',
  import_students: 'Import Students',
  export_students: 'Export Students',
  view_subjects: 'View Subjects',
  add_subjects: 'Add Subjects',
  edit_subjects: 'Edit Subjects',
  delete_subjects: 'Delete Subjects',
  view_questions: 'View Questions',
  add_questions: 'Add Questions',
  edit_questions: 'Edit Questions',
  delete_questions: 'Delete Questions',
  import_questions: 'Import Questions',
  export_questions: 'Export Questions',
  use_ai_generator: 'Use AI Generator',
  view_exams: 'View Exams',
  add_exams: 'Add Exams',
  edit_exams: 'Edit Exams',
  delete_exams: 'Delete Exams',
  publish_exams: 'Publish Exams',
  view_results: 'View Results',
  evaluate_results: 'Evaluate Results',
  publish_results: 'Publish Results',
  export_results: 'Export Results',
  view_reports: 'View Reports',
  generate_reports: 'Generate Reports',
  export_reports: 'Export Reports',
  view_admins: 'View Admins',
  add_admins: 'Add Admins',
  edit_admins: 'Edit Admins',
  delete_admins: 'Delete Admins',
  view_settings: 'View Settings',
  edit_settings: 'Edit Settings',
  view_audit_logs: 'View Audit Logs',
};

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
};

export const PLAN_LABELS = {
  [SUBSCRIPTION_PLANS.FREE]: 'Free',
  [SUBSCRIPTION_PLANS.BASIC]: 'Basic',
  [SUBSCRIPTION_PLANS.PREMIUM]: 'Premium',
  [SUBSCRIPTION_PLANS.ENTERPRISE]: 'Enterprise',
};

export const PLAN_LIMITS = {
  [SUBSCRIPTION_PLANS.FREE]: {
    maxStudents: 50,
    maxAdmins: 2,
    maxExams: 10,
    maxQuestions: 100,
    features: ['basic', 'manual_question'],
  },
  [SUBSCRIPTION_PLANS.BASIC]: {
    maxStudents: 200,
    maxAdmins: 5,
    maxExams: 50,
    maxQuestions: 500,
    features: ['basic', 'manual_question', 'ai_generator', 'reports'],
  },
  [SUBSCRIPTION_PLANS.PREMIUM]: {
    maxStudents: 1000,
    maxAdmins: 10,
    maxExams: 200,
    maxQuestions: 2000,
    features: ['basic', 'manual_question', 'ai_generator', 'reports', 'analytics', 'bulk_import', 'advanced_reports'],
  },
  [SUBSCRIPTION_PLANS.ENTERPRISE]: {
    maxStudents: -1,
    maxAdmins: -1,
    maxExams: -1,
    maxQuestions: -1,
    features: ['all'],
  },
};

// Organization Status
export const ORGANIZATION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  EXPIRED: 'expired',
};

export const STATUS_LABELS = {
  [ORGANIZATION_STATUS.ACTIVE]: 'Active',
  [ORGANIZATION_STATUS.INACTIVE]: 'Inactive',
  [ORGANIZATION_STATUS.SUSPENDED]: 'Suspended',
  [ORGANIZATION_STATUS.EXPIRED]: 'Expired',
};

export const STATUS_COLORS = {
  [ORGANIZATION_STATUS.ACTIVE]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [ORGANIZATION_STATUS.INACTIVE]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  [ORGANIZATION_STATUS.SUSPENDED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  [ORGANIZATION_STATUS.EXPIRED]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};