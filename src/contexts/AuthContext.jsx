// Auth Context
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { onAuthStateChange, logoutUser, getCurrentUserData } from '../services/firebase/auth';
import { setAuthPersistence } from '../services/firebase/auth';
import Spinner from '../components/common/Loading/Spinner';

const AuthContext = createContext({
  user: null,
  userData: null,
  loading: true,
  error: null,
  isAuthorized: false,
  isAuthenticated: false,
  isAdmin: false,
  isStudent: false,
  isSuperAdmin: false,
  isOrganizationAdmin: false,
  logout: async () => {},
  refreshUserData: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const authInitialized = useRef(false);

  console.log('🏗️ AuthProvider rendering, loading:', loading);

  useEffect(() => {
    console.log('🔧 AuthProvider mounted, initializing...');
    let isMounted = true;

    const initAuth = async () => {
      try {
        await setAuthPersistence('local');
        console.log('✅ Auth persistence configured');
      } catch (error) {
        console.warn('⚠️ Auth persistence warning:', error);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    console.log('👂 Setting up auth state listener...');
    let isMounted = true;

    const unsubscribe = onAuthStateChange(async ({ user: authUser, userData: authUserData }) => {
      console.log('📩 Auth state update received:', {
        hasUser: !!authUser,
        hasUserData: !!authUserData,
        isMounted,
        authInitialized: authInitialized.current,
      });

      if (!isMounted) {
        console.log('⚠️ Component unmounted, ignoring auth update');
        return;
      }

      // Set user and userData
      setUser(authUser);
      setUserData(authUserData);
      
      if (authUser && authUserData) {
        console.log('✅ User and data available, checking role...');
        const validRoles = ['super_admin', 'admin', 'student'];
        if (authUserData.role && validRoles.includes(authUserData.role)) {
          console.log('✅ Valid role confirmed:', authUserData.role);
          setIsAuthorized(true);
          authInitialized.current = true;
        } else {
          console.log('❌ Invalid role detected:', authUserData.role);
          setIsAuthorized(false);
          await logoutUser();
          setUser(null);
          setUserData(null);
          authInitialized.current = true;
        }
      } else if (authUser && !authUserData) {
        console.log('⚠️ User has no Firestore document');
        setIsAuthorized(false);
        await logoutUser();
        setUser(null);
        setUserData(null);
        authInitialized.current = true;
      } else {
        console.log('🔓 No user logged in');
        setIsAuthorized(false);
        authInitialized.current = true;
      }
      
      // IMPORTANT: Set loading to false after processing auth state
      console.log('🔄 Setting loading to false');
      setLoading(false);
    });

    return () => {
      console.log('🧹 Cleaning up auth state listener');
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const refreshUserData = async () => {
    console.log('🔄 Refreshing user data...');
    if (user) {
      const result = await getCurrentUserData();
      if (result.success) {
        setUserData(result.data);
        const validRoles = ['super_admin', 'admin', 'student'];
        if (result.data.role && validRoles.includes(result.data.role)) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          await logoutUser();
          setUser(null);
          setUserData(null);
        }
        console.log('✅ User data refreshed');
        return result.data;
      } else {
        console.log('❌ Failed to refresh user data');
        setIsAuthorized(false);
        await logoutUser();
        setUser(null);
        setUserData(null);
      }
    }
    return null;
  };

  const logout = async () => {
    console.log('🔓 Logging out...');
    try {
      const result = await logoutUser();
      if (result.success) {
        setUser(null);
        setUserData(null);
        setIsAuthorized(false);
        setLoading(false);
        console.log('✅ Logged out successfully');
        return { success: true };
      }
      return result;
    } catch (error) {
      console.error('❌ Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userData,
    loading,
    error,
    logout,
    refreshUserData,
    isAuthorized,
    isAuthenticated: !!user && !!userData && isAuthorized,
    isAdmin: userData?.role === 'admin' || userData?.role === 'super_admin',
    isStudent: userData?.role === 'student',
    isSuperAdmin: userData?.role === 'super_admin',
    isOrganizationAdmin: userData?.role === 'admin',
  };

  console.log('📤 AuthProvider providing value:', {
    loading: value.loading,
    isAuthenticated: value.isAuthenticated,
    role: userData?.role,
    isAuthorized: value.isAuthorized,
  });

  // Show loading spinner while auth is initializing - FIX: Don't return null
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;