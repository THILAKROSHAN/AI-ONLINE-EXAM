import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getExam, getExamStats } from '../../services/api/exam';
import Button from '../common/Buttons/Button';
import Spinner from '../common/Loading/Spinner';
import { EXAM_STATUS_LABELS } from '../../utils/constants/examStatus';

const ExamDetails = ({ examId, onClose }) => {
  const { userData } = useAuth();
  const [exam, setExam] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (examId) {
      loadExamDetails();
    }
  }, [examId]);

  const loadExamDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const [examResult, statsResult] = await Promise.all([
        getExam(examId),
        getExamStats(examId),
      ]);

      if (examResult.success) {
        setExam(examResult.data);
      } else {
        setError(examResult.error || 'Failed to load exam');
      }

      if (statsResult.success) {
        setStats(statsResult.data);
      }
    } catch (error) {
      console.error('Error loading exam details:', error);
      setError('An unexpected error occurred');
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

  if (!exam) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        Exam not found
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Exam Details
        </h2>
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Close
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {exam.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {exam.description || 'No description'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Questions</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {exam.totalQuestions || 0}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {exam.duration} min
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Passing Marks</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {exam.passingMarks}%
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Students</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {exam.assignedStudents?.length || 0}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {EXAM_STATUS_LABELS[exam.status] || exam.status}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Published</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {exam.isPublished ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Start Date</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {exam.startDate || 'Not scheduled'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">End Date</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {exam.endDate || 'Not scheduled'}
            </p>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Security Settings
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Allow Resume:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {exam.allowResume ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Detect Tab Switch:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {exam.detectTabSwitch ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Require Fullscreen:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {exam.requireFullscreen ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Prevent Copy/Paste:</span>
              <span className="ml-2 text-gray-900 dark:text-white">
                {exam.preventCopyPaste ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Statistics
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Total Attempts:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {stats.totalAttempts || 0}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Completed:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {stats.completed || 0}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Average Score:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {stats.averageScore?.toFixed(1) || 0}%
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Pass Rate:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {stats.passRate?.toFixed(1) || 0}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {exam.instructions && exam.instructions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Instructions
            </h4>
            <div className="space-y-1">
              {exam.instructions.map((instruction, index) => (
                <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
                  {index + 1}. {instruction}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamDetails;