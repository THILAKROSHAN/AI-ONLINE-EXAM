// useExams Hook
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getOrganizationExams,
  createExam,
  updateExam,
  deleteExam,
  publishExam,
  unpublishExam,
  getExam,
  getExamStats,
  getStudentExams,
  startExamAttempt,
  submitExam,
  getExamAttempt,
  getStudentExamAttempts,
  saveExamProgress,
  assignStudentsToExam,
} from '../services/api/exam';

export const useExams = () => {
  const { userData } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    subjectId: '',
    isPublished: 'all',
  });

  const loadExams = useCallback(async () => {
    if (!userData?.organizationId) return;

    setLoading(true);
    setError(null);

    try {
      const filterParams = {
        status: filters.status === 'all' ? undefined : filters.status,
        subjectId: filters.subjectId || undefined,
        isPublished: filters.isPublished === 'all' ? undefined : filters.isPublished === 'true',
      };
      
      const result = await getOrganizationExams(userData.organizationId, filterParams);
      
      if (result.success) {
        let filteredData = result.data;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(exam =>
            exam.title?.toLowerCase().includes(searchLower) ||
            exam.description?.toLowerCase().includes(searchLower)
          );
        }
        setExams(filteredData);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error loading exams:', error);
      setError('Failed to load exams');
    } finally {
      setLoading(false);
    }
  }, [userData?.organizationId, filters]);

  useEffect(() => {
    loadExams();
  }, [loadExams]);

  const addExam = async (examData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await createExam({
        ...examData,
        organizationId: userData.organizationId,
        createdBy: userData.uid,
      });

      if (result.success) {
        await loadExams();
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error adding exam:', error);
      setError('Failed to add exam');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const editExam = async (examId, data) => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateExam(examId, data);

      if (result.success) {
        await loadExams();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error updating exam:', error);
      setError('Failed to update exam');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeExam = async (examId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await deleteExam(examId);

      if (result.success) {
        await loadExams();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      setError('Failed to delete exam');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const publish = async (examId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await publishExam(examId);

      if (result.success) {
        await loadExams();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error publishing exam:', error);
      setError('Failed to publish exam');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const unpublish = async (examId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await unpublishExam(examId);

      if (result.success) {
        await loadExams();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error unpublishing exam:', error);
      setError('Failed to unpublish exam');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getExamById = async (examId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getExam(examId);
      return result;
    } catch (error) {
      console.error('Error getting exam:', error);
      setError('Failed to get exam');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getStats = async (examId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getExamStats(examId);
      return result;
    } catch (error) {
      console.error('Error getting exam stats:', error);
      setError('Failed to get exam stats');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getStudentExamsList = async (studentId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getStudentExams(studentId, userData.organizationId);
      return result;
    } catch (error) {
      console.error('Error getting student exams:', error);
      setError('Failed to get student exams');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const startAttempt = async (examId, studentId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await startExamAttempt(examId, studentId);
      return result;
    } catch (error) {
      console.error('Error starting exam attempt:', error);
      setError('Failed to start exam attempt');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const submitAttempt = async (attemptId, answers, timeSpent) => {
    setLoading(true);
    setError(null);

    try {
      const result = await submitExam(attemptId, answers, timeSpent);
      return result;
    } catch (error) {
      console.error('Error submitting exam:', error);
      setError('Failed to submit exam');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getAttempt = async (attemptId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getExamAttempt(attemptId);
      return result;
    } catch (error) {
      console.error('Error getting exam attempt:', error);
      setError('Failed to get exam attempt');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getStudentAttempts = async (studentId, examId = null) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getStudentExamAttempts(studentId, examId);
      return result;
    } catch (error) {
      console.error('Error getting student attempts:', error);
      setError('Failed to get student attempts');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (attemptId, data) => {
    setLoading(true);
    setError(null);

    try {
      const result = await saveExamProgress(attemptId, data);
      return result;
    } catch (error) {
      console.error('Error saving exam progress:', error);
      setError('Failed to save exam progress');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const assignStudents = async (examId, studentIds) => {
    setLoading(true);
    setError(null);

    try {
      const result = await assignStudentsToExam(examId, studentIds);

      if (result.success) {
        await loadExams();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error assigning students:', error);
      setError('Failed to assign students');
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
      status: 'all',
      subjectId: '',
      isPublished: 'all',
    });
  };

  return {
    exams,
    loading,
    error,
    filters,
    loadExams,
    addExam,
    editExam,
    removeExam,
    publish,
    unpublish,
    getExamById,
    getStats,
    getStudentExamsList,
    startAttempt,
    submitAttempt,
    getAttempt,
    getStudentAttempts,
    saveProgress,
    assignStudents,
    updateFilters,
    resetFilters,
  };
};

export default useExams;