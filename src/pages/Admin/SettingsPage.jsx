import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import OrganizationSettings from '../../components/organization/OrganizationSettings';
import { ROLES } from '../../utils/constants/roles';

const SettingsPage = () => {
  const { userData } = useAuth();
  const isSuperAdmin = userData?.role === ROLES.SUPER_ADMIN;

  return (
    <div className="container-custom py-6">
      <OrganizationSettings />
      
      {isSuperAdmin && (
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            🔑 Super Admin: You have full access to all organization settings.
          </p>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;