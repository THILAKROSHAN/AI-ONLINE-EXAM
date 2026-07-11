// Results API Service
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

// Create a new result
export const createResult = async (resultData) => {
  try {
    const data = {
      examId: resultData.examId,
      studentId: resultData.studentId,
      organizationId: resultData.organizationId,
      examTitle: resultData.examTitle || '',
      studentName: resultData.studentName || '',
      studentEmail: resultData.studentEmail || '',
      
      // Scores
      totalMarks: resultData.totalMarks || 0,
      obtainedMarks: resultData.obtainedMarks || 0,
      percentage: resultData.percentage || 0,
      
      // Statistics
      correctAnswers: resultData.correctAnswers || 0,
      wrongAnswers: resultData.wrongAnswers || 0,
      unattempted: resultData.unattempted || 0,
      
      // Status
      isPassed: resultData.isPassed || false,
      isPublished: resultData.isPublished || false,
      status: resultData.status || 'draft',
      
      // Time
      timeSpent: resultData.timeSpent || 0,
      startedAt: resultData.startedAt || null,
      submittedAt: resultData.submittedAt || null,
      completedAt: resultData.completedAt || null,
      
      // Answers
      answers: resultData.answers || {},
      questionResults: resultData.questionResults || [],
      
      // Metadata
      rank: resultData.rank || null,
      percentile: resultData.percentile || null,
      feedback: resultData.feedback || '',
      
      // Audit
      evaluatedBy: resultData.evaluatedBy || null,
      evaluatedAt: resultData.evaluatedAt || null,
      manualEvaluation: resultData.manualEvaluation || false,
      
      // Flags
      isAutoEvaluated: resultData.isAutoEvaluated || true,
      isManualEvaluated: resultData.isManualEvaluated || false,
      
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await createDocument(COLLECTIONS.RESULTS, data);
    return result;
  } catch (error) {
    console.error('❌ Error creating result:', error);
    return { success: false, error: error.message };
  }
};

// Get result by ID
export const getResult = async (resultId) => {
  try {
    const result = await getDocument(COLLECTIONS.RESULTS, resultId);
    return result;
  } catch (error) {
    console.error('❌ Error getting result:', error);
    return { success: false, error: error.message };
  }
};

// Update result
export const updateResult = async (resultId, data) => {
  try {
    const result = await updateDocument(COLLECTIONS.RESULTS, resultId, {
      ...data,
      updatedAt: new Date(),
    });
    return result;
  } catch (error) {
    console.error('❌ Error updating result:', error);
    return { success: false, error: error.message };
  }
};

// Delete result
export const deleteResult = async (resultId) => {
  try {
    const result = await deleteDocument(COLLECTIONS.RESULTS, resultId);
    return result;
  } catch (error) {
    console.error('❌ Error deleting result:', error);
    return { success: false, error: error.message };
  }
};

// Get student results
export const getStudentResults = async (studentId, examId = null) => {
  try {
    const conditions = [
      { field: 'studentId', operator: '==', value: studentId }
    ];
    
    if (examId) {
      conditions.push({ field: 'examId', operator: '==', value: examId });
    }
    
    const result = await queryDocuments(
      COLLECTIONS.RESULTS,
      conditions,
      'completedAt',
      'desc'
    );
    return result;
  } catch (error) {
    console.error('❌ Error getting student results:', error);
    return { success: false, error: error.message };
  }
};

// Get exam results
export const getExamResults = async (examId) => {
  try {
    const result = await queryDocuments(COLLECTIONS.RESULTS, [
      { field: 'examId', operator: '==', value: examId }
    ]);
    return result;
  } catch (error) {
    console.error('❌ Error getting exam results:', error);
    return { success: false, error: error.message };
  }
};

// Get organization results
export const getOrganizationResults = async (organizationId, filters = {}) => {
  try {
    const conditions = [
      { field: 'organizationId', operator: '==', value: organizationId }
    ];
    
    if (filters.examId) {
      conditions.push({ field: 'examId', operator: '==', value: filters.examId });
    }
    
    if (filters.studentId) {
      conditions.push({ field: 'studentId', operator: '==', value: filters.studentId });
    }
    
    if (filters.isPublished !== undefined) {
      conditions.push({ field: 'isPublished', operator: '==', value: filters.isPublished });
    }
    
    if (filters.isPassed !== undefined) {
      conditions.push({ field: 'isPassed', operator: '==', value: filters.isPassed });
    }
    
    if (filters.minScore !== undefined) {
      conditions.push({ field: 'percentage', operator: '>=', value: filters.minScore });
    }
    
    if (filters.maxScore !== undefined) {
      conditions.push({ field: 'percentage', operator: '<=', value: filters.maxScore });
    }
    
    const result = await queryDocuments(
      COLLECTIONS.RESULTS,
      conditions,
      'percentage',
      'desc'
    );
    return result;
  } catch (error) {
    console.error('❌ Error getting organization results:', error);
    return { success: false, error: error.message };
  }
};

// Publish result
export const publishResult = async (resultId) => {
  try {
    const result = await updateDocument(COLLECTIONS.RESULTS, resultId, {
      isPublished: true,
      status: 'published',
      publishedAt: new Date(),
      updatedAt: new Date(),
    });
    
    // Send notification
    if (result.success) {
      await callFunction('sendResultNotification', { resultId });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error publishing result:', error);
    return { success: false, error: error.message };
  }
};

// Unpublish result
export const unpublishResult = async (resultId) => {
  try {
    const result = await updateDocument(COLLECTIONS.RESULTS, resultId, {
      isPublished: false,
      status: 'draft',
      updatedAt: new Date(),
    });
    return result;
  } catch (error) {
    console.error('❌ Error unpublishing result:', error);
    return { success: false, error: error.message };
  }
};

// Bulk publish results
export const bulkPublishResults = async (resultIds) => {
  try {
    const results = [];
    for (const id of resultIds) {
      const result = await publishResult(id);
      if (result.success) {
        results.push(result.data);
      }
    }
    return { success: true, data: results };
  } catch (error) {
    console.error('❌ Error bulk publishing results:', error);
    return { success: false, error: error.message };
  }
};

// Manual evaluation
export const manualEvaluate = async (resultId, evaluationData) => {
  try {
    const result = await updateDocument(COLLECTIONS.RESULTS, resultId, {
      ...evaluationData,
      manualEvaluation: true,
      isManualEvaluated: true,
      evaluatedAt: new Date(),
      status: 'evaluated',
      updatedAt: new Date(),
    });
    return result;
  } catch (error) {
    console.error('❌ Error manual evaluation:', error);
    return { success: false, error: error.message };
  }
};

// Get result statistics
export const getResultStats = async (organizationId, examId = null) => {
  try {
    const conditions = [
      { field: 'organizationId', operator: '==', value: organizationId }
    ];
    
    if (examId) {
      conditions.push({ field: 'examId', operator: '==', value: examId });
    }
    
    const resultsResult = await queryDocuments(COLLECTIONS.RESULTS, conditions);
    
    if (!resultsResult.success) {
      return { success: false, error: resultsResult.error };
    }

    const results = resultsResult.data;
    const published = results.filter(r => r.isPublished);
    const passed = results.filter(r => r.isPassed);
    const failed = results.filter(r => !r.isPassed);
    
    const scores = results.map(r => r.percentage || 0);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    
    const sortedScores = [...scores].sort((a, b) => b - a);
    const highest = sortedScores.length > 0 ? sortedScores[0] : 0;
    const lowest = sortedScores.length > 0 ? sortedScores[sortedScores.length - 1] : 0;
    
    // Calculate grade distribution
    const gradeDistribution = {
      'A': results.filter(r => r.percentage >= 80).length,
      'B': results.filter(r => r.percentage >= 60 && r.percentage < 80).length,
      'C': results.filter(r => r.percentage >= 40 && r.percentage < 60).length,
      'D': results.filter(r => r.percentage >= 30 && r.percentage < 40).length,
      'F': results.filter(r => r.percentage < 30).length,
    };

    return {
      success: true,
      data: {
        total: results.length,
        published: published.length,
        unpublished: results.length - published.length,
        passed: passed.length,
        failed: failed.length,
        passRate: results.length > 0 ? (passed.length / results.length) * 100 : 0,
        averageScore: avgScore,
        highestScore: highest,
        lowestScore: lowest,
        gradeDistribution,
        totalMarks: results.reduce((sum, r) => sum + (r.totalMarks || 0), 0),
        averageMarks: results.length > 0 ? results.reduce((sum, r) => sum + (r.obtainedMarks || 0), 0) / results.length : 0,
      },
    };
  } catch (error) {
    console.error('❌ Error getting result stats:', error);
    return { success: false, error: error.message };
  }
};

// Get student performance analytics
export const getStudentPerformanceAnalytics = async (studentId, organizationId) => {
  try {
    const resultsResult = await getStudentResults(studentId);
    
    if (!resultsResult.success) {
      return { success: false, error: resultsResult.error };
    }

    const results = resultsResult.data;
    
    // Subject-wise performance
    const subjectPerformance = {};
    results.forEach(result => {
      if (result.subjectId) {
        if (!subjectPerformance[result.subjectId]) {
          subjectPerformance[result.subjectId] = {
            count: 0,
            totalScore: 0,
            scores: [],
          };
        }
        subjectPerformance[result.subjectId].count++;
        subjectPerformance[result.subjectId].totalScore += result.percentage || 0;
        subjectPerformance[result.subjectId].scores.push(result.percentage || 0);
      }
    });

    // Calculate subject averages
    const subjectAverages = {};
    Object.keys(subjectPerformance).forEach(subjectId => {
      const data = subjectPerformance[subjectId];
      subjectAverages[subjectId] = {
        average: data.totalScore / data.count,
        count: data.count,
        highest: Math.max(...data.scores),
        lowest: Math.min(...data.scores),
      };
    });

    // Trend data
    const trendData = results.map((r, index) => ({
      exam: index + 1,
      score: r.percentage || 0,
      date: r.completedAt?.toDate?.() || new Date(),
    })).reverse();

    // Overall stats
    const scores = results.map(r => r.percentage || 0);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const passed = results.filter(r => r.isPassed);
    const failed = results.filter(r => !r.isPassed);

    return {
      success: true,
      data: {
        totalExams: results.length,
        averageScore: avgScore,
        passRate: results.length > 0 ? (passed.length / results.length) * 100 : 0,
        passed: passed.length,
        failed: failed.length,
        highestScore: scores.length > 0 ? Math.max(...scores) : 0,
        lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
        subjectPerformance: subjectAverages,
        trendData: trendData,
        recentResults: results.slice(0, 5),
      },
    };
  } catch (error) {
    console.error('❌ Error getting student performance:', error);
    return { success: false, error: error.message };
  }
};

// Export results
export const exportResults = async (organizationId, filters = {}, format = 'excel') => {
  try {
    const result = await callFunction('exportResults', {
      organizationId,
      filters,
      format,
    });
    return result;
  } catch (error) {
    console.error('❌ Error exporting results:', error);
    return { success: false, error: error.message };
  }
};

// Generate result report
export const generateResultReport = async (resultId) => {
  try {
    const result = await callFunction('generateResultReport', { resultId });
    return result;
  } catch (error) {
    console.error('❌ Error generating result report:', error);
    return { success: false, error: error.message };
  }
};

// Calculate rank
export const calculateRank = async (examId) => {
  try {
    const resultsResult = await getExamResults(examId);
    
    if (!resultsResult.success) {
      return { success: false, error: resultsResult.error };
    }

    const results = resultsResult.data;
    const sorted = [...results].sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
    
    // Update ranks
    const updates = [];
    sorted.forEach((result, index) => {
      const rank = index + 1;
      updates.push({
        id: result.id,
        rank: rank,
        percentile: ((sorted.length - index) / sorted.length) * 100,
      });
    });
    
    // Batch update
    for (const update of updates) {
      await updateDocument(COLLECTIONS.RESULTS, update.id, {
        rank: update.rank,
        percentile: update.percentile,
        updatedAt: new Date(),
      });
    }
    
    return { success: true, data: updates };
  } catch (error) {
    console.error('❌ Error calculating rank:', error);
    return { success: false, error: error.message };
  }
};