import React from 'react';
import StatCard from '../common/Cards/StatCard';

const DashboardStats = ({ stats, role }) => {
  const isStudent = role === 'student';
  const isAdmin = role === 'admin';

  if (isStudent) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Exams"
          value={stats.totalExams || 0}
          icon="📝"
          color="primary"
        />
        <StatCard
          title="Completed"
          value={stats.completedExams || 0}
          icon="✅"
          color="green"
        />
        <StatCard
          title="Upcoming"
          value={stats.upcomingExams || 0}
          icon="📅"
          color="blue"
        />
        <StatCard
          title="Average Score"
          value={`${stats.averageScore?.toFixed(1) || 0}%`}
          icon="📊"
          color="purple"
          subtitle={`Pass Rate: ${stats.passRate?.toFixed(1) || 0}%`}
        />
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents || 0}
          icon="👨‍🎓"
          color="primary"
          subtitle={`Active: ${stats.activeStudents || 0}`}
        />
        <StatCard
          title="Total Subjects"
          value={stats.totalSubjects || 0}
          icon="📚"
          color="blue"
        />
        <StatCard
          title="Total Questions"
          value={stats.totalQuestions || 0}
          icon="❓"
          color="purple"
        />
        <StatCard
          title="Total Exams"
          value={stats.totalExams || 0}
          icon="📝"
          color="green"
          subtitle={`Active: ${stats.activeExams || 0}`}
        />
      </div>
    );
  }

  return null;
};

export default DashboardStats;