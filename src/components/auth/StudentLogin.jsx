import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginUser } from '../../services/firebase/auth';
import Button from '../common/Buttons/Button';
import Input from '../common/Forms/Input';
import Spinner from '../common/Loading/Spinner';

const StudentLogin = () => {
  const navigate = useNavigate();
  const { refreshUserData, loading: authLoading, isAuthenticated, userData } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  console.log('📋 StudentLogin rendering:', { 
    authLoading, 
    isAuthenticated, 
    role: userData?.role,
  });

  // If already authenticated, redirect based on role
  if (!authLoading && isAuthenticated && userData?.role) {
    console.log('🔄 Already authenticated, redirecting based on role:', userData.role);
    if (userData.role === 'owner' || userData.role === 'admin') {
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
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('🔑 Attempting student login...');
      const result = await loginUser(formData.email, formData.password);
      console.log('📋 Login result:', result);
      
      if (result.success) {
        console.log('✅ Login successful, refreshing user data...');
        await refreshUserData();
        
        if (result.userData.role === 'student') {
          navigate('/student/dashboard');
        } else if (result.userData.role === 'owner' || result.userData.role === 'admin') {
          navigate('/admin/dashboard');
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
  };

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Student Login
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Sign in to access your exams and results
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          name="email"
          label="Email Address"
          placeholder="Enter your student email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Contact your administrator if you forgot your password
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Don't have an account? Contact your administrator to create one.
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        <Link to="/admin/login" className="hover:text-primary-600 dark:hover:text-primary-400">
          Admin Login →
        </Link>
      </p>
    </div>
  );
};

export default StudentLogin;