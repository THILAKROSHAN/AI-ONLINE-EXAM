// useResults Hook
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getOrganizationResults,
  getStudentResults,
  getExamResults,
  getResult,
  createResult,
  updateResult,
  deleteResult,
  publishResult,
  unpublishResult,
  manualEvaluate,
  getResultStats,
  getStudentPerformanceAnalytics,
  exportResults,
  generateResultReport,
  calculateRank,
} from '../services/api/result';

export const useResults = () => {
  const { userData } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    minScore: '',
    maxScore: '',
  });

  const loadResults = useCallback(async () => {
    if (!userData?.organizationId) return;

    setLoading(true);
    setError(null);

    try {
      const filterParams = {
        isPublished: filters.status === 'published' ? true : filters.status === 'unpublished' ? false : undefined,
        minScore: filters.minScore ? parseFloat(filters.minScore) : undefined,
        maxScore: filters.maxScore ? parseFloat(filters.maxScore) : undefined,
      };
      
      const result = await getOrganizationResults(userData.organizationId, filterParams);
      
      if (result.success) {
        let filteredData = result.data;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(r =>
            r.studentName?.toLowerCase().includes(searchLower) ||
            r.studentEmail?.toLowerCase().includes(searchLower) ||
            r.examTitle?.toLowerCase().includes(searchLower)
          );
        }
        setResults(filteredData);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error loading results:', error);
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  }, [userData?.organizationId, filters]);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  const addResult = async (resultData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await createResult({
        ...resultData,
        organizationId: userData.organizationId,
      });

      if (result.success) {
        await loadResults();
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error adding result:', error);
      setError('Failed to add result');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const editResult = async (resultId, data) => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateResult(resultId, data);

      if (result.success) {
        await loadResults();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error updating result:', error);
      setError('Failed to update result');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeResult = async (resultId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await deleteResult(resultId);

      if (result.success) {
        await loadResults();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error deleting result:', error);
      setError('Failed to delete result');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const publish = async (resultId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await publishResult(resultId);

      if (result.success) {
        await loadResults();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error publishing result:', error);
      setError('Failed to publish result');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const unpublish = async (resultId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await unpublishResult(resultId);

      if (result.success) {
        await loadResults();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error unpublishing result:', error);
      setError('Failed to unpublish result');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const evaluateManually = async (resultId, evaluationData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await manualEvaluate(resultId, evaluationData);

      if (result.success) {
        await loadResults();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error manual evaluation:', error);
      setError('Failed to evaluate manually');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getResultById = async (resultId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getResult(resultId);
      return result;
    } catch (error) {
      console.error('Error getting result:', error);
      setError('Failed to get result');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getStudentResultsList = async (studentId, examId = null) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getStudentResults(studentId, examId);
      return result;
    } catch (error) {
      console.error('Error getting student results:', error);
      setError('Failed to get student results');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getExamResultsList = async (examId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getExamResults(examId);
      return result;
    } catch (error) {
      console.error('Error getting exam results:', error);
      setError('Failed to get exam results');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getStats = async (examId = null) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getResultStats(userData.organizationId, examId);
      return result;
    } catch (error) {
      console.error('Error getting result stats:', error);
      setError('Failed to get result stats');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getStudentAnalytics = async (studentId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getStudentPerformanceAnalytics(studentId, userData.organizationId);
      return result;
    } catch (error) {
      console.error('Error getting student analytics:', error);
      setError('Failed to get student analytics');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const exportResultsData = async (format = 'excel', exportFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await exportResults(
        userData.organizationId,
        { ...filters, ...exportFilters },
        format
      );
      return result;
    } catch (error) {
      console.error('Error exporting results:', error);
      setError('Failed to export results');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const generatePDFReport = async (resultId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await generateResultReport(resultId);
      return result;
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const calculateRanks = async (examId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await calculateRank(examId);
      return result;
    } catch (error) {
      console.error('Error calculating ranks:', error);
      setError('Failed to calculate ranks');
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
      minScore: '',
      maxScore: '',
    });
  };

  return {
    results,
    loading,
    error,
    filters,
    loadResults,
    addResult,
    editResult,
    removeResult,
    publish,
    unpublish,
    evaluateManually,
    getResultById,
    getStudentResultsList,
    getExamResultsList,
    getStats,
    getStudentAnalytics,
    exportResultsData,
    generatePDFReport,
    calculateRanks,
    updateFilters,
    resetFilters,
  };
};

export default useResults;