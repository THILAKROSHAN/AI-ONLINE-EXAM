// useNotifications Hook
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  sendStudentCredentials,
  sendExamReminder,
  sendResultNotification,
  sendPasswordResetEmail,
} from '../services/firebase/functions';

export const useNotifications = () => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendCredentials = async (studentId, email, password) => {
    setLoading(true);
    setError(null);

    try {
      const result = await sendStudentCredentials(
        studentId,
        email,
        password,
        userData.organizationId
      );

      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error sending credentials:', error);
      setError('Failed to send credentials');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (examId, studentIds) => {
    setLoading(true);
    setError(null);

    try {
      const result = await sendExamReminder(examId, studentIds);

      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error sending exam reminder:', error);
      setError('Failed to send exam reminder');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const sendResult = async (resultId, studentId, examId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await sendResultNotification(resultId, studentId, examId);

      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error sending result notification:', error);
      setError('Failed to send result notification');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email, resetLink) => {
    setLoading(true);
    setError(null);

    try {
      const result = await sendPasswordResetEmail(email, resetLink);

      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error sending password reset:', error);
      setError('Failed to send password reset');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    sendCredentials,
    sendReminder,
    sendResult,
    sendPasswordReset,
  };
};

export default useNotifications;