import React from 'react';
import ForgotPassword from '../../components/auth/ForgotPassword';

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <ForgotPassword />
    </div>
  );
};

export default ForgotPasswordPage;