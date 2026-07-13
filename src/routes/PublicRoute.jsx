import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/common/Loading/Spinner';

const PublicRoute = () => {
  const { user, userData, loading, isAuthenticated, isAuthorized } = useAuth();

  console.log('🌐 PublicRoute rendering:', {
    loading,
    isAuthenticated,
    isAuthorized,
    userRole: userData?.role,
  });

  if (loading) {
    console.log('⏳ PublicRoute: Still loading, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated && isAuthorized) {
    const role = userData?.role;
    console.log('🔀 PublicRoute: Redirecting based on role:', role);

    if (role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    }
    if (role === 'admin' || role === 'super_admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('✅ PublicRoute: Rendering outlet');
  return <Outlet />;
};

export default PublicRoute;