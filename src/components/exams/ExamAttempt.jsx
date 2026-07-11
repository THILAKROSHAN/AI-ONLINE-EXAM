import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getExam, startExamAttempt, submitExam, saveExamProgress } from '../../services/api/exam';
import { getQuestions } from '../../services/api/question';
import ExamTimer from './ExamTimer';
import Button from '../common/Buttons/Button';
import Spinner from '../common/Loading/Spinner';


const ExamAttempt = ({ examId, onComplete, onExit }) => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [attemptId, setAttemptId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [tabWarnings, setTabWarnings] = useState(0);

  useEffect(() => {
    loadExamData();
    setupSecurity();
    return cleanupSecurity;
  }, []);

  const loadExamData = async () => {
    setLoading(true);
    try {
      const examResult = await getExam(examId);
      if (examResult.success) {
        setExam(examResult.data);
        
        // Get questions
        const questionsResult = await getQuestions(examResult.data.questionIds);
        if (questionsResult.success) {
          let questionList = questionsResult.data;
          if (examResult.data.shuffleQuestions) {
            questionList = shuffleArray(questionList);
          }
          setQuestions(questionList);
        }

        // Start attempt
        const attemptResult = await startExamAttempt(examId, userData.uid);
        if (attemptResult.success) {
          setAttemptId(attemptResult.id);
        }
      }
    } catch (error) {
      console.error('Error loading exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSecurity = () => {
    if (exam?.detectTabSwitch) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    if (exam?.preventCopyPaste) {
      document.addEventListener('copy', preventCopy);
      document.addEventListener('paste', preventCopy);
      document.addEventListener('contextmenu', preventCopy);
    }
    if (exam?.requireFullscreen) {
      requestFullscreen();
      document.addEventListener('fullscreenchange', handleFullscreenChange);
    }
  };

  const cleanupSecurity = () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    document.removeEventListener('copy', preventCopy);
    document.removeEventListener('paste', preventCopy);
    document.removeEventListener('contextmenu', preventCopy);
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      setTabWarnings(prev => prev + 1);
      // Log tab switch
      saveExamProgress(attemptId, {
        tabSwitches: tabWarnings + 1,
      });
    }
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement && exam?.requireFullscreen) {
      // User exited fullscreen
      requestFullscreen();
    }
  };

  const requestFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const preventCopy = (e) => {
    e.preventDefault();
    return false;
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!window.confirm('Are you sure you want to submit the exam? You cannot change your answers after submission.')) {
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitExam(attemptId, answers, timeSpent);
      if (result.success) {
        onComplete(attemptId);
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTimeUp = async () => {
    await handleSubmit();
  };

  const handleTimeUpdate = (time) => {
    setTimeSpent(time);
    // Auto-save progress
    if (attemptId && time % 30 === 0) { // Save every 30 seconds
      saveExamProgress(attemptId, {
        answers,
        timeSpent: time,
        currentQuestionIndex: currentIndex,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No questions found for this exam.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isAnswered = answers[currentIndex] !== undefined;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Timer */}
      <ExamTimer
        duration={exam.duration}
        onTimeUp={handleTimeUp}
        onTimeUpdate={handleTimeUpdate}
      />

      {/* Progress */}
      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Question {currentIndex + 1} of {questions.length}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {Object.keys(answers).length} answered
        </p>
      </div>

      {/* Question */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {currentQuestion.type?.toUpperCase()}
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {currentQuestion.difficulty?.toUpperCase()}
            </span>
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {currentQuestion.marks || 1} mark{currentQuestion.marks > 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-lg text-gray-900 dark:text-white">
            {currentQuestion.text}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.type === 'mcq' && currentQuestion.options?.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                answers[currentIndex] === option
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentIndex}`}
                value={option}
                checked={answers[currentIndex] === option}
                onChange={() => handleAnswerSelect(currentIndex, option)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                {String.fromCharCode(65 + index)}. {option}
              </span>
            </label>
          ))}

          {currentQuestion.type === 'true_false' && (
            <div className="space-y-2">
              {['True', 'False'].map((option) => (
                <label
                  key={option}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    answers[currentIndex] === option
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentIndex}`}
                    value={option.toLowerCase()}
                    checked={answers[currentIndex] === option.toLowerCase()}
                    onChange={() => handleAnswerSelect(currentIndex, option.toLowerCase())}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'fill_blank' && (
            <input
              type="text"
              placeholder="Type your answer..."
              value={answers[currentIndex] || ''}
              onChange={(e) => handleAnswerSelect(currentIndex, e.target.value)}
              className="input-field"
            />
          )}

          {(currentQuestion.type === 'descriptive' || currentQuestion.type === 'paragraph') && (
            <textarea
              placeholder="Type your answer..."
              value={answers[currentIndex] || ''}
              onChange={(e) => handleAnswerSelect(currentIndex, e.target.value)}
              className="input-field min-h-[150px]"
              rows={5}
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <div className="flex gap-2">
          {currentIndex === questions.length - 1 ? (
            <Button
              variant="success"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? <Spinner size="sm" /> : 'Submit Exam'}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </div>
      </div>

      {/* Question Navigator */}
      <div className="mt-6 flex flex-wrap gap-2">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
              index === currentIndex
                ? 'bg-primary-600 text-white'
                : answers[index] !== undefined
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamAttempt;