import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Buttons/Button';

const QuickActions = ({ role }) => {
  const isStudent = role === 'student';

  if (isStudent) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="space-y-3">
          <Link to="/student/exams">
            <Button variant="primary" className="w-full">
              📝 View All Exams
            </Button>
          </Link>
          <Link to="/student/results">
            <Button variant="secondary" className="w-full">
              📊 View Results
            </Button>
          </Link>
          <Link to="/student/profile">
            <Button variant="outline" className="w-full">
              👤 My Profile
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      <div className="space-y-3">
        <Link to="/admin/students">
          <Button variant="primary" className="w-full">
            👨‍🎓 Manage Students
          </Button>
        </Link>
        <Link to="/admin/exams">
          <Button variant="secondary" className="w-full">
            📝 Manage Exams
          </Button>
        </Link>
        <Link to="/admin/questions">
          <Button variant="outline" className="w-full">
            ❓ Question Bank
          </Button>
        </Link>
        <Link to="/admin/ai-generator">
          <Button variant="success" className="w-full">
            🤖 AI Generator
          </Button>
        </Link>
        <Link to="/admin/reports">
          <Button variant="warning" className="w-full">
            📄 Reports
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;