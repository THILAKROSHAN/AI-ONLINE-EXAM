import React, { useState } from 'react';
import { generateResultReport } from '../../services/api/result';
import Button from '../common/Buttons/Button';
import Spinner from '../common/Loading/Spinner';

const ResultPDF = ({ resultId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await generateResultReport(resultId);

      if (result.success && result.data?.url) {
        setSuccess(true);
        window.open(result.data.url, '_blank');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Failed to generate PDF');
      }
    } catch (error) {
      console.error('PDF generation error:', error);
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
            PDF Generated!
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Your PDF report has been generated. The download should start automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Generate PDF Report
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Generate a detailed PDF report for this result
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            ⚠️ The PDF report will include:
          </p>
          <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-400 list-disc list-inside">
            <li>Student information</li>
            <li>Exam details</li>
            <li>Score and grade</li>
            <li>Question-wise analysis</li>
            <li>Performance summary</li>
          </ul>
        </div>

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
            type="button"
            variant="primary"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : 'Generate PDF'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultPDF;