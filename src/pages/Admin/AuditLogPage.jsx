import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuditLog from '../../components/audit/AuditLog';
import { ROLES } from '../../utils/constants/roles';

const AuditLogPage = () => {
  const { userData } = useAuth();

  if (userData?.role !== ROLES.SUPER_ADMIN && userData?.role !== ROLES.ORGANIZATION_ADMIN) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to view audit logs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Audit Log
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Track all activities and changes within your organization
        </p>
      </div>

      <AuditLog />
    </div>
  );
};

export default AuditLogPage;