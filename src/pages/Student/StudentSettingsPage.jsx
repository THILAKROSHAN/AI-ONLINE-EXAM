import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { changePassword } from '../../services/firebase/auth';
import Button from '../../components/common/Buttons/Button';
import Input from '../../components/common/Forms/Input';
import Spinner from '../../components/common/Loading/Spinner';
import Toast from '../../components/common/Notifications/Toast';

const StudentSettingsPage = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await changePassword(formData.currentPassword, formData.newPassword);
      if (result.success) {
        setSuccess('Password changed successfully');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="container-custom py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Change Password
          </h2>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              type="password"
              name="currentPassword"
              label="Current Password"
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Input
              type="password"
              name="newPassword"
              label="New Password"
              placeholder="Enter new password (min 6 chars)"
              value={formData.newPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Input
              type="password"
              name="confirmPassword"
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : 'Change Password'}
            </Button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account Management
          </h2>

          <div className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Email
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.email}
              </p>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Account Type
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                Student
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="danger"
                className="w-full"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSettingsPage;