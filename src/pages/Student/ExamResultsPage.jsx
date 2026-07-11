import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getExamAttempt } from '../../services/api/exam';
import { getResult, getStudentResults } from '../../services/api/result';
import ResultDetails from '../../components/results/ResultDetails';
import ResultAnalytics from '../../components/results/ResultAnalytics';
import Button from '../../components/common/Buttons/Button';
import Spinner from '../../components/common/Loading/Spinner';

const ExamResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [allResults, setAllResults] = useState([]);
  const [error, setError] = useState('');

  const attemptId = searchParams.get('attemptId');
  const examId = searchParams.get('examId');

  useEffect(() => {
    if (userData?.uid) {
      loadResults();
    }
  }, [userData, attemptId, examId]);

  const loadResults = async () => {
    setLoading(true);
    setError('');

    try {
      if (attemptId) {
        const [resultResult, attemptResult] = await Promise.all([
          getResult(attemptId),
          getExamAttempt(attemptId),
        ]);

        if (resultResult.success) {
          setResult(resultResult.data);
        } else {
          setError('Result not found');
        }

        if (attemptResult.success) {
          setAttempt(attemptResult.data);
        }
      } else if (examId) {
        const resultsResult = await getStudentResults(userData.uid, examId);
        if (resultsResult.success) {
          setAllResults(resultsResult.data);
        } else {
          setError('No results found');
        }
      } else {
        const resultsResult = await getStudentResults(userData.uid);
        if (resultsResult.success) {
          setAllResults(resultsResult.data);
        } else {
          setError('No results found');
        }
      }
    } catch (error) {
      console.error('Error loading results:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
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
            onClick={() => navigate('/student/dashboard')}
            className="mt-4 btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (result && attempt) {
    return (
      <div className="container-custom py-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Exam Results
          </h1>
          <Button
            variant="secondary"
            onClick={() => navigate('/student/exams')}
          >
            Back to Exams
          </Button>
        </div>

        <ResultDetails result={result} attempt={attempt} />
        
        <div className="mt-8">
          <ResultAnalytics result={result} />
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Results
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          View all your exam results and performance analytics
        </p>
      </div>

      {allResults.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No results found. Complete some exams to see your results here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {allResults.map((result) => (
            <div
              key={result.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/student/results?attemptId=${result.id}`)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {result.examTitle || 'Exam'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {result.completedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    (result.percentage || 0) >= 40
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {result.percentage || 0}%
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    (result.percentage || 0) >= 40
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {(result.percentage || 0) >= 40 ? 'Passed' : 'Failed'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamResultsPage;