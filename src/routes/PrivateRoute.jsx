import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/common/Loading/Spinner';

const PrivateRoute = ({ allowedRoles = [] }) => {
  const { user, userData, loading, isAuthenticated, isAuthorized } = useAuth();

  console.log('🔒 PrivateRoute rendering:', {
    loading,
    isAuthenticated,
    isAuthorized,
    userRole: userData?.role,
    allowedRoles,
  });

  // If still loading, show spinner
  if (loading) {
    console.log('⏳ PrivateRoute: Still loading, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // If not authenticated or not authorized, redirect to unauthorized
  if (!isAuthenticated || !isAuthorized) {
    console.log('🚫 PrivateRoute: Not authenticated or authorized, redirecting to /unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles.length > 0) {
    const userRole = userData?.role;
    if (!allowedRoles.includes(userRole)) {
      console.log('🚫 PrivateRoute: Role mismatch, redirecting based on role:', userRole);
      if (userRole === 'student') {
        return <Navigate to="/student/dashboard" replace />;
      }
      if (['super_admin', 'admin'].includes(userRole)) {
        return <Navigate to="/admin/dashboard" replace />;
      }
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log('✅ PrivateRoute: Authorized, rendering outlet');
  return <Outlet />;
};

export default PrivateRoute;