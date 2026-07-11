import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../../contexts/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, userData } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);

  if (isAuthPage || !isAuthenticated) {
    return <div className="min-h-screen">{children}</div>;
  }

  const isAdmin = userData?.role === 'super_admin' || 
                  userData?.role === 'admin' || 
                  userData?.role === 'sub_admin';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
          isAdmin={isAdmin}
        />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'}`}>
          <div className="container-custom py-6">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;