import React from 'react';
import { QUESTION_TYPE_LABELS } from '../../utils/constants/questionTypes';

const QuestionPreview = ({ question, onClose }) => {
  if (!question) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        No question selected
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[difficulty] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      archived: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    return colors[status] || colors.draft;
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Question Preview
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Close
        </button>
      </div>

      <div className="space-y-4">
        {/* Question Text */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-gray-900 dark:text-white font-medium">
            {question.text}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}>
            {QUESTION_TYPE_LABELS[question.type] || question.type}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty?.toUpperCase()}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(question.status)}`}>
            {question.status?.toUpperCase() || 'DRAFT'}
          </span>
          {question.isAIGenerated && (
            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              🤖 AI Generated
            </span>
          )}
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            {question.marks || 1} marks
          </span>
          {question.negativeMarks > 0 && (
            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              -{question.negativeMarks} marks
            </span>
          )}
        </div>

        {/* Topic and Subject */}
        {(question.topic || question.subjectId) && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {question.topic && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Topic:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{question.topic}</span>
              </div>
            )}
            {question.subjectId && (
              <div>
                <span className="text-gray-500 dark:text-gray-400">Subject ID:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{question.subjectId}</span>
              </div>
            )}
          </div>
        )}

        {/* Options (for MCQ) */}
        {question.type === 'mcq' && question.options && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Options:</p>
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  option === question.correctAnswer
                    ? 'bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600'
                    : 'bg-gray-50 dark:bg-gray-700'
                }`}
              >
                <span className="text-sm">
                  {String.fromCharCode(65 + index)}. {option}
                  {option === question.correctAnswer && (
                    <span className="ml-2 text-green-600 dark:text-green-400 font-medium">✓ Correct</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Correct Answer (for non-MCQ) */}
        {question.type !== 'mcq' && question.correctAnswer && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              Correct Answer:
            </p>
            <p className="text-green-900 dark:text-green-300 mt-1">
              {question.correctAnswer}
            </p>
          </div>
        )}

        {/* Explanation */}
        {question.explanation && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Explanation:
            </p>
            <p className="text-blue-900 dark:text-blue-300 mt-1">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p>Created: {question.createdAt?.toDate?.()?.toLocaleString() || 'N/A'}</p>
          <p>ID: {question.id}</p>
        </div>
      </div>
    </div>
  );
};

export default QuestionPreview;