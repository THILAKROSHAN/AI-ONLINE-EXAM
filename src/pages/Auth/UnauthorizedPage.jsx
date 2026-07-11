import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Buttons/Button';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30">
            <svg className="h-12 w-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Unauthorized Access
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            You do not have permission to access this page.
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Please contact your administrator if you believe this is an error.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Link to="/admin/login">
            <Button variant="primary" className="w-full">
              Go to Admin Login
            </Button>
          </Link>
          <Link to="/student/login">
            <Button variant="secondary" className="w-full">
              Go to Student Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;