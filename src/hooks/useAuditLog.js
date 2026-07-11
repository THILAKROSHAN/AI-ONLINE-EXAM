// src/hooks/useAuditLog.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getOrganizationAuditLogs,
  getUserAuditLogs,
  getTargetAuditLogs,
  getAuditStats,
  exportAuditLogs,
  clearOldAuditLogs,
  createAuditLog,
  ACTION_TYPES,
  TARGET_TYPES,
} from '../services/api/audit';

export const useAuditLog = () => {
  const { userData } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    actionType: '',
    targetType: '',
    performedBy: '',
    startDate: '',
    endDate: '',
    status: '',
    search: '',
  });

  const loadLogs = useCallback(async () => {
    if (!userData?.organizationId) return;

    setLoading(true);
    setError(null);

    try {
      const filterParams = {
        actionType: filters.actionType || undefined,
        targetType: filters.targetType || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        status: filters.status || undefined,
        limit: 100,
      };
      
      const result = await getOrganizationAuditLogs(userData.organizationId, filterParams);
      
      if (result.success) {
        let filteredData = result.data;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(log =>
            log.action?.toLowerCase().includes(searchLower) ||
            log.targetName?.toLowerCase().includes(searchLower) ||
            log.performedByName?.toLowerCase().includes(searchLower) ||
            log.performedByEmail?.toLowerCase().includes(searchLower)
          );
        }
        setLogs(filteredData);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error loading audit logs:', error);
      setError('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, [userData?.organizationId, filters]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const logAction = async (actionData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await createAuditLog({
        ...actionData,
        organizationId: userData.organizationId,
        performedBy: userData.uid,
        performedByEmail: userData.email,
        performedByName: userData.displayName,
        performedByRole: userData.role,
      });

      if (result.success) {
        await loadLogs();
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error logging action:', error);
      setError('Failed to log action');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getUserLogs = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getUserAuditLogs(userId, userData.organizationId);
      return result;
    } catch (error) {
      console.error('Error getting user logs:', error);
      setError('Failed to get user logs');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getTargetLogs = async (targetType, targetId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getTargetAuditLogs(targetType, targetId, userData.organizationId);
      return result;
    } catch (error) {
      console.error('Error getting target logs:', error);
      setError('Failed to get target logs');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getStats = async (dateRange = null) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getAuditStats(userData.organizationId, dateRange);
      return result;
    } catch (error) {
      console.error('Error getting audit stats:', error);
      setError('Failed to get audit stats');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = async (format = 'excel', exportFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await exportAuditLogs(
        userData.organizationId,
        { ...filters, ...exportFilters },
        format
      );
      return result;
    } catch (error) {
      console.error('Error exporting logs:', error);
      setError('Failed to export logs');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const clearOldLogs = async (daysOld = 90) => {
    setLoading(true);
    setError(null);

    try {
      const result = await clearOldAuditLogs(userData.organizationId, daysOld);
      if (result.success) {
        await loadLogs();
        return { success: true, deletedCount: result.deletedCount };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error clearing old logs:', error);
      setError('Failed to clear old logs');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      actionType: '',
      targetType: '',
      performedBy: '',
      startDate: '',
      endDate: '',
      status: '',
      search: '',
    });
  };

  return {
    logs,
    loading,
    error,
    filters,
    loadLogs,
    logAction,
    getUserLogs,
    getTargetLogs,
    getStats,
    exportLogs,
    clearOldLogs,
    updateFilters,
    resetFilters,
    ACTION_TYPES,
    TARGET_TYPES,
  };
};

export default useAuditLog;