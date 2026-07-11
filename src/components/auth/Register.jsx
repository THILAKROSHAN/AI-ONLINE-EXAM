import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerAdmin } from '../../services/firebase/auth';
import Button from '../common/Buttons/Button';
import Input from '../common/Forms/Input';
import Spinner from '../common/Loading/Spinner';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
    organizationId: null,
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
    
    if (!formData.displayName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
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
      const result = await registerAdmin(
        formData.email,
        formData.password,
        {
          displayName: formData.displayName,
          role: formData.role,
          organizationId: formData.organizationId,
        }
      );

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin/login');
        }, 2000);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Registration Successful!
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Your admin account has been created.
              <br />
              Please login to continue.
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create Admin Account
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Register as an administrator
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="text"
          name="displayName"
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.displayName}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <Input
          type="email"
          name="email"
          label="Email Address"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Create a password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <Input
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
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
          {loading ? <Spinner size="sm" /> : 'Create Admin Account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link
          to="/admin/login"
          className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
        >
          Sign in
        </Link>
      </p>
      
      <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        <Link to="/student/login" className="hover:text-primary-600 dark:hover:text-primary-400">
          Student Login →
        </Link>
      </p>
    </div>
  );
};

export default Register;