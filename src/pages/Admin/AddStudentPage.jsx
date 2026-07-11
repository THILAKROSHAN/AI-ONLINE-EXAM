import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createStudentAccount } from '../../services/firebase/auth';
import Button from '../../components/common/Buttons/Button';
import Input from '../../components/common/Forms/Input';
import Spinner from '../../components/common/Loading/Spinner';
import Toast from '../../components/common/Notifications/Toast';
import { sendStudentCredentials } from '../../services/firebase/functions';

const AddStudentPage = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      setError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const password = generatePassword();
      setGeneratedPassword(password);

      const result = await createStudentAccount(
        {
          displayName: formData.name,
          email: formData.email,
          organizationId: userData.organizationId,
          createdBy: userData.uid,
          studentId: `STU${Date.now().toString().slice(-6)}`,
        },
        password
      );

      if (result.success) {
        await sendStudentCredentials(
          result.user.uid,
          formData.email,
          password,
          userData.organizationId
        );

        setSuccess(true);
        setShowSuccessDialog(true);
        setFormData({ name: '', email: '' });
      } else {
        setError(result.error || 'Failed to create student account');
      }
    } catch (error) {
      console.error('Error creating student:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    Toast.success('Password copied to clipboard');
  };

  const handleCopyAll = () => {
    const text = `Name: ${formData.name}\nEmail: ${formData.email}\nPassword: ${generatedPassword}`;
    navigator.clipboard.writeText(text);
    Toast.success('All details copied to clipboard');
  };

  const handleCloseDialog = () => {
    setShowSuccessDialog(false);
    setGeneratedPassword('');
    navigate('/admin/students');
  };

  if (showSuccessDialog) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Student Created Successfully!
            </h3>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Name:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Email:</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{formData.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Password:</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                  {generatedPassword}
                </span>
                <button
                  onClick={handleCopyPassword}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={handleCopyAll} className="flex-1 btn-secondary text-sm">
              Copy All
            </button>
            <button onClick={handleCloseDialog} className="flex-1 btn-primary text-sm">
              Close
            </button>
          </div>

          <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
            Credentials have been sent to the student's email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Add New Student
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Create a new student account. Credentials will be auto-generated and sent via email.
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
          message="Student created successfully!"
          duration={3000}
          onClose={() => setSuccess(false)}
        />
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            name="name"
            label="Student Name"
            placeholder="Enter student's full name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <Input
            type="email"
            name="email"
            label="Student Email"
            placeholder="Enter student's email address"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-400 flex items-start">
              <span className="mr-2">ℹ️</span>
              <span>
                A strong password will be automatically generated and sent to the student's email.
                No manual password entry is required.
              </span>
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/students')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : 'Create Student'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentPage;