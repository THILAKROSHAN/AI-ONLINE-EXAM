import React from 'react';
import { Link } from 'react-router-dom';

const RecentActivities = ({ role, activities, exams }) => {
  const isStudent = role === 'student';

  if (isStudent && exams) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Exams
        </h3>
        {exams.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No recent exams
          </p>
        ) : (
          <div className="space-y-3">
            {exams.slice(0, 5).map((exam) => (
              <div
                key={exam.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {exam.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {exam.duration} min • {exam.totalQuestions || 0} questions
                  </p>
                </div>
                <Link
                  to={`/student/exam/${exam.id}`}
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  {exam.startDate && new Date(exam.startDate) > new Date() ? 'Upcoming' : 'View'}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!isStudent && activities) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activities
        </h3>
        {activities.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No recent activities
          </p>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 5).map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="text-2xl">📌</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Activities
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        No recent activities
      </p>
    </div>
  );
};

export default RecentActivities;