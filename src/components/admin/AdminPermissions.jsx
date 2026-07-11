import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { updateAdminPermissions } from '../../services/api/admin';
import Button from '../common/Buttons/Button';
import Spinner from '../common/Loading/Spinner';
import Toast from '../common/Notifications/Toast';

const AdminPermissions = ({ admin, onClose, onSuccess }) => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [permissions, setPermissions] = useState({
    // Student Management
    viewStudents: false,
    addStudents: false,
    editStudents: false,
    deleteStudents: false,
    importStudents: false,
    exportStudents: false,
    
    // Subject Management
    viewSubjects: false,
    addSubjects: false,
    editSubjects: false,
    deleteSubjects: false,
    
    // Question Management
    viewQuestions: false,
    addQuestions: false,
    editQuestions: false,
    deleteQuestions: false,
    importQuestions: false,
    exportQuestions: false,
    useAIGenerator: false,
    
    // Exam Management
    viewExams: false,
    addExams: false,
    editExams: false,
    deleteExams: false,
    publishExams: false,
    
    // Result Management
    viewResults: false,
    evaluateResults: false,
    publishResults: false,
    exportResults: false,
    
    // Report Management
    viewReports: false,
    generateReports: false,
    exportReports: false,
    
    // Admin Management
    viewAdmins: false,
    addAdmins: false,
    editAdmins: false,
    deleteAdmins: false,
    
    // Settings
    viewSettings: false,
    editSettings: false,
    
    // Audit Logs
    viewAuditLogs: false,
  });

  useEffect(() => {
    if (admin?.permissions) {
      setPermissions(admin.permissions);
    }
  }, [admin]);

  const handlePermissionChange = (permission) => {
    setPermissions({
      ...permissions,
      [permission]: !permissions[permission],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await updateAdminPermissions(admin.id, permissions);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Failed to update permissions');
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const PermissionGroup = ({ title, permissions: groupPermissions }) => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(groupPermissions).map(([key, label]) => (
          <label key={key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={permissions[key] || false}
              onChange={() => handlePermissionChange(key)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={loading}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  if (success) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Permissions Updated!
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Admin permissions have been updated successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Admin Permissions
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage permissions for {admin?.name || 'admin'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <PermissionGroup
          title="Student Management"
          permissions={{
            viewStudents: 'View Students',
            addStudents: 'Add Students',
            editStudents: 'Edit Students',
            deleteStudents: 'Delete Students',
            importStudents: 'Import Students',
            exportStudents: 'Export Students',
          }}
        />

        <PermissionGroup
          title="Subject Management"
          permissions={{
            viewSubjects: 'View Subjects',
            addSubjects: 'Add Subjects',
            editSubjects: 'Edit Subjects',
            deleteSubjects: 'Delete Subjects',
          }}
        />

        <PermissionGroup
          title="Question Management"
          permissions={{
            viewQuestions: 'View Questions',
            addQuestions: 'Add Questions',
            editQuestions: 'Edit Questions',
            deleteQuestions: 'Delete Questions',
            importQuestions: 'Import Questions',
            exportQuestions: 'Export Questions',
            useAIGenerator: 'Use AI Generator',
          }}
        />

        <PermissionGroup
          title="Exam Management"
          permissions={{
            viewExams: 'View Exams',
            addExams: 'Add Exams',
            editExams: 'Edit Exams',
            deleteExams: 'Delete Exams',
            publishExams: 'Publish Exams',
          }}
        />

        <PermissionGroup
          title="Result Management"
          permissions={{
            viewResults: 'View Results',
            evaluateResults: 'Evaluate Results',
            publishResults: 'Publish Results',
            exportResults: 'Export Results',
          }}
        />

        <PermissionGroup
          title="Report Management"
          permissions={{
            viewReports: 'View Reports',
            generateReports: 'Generate Reports',
            exportReports: 'Export Reports',
          }}
        />

        <PermissionGroup
          title="Admin Management"
          permissions={{
            viewAdmins: 'View Admins',
            addAdmins: 'Add Admins',
            editAdmins: 'Edit Admins',
            deleteAdmins: 'Delete Admins',
          }}
        />

        <PermissionGroup
          title="System"
          permissions={{
            viewSettings: 'View Settings',
            editSettings: 'Edit Settings',
            viewAuditLogs: 'View Audit Logs',
          }}
        />
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : 'Save Permissions'}
        </Button>
      </div>
    </form>
  );
};

export default AdminPermissions;