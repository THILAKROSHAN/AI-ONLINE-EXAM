import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { changePassword } from '../../services/firebase/auth';
import Button from '../common/Buttons/Button';
import Input from '../common/Forms/Input';
import Spinner from '../common/Loading/Spinner';
import Toast from '../common/Notifications/Toast';

const ChangePassword = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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

  const handleSubmit = async (e) => {
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
        setSuccess(true);
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setTimeout(() => {
          if (onSuccess) onSuccess();
          if (onClose) onClose();
        }, 2000);
      } else {
        setError(result.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
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
            Password Changed!
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Your password has been updated successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Change Password
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Update your password to keep your account secure
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <Input
          type="password"
          name="currentPassword"
          label="Current Password"
          placeholder="Enter your current password"
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
          placeholder="Confirm your new password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={loading}
        />

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
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : 'Change Password'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChangePassword;