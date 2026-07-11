import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { verifyResetCode, resetPassword } from '../../services/firebase/auth';
import Button from '../common/Buttons/Button';
import Input from '../common/Forms/Input';
import Spinner from '../common/Loading/Spinner';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');
    const oobCode = queryParams.get('oobCode');

    if (mode === 'resetPassword' && oobCode) {
      setCode(oobCode);
      verifyCode(oobCode);
    } else {
      setError('Invalid reset link. Please request a new one.');
      setVerifying(false);
    }
  }, [location]);

  const verifyCode = async (oobCode) => {
    try {
      const result = await verifyResetCode(oobCode);
      if (result.success) {
        setEmail(result.email);
        setVerifying(false);
      } else {
        setError(result.error || 'Invalid or expired reset link.');
        setVerifying(false);
      }
    } catch (error) {
      setError('An error occurred while verifying your reset link.');
      setVerifying(false);
      console.error('Verification error:', error);
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
    
    if (!formData.password || !formData.confirmPassword) {
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
      const result = await resetPassword(code, formData.password);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);
      } else {
        setError(result.error || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Verifying your reset link...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !success) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Invalid Reset Link
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {error}
            </p>
            <Link
              to="/forgot-password"
              className="mt-4 inline-block text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Request a new reset link
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              Password Reset Successful!
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Your password has been successfully reset.
              <br />
              You can now sign in with your new password.
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
          Reset Password
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Create a new password for <strong>{email}</strong>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="password"
          name="password"
          label="New Password"
          placeholder="Enter new password (min 6 characters)"
          value={formData.password}
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

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : 'Reset Password'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Remember your password?{' '}
        <Link
          to="/admin/login"
          className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default ResetPassword;