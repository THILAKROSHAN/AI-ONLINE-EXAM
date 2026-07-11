// Audit Log API Service
import { 
  createDocument, 
  getDocument, 
  updateDocument, 
  deleteDocument, 
  queryDocuments,
  getAllDocuments,
  COLLECTIONS 
} from '../firebase/firestore';
import { callFunction } from '../firebase/functions';

// Create audit log entry
export const createAuditLog = async (auditData) => {
  try {
    const data = {
      action: auditData.action,
      actionType: auditData.actionType || 'update', // create, update, delete, login, logout
      targetType: auditData.targetType || 'unknown',
      targetId: auditData.targetId || null,
      targetName: auditData.targetName || null,
      performedBy: auditData.performedBy || null,
      performedByEmail: auditData.performedByEmail || null,
      performedByName: auditData.performedByName || null,
      performedByRole: auditData.performedByRole || null,
      organizationId: auditData.organizationId || null,
      
      // Changes
      oldValue: auditData.oldValue || null,
      newValue: auditData.newValue || null,
      changes: auditData.changes || [],
      
      // Details
      details: auditData.details || {},
      ipAddress: auditData.ipAddress || null,
      userAgent: auditData.userAgent || null,
      
      // Status
      status: auditData.status || 'success',
      error: auditData.error || null,
      
      // Timestamps
      createdAt: new Date(),
      timestamp: new Date(),
    };

    const result = await createDocument(COLLECTIONS.AUDIT_LOGS, data);
    return result;
  } catch (error) {
    console.error('❌ Error creating audit log:', error);
    return { success: false, error: error.message };
  }
};

// Get audit log by ID
export const getAuditLog = async (logId) => {
  try {
    const result = await getDocument(COLLECTIONS.AUDIT_LOGS, logId);
    return result;
  } catch (error) {
    console.error('❌ Error getting audit log:', error);
    return { success: false, error: error.message };
  }
};

// Get audit logs for an organization
export const getOrganizationAuditLogs = async (organizationId, filters = {}) => {
  try {
    const conditions = [
      { field: 'organizationId', operator: '==', value: organizationId }
    ];

    if (filters.actionType) {
      conditions.push({ field: 'actionType', operator: '==', value: filters.actionType });
    }

    if (filters.targetType) {
      conditions.push({ field: 'targetType', operator: '==', value: filters.targetType });
    }

    if (filters.performedBy) {
      conditions.push({ field: 'performedBy', operator: '==', value: filters.performedBy });
    }

    if (filters.startDate) {
      conditions.push({ field: 'createdAt', operator: '>=', value: filters.startDate });
    }

    if (filters.endDate) {
      conditions.push({ field: 'createdAt', operator: '<=', value: filters.endDate });
    }

    if (filters.status) {
      conditions.push({ field: 'status', operator: '==', value: filters.status });
    }

    const limitCount = filters.limit || 100;

    const result = await queryDocuments(
      COLLECTIONS.AUDIT_LOGS,
      conditions,
      'createdAt',
      'desc',
      limitCount
    );
    return result;
  } catch (error) {
    console.error('❌ Error getting organization audit logs:', error);
    return { success: false, error: error.message };
  }
};

// Get all audit logs (Super Admin only)
export const getAllAuditLogs = async (filters = {}) => {
  try {
    const conditions = [];

    if (filters.actionType) {
      conditions.push({ field: 'actionType', operator: '==', value: filters.actionType });
    }

    if (filters.targetType) {
      conditions.push({ field: 'targetType', operator: '==', value: filters.targetType });
    }

    if (filters.startDate) {
      conditions.push({ field: 'createdAt', operator: '>=', value: filters.startDate });
    }

    if (filters.endDate) {
      conditions.push({ field: 'createdAt', operator: '<=', value: filters.endDate });
    }

    const limitCount = filters.limit || 100;

    const result = await queryDocuments(
      COLLECTIONS.AUDIT_LOGS,
      conditions,
      'createdAt',
      'desc',
      limitCount
    );
    return result;
  } catch (error) {
    console.error('❌ Error getting all audit logs:', error);
    return { success: false, error: error.message };
  }
};

