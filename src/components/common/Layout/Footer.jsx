import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container-custom py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            &copy; {currentYear} AI Examination Portal. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;