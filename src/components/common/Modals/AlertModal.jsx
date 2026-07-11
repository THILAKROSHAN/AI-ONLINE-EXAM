import React from 'react';
import Modal from './Modal';
import Button from '../Buttons/Button';

const AlertModal = ({ isOpen, onClose, title, message, type = 'info', buttonText = 'OK' }) => {
  const typeStyles = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  };

  const typeIcons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="p-6">
        <div className={`p-4 rounded-lg ${typeStyles[type]}`}>
          <div className="flex items-center">
            <span className="text-2xl mr-3">{typeIcons[type]}</span>
            <p className="text-sm">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button variant="primary" onClick={onClose}>
            {buttonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AlertModal;