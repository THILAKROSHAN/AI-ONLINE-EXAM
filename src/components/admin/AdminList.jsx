import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getOrganizationAdmins, toggleAdminStatus, deleteAdmin } from '../../services/api/admin';
import Button from '../common/Buttons/Button';
import Spinner from '../common/Loading/Spinner';
import Toast from '../common/Notifications/Toast';
import { ROLES, ROLE_LABELS, ROLE_COLORS } from '../../utils/constants/roles';

const AdminList = ({ onEdit, onAdd }) => {
  const { userData } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (userData?.organizationId) {
      loadAdmins();
    }
  }, [userData]);

  const loadAdmins = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getOrganizationAdmins(userData.organizationId);
      
      if (result.success) {
        setAdmins(result.data);
      } else {
        setError(result.error || 'Failed to load admins');
      }
    } catch (error) {
      console.error('Error loading admins:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (adminId, currentStatus) => {
    try {
      const result = await toggleAdminStatus(adminId, !currentStatus);

      if (result.success) {
        setSuccess(`Admin ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        await loadAdmins();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update admin status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleDelete = async (adminId, adminName) => {
    if (!window.confirm(`Are you sure you want to delete admin "${adminName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const result = await deleteAdmin(adminId);

      if (result.success) {
        setSuccess(`Admin deleted successfully`);
        await loadAdmins();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to delete admin');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      setError('An unexpected error occurred');
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canManage = userData?.role === ROLES.SUPER_ADMIN || 
                    userData?.role === ROLES.ORGANIZATION_ADMIN;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field max-w-xs"
          />
        </div>
        {canManage && (
          <Button variant="primary" onClick={onAdd}>
            Add Admin
          </Button>
        )}
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
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Department
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
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No admins found
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                          {admin.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {admin.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${ROLE_COLORS[admin.role]}`}>
                        {ROLE_LABELS[admin.role] || admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {admin.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        admin.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {canManage && admin.id !== userData?.uid && (
                        <>
                          <button
                            onClick={() => onEdit(admin)}
                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(admin.id, admin.isActive)}
                            className={`mr-3 ${
                              admin.isActive 
                                ? 'text-yellow-600 hover:text-yellow-900' 
                                : 'text-green-600 hover:text-green-900'
                            } dark:hover:text-white`}
                          >
                            {admin.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(admin.id, admin.name)}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {admin.id === userData?.uid && (
                        <span className="text-gray-400 text-xs">(You)</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Total: {filteredAdmins.length} admins
      </div>
    </div>
  );
};

export default AdminList;