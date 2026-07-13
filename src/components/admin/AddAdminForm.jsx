import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createAdminAccount, checkAdminLimit } from '../../services/firebase/auth';
import Button from '../common/Buttons/Button';
import Input from '../common/Forms/Input';
import Spinner from '../common/Loading/Spinner';

const AddAdminForm = ({ onClose, onSuccess }) => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [canAddAdmin, setCanAddAdmin] = useState(false);
  const [adminCount, setAdminCount] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    title: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    checkAdminLimit();
  }, []);

  const checkAdminLimit = async () => {
    setChecking(true);
    try {
      const result = await checkAdminLimit(userData.organizationId);
      if (result.success) {
        setAdminCount(result.count);
        setCanAddAdmin(result.canAdd);
        if (!result.canAdd) {
          setError(`Maximum 5 admins allowed. Current: ${result.count}`);
        }
      }
    } catch (error) {
      console.error('Error checking admin limit:', error);
      setError('Failed to check admin limit');
    } finally {
      setChecking(false);
    }
  };

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
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email and password are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await createAdminAccount({
        displayName: formData.name,
        email: formData.email,
        phone: formData.phone,
        organizationId: userData.organizationId,
        department: formData.department,
        title: formData.title,
        createdBy: userData.uid,
      }, formData.password);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="p-6 text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Checking admin limit...</p>
      </div>
    );
  }

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
            Admin Added Successfully!
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Credentials have been sent to the admin's email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Add New Admin
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Current admins: {adminCount}/5
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            name="name"
            label="Full Name"
            placeholder="Enter admin name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading || !canAddAdmin}
          />

          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="Enter admin email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading || !canAddAdmin}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            name="phone"
            label="Phone Number"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
            disabled={loading || !canAddAdmin}
          />

          <Input
            type="text"
            name="department"
            label="Department"
            placeholder="Enter department"
            value={formData.department}
            onChange={handleChange}
            disabled={loading || !canAddAdmin}
          />
        </div>

        <Input
          type="text"
          name="title"
          label="Job Title"
          placeholder="Enter job title"
          value={formData.title}
          onChange={handleChange}
          disabled={loading || !canAddAdmin}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Create password (min 6 chars)"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading || !canAddAdmin}
          />

          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading || !canAddAdmin}
          />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
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
            disabled={loading || !canAddAdmin}
          >
            {loading ? <Spinner size="sm" /> : 'Add Admin'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddAdminForm;