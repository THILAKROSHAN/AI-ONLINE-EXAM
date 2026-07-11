// Reports API Service
import { callFunction } from '../firebase/functions';
import { queryDocuments, COLLECTIONS } from '../firebase/firestore';

// Report types
export const REPORT_TYPES = {
  STUDENT: 'student',
  EXAM: 'exam',
  ORGANIZATION: 'organization',
  PERFORMANCE: 'performance',
  QUESTION: 'question',
  ATTENDANCE: 'attendance',
};

export const REPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv',
};

// Generate a report
export const generateReport = async (reportData) => {
  try {
    const result = await callFunction('generateReport', reportData);
    return result;
  } catch (error) {
    console.error('❌ Error generating report:', error);
    return { success: false, error: error.message };
  }
};

// Generate student report
export const generateStudentReport = async (studentId, organizationId, dateRange = null) => {
  try {
    const result = await callFunction('generateStudentReport', {
      studentId,
      organizationId,
      dateRange,
    });
    return result;
  } catch (error) {
    console.error('❌ Error generating student report:', error);
    return { success: false, error: error.message };
  }
};

// Generate exam report
export const generateExamReport = async (examId, organizationId, includeAnswers = false) => {
  try {
    const result = await callFunction('generateExamReport', {
      examId,
      organizationId,
      includeAnswers,
    });
    return result;
  } catch (error) {
    console.error('❌ Error generating exam report:', error);
    return { success: false, error: error.message };
  }
};

// Generate organization report
export const generateOrganizationReport = async (organizationId, dateRange = null) => {
  try {
    const result = await callFunction('generateOrganizationReport', {
      organizationId,
      dateRange,
    });
    return result;
  } catch (error) {
    console.error('❌ Error generating organization report:', error);
    return { success: false, error: error.message };
  }
};

// Generate performance report
export const generatePerformanceReport = async (organizationId, filters = {}) => {
  try {
    const result = await callFunction('generatePerformanceReport', {
      organizationId,
      filters,
    });
    return result;
  } catch (error) {
    console.error('❌ Error generating performance report:', error);
    return { success: false, error: error.message };
  }
};

// Generate question report
export const generateQuestionReport = async (organizationId, filters = {}) => {
  try {
    const result = await callFunction('generateQuestionReport', {
      organizationId,
      filters,
    });
    return result;
  } catch (error) {
    console.error('❌ Error generating question report:', error);
    return { success: false, error: error.message };
  }
};

// Generate attendance report
export const generateAttendanceReport = async (organizationId, dateRange = null) => {
  try {
    const result = await callFunction('generateAttendanceReport', {
      organizationId,
      dateRange,
    });
    return result;
  } catch (error) {
    console.error('❌ Error generating attendance report:', error);
    return { success: false, error: error.message };
  }
};

// Get report history
export const getReportHistory = async (organizationId) => {
  try {
    const result = await queryDocuments(COLLECTIONS.REPORTS, [
      { field: 'organizationId', operator: '==', value: organizationId },
    ], 'createdAt', 'desc');
    return result;
  } catch (error) {
    console.error('❌ Error getting report history:', error);
    return { success: false, error: error.message };
  }
};

// Get report by ID
export const getReport = async (reportId) => {
  try {
    const result = await getDocument(COLLECTIONS.REPORTS, reportId);
    return result;
  } catch (error) {
    console.error('❌ Error getting report:', error);
    return { success: false, error: error.message };
  }
};

// Delete report
export const deleteReport = async (reportId) => {
  try {
    const result = await deleteDocument(COLLECTIONS.REPORTS, reportId);
    return result;
  } catch (error) {
    console.error('❌ Error deleting report:', error);
    return { success: false, error: error.message };
  }
};

// Download report
export const downloadReport = async (reportId, format = 'pdf') => {
  try {
    const result = await callFunction('downloadReport', {
      reportId,
      format,
    });
    return result;
  } catch (error) {
    console.error('❌ Error downloading report:', error);
    return { success: false, error: error.message };
  }
};

