import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/common/Loading/Spinner';

const RoleRoute = ({ allowedRoles = [], redirectTo = '/unauthorized' }) => {
  const { userData, loading, isAuthenticated } = useAuth();

  console.log('🎭 RoleRoute rendering:', {
    loading,
    isAuthenticated,
    userRole: userData?.role,
    allowedRoles,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = userData?.role;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;