import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentExams } from '../../services/api/exam';
import { getStudentExamAttempts } from '../../services/api/exam';
import Button from '../../components/common/Buttons/Button';
import Spinner from '../../components/common/Loading/Spinner';
import ExamCard from '../../components/common/Cards/ExamCard';

const StudentExamsPage = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [attempts, setAttempts] = useState({});
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    if (userData?.uid) {
      loadExams();
    }
  }, [userData]);

  const loadExams = async () => {
    setLoading(true);
    try {
      const [examsResult, attemptsResult] = await Promise.all([
        getStudentExams(userData.uid, userData.organizationId),
        getStudentExamAttempts(userData.uid),
      ]);

      if (examsResult.success) {
        setExams(examsResult.data);
      }

      if (attemptsResult.success) {
        const attemptsMap = {};
        attemptsResult.data.forEach(attempt => {
          attemptsMap[attempt.examId] = attempt;
        });
        setAttempts(attemptsMap);
      }
    } catch (error) {
      console.error('Error loading exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredExams = () => {
    const now = new Date();
    
    return exams.filter(exam => {
      const startDate = exam.startDate ? new Date(exam.startDate) : null;
      const endDate = exam.endDate ? new Date(exam.endDate) : null;
      const attempt = attempts[exam.id];
      const isCompleted = attempt?.isCompleted || false;

      switch (activeTab) {
        case 'upcoming':
          return startDate && startDate > now && !isCompleted;
        case 'ongoing':
          return startDate && startDate <= now && endDate && endDate >= now && !isCompleted;
        case 'completed':
          return isCompleted || (endDate && endDate < now);
        default:
          return true;
      }
    });
  };

  const handleStartExam = (examId) => {
    navigate(`/student/exam/${examId}`);
  };

  const handleViewResults = (examId) => {
    navigate(`/student/results?examId=${examId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const filteredExams = getFilteredExams();

  return (
    <div className="container-custom py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Exams
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          View and manage all your exams
        </p>
      </div>

      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4">
          {['upcoming', 'ongoing', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredExams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No {activeTab} exams found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => {
            const attempt = attempts[exam.id];
            const isCompleted = attempt?.isCompleted || false;
            const isInProgress = attempt?.status === 'in_progress';

            let status = 'available';
            if (isCompleted) {
              status = 'completed';
            } else if (isInProgress) {
              status = 'in_progress';
            } else if (exam.startDate && new Date(exam.startDate) > new Date()) {
              status = 'upcoming';
            }

            return (
              <ExamCard
                key={exam.id}
                exam={exam}
                status={status}
                onStart={() => handleStartExam(exam.id)}
                onViewResults={() => handleViewResults(exam.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentExamsPage;