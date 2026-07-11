import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getExam, getExamAttempt, startExamAttempt } from '../../services/api/exam';
import ExamInstructions from '../../components/exams/ExamInstructions';
import ExamAttempt from '../../components/exams/ExamAttempt';
import Spinner from '../../components/common/Loading/Spinner';

const ExamAttemptPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadExamData();
  }, [examId]);

  const loadExamData = async () => {
    setLoading(true);
    setError('');

    try {
      const examResult = await getExam(examId);
      if (!examResult.success) {
        setError('Exam not found');
        setLoading(false);
        return;
      }

      const examData = examResult.data;
      setExam(examData);

      if (!examData.isPublished) {
        setError('This exam is not available');
        setLoading(false);
        return;
      }

      if (!examData.assignedStudents?.includes(userData.uid)) {
        setError('You are not assigned to this exam');
        setLoading(false);
        return;
      }

      if (examData.startDate) {
        const startDate = new Date(examData.startDate);
        if (startDate > new Date()) {
          setError('This exam has not started yet');
          setLoading(false);
          return;
        }
      }

      if (examData.endDate) {
        const endDate = new Date(examData.endDate);
        if (endDate < new Date()) {
          setError('This exam has already ended');
          setLoading(false);
          return;
        }
      }

      const attemptResult = await getExamAttempt(`${examId}_${userData.uid}`);
      if (attemptResult.success) {
        const attemptData = attemptResult.data;
        if (attemptData.isCompleted) {
          setError('You have already completed this exam');
          setLoading(false);
          return;
        }
        setAttempt(attemptData);
        setShowInstructions(false);
      }
    } catch (error) {
      console.error('Error loading exam:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async () => {
    setLoading(true);
    try {
      const result = await startExamAttempt(examId, userData.uid);
      if (result.success) {
        setAttempt(result.data);
        setShowInstructions(false);
      } else {
        setError(result.error || 'Failed to start exam');
      }
    } catch (error) {
      console.error('Error starting exam:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = (attemptId) => {
    navigate(`/student/results?attemptId=${attemptId}`);
  };

  const handleExit = () => {
    navigate('/student/exams');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-700 dark:text-red-400">{error}</p>
          <button
            onClick={() => navigate('/student/exams')}
            className="mt-4 btn-primary"
          >
            Back to Exams
          </button>
        </div>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <ExamInstructions
        exam={exam}
        onStart={handleStartExam}
        onBack={handleExit}
      />
    );
  }

  return (
    <ExamAttempt
      examId={examId}
      attempt={attempt}
      onComplete={handleComplete}
      onExit={handleExit}
    />
  );
};

export default ExamAttemptPage;