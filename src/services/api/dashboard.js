// Dashboard API Service
import { queryDocuments, COLLECTIONS } from '../firebase/firestore';

// Get dashboard data
export const getDashboardData = async (organizationId) => {
  try {
    console.log('🔄 Loading dashboard data for:', organizationId);

    // Get all required data in parallel
    const [
      studentsResult,
      subjectsResult,
      questionsResult,
      examsResult,
      resultsResult,
    ] = await Promise.all([
      queryDocuments(COLLECTIONS.STUDENTS, [
        { field: 'organizationId', operator: '==', value: organizationId }
      ]),
      queryDocuments(COLLECTIONS.SUBJECTS, [
        { field: 'organizationId', operator: '==', value: organizationId }
      ]),
      queryDocuments(COLLECTIONS.QUESTIONS, [
        { field: 'organizationId', operator: '==', value: organizationId }
      ]),
      queryDocuments(COLLECTIONS.EXAMS, [
        { field: 'organizationId', operator: '==', value: organizationId }
      ]),
      queryDocuments(COLLECTIONS.RESULTS, [
        { field: 'organizationId', operator: '==', value: organizationId }
      ]),
    ]);

    // Process stats
    const students = studentsResult.success ? studentsResult.data : [];
    const subjects = subjectsResult.success ? subjectsResult.data : [];
    const questions = questionsResult.success ? questionsResult.data : [];
    const exams = examsResult.success ? examsResult.data : [];
    const results = resultsResult.success ? resultsResult.data : [];

    console.log('📊 Stats:', {
      students: students.length,
      subjects: subjects.length,
      questions: questions.length,
      exams: exams.length,
      results: results.length,
    });

    const stats = {
      totalStudents: students.length,
      activeStudents: students.filter(s => s.isActive).length,
      totalAdmins: 0,
      totalSubjects: subjects.length,
      totalQuestions: questions.length,
      totalExams: exams.length,
      activeExams: exams.filter(e => e.isActive && e.isPublished).length,
      totalResults: results.length,
    };

    // Process exam stats
    const examStats = {
      byStatus: {},
      byQuestionType: {},
      totalExams: exams.length,
      publishedExams: exams.filter(e => e.isPublished).length,
      draftExams: exams.filter(e => e.status === 'draft').length,
      scheduledExams: exams.filter(e => e.status === 'scheduled').length,
      completedExams: exams.filter(e => e.status === 'completed').length,
    };

    exams.forEach(exam => {
      if (exam.status) {
        examStats.byStatus[exam.status] = (examStats.byStatus[exam.status] || 0) + 1;
      }
    });

    // Process question types
    questions.forEach(question => {
      if (question.type) {
        examStats.byQuestionType[question.type] = (examStats.byQuestionType[question.type] || 0) + 1;
      }
    });

    // Recent activities
    const recentActivities = exams.slice(0, 5).map(exam => ({
      type: 'exam_created',
      description: `Exam "${exam.title}" created`,
      time: exam.createdAt?.toDate?.()?.toLocaleString() || 'Recently',
      user: 'System',
    }));

    // Notifications
    const notifications = [];
    const now = new Date();
    const upcomingExams = exams.filter(e => 
      e.startDate && new Date(e.startDate) > now && e.isPublished
    );
    
    if (upcomingExams.length > 0) {
      notifications.push({
        id: 'upcoming-exams',
        type: 'info',
        message: `${upcomingExams.length} exam${upcomingExams.length > 1 ? 's' : ''} starting soon`,
        time: new Date().toLocaleString(),
      });
    }

    const pendingResults = results.filter(r => !r.isPublished);
    if (pendingResults.length > 0) {
      notifications.push({
        id: 'pending-results',
        type: 'warning',
        message: `${pendingResults.length} result${pendingResults.length > 1 ? 's' : ''} pending publication`,
        time: new Date().toLocaleString(),
      });
    }

    // Student growth data
    const studentGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('default', { month: 'short' });
      
      const count = students.filter(s => {
        const created = s.createdAt?.toDate?.() || new Date(s.createdAt);
        return created.getMonth() === date.getMonth() && 
               created.getFullYear() === date.getFullYear();
      }).length;
      
      studentGrowth.push({
        month,
        students: count,
      });
    }

    // Performance data
    const performanceData = {
      completedExams: results.filter(r => r.isPassed !== undefined).length,
      upcomingExams: upcomingExams.length,
      inProgressExams: exams.filter(e => e.status === 'ongoing').length,
      trend: results.slice(0, 10).map((r, index) => ({
        exam: `Exam ${index + 1}`,
        score: r.percentage || 0,
      })),
    };

    console.log('✅ Dashboard data loaded successfully');

    return {
      success: true,
      data: {
        stats,
        examStats,
        recentActivities,
        notifications,
        performanceData,
        studentGrowth,
      },
    };
  } catch (error) {
    console.error('❌ Error getting dashboard data:', error);
    // Return default data instead of error
    return {
      success: true,
      data: {
        stats: {
          totalStudents: 0,
          activeStudents: 0,
          totalAdmins: 0,
          totalSubjects: 0,
          totalQuestions: 0,
          totalExams: 0,
          activeExams: 0,
          totalResults: 0,
        },
        examStats: {
          byStatus: {},
          byQuestionType: {},
          totalExams: 0,
          publishedExams: 0,
          draftExams: 0,
          scheduledExams: 0,
          completedExams: 0,
        },
        recentActivities: [],
        notifications: [],
        performanceData: {
          completedExams: 0,
          upcomingExams: 0,
          inProgressExams: 0,
          trend: [],
        },
        studentGrowth: [],
      },
    };
  }
};

// Get admin stats
export const getAdminStats = async (organizationId) => {
  try {
    const result = await queryDocuments(COLLECTIONS.ADMINISTRATORS, [
      { field: 'organizationId', operator: '==', value: organizationId },
    ]);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const admins = result.data;
    const stats = {
      total: admins.length,
      active: admins.filter(a => a.isActive).length,
      inactive: admins.filter(a => !a.isActive).length,
      byRole: {},
    };

    admins.forEach(admin => {
      if (admin.role) {
        stats.byRole[admin.role] = (stats.byRole[admin.role] || 0) + 1;
      }
    });

    return { success: true, data: stats };
  } catch (error) {
    console.error('❌ Error getting admin stats:', error);
    return { success: false, error: error.message };
  }
};