// Get audit logs by user
export const getUserAuditLogs = async (userId, organizationId = null) => {
  try {
    const conditions = [
      { field: 'performedBy', operator: '==', value: userId }
    ];

    if (organizationId) {
      conditions.push({ field: 'organizationId', operator: '==', value: organizationId });
    }

    const result = await queryDocuments(
      COLLECTIONS.AUDIT_LOGS,
      conditions,
      'createdAt',
      'desc'
    );
    return result;
  } catch (error) {
    console.error('❌ Error getting user audit logs:', error);
    return { success: false, error: error.message };
  }
};

// Get audit logs by target
export const getTargetAuditLogs = async (targetType, targetId, organizationId = null) => {
  try {
    const conditions = [
      { field: 'targetType', operator: '==', value: targetType },
      { field: 'targetId', operator: '==', value: targetId }
    ];

    if (organizationId) {
      conditions.push({ field: 'organizationId', operator: '==', value: organizationId });
    }

    const result = await queryDocuments(
      COLLECTIONS.AUDIT_LOGS,
      conditions,
      'createdAt',
      'desc'
    );
    return result;
  } catch (error) {
    console.error('❌ Error getting target audit logs:', error);
    return { success: false, error: error.message };
  }
};

// Get audit log statistics
export const getAuditStats = async (organizationId, dateRange = null) => {
  try {
    const conditions = [
      { field: 'organizationId', operator: '==', value: organizationId }
    ];

    if (dateRange) {
      if (dateRange.start) {
        conditions.push({ field: 'createdAt', operator: '>=', value: dateRange.start });
      }
      if (dateRange.end) {
        conditions.push({ field: 'createdAt', operator: '<=', value: dateRange.end });
      }
    }

    const result = await queryDocuments(COLLECTIONS.AUDIT_LOGS, conditions);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const logs = result.data;
    const stats = {
      total: logs.length,
      byActionType: {},
      byTargetType: {},
      byStatus: {},
      byUser: {},
      today: 0,
      week: 0,
      month: 0,
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    logs.forEach(log => {
      // By action type
      if (log.actionType) {
        stats.byActionType[log.actionType] = (stats.byActionType[log.actionType] || 0) + 1;
      }

      // By target type
      if (log.targetType) {
        stats.byTargetType[log.targetType] = (stats.byTargetType[log.targetType] || 0) + 1;
      }

      // By status
      if (log.status) {
        stats.byStatus[log.status] = (stats.byStatus[log.status] || 0) + 1;
      }

      // By user
      if (log.performedBy) {
        stats.byUser[log.performedBy] = (stats.byUser[log.performedBy] || 0) + 1;
      }

      // Date ranges
      const logDate = log.createdAt?.toDate?.() || new Date(log.createdAt);
      if (logDate >= today) {
        stats.today++;
      }
      if (logDate >= weekAgo) {
        stats.week++;
      }
      if (logDate >= monthAgo) {
        stats.month++;
      }
    });

    return { success: true, data: stats };
  } catch (error) {
    console.error('❌ Error getting audit stats:', error);
    return { success: false, error: error.message };
  }
};

// Export audit logs
export const exportAuditLogs = async (organizationId, filters = {}, format = 'excel') => {
  try {
    const result = await callFunction('exportAuditLogs', {
      organizationId,
      filters,
      format,
    });
    return result;
  } catch (error) {
    console.error('❌ Error exporting audit logs:', error);
    return { success: false, error: error.message };
  }
};

// Clear old audit logs
export const clearOldAuditLogs = async (organizationId, daysOld = 90) => {
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysOld);

    const result = await queryDocuments(COLLECTIONS.AUDIT_LOGS, [
      { field: 'organizationId', operator: '==', value: organizationId },
      { field: 'createdAt', operator: '<=', value: cutoff }
    ]);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const logs = result.data;
    let deletedCount = 0;

    for (const log of logs) {
      const deleteResult = await deleteDocument(COLLECTIONS.AUDIT_LOGS, log.id);
      if (deleteResult.success) {
        deletedCount++;
      }
    }

    return { success: true, deletedCount };
  } catch (error) {
    console.error('❌ Error clearing old audit logs:', error);
    return { success: false, error: error.message };
  }
};

// Action types
export const ACTION_TYPES = {
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

// Target types
export const TARGET_TYPES = {
  STUDENT: 'student',
  ADMIN: 'admin',
  EXAM: 'exam',
  QUESTION: 'question',
  SUBJECT: 'subject',
  RESULT: 'result',
  ORGANIZATION: 'organization',
  USER: 'user',
};