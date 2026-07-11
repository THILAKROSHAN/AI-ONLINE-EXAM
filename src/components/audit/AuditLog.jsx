import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getOrganizationAuditLogs } from '../../services/api/audit';
import Spinner from '../common/Loading/Spinner';
import Toast from '../common/Notifications/Toast';
import AuditFilters from './AuditFilters';
import AuditDetails from './AuditDetails';
import Modal from '../common/Modals/Modal';

const AuditLog = () => {
  const { userData } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filters, setFilters] = useState({
    actionType: '',
    targetType: '',
    performedBy: '',
    startDate: '',
    endDate: '',
    status: '',
    search: '',
  });

  useEffect(() => {
    if (userData?.organizationId) {
      loadLogs();
    }
  }, [userData]);

  const loadLogs = async () => {
    setLoading(true);
    setError('');

    try {
      const filterParams = {
        actionType: filters.actionType || undefined,
        targetType: filters.targetType || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        status: filters.status || undefined,
        limit: 100,
      };
      
      const result = await getOrganizationAuditLogs(userData.organizationId, filterParams);
      
      if (result.success) {
        let filteredData = result.data;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(log =>
            log.action?.toLowerCase().includes(searchLower) ||
            log.targetName?.toLowerCase().includes(searchLower) ||
            log.performedByName?.toLowerCase().includes(searchLower) ||
            log.performedByEmail?.toLowerCase().includes(searchLower)
          );
        }
        setLogs(filteredData);
      } else {
        setError(result.error || 'Failed to load audit logs');
      }
    } catch (error) {
      console.error('Error loading audit logs:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setShowDetails(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleApplyFilters = () => {
    loadLogs();
  };

  const handleResetFilters = () => {
    setFilters({
      actionType: '',
      targetType: '',
      performedBy: '',
      startDate: '',
      endDate: '',
      status: '',
      search: '',
    });
    setTimeout(loadLogs, 100);
  };

  const getActionTypeColor = (actionType) => {
    const colors = {
      create: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      update: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      delete: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      login: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      logout: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      password_change: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      exam_create: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      exam_update: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      exam_delete: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      question_create: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      question_update: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      question_delete: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      result_publish: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };
    return colors[actionType] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const getStatusColor = (status) => {
    const colors = {
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      failure: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
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
      <AuditFilters
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
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Performed By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No audit logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getActionTypeColor(log.actionType)}`}>
                          {log.actionType?.replace(/_/g, ' ')?.toUpperCase() || 'UNKNOWN'}
                        </span>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {log.action}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {log.targetName || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {log.targetType}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {log.performedByName || 'System'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {log.performedByEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {log.createdAt?.toDate?.()?.toLocaleString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(log.status)}`}>
                        {log.status?.toUpperCase() || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(log)}
                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                      >
                        View Details
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
        Total: {logs.length} logs
      </div>

      {/* Audit Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        size="lg"
        title="Audit Log Details"
      >
        <AuditDetails
          log={selectedLog}
          onClose={() => setShowDetails(false)}
        />
      </Modal>
    </div>
  );
};

export default AuditLog;