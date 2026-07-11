// Question API Service
import { 
  createDocument, 
  getDocument, 
  updateDocument, 
  deleteDocument, 
  queryDocuments,
  getAllDocuments,
  COLLECTIONS 
} from '../firebase/firestore';
import { callFunction } from '../firebase/functions';

// Create a new question
export const createQuestion = async (questionData) => {
  try {
    const data = {
      text: questionData.text,
      type: questionData.type,
      difficulty: questionData.difficulty,
      options: questionData.options || [],
      correctAnswer: questionData.correctAnswer,
      explanation: questionData.explanation || '',
      subjectId: questionData.subjectId || null,
      topic: questionData.topic || '',
      organizationId: questionData.organizationId,
      createdBy: questionData.createdBy || null,
      isActive: true,
      isAIGenerated: questionData.isAIGenerated || false,
      status: questionData.status || 'draft',
      tags: questionData.tags || [],
      marks: questionData.marks || 1,
      negativeMarks: questionData.negativeMarks || 0,
      metadata: questionData.metadata || {},
    };

    const result = await createDocument(COLLECTIONS.QUESTIONS, data);
    return result;
  } catch (error) {
    console.error('❌ Error creating question:', error);
    return { success: false, error: error.message };
  }
};

// Get question by ID
export const getQuestion = async (questionId) => {
  try {
    const result = await getDocument(COLLECTIONS.QUESTIONS, questionId);
    return result;
  } catch (error) {
    console.error('❌ Error getting question:', error);
    return { success: false, error: error.message };
  }
};

// Get questions by IDs
export const getQuestions = async (questionIds) => {
  try {
    if (!questionIds || questionIds.length === 0) {
      return { success: true, data: [] };
    }

    const questions = [];
    for (const id of questionIds) {
      const result = await getDocument(COLLECTIONS.QUESTIONS, id);
      if (result.success) {
        questions.push(result.data);
      }
    }
    
    return { success: true, data: questions };
  } catch (error) {
    console.error('❌ Error getting questions:', error);
    return { success: false, error: error.message };
  }
};

// Update question
export const updateQuestion = async (questionId, data) => {
  try {
    const result = await updateDocument(COLLECTIONS.QUESTIONS, questionId, data);
    return result;
  } catch (error) {
    console.error('❌ Error updating question:', error);
    return { success: false, error: error.message };
  }
};

// Delete question
export const deleteQuestion = async (questionId) => {
  try {
    const result = await deleteDocument(COLLECTIONS.QUESTIONS, questionId);
    return result;
  } catch (error) {
    console.error('❌ Error deleting question:', error);
    return { success: false, error: error.message };
  }
};

// Get all questions for an organization
export const getOrganizationQuestions = async (organizationId, filters = {}) => {
  try {
    const conditions = [
      { field: 'organizationId', operator: '==', value: organizationId }
    ];

    if (filters.subjectId) {
      conditions.push({ field: 'subjectId', operator: '==', value: filters.subjectId });
    }

    if (filters.type) {
      conditions.push({ field: 'type', operator: '==', value: filters.type });
    }

    if (filters.difficulty) {
      conditions.push({ field: 'difficulty', operator: '==', value: filters.difficulty });
    }

    if (filters.status) {
      conditions.push({ field: 'status', operator: '==', value: filters.status });
    }

    if (filters.isActive !== undefined) {
      conditions.push({ field: 'isActive', operator: '==', value: filters.isActive });
    }

    if (filters.isAIGenerated !== undefined) {
      conditions.push({ field: 'isAIGenerated', operator: '==', value: filters.isAIGenerated });
    }

    const result = await queryDocuments(
      COLLECTIONS.QUESTIONS,
      conditions,
      'createdAt',
      'desc'
    );
    return result;
  } catch (error) {
    console.error('❌ Error getting organization questions:', error);
    return { success: false, error: error.message };
  }
};

