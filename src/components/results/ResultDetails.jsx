import React, { useState } from 'react';
import Button from '../common/Buttons/Button';
import Spinner from '../common/Loading/Spinner';

const ResultDetails = ({ result, attempt, onClose, onExport }) => {
  const [loading, setLoading] = useState(false);

  if (!result || !attempt) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No result data available</p>
      </div>
    );
  }

  const getGrade = (percentage) => {
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600 dark:text-green-400' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-600 dark:text-blue-400' };
    if (percentage >= 40) return { grade: 'C', color: 'text-yellow-600 dark:text-yellow-400' };
    if (percentage >= 30) return { grade: 'D', color: 'text-orange-600 dark:text-orange-400' };
    return { grade: 'F', color: 'text-red-600 dark:text-red-400' };
  };

  const grade = getGrade(result.percentage || 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {result.examTitle || 'Exam Results'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {result.studentName} • {result.studentEmail}
            </p>
          </div>
          <div className="flex gap-2">
            {onExport && (
              <Button variant="secondary" size="sm" onClick={onExport}>
                Export
              </Button>
            )}
            {onClose && (
              <Button variant="secondary" size="sm" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Score Summary */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Score</p>
          <p className={`text-2xl font-bold ${grade.color}`}>
            {result.percentage?.toFixed(1) || 0}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {result.obtainedMarks || 0}/{result.totalMarks || 0}
          </p>
        </div>

        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Grade</p>
          <p className={`text-2xl font-bold ${grade.color}`}>
            {grade.grade}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {result.isPassed ? '✅ Passed' : '❌ Failed'}
          </p>
        </div>

        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Time Spent</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Math.floor((result.timeSpent || 0) / 60)}m {Math.floor((result.timeSpent || 0) % 60)}s
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Rank: #{result.rank || '-'}
          </p>
        </div>

        <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Statistics</p>
          <div className="flex justify-center gap-4 text-sm">
            <div>
              <span className="text-green-600 dark:text-green-400">✓ {result.correctAnswers || 0}</span>
            </div>
            <div>
              <span className="text-red-600 dark:text-red-400">✗ {result.wrongAnswers || 0}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">- {result.unattempted || 0}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Completed: {result.completedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
          </p>
        </div>
      </div>

      {/* Question-wise Analysis */}
      {result.questionResults && result.questionResults.length > 0 && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Question-wise Analysis
          </h4>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {result.questionResults.map((q, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  q.isCorrect
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                    : q.isAttempted
                    ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Q{index + 1}: {q.questionText || 'Question'}
                    </p>
                    <div className="mt-1 space-y-1 text-sm">
                      {q.userAnswer && (
                        <p className="text-gray-600 dark:text-gray-400">
                          Your answer: <span className={q.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {q.userAnswer}
                          </span>
                        </p>
                      )}
                      {q.correctAnswer && (
                        <p className="text-gray-600 dark:text-gray-400">
                          Correct answer: <span className="text-green-600 dark:text-green-400">{q.correctAnswer}</span>
                        </p>
                      )}
                      {q.explanation && (
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          💡 {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      q.isCorrect
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : q.isAttempted
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {q.isCorrect ? '✓ Correct' : q.isAttempted ? '✗ Wrong' : '⏭ Skipped'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      {result.feedback && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Feedback
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{result.feedback}</p>
        </div>
      )}
    </div>
  );
};

export default ResultDetails;