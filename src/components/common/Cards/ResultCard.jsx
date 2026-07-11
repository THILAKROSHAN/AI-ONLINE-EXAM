import React from 'react';
import Button from '../Buttons/Button';

const ResultCard = ({ result, onView }) => {
  const getGrade = (percentage) => {
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600 dark:text-green-400' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-600 dark:text-blue-400' };
    if (percentage >= 40) return { grade: 'C', color: 'text-yellow-600 dark:text-yellow-400' };
    if (percentage >= 30) return { grade: 'D', color: 'text-orange-600 dark:text-orange-400' };
    return { grade: 'F', color: 'text-red-600 dark:text-red-400' };
  };

  const grade = getGrade(result.percentage || 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {result.examTitle || 'Exam Results'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {result.studentName}
            </p>
          </div>
          <div className={`text-2xl font-bold ${grade.color}`}>
            {grade.grade}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Score</span>
            <span className={`font-medium ${grade.color}`}>
              {result.percentage?.toFixed(1) || 0}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Marks</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {result.obtainedMarks || 0}/{result.totalMarks || 0}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Status</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              result.isPassed
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {result.isPassed ? 'Passed' : 'Failed'}
            </span>
          </div>
          {result.rank && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Rank</span>
              <span className="text-gray-900 dark:text-white font-medium">
                #{result.rank}
              </span>
            </div>
          )}
        </div>

        <Button variant="primary" className="w-full" onClick={() => onView(result)}>
          View Details
        </Button>
      </div>
    </div>
  );
};

export default ResultCard;