import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar, isMobile, isAdmin }) => {
  const { userData } = useAuth();

  const adminLinks = [
    { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/admin/students', icon: '👨‍🎓', label: 'Students' },
    { to: '/admin/subjects', icon: '📚', label: 'Subjects' },
    { to: '/admin/questions', icon: '❓', label: 'Question Bank' },
    { to: '/admin/ai-generator', icon: '🤖', label: 'AI Generator' },
    { to: '/admin/exams', icon: '📝', label: 'Exams' },
    { to: '/admin/results', icon: '📊', label: 'Results' },
    { to: '/admin/reports', icon: '📄', label: 'Reports' },
    { to: '/admin/audit', icon: '🔍', label: 'Audit Log' },
    { to: '/admin/settings', icon: '⚙️', label: 'Settings' },
  ];

  const quickActions = [
    { to: '/admin/students/add', icon: '➕', label: 'Add Student' },
  ];

  const studentLinks = [
    { to: '/student/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/student/exams', icon: '📝', label: 'My Exams' },
    { to: '/student/results', icon: '📊', label: 'Results' },
    { to: '/student/profile', icon: '👤', label: 'Profile' },
    { to: '/student/settings', icon: '⚙️', label: 'Settings' },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-16 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isMobile ? 'w-64' : 'w-64'}
        `}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg">
                {userData?.displayName?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {userData?.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {userData?.email}
                </p>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Quick Actions
              </p>
              <div className="mt-2 space-y-1">
                {quickActions.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 text-sm
                      ${isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          )}

          <nav className="flex-1 p-4 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors duration-200
                  ${isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <span className="text-xl">{link.icon}</span>
                <span className="text-sm font-medium">{link.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
              <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                AI Examination Portal
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                v1.0.0
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;