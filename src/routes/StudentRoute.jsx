import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/common/Loading/Spinner';

const StudentRoute = () => {
  const { user, userData, loading, isAuthenticated, isStudent } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/student/login" replace />;
  }

  if (!isStudent) {
    if (userData?.role === 'admin' || userData?.role === 'super_admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default StudentRoute;