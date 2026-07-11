import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createAdmin, updateAdmin } from '../../services/api/admin';
import { registerAdmin } from '../../services/firebase/auth'; // Correct import
import Button from '../common/Buttons/Button';
import Input from '../common/Forms/Input';
import Spinner from '../common/Loading/Spinner';
import Toast from '../common/Notifications/Toast';
import { ROLES, ROLE_LABELS } from '../../utils/constants/roles';


const AdminForm = ({ admin, onClose, onSuccess }) => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: ROLES.ORGANIZATION_ADMIN,
    department: '',
    title: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (admin) {
      setIsEdit(true);
      setFormData({
        name: admin.name || '',
        email: admin.email || '',
        phone: admin.phone || '',
        role: admin.role || ROLES.ORGANIZATION_ADMIN,
        department: admin.department || '',
        title: admin.title || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [admin]);

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
    
    if (!formData.name || !formData.email) {
      setError('Name and email are required');
      return;
    }

    if (!isEdit) {
      if (!formData.password || !formData.confirmPassword) {
        setError('Password is required for new admin');
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
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      let result;
      
      if (isEdit) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          department: formData.department,
          title: formData.title,
        };
        result = await updateAdmin(admin.id, updateData);
      } else {
        // Use registerAdmin to create admin with proper role
        result = await registerAdmin(formData.email, formData.password, {
          displayName: formData.name,
          role: formData.role,
          organizationId: userData.organizationId,
          createdBy: userData.uid,
        });
        
        if (result.success) {
          // Also create admin document in administrators collection
          await createAdmin({
            uid: result.user.uid,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            organizationId: userData.organizationId,
            department: formData.department,
            title: formData.title,
            createdBy: userData.uid,
          });
        }
      }

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setError(result.error || `Failed to ${isEdit ? 'update' : 'create'} admin`);
      }
    } catch (error) {
      console.error('Admin form error:', error);
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
            {isEdit ? 'Admin Updated!' : 'Admin Created!'}
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isEdit 
              ? 'Admin has been updated successfully.' 
              : 'Admin account created successfully.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEdit ? 'Edit Admin' : 'Add New Admin'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isEdit ? 'Update admin information' : 'Create a new admin account'}
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
            disabled={loading}
          />

          <Input
            type="email"
            name="email"
            label="Email Address"
            placeholder="Enter admin email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
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
            disabled={loading}
          />

          <div>
            <label className="label">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              <option value={ROLES.ORGANIZATION_ADMIN}>Organization Admin</option>
              <option value={ROLES.SUB_ADMIN}>Sub Admin</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            name="department"
            label="Department"
            placeholder="Enter department"
            value={formData.department}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            type="text"
            name="title"
            label="Job Title"
            placeholder="Enter job title"
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {!isEdit && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="password"
                name="password"
                label="Password"
                placeholder="Create password (min 6 chars)"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <Input
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </>
        )}
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
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : (isEdit ? 'Update Admin' : 'Create Admin')}
        </Button>
      </div>
    </form>
  );
};

export default AdminForm;