import React from 'react';
import { QUESTION_TYPES, DIFFICULTY_LEVELS } from '../../services/ai/gemini';

const AIOptions = ({
  questionCount,
  setQuestionCount,
  difficulty,
  setDifficulty,
  selectedTypes,
  setSelectedTypes,
  disabled,
}) => {
  const handleTypeToggle = (type) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length === 1) {
        // Keep at least one type selected
        return;
      }
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const typeLabels = {
    [QUESTION_TYPES.MCQ]: 'Multiple Choice',
    [QUESTION_TYPES.TRUE_FALSE]: 'True/False',
    [QUESTION_TYPES.FILL_BLANK]: 'Fill in the Blank',
    [QUESTION_TYPES.DESCRIPTIVE]: 'Descriptive',
    [QUESTION_TYPES.PARAGRAPH]: 'Paragraph',
  };

  const difficultyLabels = {
    [DIFFICULTY_LEVELS.EASY]: 'Easy',
    [DIFFICULTY_LEVELS.MEDIUM]: 'Medium',
    [DIFFICULTY_LEVELS.HARD]: 'Hard',
  };

  return (
    <div className="space-y-4">
      {/* Question Count */}
      <div>
        <label className="label">Number of Questions</label>
        <input
          type="number"
          min="1"
          max="20"
          value={questionCount}
          onChange={(e) => setQuestionCount(parseInt(e.target.value) || 1)}
          className="input-field max-w-[100px]"
          disabled={disabled}
        />
      </div>

      {/* Difficulty */}
      <div>
        <label className="label">Difficulty Level</label>
        <div className="flex gap-2 flex-wrap">
          {Object.values(DIFFICULTY_LEVELS).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setDifficulty(level)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                difficulty === level
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={disabled}
            >
              {difficultyLabels[level]}
            </button>
          ))}
        </div>
      </div>

      {/* Question Types */}
      <div>
        <label className="label">Question Types</label>
        <div className="flex gap-2 flex-wrap">
          {Object.values(QUESTION_TYPES).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleTypeToggle(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTypes.includes(type)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={disabled}
            >
              {typeLabels[type]}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Select at least one question type
        </p>
      </div>
    </div>
  );
};

export default AIOptions;