// Exam API Service
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

// Create a new exam
export const createExam = async (examData) => {
  try {
    const data = {
      title: examData.title,
      description: examData.description || '',
      organizationId: examData.organizationId,
      subjectId: examData.subjectId || null,
      createdBy: examData.createdBy || null,
      
      // Exam settings
      duration: examData.duration || 60, // in minutes
      totalMarks: examData.totalMarks || 0,
      passingMarks: examData.passingMarks || 0,
      negativeMarking: examData.negativeMarking || false,
      negativeMarkValue: examData.negativeMarkValue || 0,
      
      // Question settings
      questionIds: examData.questionIds || [],
      totalQuestions: examData.questionIds?.length || 0,
      shuffleQuestions: examData.shuffleQuestions || false,
      shuffleOptions: examData.shuffleOptions || false,
      randomQuestions: examData.randomQuestions || false,
      randomQuestionCount: examData.randomQuestionCount || 0,
      
      // Student settings
      assignedStudents: examData.assignedStudents || [],
      isPublished: false,
      isActive: true,
      status: 'draft', // draft, scheduled, ongoing, completed, archived
      
      // Schedule
      startDate: examData.startDate || null,
      endDate: examData.endDate || null,
      scheduledAt: examData.scheduledAt || null,
      
      // Instructions
      instructions: examData.instructions || [],
      
      // Results
      resultsPublished: false,
      resultsPublishedAt: null,
      
      // Security
      allowResume: examData.allowResume || true,
      detectTabSwitch: examData.detectTabSwitch || true,
      requireFullscreen: examData.requireFullscreen || false,
      preventCopyPaste: examData.preventCopyPaste || true,
      
      // Metadata
      tags: examData.tags || [],
      category: examData.category || '',
      level: examData.level || 'medium',
      
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Calculate total marks
    if (examData.questionIds && examData.questionIds.length > 0) {
      // We'll calculate total marks based on questions
      // This should be done server-side or with a separate query
    }

    const result = await createDocument(COLLECTIONS.EXAMS, data);
    return result;
  } catch (error) {
    console.error('❌ Error creating exam:', error);
    return { success: false, error: error.message };
  }
};

// Get exam by ID
export const getExam = async (examId) => {
  try {
    const result = await getDocument(COLLECTIONS.EXAMS, examId);
    return result;
  } catch (error) {
    console.error('❌ Error getting exam:', error);
    return { success: false, error: error.message };
  }
};

// Update exam
export const updateExam = async (examId, data) => {
  try {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };
    const result = await updateDocument(COLLECTIONS.EXAMS, examId, updateData);
    return result;
  } catch (error) {
    console.error('❌ Error updating exam:', error);
    return { success: false, error: error.message };
  }
};

// Delete exam
export const deleteExam = async (examId) => {
  try {
    const result = await deleteDocument(COLLECTIONS.EXAMS, examId);
    return result;
  } catch (error) {
    console.error('❌ Error deleting exam:', error);
    return { success: false, error: error.message };
  }
};

// Get all exams for an organization
export const getOrganizationExams = async (organizationId, filters = {}) => {
  try {
    const conditions = [
      { field: 'organizationId', operator: '==', value: organizationId }
    ];

    if (filters.subjectId) {
      conditions.push({ field: 'subjectId', operator: '==', value: filters.subjectId });
    }

    if (filters.status) {
      conditions.push({ field: 'status', operator: '==', value: filters.status });
    }

    if (filters.isPublished !== undefined) {
      conditions.push({ field: 'isPublished', operator: '==', value: filters.isPublished });
    }

    if (filters.isActive !== undefined) {
      conditions.push({ field: 'isActive', operator: '==', value: filters.isActive });
    }

    const result = await queryDocuments(
      COLLECTIONS.EXAMS,
      conditions,
      'createdAt',
      'desc'
    );
    return result;
  } catch (error) {
    console.error('❌ Error getting organization exams:', error);
    return { success: false, error: error.message };
  }
};

// Get exams for a student
export const getStudentExams = async (studentId, organizationId) => {
  try {
    const result = await queryDocuments(COLLECTIONS.EXAMS, [
      { field: 'organizationId', operator: '==', value: organizationId },
      { field: 'assignedStudents', operator: 'array-contains', value: studentId },
      { field: 'isActive', operator: '==', value: true },
      { field: 'isPublished', operator: '==', value: true },
    ]);
    return result;
  } catch (error) {
    console.error('❌ Error getting student exams:', error);
    return { success: false, error: error.message };
  }
};

// Publish exam
export const publishExam = async (examId) => {
  try {
    const result = await updateDocument(COLLECTIONS.EXAMS, examId, {
      isPublished: true,
      status: 'scheduled',
      publishedAt: new Date(),
      updatedAt: new Date(),
    });
    return result;
  } catch (error) {
    console.error('❌ Error publishing exam:', error);
    return { success: false, error: error.message };
  }
};

// Unpublish exam
export const unpublishExam = async (examId) => {
  try {
    const result = await updateDocument(COLLECTIONS.EXAMS, examId, {
      isPublished: false,
      status: 'draft',
      updatedAt: new Date(),
    });
    return result;
  } catch (error) {
    console.error('❌ Error unpublishing exam:', error);
    return { success: false, error: error.message };
  }
};