// Schedule report
export const scheduleReport = async (scheduleData) => {
  try {
    const result = await callFunction('scheduleReport', scheduleData);
    return result;
  } catch (error) {
    console.error('❌ Error scheduling report:', error);
    return { success: false, error: error.message };
  }
};

// Cancel scheduled report
export const cancelScheduledReport = async (scheduleId) => {
  try {
    const result = await callFunction('cancelScheduledReport', { scheduleId });
    return result;
  } catch (error) {
    console.error('❌ Error canceling scheduled report:', error);
    return { success: false, error: error.message };
  }
};

// Get report templates
export const getReportTemplates = async (organizationId) => {
  try {
    const result = await callFunction('getReportTemplates', { organizationId });
    return result;
  } catch (error) {
    console.error('❌ Error getting report templates:', error);
    return { success: false, error: error.message };
  }
};

// Save report template
export const saveReportTemplate = async (templateData) => {
  try {
    const result = await callFunction('saveReportTemplate', templateData);
    return result;
  } catch (error) {
    console.error('❌ Error saving report template:', error);
    return { success: false, error: error.message };
  }
};

// Get report statistics
export const getReportStats = async (organizationId) => {
  try {
    const reportsResult = await queryDocuments(COLLECTIONS.REPORTS, [
      { field: 'organizationId', operator: '==', value: organizationId },
    ]);

    if (!reportsResult.success) {
      return { success: false, error: reportsResult.error };
    }

    const reports = reportsResult.data;
    const stats = {
      total: reports.length,
      byType: {},
      byFormat: {},
      recent: reports.slice(0, 5),
    };

    reports.forEach(report => {
      if (report.type) {
        stats.byType[report.type] = (stats.byType[report.type] || 0) + 1;
      }
      if (report.format) {
        stats.byFormat[report.format] = (stats.byFormat[report.format] || 0) + 1;
      }
    });

    return { success: true, data: stats };
  } catch (error) {
    console.error('❌ Error getting report stats:', error);
    return { success: false, error: error.message };
  }
};

// Format report data for display
export const formatReportData = (data, type) => {
  switch (type) {
    case REPORT_TYPES.STUDENT:
      return {
        title: 'Student Report',
        headers: ['Student ID', 'Name', 'Email', 'Department', 'Semester', 'Exams', 'Average Score', 'Status'],
        data: data.map(student => [
          student.studentId || 'N/A',
          student.name || 'N/A',
          student.email || 'N/A',
          student.department || 'N/A',
          student.semester || 'N/A',
          student.totalExams || 0,
          `${student.averageScore?.toFixed(1) || 0}%`,
          student.isActive ? 'Active' : 'Inactive',
        ]),
      };
    case REPORT_TYPES.EXAM:
      return {
        title: 'Exam Report',
        headers: ['Exam', 'Subject', 'Duration', 'Questions', 'Students', 'Average Score', 'Pass Rate'],
        data: data.map(exam => [
          exam.title || 'N/A',
          exam.subjectName || 'N/A',
          `${exam.duration || 0} min`,
          exam.totalQuestions || 0,
          exam.assignedStudents?.length || 0,
          `${exam.averageScore?.toFixed(1) || 0}%`,
          `${exam.passRate?.toFixed(1) || 0}%`,
        ]),
      };
    case REPORT_TYPES.PERFORMANCE:
      return {
        title: 'Performance Report',
        headers: ['Student', 'Exams', 'Average Score', 'Passed', 'Failed', 'Highest Score', 'Lowest Score'],
        data: data.map(perf => [
          perf.studentName || 'N/A',
          perf.totalExams || 0,
          `${perf.averageScore?.toFixed(1) || 0}%`,
          perf.passed || 0,
          perf.failed || 0,
          `${perf.highestScore?.toFixed(1) || 0}%`,
          `${perf.lowestScore?.toFixed(1) || 0}%`,
        ]),
      };
    default:
      return {
        title: 'Report',
        headers: ['Data'],
        data: data.map(item => [JSON.stringify(item)]),
      };
  }
};