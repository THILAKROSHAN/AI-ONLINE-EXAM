import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getOrganizationResults, publishResult, unpublishResult, deleteResult } from '../../services/api/result';
import Button from '../common/Buttons/Button';
import Spinner from '../common/Loading/Spinner';
import Toast from '../common/Notifications/Toast';

const ResultList = ({ onView, onExport, examId }) => {
  const { userData } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    minScore: '',
    maxScore: '',
  });

  useEffect(() => {
    if (userData?.organizationId) {
      loadResults();
    }
  }, [userData, examId]);

  const loadResults = async () => {
    setLoading(true);
    setError('');

    try {
      const filterParams = {
        examId: examId || undefined,
        isPublished: filters.status === 'published' ? true : filters.status === 'unpublished' ? false : undefined,
        minScore: filters.minScore ? parseFloat(filters.minScore) : undefined,
        maxScore: filters.maxScore ? parseFloat(filters.maxScore) : undefined,
      };
      
      const result = await getOrganizationResults(userData.organizationId, filterParams);
      
      if (result.success) {
        let filteredData = result.data;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(r =>
            r.studentName?.toLowerCase().includes(searchLower) ||
            r.studentEmail?.toLowerCase().includes(searchLower) ||
            r.examTitle?.toLowerCase().includes(searchLower)
          );
        }
        setResults(filteredData);
      } else {
        setError(result.error || 'Failed to load results');
      }
    } catch (error) {
      console.error('Error loading results:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (resultId) => {
    try {
      const result = await publishResult(resultId);
      if (result.success) {
        setSuccess('Result published successfully');
        await loadResults();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to publish result');
      }
    } catch (error) {
      console.error('Error publishing result:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleUnpublish = async (resultId) => {
    try {
      const result = await unpublishResult(resultId);
      if (result.success) {
        setSuccess('Result unpublished successfully');
        await loadResults();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to unpublish result');
      }
    } catch (error) {
      console.error('Error unpublishing result:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleDelete = async (resultId) => {
    if (!window.confirm('Are you sure you want to delete this result?')) {
      return;
    }

    try {
      const result = await deleteResult(resultId);
      if (result.success) {
        setSuccess('Result deleted successfully');
        await loadResults();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to delete result');
      }
    } catch (error) {
      console.error('Error deleting result:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleApplyFilters = () => {
    loadResults();
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      minScore: '',
      maxScore: '',
    });
    setTimeout(loadResults, 100);
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
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="label">Search</label>
            <input
              type="text"
              name="search"
              placeholder="Search by name, email..."
              value={filters.search}
              onChange={handleFilterChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="label">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </div>

          <div>
            <label className="label">Min Score</label>
            <input
              type="number"
              name="minScore"
              placeholder="Min %"
              value={filters.minScore}
              onChange={handleFilterChange}
              className="input-field"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="label">Max Score</label>
            <input
              type="number"
              name="maxScore"
              placeholder="Max %"
              value={filters.maxScore}
              onChange={handleFilterChange}
              className="input-field"
              min="0"
              max="100"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Button variant="primary" onClick={handleApplyFilters}>Apply Filters</Button>
          <Button variant="secondary" onClick={handleResetFilters}>Reset</Button>
          {onExport && (
            <Button variant="success" onClick={onExport}>Export</Button>
          )}
        </div>
      </div>

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
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {results.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No results found
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {result.studentName || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {result.studentEmail || 'No email'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {result.examTitle || 'Untitled Exam'}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className={`text-sm font-bold ${
                          (result.percentage || 0) >= 40
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {result.percentage?.toFixed(1) || 0}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {result.obtainedMarks || 0}/{result.totalMarks || 0}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          result.isPassed
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {result.isPassed ? 'Passed' : 'Failed'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          result.isPublished
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {result.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {result.rank || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onView(result)}
                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-2"
                      >
                        View
                      </button>
                      {result.isPublished ? (
                        <button
                          onClick={() => handleUnpublish(result.id)}
                          className="text-yellow-600 hover:text-yellow-900 dark:hover:text-yellow-400 mr-2"
                        >
                          Unpublish
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePublish(result.id)}
                          className="text-green-600 hover:text-green-900 dark:hover:text-green-400 mr-2"
                        >
                          Publish
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(result.id)}
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
        Total: {results.length} results
      </div>
    </div>
  );
};

export default ResultList;