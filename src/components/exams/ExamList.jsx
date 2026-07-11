import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getOrganizationExams, publishExam, unpublishExam, deleteExam } from '../../services/api/exam';
import Button from '../common/Buttons/Button';
import Spinner from '../common/Loading/Spinner';
import Toast from '../common/Notifications/Toast';
import ExamFilters from './ExamFilters';
import { EXAM_STATUS, EXAM_STATUS_LABELS, EXAM_STATUS_COLORS } from '../../utils/constants/examStatus';

const ExamList = ({ onEdit, onView, onResults }) => {
  const { userData } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    subjectId: '',
    isPublished: 'all',
  });

  useEffect(() => {
    if (userData?.organizationId) {
      loadExams();
    }
  }, [userData]);

  const loadExams = async () => {
    setLoading(true);
    setError('');

    try {
      const filterParams = {
        status: filters.status === 'all' ? undefined : filters.status,
        subjectId: filters.subjectId || undefined,
        isPublished: filters.isPublished === 'all' ? undefined : filters.isPublished === 'true',
      };
      
      const result = await getOrganizationExams(userData.organizationId, filterParams);
      
      if (result.success) {
        let filteredData = result.data;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(exam =>
            exam.title?.toLowerCase().includes(searchLower) ||
            exam.description?.toLowerCase().includes(searchLower)
          );
        }
        setExams(filteredData);
      } else {
        setError(result.error || 'Failed to load exams');
      }
    } catch (error) {
      console.error('Error loading exams:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (examId) => {
    try {
      const result = await publishExam(examId);
      if (result.success) {
        setSuccess('Exam published successfully');
        await loadExams();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to publish exam');
      }
    } catch (error) {
      console.error('Error publishing exam:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleUnpublish = async (examId) => {
    try {
      const result = await unpublishExam(examId);
      if (result.success) {
        setSuccess('Exam unpublished successfully');
        await loadExams();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to unpublish exam');
      }
    } catch (error) {
      console.error('Error unpublishing exam:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleDelete = async (examId, examTitle) => {
    if (!window.confirm(`Are you sure you want to delete exam "${examTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const result = await deleteExam(examId);
      if (result.success) {
        setSuccess('Exam deleted successfully');
        await loadExams();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to delete exam');
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleApplyFilters = () => {
    loadExams();
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      subjectId: '',
      isPublished: 'all',
    });
    setTimeout(loadExams, 100);
  };

  const getStatusBadge = (status) => {
    const color = EXAM_STATUS_COLORS[status] || EXAM_STATUS_COLORS.draft;
    const label = EXAM_STATUS_LABELS[status] || status;
    return <span className={`px-2 py-1 text-xs rounded-full ${color}`}>{label}</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <ExamFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <Toast
          type="success"
          message={success}
          duration={3000}
          onClose={() => setSuccess('')}
        />
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Questions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {exams.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No exams found
                  </td>
                </tr>
              ) : (
                exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {exam.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {exam.description || 'No description'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {exam.totalQuestions || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {exam.duration} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(exam.status)}
                        {exam.isPublished ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            Unpublished
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {exam.assignedStudents?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onView(exam)}
                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-2"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onEdit(exam)}
                        className="text-green-600 hover:text-green-900 dark:hover:text-green-400 mr-2"
                      >
                        Edit
                      </button>
                      {exam.isPublished ? (
                        <button
                          onClick={() => handleUnpublish(exam.id)}
                          className="text-yellow-600 hover:text-yellow-900 dark:hover:text-yellow-400 mr-2"
                        >
                          Unpublish
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePublish(exam.id)}
                          className="text-purple-600 hover:text-purple-900 dark:hover:text-purple-400 mr-2"
                        >
                          Publish
                        </button>
                      )}
                      <button
                        onClick={() => onResults(exam)}
                        className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400 mr-2"
                      >
                        Results
                      </button>
                      <button
                        onClick={() => handleDelete(exam.id, exam.title)}
                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Total: {exams.length} exams
      </div>
    </div>
  );
};

export default ExamList;