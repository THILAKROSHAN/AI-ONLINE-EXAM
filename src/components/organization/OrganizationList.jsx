import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllOrganizations, updateOrganization, deleteOrganization } from '../../services/api/organization';
import Button from '../common/Buttons/Button';
import Spinner from '../common/Loading/Spinner';
import Toast from '../common/Notifications/Toast';
import { ROLES } from '../../utils/constants/roles';

const OrganizationList = () => {
  const { userData } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedOrg, setSelectedOrg] = useState(null);

  useEffect(() => {
    // Only Super Admin can view all organizations
    if (userData?.role === ROLES.SUPER_ADMIN) {
      loadOrganizations();
    }
  }, [userData]);

  const loadOrganizations = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getAllOrganizations();
      
      if (result.success) {
        setOrganizations(result.data);
      } else {
        setError(result.error || 'Failed to load organizations');
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (orgId, currentStatus) => {
    try {
      const result = await updateOrganization(orgId, {
        isActive: !currentStatus,
      });

      if (result.success) {
        setSuccess(`Organization ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        await loadOrganizations();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update organization status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleDelete = async (orgId) => {
    if (!window.confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await deleteOrganization(orgId);

      if (result.success) {
        setSuccess('Organization deleted successfully');
        await loadOrganizations();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to delete organization');
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
      setError('An unexpected error occurred');
    }
  };

  const getPlanColor = (plan) => {
    const colors = {
      free: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      basic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      premium: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      enterprise: 'bg-gold-100 text-gold-800 dark:bg-gold-900 dark:text-gold-200',
    };
    return colors[plan] || colors.free;
  };

  if (userData?.role !== ROLES.SUPER_ADMIN) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Organizations
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage all organizations in the system
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => window.location.href = '/admin/organization/create'}
        >
          Add Organization
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {organizations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No organizations found
                  </td>
                </tr>
              ) : (
                organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                          {org.name?.[0]?.toUpperCase() || 'O'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {org.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {org.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPlanColor(org.subscription?.plan)}`}>
                        {org.subscription?.plan?.toUpperCase() || 'FREE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        org.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {org.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {org.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleToggleStatus(org.id, org.isActive)}
                        className={`mr-3 ${org.isActive ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'} dark:hover:text-white`}
                      >
                        {org.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(org.id)}
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
    </div>
  );
};

export default OrganizationList;