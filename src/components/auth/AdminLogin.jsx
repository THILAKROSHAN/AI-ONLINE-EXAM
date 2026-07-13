import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  loginUser,
  createSuperAdmin,
  googleSignIn,
  handleRedirectResult,
} from '../../services/firebase/auth';
import Button from '../common/Buttons/Button';
import Input from '../common/Forms/Input';
import Spinner from '../common/Loading/Spinner';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { refreshUserData, loading: authLoading, isAuthenticated, userData } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });

  console.log('📋 AdminLogin rendering:', {
    authLoading,
    isAuthenticated,
    role: userData?.role,
    isProcessingRedirect,
  });

  // Check for redirect result on mount
  useEffect(() => {
    let isMounted = true;

    const checkRedirect = async () => {
      try {
        console.log('🔍 Checking for redirect result...');
        const result = await handleRedirectResult();
        console.log('📋 Redirect result:', result);

        if (!isMounted) return;

        if (result && result.success) {
          console.log('✅ Redirect successful, refreshing user data...');
          await refreshUserData();

          if (result.userData.role === 'super_admin' || result.userData.role === 'admin') {
            navigate('/admin/dashboard');
          } else if (result.userData.role === 'student') {
            navigate('/student/dashboard');
          } else {
            navigate('/unauthorized');
          }
          return;
        } else if (result && result.noResult) {
          console.log('ℹ️ No redirect result found');
          setIsProcessingRedirect(false);
          return;
        } else if (result && result.success === false) {
          console.error('❌ Redirect error:', result.error);
          setError(result.error || 'Google sign-in failed. Please try again.');
          setIsProcessingRedirect(false);
          return;
        }

        setIsProcessingRedirect(false);
      } catch (error) {
        console.error('❌ Redirect check error:', error);
        if (isMounted) {
          setError('An unexpected error occurred. Please try again.');
          setIsProcessingRedirect(false);
        }
      }
    };

    checkRedirect();

    // Timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isMounted && isProcessingRedirect) {
        console.log('⏰ Redirect check timeout');
        setIsProcessingRedirect(false);
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [navigate, refreshUserData, isProcessingRedirect]);

  // If already authenticated, redirect
  if (!authLoading && isAuthenticated && userData?.role) {
    console.log('🔄 Already authenticated, redirecting based on role:', userData.role);
    if (userData.role === 'super_admin' || userData.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (userData.role === 'student') {
      navigate('/student/dashboard');
    }
    return null;
  }

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

    if (isSignUp) {
      // Sign Up flow
      if (!formData.displayName) {
        setError('Please enter your full name');
        return;
      }
      if (!formData.email || !formData.password) {
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
        console.log('📝 Attempting Super Admin registration...');
        const result = await createSuperAdmin(formData.email, formData.password, {
          displayName: formData.displayName,
        });
        console.log('📋 Registration result:', result);

        if (result.success) {
          console.log('✅ Registration successful, refreshing user data...');
          await refreshUserData();
          navigate('/admin/dashboard');
        } else {
          setError(result.error || 'Registration failed. Please try again.');
        }
      } catch (error) {
        setError('An unexpected error occurred. Please try again.');
        console.error('Registration error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Login flow
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }

      setLoading(true);
      setError('');

      try {
        console.log('🔑 Attempting login...');
        const result = await loginUser(formData.email, formData.password);
        console.log('📋 Login result:', result);

        if (result.success) {
          console.log('✅ Login successful, refreshing user data...');
          await refreshUserData();

          if (result.userData.role === 'super_admin' || result.userData.role === 'admin') {
            navigate('/admin/dashboard');
          } else if (result.userData.role === 'student') {
            navigate('/student/dashboard');
          } else {
            navigate('/unauthorized');
          }
        } else {
          setError(result.error || 'Login failed. Please try again.');
        }
      } catch (error) {
        console.error('❌ Login error:', error);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('🔄 Attempting Google Sign-In...');
      const result = await googleSignIn();
      console.log('📋 Google Sign-In result:', result);

      if (result.success) {
        if (result.redirecting) {
          console.log('🔄 Redirecting to Google...');
          return;
        }
        console.log('✅ Google Sign-In successful, refreshing user data...');
        await refreshUserData();

        if (result.userData.role === 'super_admin' || result.userData.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (result.userData.role === 'student') {
          navigate('/student/dashboard');
        } else {
          navigate('/unauthorized');
        }
      } else {
        setError(result.error || 'Google sign-in failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Google sign-in error:', error);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  // Show loading while checking redirect or auth loading
  if (isProcessingRedirect || authLoading) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {isProcessingRedirect ? 'Processing...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isSignUp ? 'Create Super Admin Account' : 'Admin Login'}
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {isSignUp
            ? 'Create the first Super Admin account'
            : 'Sign in to your admin account'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {isSignUp && (
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
        )}

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
          label={isSignUp ? 'Create Password' : 'Password'}
          placeholder={isSignUp ? 'Create a password (min 6 chars)' : 'Enter your password'}
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
        />

        {isSignUp && (
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
        )}

        {!isSignUp && (
          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Forgot password?
            </Link>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : (isSignUp ? 'Create Account' : 'Sign In')}
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError('');
            setFormData({
              email: '',
              password: '',
              confirmPassword: '',
              displayName: '',
            });
          }}
          className="ml-1 text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
        >
          {isSignUp ? 'Sign In' : 'Create Account'}
        </button>
      </p>

      <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        <Link to="/student/login" className="hover:text-primary-600 dark:hover:text-primary-400">
          Student Login →
        </Link>
      </p>
    </div>
  );
};

export default AdminLogin;