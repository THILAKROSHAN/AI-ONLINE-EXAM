import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/common/Loading/Spinner';

const AdminRoute = () => {
  const { user, userData, loading, isAuthenticated, isAuthorized, isAdmin } = useAuth();

  console.log('👔 AdminRoute rendering:', {
    loading,
    isAuthenticated,
    isAuthorized,
    isAdmin,
    userRole: userData?.role,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !isAuthorized) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    if (userData?.role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;