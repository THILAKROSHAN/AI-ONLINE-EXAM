import React, { useState } from 'react';
import Button from '../common/Buttons/Button';
import Input from '../common/Forms/Input';

const AIQuestionPreview = ({ 
  question, 
  index, 
  onEdit, 
  onRemove, 
  onRegenerate,
  disabled 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState({ ...question });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedQuestion({ ...question });
  };

  const handleSave = () => {
    onEdit(index, editedQuestion);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedQuestion({ ...question });
  };

  const handleChange = (field, value) => {
    setEditedQuestion({
      ...editedQuestion,
      [field]: value,
    });
  };

  const getTypeLabel = (type) => {
    const labels = {
      mcq: 'Multiple Choice',
      true_false: 'True/False',
      fill_blank: 'Fill in the Blank',
      descriptive: 'Descriptive',
      paragraph: 'Paragraph',
    };
    return labels[type] || type;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[difficulty] || colors.medium;
  };

  if (isEditing) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="space-y-3">
          <Input
            type="text"
            label="Question Text"
            value={editedQuestion.text}
            onChange={(e) => handleChange('text', e.target.value)}
            disabled={disabled}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Type</label>
              <select
                value={editedQuestion.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="input-field"
                disabled={disabled}
              >
                <option value="mcq">Multiple Choice</option>
                <option value="true_false">True/False</option>
                <option value="fill_blank">Fill in the Blank</option>
                <option value="descriptive">Descriptive</option>
                <option value="paragraph">Paragraph</option>
              </select>
            </div>

            <div>
              <label className="label">Difficulty</label>
              <select
                value={editedQuestion.difficulty}
                onChange={(e) => handleChange('difficulty', e.target.value)}
                className="input-field"
                disabled={disabled}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {editedQuestion.type === 'mcq' && (
            <div className="space-y-2">
              <label className="label">Options</label>
              {editedQuestion.options?.map((option, optIndex) => (
                <div key={optIndex} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...editedQuestion.options];
                      newOptions[optIndex] = e.target.value;
                      handleChange('options', newOptions);
                    }}
                    className="input-field flex-1"
                    disabled={disabled}
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      const newOptions = editedQuestion.options.filter((_, i) => i !== optIndex);
                      handleChange('options', newOptions);
                    }}
                    disabled={disabled}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  const newOptions = [...(editedQuestion.options || []), ''];
                  handleChange('options', newOptions);
                }}
                disabled={disabled}
              >
                Add Option
              </Button>
            </div>
          )}

          <Input
            type="text"
            label="Correct Answer"
            value={editedQuestion.correctAnswer || ''}
            onChange={(e) => handleChange('correctAnswer', e.target.value)}
            disabled={disabled}
          />

          <Input
            type="text"
            label="Explanation"
            value={editedQuestion.explanation || ''}
            onChange={(e) => handleChange('explanation', e.target.value)}
            disabled={disabled}
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCancel}
              disabled={disabled}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={disabled}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              #{index + 1}
            </span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty?.toUpperCase()}
            </span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {getTypeLabel(question.type)}
            </span>
            {question._edited && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Edited
              </span>
            )}
          </div>

          <p className="text-gray-900 dark:text-white mb-2">
            {question.text}
          </p>

          {question.type === 'mcq' && question.options && (
            <div className="space-y-1 mb-2">
              {question.options.map((option, optIndex) => (
                <p key={optIndex} className="text-sm text-gray-600 dark:text-gray-400">
                  {String.fromCharCode(65 + optIndex)}. {option}
                </p>
              ))}
            </div>
          )}

          {question.correctAnswer && (
            <div className="text-sm text-green-600 dark:text-green-400 mb-1">
              ✓ Answer: {question.correctAnswer}
            </div>
          )}

          {question.explanation && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              💡 {question.explanation}
            </div>
          )}
        </div>

        <div className="flex gap-1 ml-4 flex-shrink-0">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleEdit}
            disabled={disabled}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onRegenerate(index)}
            disabled={disabled}
          >
            Regenerate
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => onRemove(index)}
            disabled={disabled}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIQuestionPreview;