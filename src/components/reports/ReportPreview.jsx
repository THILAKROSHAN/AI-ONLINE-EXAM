import React, { useState } from 'react';
import Button from '../common/Buttons/Button';
import { downloadReport } from '../../services/api/report';
import Spinner from '../common/Loading/Spinner';

const ReportPreview = ({ reportData }) => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  if (!reportData) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No report data to preview
      </div>
    );
  }

  const handleDownload = async (format = 'pdf') => {
    setDownloading(true);
    setError('');

    try {
      const result = await downloadReport(reportData.id, format);
      if (result.success && result.data?.url) {
        window.open(result.data.url, '_blank');
      } else {
        setError(result.error || 'Failed to download report');
      }
    } catch (error) {
      console.error('Download error:', error);
      setError('An unexpected error occurred');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Report Preview
        </h3>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleDownload('pdf')}
            disabled={downloading}
          >
            {downloading ? <Spinner size="sm" /> : 'PDF'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleDownload('excel')}
            disabled={downloading}
          >
            Excel
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleDownload('csv')}
            disabled={downloading}
          >
            CSV
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="p-6">
        {/* Report Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {reportData.title || 'Report'}
          </h2>
          {reportData.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {reportData.description}
            </p>
          )}
          <div className="mt-2 flex gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>Generated: {new Date().toLocaleDateString()}</span>
            <span>Type: {reportData.type?.toUpperCase() || 'N/A'}</span>
            {reportData.format && (
              <span>Format: {reportData.format.toUpperCase()}</span>
            )}
          </div>
        </div>

        {/* Summary */}
        {reportData.summary && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Summary
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(reportData.summary).map(([key, value]) => (
                <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {typeof value === 'number' ? value.toFixed(1) : value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts */}
        {reportData.charts && reportData.charts.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Charts
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportData.charts.map((chart, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {chart.title || `Chart ${index + 1}`}
                  </p>
                  <div className="h-[200px] flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded">
                    <span className="text-gray-500 dark:text-gray-400">Chart Placeholder</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Table */}
        {reportData.data && reportData.data.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    {reportData.headers?.map((header, index) => (
                      <th
                        key={index}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {reportData.data.slice(0, 10).map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-4 py-2 text-sm text-gray-900 dark:text-white"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {reportData.data.length > 10 && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Showing 10 of {reportData.data.length} rows
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPreview;