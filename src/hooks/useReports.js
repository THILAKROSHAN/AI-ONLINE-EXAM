// useReports Hook
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  generateReport,
  generateStudentReport,
  generateExamReport,
  generateOrganizationReport,
  generatePerformanceReport,
  generateQuestionReport,
  getReportHistory,
  getReport,
  deleteReport,
  downloadReport,
  scheduleReport,
  cancelScheduledReport,
  getReportTemplates,
  saveReportTemplate,
  getReportStats,
  REPORT_TYPES,
  REPORT_FORMATS,
} from '../services/api/report';

export const useReports = () => {
  const { userData } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadReports = useCallback(async () => {
    if (!userData?.organizationId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getReportHistory(userData.organizationId);
      if (result.success) {
        setReports(result.data);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [userData?.organizationId]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const generateNewReport = async (reportData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await generateReport({
        ...reportData,
        organizationId: userData.organizationId,
      });

      if (result.success) {
        await loadReports();
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const generateStudent = async (studentId, dateRange = null) => {
    setLoading(true);
    setError(null);

    try {
      const result = await generateStudentReport(studentId, userData.organizationId, dateRange);
      if (result.success) {
        await loadReports();
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error generating student report:', error);
      setError('Failed to generate student report');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const generateExam = async (examId, includeAnswers = false) => {
    setLoading(true);
    setError(null);

    try {
      const result = await generateExamReport(examId, userData.organizationId, includeAnswers);
      if (result.success) {
        await loadReports();
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error generating exam report:', error);
      setError('Failed to generate exam report');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const generateOrganization = async (dateRange = null) => {
    setLoading(true);
    setError(null);

    try {
      const result = await generateOrganizationReport(userData.organizationId, dateRange);
      if (result.success) {
        await loadReports();
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error generating organization report:', error);
      setError('Failed to generate organization report');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const generatePerformance = async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await generatePerformanceReport(userData.organizationId, filters);
      if (result.success) {
        await loadReports();
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error generating performance report:', error);
      setError('Failed to generate performance report');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const generateQuestion = async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await generateQuestionReport(userData.organizationId, filters);
      if (result.success) {
        await loadReports();
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error generating question report:', error);
      setError('Failed to generate question report');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (reportId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getReport(reportId);
      return result;
    } catch (error) {
      console.error('Error getting report:', error);
      setError('Failed to get report');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeReport = async (reportId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await deleteReport(reportId);
      if (result.success) {
        await loadReports();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      setError('Failed to delete report');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const download = async (reportId, format = 'pdf') => {
    setLoading(true);
    setError(null);

    try {
      const result = await downloadReport(reportId, format);
      return result;
    } catch (error) {
      console.error('Error downloading report:', error);
      setError('Failed to download report');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const schedule = async (scheduleData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await scheduleReport({
        ...scheduleData,
        organizationId: userData.organizationId,
      });
      return result;
    } catch (error) {
      console.error('Error scheduling report:', error);
      setError('Failed to schedule report');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const cancelSchedule = async (scheduleId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await cancelScheduledReport(scheduleId);
      return result;
    } catch (error) {
      console.error('Error canceling schedule:', error);
      setError('Failed to cancel schedule');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getTemplates = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getReportTemplates(userData.organizationId);
      return result;
    } catch (error) {
      console.error('Error getting templates:', error);
      setError('Failed to get templates');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = async (templateData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await saveReportTemplate({
        ...templateData,
        organizationId: userData.organizationId,
      });
      return result;
    } catch (error) {
      console.error('Error saving template:', error);
      setError('Failed to save template');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getReportStats(userData.organizationId);
      return result;
    } catch (error) {
      console.error('Error getting report stats:', error);
      setError('Failed to get report stats');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    reports,
    loading,
    error,
    loadReports,
    generateNewReport,
    generateStudent,
    generateExam,
    generateOrganization,
    generatePerformance,
    generateQuestion,
    getReportById,
    removeReport,
    download,
    schedule,
    cancelSchedule,
    getTemplates,
    saveTemplate,
    getStats,
    REPORT_TYPES,
    REPORT_FORMATS,
  };
};

export default useReports;