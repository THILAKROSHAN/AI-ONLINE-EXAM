import React, { useState } from 'react';
import Button from '../common/Buttons/Button';

const ExamReview = ({ questions, answers, onBack, onSubmit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const getAnswerStatus = (questionIndex) => {
    const answer = answers[questionIndex];
    if (!answer || answer === '') return 'unanswered';
    return 'answered';
  };

  const getStatusColor = (status) => {
    const colors = {
      answered: 'bg-green-500 text-white',
      unanswered: 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-400',
    };
    return colors[status] || colors.unanswered;
  };

  const getStatusLabel = (status) => {
    const labels = {
      answered: 'Answered',
      unanswered: 'Unanswered',
    };
    return labels[status] || 'Unknown';
  };

  const answeredCount = questions.filter((_, index) => answers[index] && answers[index] !== '').length;
  const totalQuestions = questions.length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Review Your Answers
        </h2>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Progress</span>
            <span>{answeredCount} of {totalQuestions} answered ({progress}%)</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Navigator */}
        <div className="flex flex-wrap gap-2 mb-6">
          {questions.map((_, index) => {
            const status = getAnswerStatus(index);
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  index === currentIndex
                    ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-800'
                    : ''
                } ${getStatusColor(status)}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        {/* Current Question */}
        {questions[currentIndex] && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                getAnswerStatus(currentIndex) === 'answered'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {getStatusLabel(getAnswerStatus(currentIndex))}
              </span>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-900 dark:text-white font-medium">
                {questions[currentIndex].text}
              </p>
              {answers[currentIndex] && (
                <div className="mt-2 p-3 bg-white dark:bg-gray-600 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Your Answer:</span> {answers[currentIndex]}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mb-6">
          <Button
            variant="secondary"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            onClick={() => setCurrentIndex(Math.min(totalQuestions - 1, currentIndex + 1))}
            disabled={currentIndex === totalQuestions - 1}
          >
            Next
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
          <Button variant="secondary" onClick={onBack}>
            Back to Exam
          </Button>
          <Button
            variant="success"
            onClick={onSubmit}
            disabled={answeredCount < totalQuestions}
          >
            Submit Exam
          </Button>
        </div>

        {answeredCount < totalQuestions && (
          <p className="mt-4 text-sm text-yellow-600 dark:text-yellow-400 text-center">
            ⚠️ You have {totalQuestions - answeredCount} unanswered question{totalQuestions - answeredCount > 1 ? 's' : ''}.
            Please answer all questions before submitting.
          </p>
        )}
      </div>
    </div>
  );
};

export default ExamReview;