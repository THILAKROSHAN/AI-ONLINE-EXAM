import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ReportGenerator from '../../components/reports/ReportGenerator';
import ReportPreview from '../../components/reports/ReportPreview';
import { getReportHistory, deleteReport } from '../../services/api/report';
import Modal from '../../components/common/Modals/Modal';
import Button from '../../components/common/Buttons/Button';
import Spinner from '../../components/common/Loading/Spinner';
import Toast from '../../components/common/Notifications/Toast';

const ReportsPage = () => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reports, setReports] = useState([]);
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const result = await getReportHistory(userData.organizationId);
      if (result.success) {
        setReports(result.data);
      } else {
        setError(result.error || 'Failed to load reports');
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      const result = await deleteReport(reportId);
      if (result.success) {
        setSuccess('Report deleted successfully');
        await loadReports();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to delete report');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowPreview(true);
  };

  const handleGenerateSuccess = () => {
    loadReports();
    setShowGenerator(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container-custom py-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Reports
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Generate and manage reports for your organization
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowGenerator(true)}>
          Generate Report
        </Button>
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
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Report History
          </h3>
        </div>

        {reports.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No reports generated yet. Click "Generate Report" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Format
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Generated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {report.title || 'Untitled Report'}
                      </div>
                      {report.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {report.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {report.type?.toUpperCase() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {report.format?.toUpperCase() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {report.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewReport(report)}
                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={showGenerator}
        onClose={() => setShowGenerator(false)}
        size="lg"
        title="Generate Report"
      >
        <ReportGenerator
          onSuccess={handleGenerateSuccess}
          onClose={() => setShowGenerator(false)}
        />
      </Modal>

      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        size="lg"
        title="Report Preview"
      >
        <ReportPreview
          reportData={selectedReport}
          onClose={() => setShowPreview(false)}
        />
      </Modal>
    </div>
  );
};

export default ReportsPage;