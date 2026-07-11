import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createQuestion, updateQuestion, validateQuestion } from '../../services/api/question';
import { getOrganizationSubjects } from '../../services/api/subject';
import Button from '../common/Buttons/Button';
import Input from '../common/Forms/Input';
import Spinner from '../common/Loading/Spinner';
import { QUESTION_TYPES, QUESTION_TYPE_LABELS } from '../../utils/constants/questionTypes';

const QuestionForm = ({ question, onClose, onSuccess }) => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    text: '',
    type: 'mcq',
    difficulty: 'medium',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    subjectId: '',
    topic: '',
    marks: 1,
    negativeMarks: 0,
    tags: [],
    status: 'draft',
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    loadSubjects();
    if (question) {
      setIsEdit(true);
      setFormData({
        text: question.text || '',
        type: question.type || 'mcq',
        difficulty: question.difficulty || 'medium',
        options: question.options || ['', '', '', ''],
        correctAnswer: question.correctAnswer || '',
        explanation: question.explanation || '',
        subjectId: question.subjectId || '',
        topic: question.topic || '',
        marks: question.marks || 1,
        negativeMarks: question.negativeMarks || 0,
        tags: question.tags || [],
        status: question.status || 'draft',
      });
    }
  }, [question]);

  const loadSubjects = async () => {
    setSubjectsLoading(true);
    try {
      const result = await getOrganizationSubjects(userData.organizationId);
      if (result.success) {
        setSubjects(result.data);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setSubjectsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({
      ...formData,
      options: newOptions,
    });
  };

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, ''],
    });
  };

  const handleRemoveOption = (index) => {
    if (formData.options.length <= 2) {
      setError('MCQ requires at least 2 options');
      return;
    }
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      options: newOptions,
      correctAnswer: formData.correctAnswer === formData.options[index] ? '' : formData.correctAnswer,
    });
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const validation = validateQuestion(formData);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      let result;
      const questionData = {
        ...formData,
        organizationId: userData.organizationId,
        createdBy: userData.uid,
      };
      
      if (isEdit) {
        result = await updateQuestion(question.id, questionData);
      } else {
        result = await createQuestion(questionData);
      }

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setError(result.error || `Failed to ${isEdit ? 'update' : 'create'} question`);
      }
    } catch (error) {
      console.error('Question form error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {isEdit ? 'Question Updated!' : 'Question Created!'}
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isEdit 
              ? 'Question has been updated successfully.' 
              : 'Question has been created successfully.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEdit ? 'Edit Question' : 'Add New Question'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isEdit ? 'Update question details' : 'Create a new question'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {/* Question Text */}
        <Input
          type="text"
          name="text"
          label="Question Text"
          placeholder="Enter the question"
          value={formData.text}
          onChange={handleChange}
          required
          disabled={loading}
        />

        {/* Type and Difficulty */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Question Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              {Object.values(QUESTION_TYPES).map((type) => (
                <option key={type} value={type}>
                  {QUESTION_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Subject and Topic */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Subject</label>
            <select
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              className="input-field"
              disabled={loading || subjectsLoading}
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>

          <Input
            type="text"
            name="topic"
            label="Topic"
            placeholder="Enter topic"
            value={formData.topic}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Options (for MCQ) */}
        {formData.type === 'mcq' && (
          <div>
            <label className="label">Options</label>
            <div className="space-y-2">
              {formData.options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="input-field flex-1"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                    disabled={loading || formData.options.length <= 2}
                  >
                    ×
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddOption}
                disabled={loading}
              >
                Add Option
              </Button>
            </div>
          </div>
        )}

        {/* Correct Answer */}
        {formData.type === 'mcq' ? (
          <div>
            <label className="label">Correct Answer</label>
            <select
              name="correctAnswer"
              value={formData.correctAnswer}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              <option value="">Select Correct Answer</option>
              {formData.options.map((option, index) => (
                <option key={index} value={option}>
                  {String.fromCharCode(65 + index)}. {option || `Option ${String.fromCharCode(65 + index)}`}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <Input
            type="text"
            name="correctAnswer"
            label="Correct Answer"
            placeholder="Enter the correct answer"
            value={formData.correctAnswer}
            onChange={handleChange}
            disabled={loading}
          />
        )}

        {/* Explanation */}
        <Input
          type="text"
          name="explanation"
          label="Explanation"
          placeholder="Enter explanation for the answer"
          value={formData.explanation}
          onChange={handleChange}
          disabled={loading}
        />

        {/* Marks */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            name="marks"
            label="Marks"
            placeholder="Enter marks"
            value={formData.marks}
            onChange={handleChange}
            min="0"
            step="0.5"
            disabled={loading}
          />

          <Input
            type="number"
            name="negativeMarks"
            label="Negative Marks"
            placeholder="Enter negative marks"
            value={formData.negativeMarks}
            onChange={handleChange}
            min="0"
            step="0.5"
            disabled={loading}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="label">Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              className="input-field flex-1"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="btn-secondary"
              disabled={loading || !newTag.trim()}
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  disabled={loading}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
            disabled={loading}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : (isEdit ? 'Update Question' : 'Create Question')}
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;