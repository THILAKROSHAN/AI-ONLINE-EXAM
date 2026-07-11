import React from 'react';
import Button from '../Buttons/Button';

const ExamCard = ({ exam, status, onStart, onViewResults }) => {
  const getStatusBadge = () => {
    const statusConfig = {
      available: {
        label: 'Available',
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      },
      in_progress: {
        label: 'In Progress',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      },
      completed: {
        label: 'Completed',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      },
      upcoming: {
        label: 'Upcoming',
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      },
    };

    const config = statusConfig[status] || statusConfig.available;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getProgress = () => {
    if (status === 'completed') return 100;
    if (status === 'in_progress') return 50;
    return 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
            {exam.title || 'Untitled Exam'}
          </h3>
          {getStatusBadge()}
        </div>

        {exam.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {exam.description}
          </p>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Duration</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {exam.duration || 60} minutes
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Questions</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {exam.totalQuestions || 0}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Total Marks</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {exam.totalMarks || 0}
            </span>
          </div>
          {exam.passingMarks && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Passing Marks</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {exam.passingMarks}%
              </span>
            </div>
          )}
          {exam.startDate && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Start</span>
              <span className="text-gray-900 dark:text-white font-medium text-xs">
                {formatDate(exam.startDate)}
              </span>
            </div>
          )}
        </div>

        {status === 'in_progress' || status === 'completed' ? (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Progress</span>
              <span>{getProgress()}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="flex gap-2 mt-4">
          {status === 'completed' ? (
            <Button variant="primary" className="w-full" onClick={onViewResults}>
              View Results
            </Button>
          ) : status === 'in_progress' ? (
            <Button variant="primary" className="w-full" onClick={onStart}>
              Continue Exam
            </Button>
          ) : status === 'available' ? (
            <Button variant="primary" className="w-full" onClick={onStart}>
              Start Exam
            </Button>
          ) : (
            <Button variant="secondary" className="w-full" disabled>
              Not Available
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamCard;