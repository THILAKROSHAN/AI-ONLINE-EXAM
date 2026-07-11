// useDashboard Hook
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardData, getAdminStats } from '../services/api/dashboard';

export const useDashboard = () => {
  const { userData } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    examStats: {},
    recentActivities: [],
    notifications: [],
    performanceData: {},
    studentGrowth: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    if (!userData?.organizationId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getDashboardData(userData.organizationId);
      
      if (result.success) {
        setDashboardData(result.data);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [userData?.organizationId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const refresh = () => {
    loadDashboard();
  };

  const getAdminStatsData = async () => {
    if (!userData?.organizationId) return null;

    try {
      const result = await getAdminStats(userData.organizationId);
      return result;
    } catch (error) {
      console.error('Error getting admin stats:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    dashboardData,
    loading,
    error,
    refresh,
    getAdminStatsData,
  };
};

export default useDashboard;