// useAI Hook
import { useState } from 'react';
import {
  generateQuestionsFromTopic,
  generateQuestionsFromParagraph,
  generateQuestionsFromLearningOutcome,
  generateAnswerKey,
  generateExplanation,
  validateAIQuestion,
  formatAIQuestionForDB,
  QUESTION_TYPES,
  DIFFICULTY_LEVELS,
} from '../services/ai/gemini';
import { saveQuestions } from '../services/api/question';
import { useAuth } from '../contexts/AuthContext';

export const useAI = () => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  const generateFromTopic = async (topic, count = 5, difficulty = 'medium', types = ['mcq']) => {
    setLoading(true);
    setError(null);

    try {
      const result = await generateQuestionsFromTopic(topic, count, difficulty, types);
      
      if (result.success) {
        setGeneratedQuestions(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      setError('Failed to generate questions');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const generateFromParagraph = async (paragraph, count = 5, difficulty = 'medium', types = ['mcq']) => {
    setLoading(true);
    setError(null);

    try {
      const result = await generateQuestionsFromParagraph(paragraph, count, difficulty, types);
      
      if (result.success) {
        setGeneratedQuestions(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      setError('Failed to generate questions');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const generateFromLearningOutcome = async (outcome, count = 5, difficulty = 'medium', types = ['mcq']) => {
    setLoading(true);
    setError(null);

    try {
      const result = await generateQuestionsFromLearningOutcome(outcome, count, difficulty, types);
      
      if (result.success) {
        setGeneratedQuestions(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      setError('Failed to generate questions');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const generateAnswers = async (questions) => {
    setLoading(true);
    setError(null);

    try {
      const result = await generateAnswerKey(questions);
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error generating answers:', error);
      setError('Failed to generate answers');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const generateQuestionExplanation = async (question, answer) => {
    setLoading(true);
    setError(null);

    try {
      const result = await generateExplanation(question, answer);
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error generating explanation:', error);
      setError('Failed to generate explanation');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const validateQuestion = (question) => {
    return validateAIQuestion(question);
  };

  const saveGeneratedQuestions = async (questions, subjectId) => {
    setLoading(true);
    setError(null);

    try {
      const formattedQuestions = questions.map(q => 
        formatAIQuestionForDB(q, userData.organizationId, subjectId, userData.uid)
      );

      const result = await saveQuestions(formattedQuestions);
      
      if (result.success) {
        setGeneratedQuestions([]);
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error saving questions:', error);
      setError('Failed to save questions');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const clearGeneratedQuestions = () => {
    setGeneratedQuestions([]);
    setError(null);
  };

  return {
    loading,
    error,
    generatedQuestions,
    generateFromTopic,
    generateFromParagraph,
    generateFromLearningOutcome,
    generateAnswers,
    generateQuestionExplanation,
    validateQuestion,
    saveGeneratedQuestions,
    clearGeneratedQuestions,
    QUESTION_TYPES,
    DIFFICULTY_LEVELS,
  };
};

export default useAI;