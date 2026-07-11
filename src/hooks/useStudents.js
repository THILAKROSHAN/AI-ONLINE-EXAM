// useStudents Hook
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getOrganizationStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  toggleStudentStatus,
  getStudent,
  importStudents,
  exportStudents,
} from '../services/api/student';

export const useStudents = () => {
  const { userData } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    semester: '',
    batch: '',
    status: 'all',
  });

  const loadStudents = useCallback(async () => {
    if (!userData?.organizationId) return;

    setLoading(true);
    setError(null);

    try {
      const filterParams = {
        ...filters,
        isActive: filters.status === 'all' ? undefined : filters.status === 'active',
      };
      
      const result = await getOrganizationStudents(userData.organizationId, filterParams);
      
      if (result.success) {
        let filteredData = result.data;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(student =>
            student.name?.toLowerCase().includes(searchLower) ||
            student.email?.toLowerCase().includes(searchLower) ||
            student.studentId?.toLowerCase().includes(searchLower)
          );
        }
        setStudents(filteredData);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error loading students:', error);
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [userData?.organizationId, filters]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const addStudent = async (studentData, password) => {
    setLoading(true);
    setError(null);

    try {
      const result = await createStudent({
        ...studentData,
        organizationId: userData.organizationId,
        createdBy: userData.uid,
      }, password);

      if (result.success) {
        await loadStudents();
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error adding student:', error);
      setError('Failed to add student');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const editStudent = async (studentId, data) => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateStudent(studentId, data);

      if (result.success) {
        await loadStudents();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error updating student:', error);
      setError('Failed to update student');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeStudent = async (studentId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await deleteStudent(studentId);

      if (result.success) {
        await loadStudents();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      setError('Failed to delete student');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (studentId, isActive) => {
    setLoading(true);
    setError(null);

    try {
      const result = await toggleStudentStatus(studentId, isActive);

      if (result.success) {
        await loadStudents();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error toggling student status:', error);
      setError('Failed to update student status');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getStudentById = async (studentId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getStudent(studentId);
      return result;
    } catch (error) {
      console.error('Error getting student:', error);
      setError('Failed to get student');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const importStudentsFromFile = async (file) => {
    setLoading(true);
    setError(null);

    try {
      const result = await importStudents(
        file,
        userData.organizationId,
        userData.uid
      );

      if (result.success) {
        await loadStudents();
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error importing students:', error);
      setError('Failed to import students');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const exportStudentsToExcel = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await exportStudents(userData.organizationId, filters);
      return result;
    } catch (error) {
      console.error('Error exporting students:', error);
      setError('Failed to export students');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      department: '',
      semester: '',
      batch: '',
      status: 'all',
    });
  };

  return {
    students,
    loading,
    error,
    filters,
    loadStudents,
    addStudent,
    editStudent,
    removeStudent,
    toggleStatus,
    getStudentById,
    importStudentsFromFile,
    exportStudentsToExcel,
    updateFilters,
    resetFilters,
  };
};

export default useStudents;