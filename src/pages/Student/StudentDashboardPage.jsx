import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import StudentDashboard from '../../components/dashboard/StudentDashboard';

const StudentDashboardPage = () => {
  const { userData } = useAuth();

  return (
    <div className="container-custom py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {userData?.displayName || 'Student'}!
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Here's an overview of your academic progress and upcoming exams.
        </p>
      </div>

      <StudentDashboard />
    </div>
  );
};

export default StudentDashboardPage;