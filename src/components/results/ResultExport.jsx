import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { exportResults } from '../../services/api/result';
import Button from '../common/Buttons/Button';
import Spinner from '../common/Loading/Spinner';

const ResultExport = ({ onClose, filters }) => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [format, setFormat] = useState('excel');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');

    try {
      const result = await exportResults(
        userData.organizationId,
        filters || {},
        format
      );

      if (result.success) {
        setSuccess(true);
        if (result.data?.url) {
          window.open(result.data.url, '_blank');
        }
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Failed to export results');
      }
    } catch (error) {
      console.error('Export error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Export Started!
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Your export is being processed. The download should start automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Export Results
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Export results to Excel or CSV format
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="label">Export Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="input-field"
            disabled={loading}
          >
            <option value="excel">Excel (.xlsx)</option>
            <option value="csv">CSV</option>
          </select>
        </div>

        {filters && Object.keys(filters).length > 0 && (
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Active Filters:
            </p>
            <div className="flex flex-wrap gap-2">
              {filters.examId && (
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Exam ID: {filters.examId}
                </span>
              )}
              {filters.minScore && (
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Min Score: {filters.minScore}%
                </span>
              )}
              {filters.maxScore && (
                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  Max Score: {filters.maxScore}%
                </span>
              )}
              {filters.isPublished !== undefined && (
                <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {filters.isPublished ? 'Published' : 'Unpublished'}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : 'Export Results'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ResultExport;