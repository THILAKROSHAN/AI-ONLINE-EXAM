import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentExams } from '../../services/api/exam';
import { getStudentResults } from '../../services/api/result';
import DashboardStats from './DashboardStats';
import DashboardCharts from './DashboardCharts';
import RecentActivities from './RecentActivities';
import QuickActions from './QuickActions';
import NotificationWidget from './NotificationWidget';
import Spinner from '../common/Loading/Spinner';

const StudentDashboard = () => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExams: 0,
    completedExams: 0,
    upcomingExams: 0,
    averageScore: 0,
    passRate: 0,
  });
  const [recentExams, setRecentExams] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (userData?.uid) {
      loadDashboardData();
    }
  }, [userData]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [examsResult, resultsResult] = await Promise.all([
        getStudentExams(userData.uid, userData.organizationId),
        getStudentResults(userData.uid),
      ]);

      const exams = examsResult.success ? examsResult.data : [];
      const results = resultsResult.success ? resultsResult.data : [];

      const now = new Date();
      const upcoming = exams.filter(e => e.startDate && new Date(e.startDate) > now);
      const completed = results.filter(r => r.isCompleted);
      
      const scores = completed.map(r => r.percentage || 0);
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const passed = completed.filter(r => (r.percentage || 0) >= 40);
      const passRate = completed.length > 0 ? (passed.length / completed.length) * 100 : 0;

      setStats({
        totalExams: exams.length,
        completedExams: completed.length,
        upcomingExams: upcoming.length,
        averageScore: avgScore,
        passRate: passRate,
      });

      const recent = exams.slice(0, 5);
      setRecentExams(recent);

      const notifs = [];
      if (upcoming.length > 0) {
        notifs.push({
          id: 'upcoming',
          type: 'info',
          message: `You have ${upcoming.length} upcoming exam${upcoming.length > 1 ? 's' : ''}`,
          time: new Date(),
        });
      }
      if (results.length > 0 && results[0].percentage !== undefined) {
        const latest = results[0];
        notifs.push({
          id: 'latest-result',
          type: latest.percentage >= 40 ? 'success' : 'warning',
          message: `Your latest exam result: ${latest.percentage}%`,
          time: new Date(),
        });
      }
      setNotifications(notifs);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardStats stats={stats} role="student" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCharts role="student" stats={stats} />
        </div>
        <div className="lg:col-span-1">
          <NotificationWidget notifications={notifications} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivities role="student" exams={recentExams} />
        </div>
        <div className="lg:col-span-1">
          <QuickActions role="student" />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;