// Get all questions (Super Admin only)
export const getAllQuestions = async () => {
  try {
    const result = await getAllDocuments(COLLECTIONS.QUESTIONS);
    return result;
  } catch (error) {
    console.error('❌ Error getting all questions:', error);
    return { success: false, error: error.message };
  }
};

// Toggle question status
export const toggleQuestionStatus = async (questionId, isActive) => {
  try {
    const result = await updateDocument(COLLECTIONS.QUESTIONS, questionId, {
      isActive: isActive,
    });
    return result;
  } catch (error) {
    console.error('❌ Error toggling question status:', error);
    return { success: false, error: error.message };
  }
};

// Update question status
export const updateQuestionStatus = async (questionId, status) => {
  try {
    const result = await updateDocument(COLLECTIONS.QUESTIONS, questionId, {
      status: status,
    });
    return result;
  } catch (error) {
    console.error('❌ Error updating question status:', error);
    return { success: false, error: error.message };
  }
};

// Save multiple questions
export const saveQuestions = async (questions) => {
  try {
    const results = [];
    for (const question of questions) {
      const result = await createDocument(COLLECTIONS.QUESTIONS, question);
      if (result.success) {
        results.push(result.data);
      }
    }
    
    return { 
      success: true, 
      data: results,
      count: results.length,
    };
  } catch (error) {
    console.error('❌ Error saving questions:', error);
    return { success: false, error: error.message };
  }
};

// Get questions by subject
export const getQuestionsBySubject = async (subjectId) => {
  try {
    const result = await queryDocuments(COLLECTIONS.QUESTIONS, [
      { field: 'subjectId', operator: '==', value: subjectId },
      { field: 'isActive', operator: '==', value: true },
    ]);
    return result;
  } catch (error) {
    console.error('❌ Error getting questions by subject:', error);
    return { success: false, error: error.message };
  }
};

// Get questions by difficulty
export const getQuestionsByDifficulty = async (organizationId, difficulty) => {
  try {
    const result = await queryDocuments(COLLECTIONS.QUESTIONS, [
      { field: 'organizationId', operator: '==', value: organizationId },
      { field: 'difficulty', operator: '==', value: difficulty },
      { field: 'isActive', operator: '==', value: true },
    ]);
    return result;
  } catch (error) {
    console.error('❌ Error getting questions by difficulty:', error);
    return { success: false, error: error.message };
  }
};

// Get AI generated questions
export const getAIGeneratedQuestions = async (organizationId) => {
  try {
    const result = await queryDocuments(COLLECTIONS.QUESTIONS, [
      { field: 'organizationId', operator: '==', value: organizationId },
      { field: 'isAIGenerated', operator: '==', value: true },
    ]);
    return result;
  } catch (error) {
    console.error('❌ Error getting AI generated questions:', error);
    return { success: false, error: error.message };
  }
};

// Bulk import questions
export const bulkImportQuestions = async (questions, organizationId, createdBy) => {
  try {
    const results = [];
    for (const question of questions) {
      const questionData = {
        ...question,
        organizationId,
        createdBy,
        isAIGenerated: false,
        status: 'published',
      };
      const result = await createDocument(COLLECTIONS.QUESTIONS, questionData);
      if (result.success) {
        results.push(result.data);
      }
    }
    
    return { 
      success: true, 
      data: results,
      count: results.length,
    };
  } catch (error) {
    console.error('❌ Error bulk importing questions:', error);
    return { success: false, error: error.message };
  }
};

// Import questions from Excel
export const importQuestionsFromExcel = async (file, organizationId, createdBy) => {
  try {
    const result = await callFunction('importQuestionsFromExcel', {
      fileUrl: file.url || file,
      organizationId,
      createdBy,
    });
    return result;
  } catch (error) {
    console.error('❌ Error importing questions:', error);
    return { success: false, error: error.message };
  }
};

// Export questions to Excel
export const exportQuestionsToExcel = async (organizationId, filters = {}) => {
  try {
    const result = await callFunction('exportQuestionsToExcel', {
      organizationId,
      filters,
    });
    return result;
  } catch (error) {
    console.error('❌ Error exporting questions:', error);
    return { success: false, error: error.message };
  }
};

