import React, { useState } from 'react';
import Button from '../common/Buttons/Button';

const ExamInstructions = ({ exam, onStart, onBack }) => {
  const [agreed, setAgreed] = useState(false);

  if (!exam) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {exam.title}
        </h2>
        
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Please read the following instructions carefully before starting the exam.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Duration:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {exam.duration} minutes
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Total Questions:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {exam.totalQuestions || 0}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Passing Marks:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {exam.passingMarks}%
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Negative Marking:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {exam.negativeMarking ? `Yes (${exam.negativeMarkValue} marks)` : 'No'}
              </span>
            </div>
          </div>
        </div>

        {exam.instructions && exam.instructions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Instructions:
            </h3>
            <ul className="space-y-1 list-disc list-inside">
              {exam.instructions.map((instruction, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            ⚠️ Important: You cannot pause or restart the exam once started.
            Make sure you have a stable internet connection.
          </p>
        </div>

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="agreed"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="agreed" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            I have read and understood all the instructions
          </label>
        </div>

        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            variant="primary"
            onClick={onStart}
            disabled={!agreed}
          >
            Start Exam
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamInstructions;