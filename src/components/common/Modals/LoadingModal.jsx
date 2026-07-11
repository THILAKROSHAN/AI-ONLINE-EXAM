import React from 'react';
import Modal from './Modal';
import Spinner from '../Loading/Spinner';

const LoadingModal = ({ isOpen, title = 'Loading...', message = 'Please wait...' }) => {
  return (
    <Modal isOpen={isOpen} onClose={() => {}} showCloseButton={false} size="sm">
      <div className="p-8 text-center">
        <Spinner size="lg" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default LoadingModal;