// Get question statistics
export const getQuestionStats = async (organizationId) => {
  try {
    const questionsResult = await queryDocuments(COLLECTIONS.QUESTIONS, [
      { field: 'organizationId', operator: '==', value: organizationId },
    ]);

    if (!questionsResult.success) {
      return { success: false, error: questionsResult.error };
    }

    const questions = questionsResult.data;
    const stats = {
      total: questions.length,
      active: questions.filter(q => q.isActive).length,
      inactive: questions.filter(q => !q.isActive).length,
      byType: {},
      byDifficulty: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
      byStatus: {
        draft: 0,
        published: 0,
        archived: 0,
      },
      aiGenerated: questions.filter(q => q.isAIGenerated).length,
      manual: questions.filter(q => !q.isAIGenerated).length,
      totalMarks: questions.reduce((sum, q) => sum + (q.marks || 1), 0),
    };

    // Calculate type stats
    questions.forEach(question => {
      if (question.type) {
        stats.byType[question.type] = (stats.byType[question.type] || 0) + 1;
      }
      if (question.difficulty) {
        stats.byDifficulty[question.difficulty] = (stats.byDifficulty[question.difficulty] || 0) + 1;
      }
      if (question.status) {
        stats.byStatus[question.status] = (stats.byStatus[question.status] || 0) + 1;
      }
    });

    return { success: true, data: stats };
  } catch (error) {
    console.error('❌ Error getting question stats:', error);
    return { success: false, error: error.message };
  }
};

// Validate question
export const validateQuestion = (question) => {
  const errors = [];
  
  if (!question.text || question.text.trim().length < 5) {
    errors.push('Question text must be at least 5 characters');
  }
  
  if (!question.type) {
    errors.push('Question type is required');
  }
  
  if (!question.difficulty) {
    errors.push('Difficulty level is required');
  }
  
  if (!question.correctAnswer) {
    errors.push('Correct answer is required');
  }
  
  if (question.type === 'mcq') {
    if (!question.options || question.options.length < 2) {
      errors.push('MCQ requires at least 2 options');
    }
    if (question.options && question.options.some(opt => !opt.trim())) {
      errors.push('All options must have text');
    }
    if (!question.options?.includes(question.correctAnswer)) {
      errors.push('Correct answer must be one of the options');
    }
  }
  
  if (question.type === 'true_false') {
    if (!['true', 'false'].includes(question.correctAnswer?.toLowerCase())) {
      errors.push('Correct answer must be "true" or "false"');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Duplicate question
export const duplicateQuestion = async (questionId, newData = {}) => {
  try {
    const questionResult = await getQuestion(questionId);
    if (!questionResult.success) {
      return { success: false, error: 'Question not found' };
    }

    const question = questionResult.data;
    const duplicateData = {
      ...question,
      text: `${question.text} (Copy)`,
      status: 'draft',
      isActive: true,
      createdBy: newData.createdBy || question.createdBy,
      organizationId: newData.organizationId || question.organizationId,
      ...newData,
    };

    delete duplicateData.id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;

    const result = await createDocument(COLLECTIONS.QUESTIONS, duplicateData);
    return result;
  } catch (error) {
    console.error('❌ Error duplicating question:', error);
    return { success: false, error: error.message };
  }
};

// Get questions by IDs with pagination
export const getQuestionsByIds = async (questionIds, limit = 50) => {
  try {
    if (!questionIds || questionIds.length === 0) {
      return { success: true, data: [] };
    }

    // Limit the number of questions to fetch
    const idsToFetch = questionIds.slice(0, limit);
    const questions = [];
    
    for (const id of idsToFetch) {
      const result = await getDocument(COLLECTIONS.QUESTIONS, id);
      if (result.success) {
        questions.push(result.data);
      }
    }
    
    return { success: true, data: questions };
  } catch (error) {
    console.error('❌ Error getting questions by IDs:', error);
    return { success: false, error: error.message };
  }
};