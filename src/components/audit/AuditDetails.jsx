import React from 'react';
import Button from '../common/Buttons/Button';

const AuditDetails = ({ log, onClose }) => {
  if (!log) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        No log details available
      </div>
    );
  }

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return 'Complex Object';
      }
    }
    return String(value);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Audit Log Details
        </h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={onClose}
        >
          Close
        </Button>
      </div>

      <div className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Action</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {log.action}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Action Type</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {log.actionType?.replace(/_/g, ' ')?.toUpperCase() || 'N/A'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Target Type</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {log.targetType || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Target ID</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {log.targetId || 'N/A'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Target Name</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {log.targetName || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <p className={`text-sm font-medium ${
              log.status === 'success' 
                ? 'text-green-600 dark:text-green-400' 
                : log.status === 'failure'
                ? 'text-red-600 dark:text-red-400'
                : 'text-yellow-600 dark:text-yellow-400'
            }`}>
              {log.status?.toUpperCase() || 'N/A'}
            </p>
          </div>
        </div>

        {/* Performed By */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Performed By
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {log.performedByName || 'System'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {log.performedByEmail || 'N/A'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {log.performedByRole || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {log.performedBy || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Changes */}
        {(log.oldValue || log.newValue) && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Changes
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Old Value</p>
                <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-auto max-h-[100px]">
                  <pre className="text-xs text-gray-900 dark:text-white whitespace-pre-wrap">
                    {formatValue(log.oldValue)}
                  </pre>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">New Value</p>
                <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-auto max-h-[100px]">
                  <pre className="text-xs text-gray-900 dark:text-white whitespace-pre-wrap">
                    {formatValue(log.newValue)}
                  </pre>
                </div>
              </div>
            </div>
            {log.changes && log.changes.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Changes List</p>
                <div className="mt-1 space-y-1">
                  {log.changes.map((change, index) => (
                    <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      • {change.field}: {change.old} → {change.new}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Details */}
        {log.details && Object.keys(log.details).length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Details
            </h4>
            <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-auto max-h-[150px]">
              <pre className="text-xs text-gray-900 dark:text-white whitespace-pre-wrap">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Error */}
        {log.error && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
              Error
            </h4>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">
                {log.error}
              </p>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Timestamps
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {log.createdAt?.toDate?.()?.toLocaleString() || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Timestamp</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {log.timestamp?.toDate?.()?.toLocaleString() || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Request Info */}
        {(log.ipAddress || log.userAgent) && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Request Info
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">IP Address</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {log.ipAddress || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">User Agent</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {log.userAgent || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditDetails;