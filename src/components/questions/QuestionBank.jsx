import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getOrganizationQuestions, toggleQuestionStatus, updateQuestionStatus, deleteQuestion } from '../../services/api/question';
import Button from '../common/Buttons/Button';
import Spinner from '../common/Loading/Spinner';
import Toast from '../common/Notifications/Toast';
import QuestionFilters from './QuestionFilters';
import { QUESTION_TYPES, QUESTION_TYPE_LABELS } from '../../utils/constants/questionTypes';

const QuestionBank = ({ onEdit, onView, onImport, onExport }) => {
  const { userData } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    difficulty: '',
    subjectId: '',
    status: 'all',
  });

  useEffect(() => {
    if (userData?.organizationId) {
      loadQuestions();
    }
  }, [userData]);

  const loadQuestions = async () => {
    setLoading(true);
    setError('');

    try {
      const filterParams = {
        ...filters,
        status: filters.status === 'all' ? undefined : filters.status,
      };
      
      const result = await getOrganizationQuestions(userData.organizationId, filterParams);
      
      if (result.success) {
        let filteredData = result.data;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(question =>
            question.text?.toLowerCase().includes(searchLower) ||
            question.topic?.toLowerCase().includes(searchLower)
          );
        }
        setQuestions(filteredData);
      } else {
        setError(result.error || 'Failed to load questions');
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (questionId, currentStatus) => {
    try {
      const result = await toggleQuestionStatus(questionId, !currentStatus);

      if (result.success) {
        setSuccess(`Question ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        await loadQuestions();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update question status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleUpdateStatus = async (questionId, status) => {
    try {
      const result = await updateQuestionStatus(questionId, status);

      if (result.success) {
        setSuccess(`Question status updated to ${status}`);
        await loadQuestions();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update question status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await deleteQuestion(questionId);

      if (result.success) {
        setSuccess(`Question deleted successfully`);
        await loadQuestions();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to delete question');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleApplyFilters = () => {
    loadQuestions();
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: '',
      difficulty: '',
      subjectId: '',
      status: 'all',
    });
    setTimeout(loadQuestions, 100);
  };

  const getTypeColor = (type) => {
    const colors = {
      mcq: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      true_false: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      fill_blank: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      descriptive: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      paragraph: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    };
    return colors[type] || colors.mcq;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[difficulty] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      archived: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    return colors[status] || colors.draft;
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
      <QuestionFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        onImport={onImport}
        onExport={onExport}
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
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Marks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  AI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {questions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No questions found
                  </td>
                </tr>
              ) : (
                questions.map((question) => (
                  <tr key={question.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                          {question.text}
                        </div>
                        {question.topic && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Topic: {question.topic}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(question.type)}`}>
                        {QUESTION_TYPE_LABELS[question.type] || question.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          question.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {question.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(question.status)}`}>
                          {question.status?.toUpperCase() || 'DRAFT'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {question.marks || 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {question.isAIGenerated ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          🤖 AI
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                          Manual
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onView(question)}
                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-2"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onEdit(question)}
                        className="text-green-600 hover:text-green-900 dark:hover:text-green-400 mr-2"
                      >
                        Edit
                      </button>
                      <select
                        onChange={(e) => handleUpdateStatus(question.id, e.target.value)}
                        className="text-xs border rounded px-2 py-1 mr-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                        value={question.status || 'draft'}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                      <button
                        onClick={() => handleToggleStatus(question.id, question.isActive)}
                        className={`mr-2 ${
                          question.isActive 
                            ? 'text-yellow-600 hover:text-yellow-900' 
                            : 'text-green-600 hover:text-green-900'
                        } dark:hover:text-white`}
                      >
                        {question.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
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
        Total: {questions.length} questions
      </div>
    </div>
  );
};

export default QuestionBank;