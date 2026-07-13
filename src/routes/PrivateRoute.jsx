import React from 'react';
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

  if (loading) {
    console.log('⏳ PrivateRoute: Still loading, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !isAuthorized) {
    console.log('🚫 PrivateRoute: Not authenticated or authorized');
    return <Navigate to="/unauthorized" replace />;
  }

  if (allowedRoles.length > 0) {
    const userRole = userData?.role;
    if (!allowedRoles.includes(userRole)) {
      console.log('🚫 PrivateRoute: Role mismatch', { userRole, allowedRoles });
      if (userRole === 'student') {
        return <Navigate to="/student/dashboard" replace />;
      }
      if (userRole === 'admin' || userRole === 'super_admin') {
        return <Navigate to="/admin/dashboard" replace />;
      }
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log('✅ PrivateRoute: Authorized, rendering outlet');
  return <Outlet />;
};

export default PrivateRoute;