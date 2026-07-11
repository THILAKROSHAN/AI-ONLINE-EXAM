import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginStudent } from '../../services/firebase/auth';
import Button from '../common/Buttons/Button';
import Input from '../common/Forms/Input';
import Spinner from '../common/Loading/Spinner';

const StudentLogin = () => {
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await loginStudent(formData.email, formData.password);
      
      if (result.success) {
        await refreshUserData();
        navigate('/student/dashboard');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

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