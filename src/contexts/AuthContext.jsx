// Auth Context
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { onAuthStateChange, logoutUser, getCurrentUserData } from '../services/firebase/auth';
import Spinner from '../components/common/Loading/Spinner';

const AuthContext = createContext({
  user: null,
  userData: null,
  loading: true,
  error: null,
  isAuthorized: false,
  isAuthenticated: false,
  isSuperAdmin: false,
  isAdmin: false,
  isStudent: false,
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
  const unsubscribeRef = useRef(null);
  const isMountedRef = useRef(true);
  const authCheckedRef = useRef(false);

  console.log('🏗️ AuthProvider rendering, loading:', loading);

  // Set up auth state listener
  useEffect(() => {
    console.log('👂 Setting up auth state listener...');

    if (unsubscribeRef.current) {
      console.log('🧹 Cleaning up previous auth listener');
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    console.log('🔄 Calling onAuthStateChange...');
    const unsubscribe = onAuthStateChange((authState) => {
      console.log('📩 Auth state callback EXECUTED!');
      console.log('📩 Auth state:', {
        hasUser: !!authState?.user,
        hasUserData: !!authState?.userData,
        isMounted: isMountedRef.current,
      });

      if (!isMountedRef.current) {
        console.log('⚠️ Component unmounted, ignoring auth update');
        return;
      }

      const { user: authUser, userData: authUserData } = authState;

      setUser(authUser);
      setUserData(authUserData);

      if (authUser && authUserData) {
        console.log('✅ User and data available, checking role...');
        const validRoles = ['super_admin', 'admin', 'student'];
        if (authUserData.role && validRoles.includes(authUserData.role)) {
          console.log('✅ Valid role confirmed:', authUserData.role);
          setIsAuthorized(true);
        } else {
          console.log('❌ Invalid role detected:', authUserData.role);
          setIsAuthorized(false);
          logoutUser();
          setUser(null);
          setUserData(null);
        }
      } else if (authUser && !authUserData) {
        console.log('⚠️ User has no Firestore document');
        setIsAuthorized(false);
        logoutUser();
        setUser(null);
        setUserData(null);
      } else {
        console.log('🔓 No user logged in');
        setIsAuthorized(false);
      }

      console.log('🔄 Setting loading to false');
      authCheckedRef.current = true;
      setLoading(false);
    });

    unsubscribeRef.current = unsubscribe;
    console.log('✅ Auth listener set up successfully');

    return () => {
      console.log('🧹 Cleaning up auth state listener');
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  // Force loading to false after timeout
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('⏰ Loading timeout - forcing loading to false');
        setLoading(false);
        authCheckedRef.current = true;
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [loading]);

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
    isSuperAdmin: userData?.role === 'super_admin',
    isAdmin: userData?.role === 'admin' || userData?.role === 'super_admin',
    isStudent: userData?.role === 'student',
  };

  console.log('📤 AuthProvider providing value:', {
    loading: value.loading,
    isAuthenticated: value.isAuthenticated,
    role: userData?.role,
    isAuthorized: value.isAuthorized,
  });

  if (loading) {
    console.log('⏳ AuthProvider: Showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('✅ AuthProvider: Rendering children');
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;