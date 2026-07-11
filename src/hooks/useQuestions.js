// useQuestions Hook
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getOrganizationQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  toggleQuestionStatus,
  updateQuestionStatus,
  getQuestion,
  getQuestionsBySubject,
  getQuestionsByDifficulty,
  getAIGeneratedQuestions,
  validateQuestion,
  duplicateQuestion,
} from '../services/api/question';

export const useQuestions = () => {
  const { userData } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    difficulty: '',
    subjectId: '',
    status: 'all',
  });

  const loadQuestions = useCallback(async () => {
    if (!userData?.organizationId) return;

    setLoading(true);
    setError(null);

    try {
      const filterParams = {
        ...filters,
        status: filters.status === 'all' ? undefined : filters.status,
      };
      
      const result = await getOrganizationQuestions(userData.organizationId, filterParams);
      
      if (result.success) {
        let filteredData = result.data;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(question =>
            question.text?.toLowerCase().includes(searchLower) ||
            question.topic?.toLowerCase().includes(searchLower)
          );
        }
        setQuestions(filteredData);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [userData?.organizationId, filters]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const addQuestion = async (questionData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await createQuestion({
        ...questionData,
        organizationId: userData.organizationId,
        createdBy: userData.uid,
      });

      if (result.success) {
        await loadQuestions();
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error adding question:', error);
      setError('Failed to add question');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const editQuestion = async (questionId, data) => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateQuestion(questionId, data);

      if (result.success) {
        await loadQuestions();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error updating question:', error);
      setError('Failed to update question');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeQuestion = async (questionId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await deleteQuestion(questionId);

      if (result.success) {
        await loadQuestions();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      setError('Failed to delete question');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (questionId, isActive) => {
    setLoading(true);
    setError(null);

    try {
      const result = await toggleQuestionStatus(questionId, isActive);

      if (result.success) {
        await loadQuestions();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error toggling question status:', error);
      setError('Failed to update question status');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (questionId, status) => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateQuestionStatus(questionId, status);

      if (result.success) {
        await loadQuestions();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error changing question status:', error);
      setError('Failed to change question status');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getQuestionById = async (questionId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getQuestion(questionId);
      return result;
    } catch (error) {
      console.error('Error getting question:', error);
      setError('Failed to get question');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getBySubject = async (subjectId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getQuestionsBySubject(subjectId);
      return result;
    } catch (error) {
      console.error('Error getting questions by subject:', error);
      setError('Failed to get questions');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getByDifficulty = async (difficulty) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getQuestionsByDifficulty(userData.organizationId, difficulty);
      return result;
    } catch (error) {
      console.error('Error getting questions by difficulty:', error);
      setError('Failed to get questions');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getAIQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getAIGeneratedQuestions(userData.organizationId);
      return result;
    } catch (error) {
      console.error('Error getting AI questions:', error);
      setError('Failed to get AI questions');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const duplicate = async (questionId, newData = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await duplicateQuestion(questionId, {
        ...newData,
        organizationId: userData.organizationId,
        createdBy: userData.uid,
      });

      if (result.success) {
        await loadQuestions();
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error duplicating question:', error);
      setError('Failed to duplicate question');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const validate = (question) => {
    return validateQuestion(question);
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      type: '',
      difficulty: '',
      subjectId: '',
      status: 'all',
    });
  };

  return {
    questions,
    loading,
    error,
    filters,
    loadQuestions,
    addQuestion,
    editQuestion,
    removeQuestion,
    toggleStatus,
    changeStatus,
    getQuestionById,
    getBySubject,
    getByDifficulty,
    getAIQuestions,
    duplicate,
    validate,
    updateFilters,
    resetFilters,
  };
};

export default useQuestions;