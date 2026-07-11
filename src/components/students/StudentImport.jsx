import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { importStudents } from '../../services/api/student';
import Button from '../common/Buttons/Button';
import Spinner from '../common/Loading/Spinner';
import Toast from '../common/Notifications/Toast';

const StudentImport = ({ onClose, onSuccess }) => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload an Excel file (.xlsx, .xls) or CSV file');
        setFile(null);
        return;
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to import');
      return;
    }

    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const result = await importStudents(
        file,
        userData.organizationId,
        userData.uid
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        setSuccess(`Successfully imported ${result.data.count || 0} students`);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Failed to import students');
      }
    } catch (error) {
      console.error('Import error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    // Create template CSV
    const headers = [
      'Name', 'Email', 'Phone', 'Department', 'Semester', 'Year',
      'Course', 'Batch', 'Roll Number', 'Date of Birth', 'Gender',
      'Address', 'City', 'State', 'Country', 'Postal Code',
      'Parent Name', 'Parent Phone', 'Parent Email'
    ];
    
    const csvContent = headers.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
            Import Successful!
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {success}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Import Students
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Bulk import students from an Excel or CSV file
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="label">Select File</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="sr-only"
                    disabled={loading}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Excel (.xlsx, .xls) or CSV up to 10MB
              </p>
              {file && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={downloadTemplate}
            className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Download Template
          </button>
          <div className="space-x-3">
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
              disabled={loading || !file}
            >
              {loading ? <Spinner size="sm" /> : 'Import Students'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default StudentImport;