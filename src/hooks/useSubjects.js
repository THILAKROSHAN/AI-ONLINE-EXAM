// useSubjects Hook
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getOrganizationSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  toggleSubjectStatus,
  updateSubjectStatus,
  getSubject,
  getSubjectsByDepartment,
  getSubjectsBySemester,
} from '../services/api/subject';

export const useSubjects = () => {
  const { userData } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    semester: '',
    status: 'all',
  });

  const loadSubjects = useCallback(async () => {
    if (!userData?.organizationId) return;

    setLoading(true);
    setError(null);

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
            subject.code?.toLowerCase().includes(searchLower)
          );
        }
        setSubjects(filteredData);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
      setError('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  }, [userData?.organizationId, filters]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  const addSubject = async (subjectData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await createSubject({
        ...subjectData,
        organizationId: userData.organizationId,
        createdBy: userData.uid,
      });

      if (result.success) {
        await loadSubjects();
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error adding subject:', error);
      setError('Failed to add subject');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const editSubject = async (subjectId, data) => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateSubject(subjectId, data);

      if (result.success) {
        await loadSubjects();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error updating subject:', error);
      setError('Failed to update subject');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeSubject = async (subjectId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await deleteSubject(subjectId);

      if (result.success) {
        await loadSubjects();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      setError('Failed to delete subject');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (subjectId, isActive) => {
    setLoading(true);
    setError(null);

    try {
      const result = await toggleSubjectStatus(subjectId, isActive);

      if (result.success) {
        await loadSubjects();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error toggling subject status:', error);
      setError('Failed to update subject status');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (subjectId, status) => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateSubjectStatus(subjectId, status);

      if (result.success) {
        await loadSubjects();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error changing subject status:', error);
      setError('Failed to change subject status');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getSubjectById = async (subjectId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getSubject(subjectId);
      return result;
    } catch (error) {
      console.error('Error getting subject:', error);
      setError('Failed to get subject');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getByDepartment = async (department) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getSubjectsByDepartment(userData.organizationId, department);
      return result;
    } catch (error) {
      console.error('Error getting subjects by department:', error);
      setError('Failed to get subjects');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getBySemester = async (semester) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getSubjectsBySemester(userData.organizationId, semester);
      return result;
    } catch (error) {
      console.error('Error getting subjects by semester:', error);
      setError('Failed to get subjects');
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
      status: 'all',
    });
  };

  return {
    subjects,
    loading,
    error,
    filters,
    loadSubjects,
    addSubject,
    editSubject,
    removeSubject,
    toggleStatus,
    changeStatus,
    getSubjectById,
    getByDepartment,
    getBySemester,
    updateFilters,
    resetFilters,
  };
};

export default useSubjects;