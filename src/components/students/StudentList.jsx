import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getOrganizationStudents, toggleStudentStatus, deleteStudent } from '../../services/api/student';
import Button from '../common/Buttons/Button';
import Spinner from '../common/Loading/Spinner';
import Toast from '../common/Notifications/Toast';
import StudentFilters from './StudentFilters';

const StudentList = ({ onEdit, onView, onImport }) => {
  const { userData } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    semester: '',
    batch: '',
    status: 'all',
  });

  useEffect(() => {
    if (userData?.organizationId) {
      loadStudents();
    }
  }, [userData]);

  const loadStudents = async () => {
    setLoading(true);
    setError('');

    try {
      const filterParams = {
        ...filters,
        isActive: filters.status === 'all' ? undefined : filters.status === 'active',
      };
      
      const result = await getOrganizationStudents(userData.organizationId, filterParams);
      
      if (result.success) {
        // Apply client-side search
        let filteredData = result.data;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(student =>
            student.name?.toLowerCase().includes(searchLower) ||
            student.email?.toLowerCase().includes(searchLower) ||
            student.studentId?.toLowerCase().includes(searchLower) ||
            student.rollNumber?.toLowerCase().includes(searchLower)
          );
        }
        setStudents(filteredData);
      } else {
        setError(result.error || 'Failed to load students');
      }
    } catch (error) {
      console.error('Error loading students:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (studentId, currentStatus) => {
    try {
      const result = await toggleStudentStatus(studentId, !currentStatus);

      if (result.success) {
        setSuccess(`Student ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        await loadStudents();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update student status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleDelete = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete student "${studentName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const result = await deleteStudent(studentId);

      if (result.success) {
        setSuccess(`Student deleted successfully`);
        await loadStudents();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleApplyFilters = () => {
    loadStudents();
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      department: '',
      semester: '',
      batch: '',
      status: 'all',
    });
    setTimeout(loadStudents, 100);
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
      <StudentFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        onImport={onImport}
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
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Exams
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No students found
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                          {student.profilePhoto ? (
                            <img
                              src={student.profilePhoto}
                              alt={student.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            student.name?.[0]?.toUpperCase() || 'S'
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {student.studentId || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {student.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {student.semester || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        student.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {student.totalExams || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onView(student)}
                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-3"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onEdit(student)}
                        className="text-green-600 hover:text-green-900 dark:hover:text-green-400 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(student.id, student.isActive)}
                        className={`mr-3 ${
                          student.isActive 
                            ? 'text-yellow-600 hover:text-yellow-900' 
                            : 'text-green-600 hover:text-green-900'
                        } dark:hover:text-white`}
                      >
                        {student.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(student.id, student.name)}
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
        Total: {students.length} students
      </div>
    </div>
  );
};

export default StudentList;