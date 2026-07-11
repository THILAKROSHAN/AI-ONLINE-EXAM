import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getOrganizationSubjects, toggleSubjectStatus, updateSubjectStatus, deleteSubject } from '../../services/api/subject';
import Button from '../common/Buttons/Button';
import Spinner from '../common/Loading/Spinner';
import Toast from '../common/Notifications/Toast';
import SubjectFilters from './SubjectFilters';

const SubjectList = ({ onEdit, onView }) => {
  const { userData } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    semester: '',
    status: 'all',
  });

  useEffect(() => {
    if (userData?.organizationId) {
      loadSubjects();
    }
  }, [userData]);

  const loadSubjects = async () => {
    setLoading(true);
    setError('');

    try {
      const filterParams = {
        ...filters,
        status: filters.status === 'all' ? undefined : filters.status,
      };
      
      const result = await getOrganizationSubjects(userData.organizationId, filterParams);
      
      if (result.success) {
        let filteredData = result.data;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(subject =>
            subject.name?.toLowerCase().includes(searchLower) ||
            subject.code?.toLowerCase().includes(searchLower) ||
            subject.department?.toLowerCase().includes(searchLower)
          );
        }
        setSubjects(filteredData);
      } else {
        setError(result.error || 'Failed to load subjects');
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (subjectId, currentStatus) => {
    try {
      const result = await toggleSubjectStatus(subjectId, !currentStatus);

      if (result.success) {
        setSuccess(`Subject ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        await loadSubjects();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update subject status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleUpdateStatus = async (subjectId, status) => {
    try {
      const result = await updateSubjectStatus(subjectId, status);

      if (result.success) {
        setSuccess(`Subject status updated to ${status}`);
        await loadSubjects();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update subject status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleDelete = async (subjectId, subjectName) => {
    if (!window.confirm(`Are you sure you want to delete subject "${subjectName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const result = await deleteSubject(subjectId);

      if (result.success) {
        setSuccess(`Subject deleted successfully`);
        await loadSubjects();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to delete subject');
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleApplyFilters = () => {
    loadSubjects();
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      department: '',
      semester: '',
      status: 'all',
    });
    setTimeout(loadSubjects, 100);
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      archived: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    return colors[status] || colors.draft;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <SubjectFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <Toast
          type="success"
          message={success}
          duration={3000}
          onClose={() => setSuccess('')}
        />
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No subjects found
                  </td>
                </tr>
              ) : (
                subjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {subject.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {subject.description || 'No description'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-gray-400">
                      {subject.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {subject.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {subject.semester || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {subject.credits || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          subject.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {subject.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(subject.status)}`}>
                          {subject.status?.toUpperCase() || 'DRAFT'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onView(subject)}
                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onEdit(subject)}
                        className="text-green-600 hover:text-green-900 dark:hover:text-green-400 mr-3"
                      >
                        Edit
                      </button>
                      <select
                        onChange={(e) => handleUpdateStatus(subject.id, e.target.value)}
                        className="text-xs border rounded px-2 py-1 mr-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                        value={subject.status || 'draft'}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                      <button
                        onClick={() => handleToggleStatus(subject.id, subject.isActive)}
                        className={`mr-3 ${
                          subject.isActive 
                            ? 'text-yellow-600 hover:text-yellow-900' 
                            : 'text-green-600 hover:text-green-900'
                        } dark:hover:text-white`}
                      >
                        {subject.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(subject.id, subject.name)}
                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Total: {subjects.length} subjects
      </div>
    </div>
  );
};

export default SubjectList;