// Start exam for a student
export const startExamAttempt = async (examId, studentId) => {
  try {
    const examAttemptData = {
      examId: examId,
      studentId: studentId,
      startTime: new Date(),
      status: 'in_progress',
      answers: {},
      currentQuestionIndex: 0,
      timeSpent: 0,
      tabSwitches: 0,
      fullscreenExits: 0,
      isCompleted: false,
      isSubmitted: false,
      score: 0,
      percentage: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      unattempted: 0,
    };

    const result = await createDocument(COLLECTIONS.EXAM_ATTEMPTS, examAttemptData);
    return result;
  } catch (error) {
    console.error('❌ Error starting exam attempt:', error);
    return { success: false, error: error.message };
  }
};

// Submit exam
export const submitExam = async (examAttemptId, answers, timeSpent) => {
  try {
    const result = await updateDocument(COLLECTIONS.EXAM_ATTEMPTS, examAttemptId, {
      answers: answers,
      timeSpent: timeSpent,
      isSubmitted: true,
      isCompleted: true,
      submittedAt: new Date(),
      status: 'submitted',
      updatedAt: new Date(),
    });
    
    // Trigger auto-evaluation
    if (result.success) {
      await callFunction('evaluateExamResults', { examAttemptId });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error submitting exam:', error);
    return { success: false, error: error.message };
  }
};

// Auto-submit exam (by timer)
export const autoSubmitExam = async (examAttemptId) => {
  try {
    const result = await callFunction('autoSubmitExam', { examAttemptId });
    return result;
  } catch (error) {
    console.error('❌ Error auto-submitting exam:', error);
    return { success: false, error: error.message };
  }
};

// Get exam attempt
export const getExamAttempt = async (examAttemptId) => {
  try {
    const result = await getDocument(COLLECTIONS.EXAM_ATTEMPTS, examAttemptId);
    return result;
  } catch (error) {
    console.error('❌ Error getting exam attempt:', error);
    return { success: false, error: error.message };
  }
};

// Get student's exam attempts
export const getStudentExamAttempts = async (studentId, examId = null) => {
  try {
    const conditions = [
      { field: 'studentId', operator: '==', value: studentId }
    ];
    
    if (examId) {
      conditions.push({ field: 'examId', operator: '==', value: examId });
    }
    
    const result = await queryDocuments(
      COLLECTIONS.EXAM_ATTEMPTS,
      conditions,
      'startTime',
      'desc'
    );
    return result;
  } catch (error) {
    console.error('❌ Error getting student exam attempts:', error);
    return { success: false, error: error.message };
  }
};

// Save exam progress (resume support)
export const saveExamProgress = async (examAttemptId, data) => {
  try {
    const result = await updateDocument(COLLECTIONS.EXAM_ATTEMPTS, examAttemptId, {
      ...data,
      updatedAt: new Date(),
    });
    return result;
  } catch (error) {
    console.error('❌ Error saving exam progress:', error);
    return { success: false, error: error.message };
  }
};

// Get exam statistics
export const getExamStats = async (examId) => {
  try {
    const examResult = await getExam(examId);
    if (!examResult.success) return examResult;
    
    const attemptsResult = await queryDocuments(COLLECTIONS.EXAM_ATTEMPTS, [
      { field: 'examId', operator: '==', value: examId },
    ]);
    
    if (!attemptsResult.success) {
      return { success: false, error: attemptsResult.error };
    }
    
    const attempts = attemptsResult.data;
    const completed = attempts.filter(a => a.isCompleted);
    const submitted = attempts.filter(a => a.isSubmitted);
    const inProgress = attempts.filter(a => a.status === 'in_progress');
    
    const scores = completed.map(a => a.percentage || 0);
    const averageScore = scores.length > 0 
      ? scores.reduce((sum, s) => sum + s, 0) / scores.length 
      : 0;
    
    const passed = completed.filter(a => (a.percentage || 0) >= 40);
    const failed = completed.filter(a => (a.percentage || 0) < 40);
    
    return {
      success: true,
      data: {
        totalAttempts: attempts.length,
        completed: completed.length,
        submitted: submitted.length,
        inProgress: inProgress.length,
        averageScore: averageScore,
        passRate: completed.length > 0 ? (passed.length / completed.length) * 100 : 0,
        passed: passed.length,
        failed: failed.length,
        highestScore: scores.length > 0 ? Math.max(...scores) : 0,
        lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
      },
    };
  } catch (error) {
    console.error('❌ Error getting exam stats:', error);
    return { success: false, error: error.message };
  }
};

// Assign students to exam
export const assignStudentsToExam = async (examId, studentIds) => {
  try {
    const result = await updateDocument(COLLECTIONS.EXAMS, examId, {
      assignedStudents: studentIds,
      updatedAt: new Date(),
    });
    return result;
  } catch (error) {
    console.error('❌ Error assigning students to exam:', error);
    return { success: false, error: error.message };
  }
};

// Publish exam results
export const publishExamResults = async (examId) => {
  try {
    const result = await callFunction('publishExamResults', { examId });
    return result;
  } catch (error) {
    console.error('❌ Error publishing exam results:', error);
    return { success: false, error: error.message };
  }
};

// Export exam results
export const exportExamResults = async (examId, format = 'excel') => {
  try {
    const result = await callFunction('exportExamResults', { examId, format });
    return result;
  } catch (error) {
    console.error('❌ Error exporting exam results:', error);
    return { success: false, error: error.message };
  }
};