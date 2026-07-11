import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardData } from '../../services/api/dashboard';
import DashboardStats from './DashboardStats';
import DashboardCharts from './DashboardCharts';
import RecentActivities from './RecentActivities';
import QuickActions from './QuickActions';
import NotificationWidget from './NotificationWidget';
import Spinner from '../common/Loading/Spinner';

const AdminDashboard = () => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalStudents: 0,
      totalAdmins: 0,
      totalSubjects: 0,
      totalQuestions: 0,
      totalExams: 0,
      totalResults: 0,
      activeStudents: 0,
      activeExams: 0,
    },
    recentActivities: [],
    notifications: [],
    performanceData: {},
    examStats: {},
    studentGrowth: [],
  });

  useEffect(() => {
    if (userData?.organizationId) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [userData]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDashboardData(userData.organizationId);
      if (result.success) {
        setDashboardData(result.data);
      } else {
        setError(result.error || 'Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <p className="text-red-700 dark:text-red-400">{error}</p>
        <button
          onClick={loadDashboardData}
          className="mt-4 btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardStats stats={dashboardData.stats} role="admin" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCharts 
            role="admin" 
            performanceData={dashboardData.performanceData}
            examStats={dashboardData.examStats}
            studentGrowth={dashboardData.studentGrowth}
          />
        </div>
        <div className="lg:col-span-1">
          <NotificationWidget notifications={dashboardData.notifications} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivities 
            role="admin" 
            activities={dashboardData.recentActivities} 
          />
        </div>
        <div className="lg:col-span-1">
          <QuickActions role="admin" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;