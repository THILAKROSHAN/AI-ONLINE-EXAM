import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createExam, updateExam } from '../../services/api/exam';
import { getOrganizationSubjects } from '../../services/api/subject';
import { getOrganizationStudents } from '../../services/api/student';
import { getOrganizationQuestions } from '../../services/api/question';
import Button from '../common/Buttons/Button';
import Input from '../common/Forms/Input';
import Spinner from '../common/Loading/Spinner';

const ExamForm = ({ exam, onClose, onSuccess }) => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    duration: 60,
    passingMarks: 40,
    negativeMarking: false,
    negativeMarkValue: 0.25,
    questionIds: [],
    assignedStudents: [],
    shuffleQuestions: false,
    shuffleOptions: false,
    randomQuestions: false,
    randomQuestionCount: 0,
    startDate: '',
    endDate: '',
    instructions: [''],
    allowResume: true,
    detectTabSwitch: true,
    requireFullscreen: false,
    preventCopyPaste: true,
    level: 'medium',
    category: '',
    tags: [],
  });
  const [newInstruction, setNewInstruction] = useState('');

  useEffect(() => {
    loadData();
    if (exam) {
      setIsEdit(true);
      setFormData({
        title: exam.title || '',
        description: exam.description || '',
        subjectId: exam.subjectId || '',
        duration: exam.duration || 60,
        passingMarks: exam.passingMarks || 40,
        negativeMarking: exam.negativeMarking || false,
        negativeMarkValue: exam.negativeMarkValue || 0.25,
        questionIds: exam.questionIds || [],
        assignedStudents: exam.assignedStudents || [],
        shuffleQuestions: exam.shuffleQuestions || false,
        shuffleOptions: exam.shuffleOptions || false,
        randomQuestions: exam.randomQuestions || false,
        randomQuestionCount: exam.randomQuestionCount || 0,
        startDate: exam.startDate || '',
        endDate: exam.endDate || '',
        instructions: exam.instructions || [''],
        allowResume: exam.allowResume !== undefined ? exam.allowResume : true,
        detectTabSwitch: exam.detectTabSwitch !== undefined ? exam.detectTabSwitch : true,
        requireFullscreen: exam.requireFullscreen || false,
        preventCopyPaste: exam.preventCopyPaste !== undefined ? exam.preventCopyPaste : true,
        level: exam.level || 'medium',
        category: exam.category || '',
        tags: exam.tags || [],
      });
    }
  }, [exam]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [subjectsResult, studentsResult, questionsResult] = await Promise.all([
        getOrganizationSubjects(userData.organizationId),
        getOrganizationStudents(userData.organizationId, { isActive: true }),
        getOrganizationQuestions(userData.organizationId, { isActive: true, status: 'published' }),
      ]);

      if (subjectsResult.success) setSubjects(subjectsResult.data);
      if (studentsResult.success) setStudents(studentsResult.data);
      if (questionsResult.success) setQuestions(questionsResult.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const handleArrayChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value.split(',').map(item => item.trim()).filter(Boolean),
    });
  };

  const handleAddInstruction = () => {
    if (newInstruction.trim()) {
      setFormData({
        ...formData,
        instructions: [...formData.instructions, newInstruction.trim()],
      });
      setNewInstruction('');
    }
  };

  const handleRemoveInstruction = (index) => {
    setFormData({
      ...formData,
      instructions: formData.instructions.filter((_, i) => i !== index),
    });
  };

  const handleQuestionSelection = (questionId) => {
    const currentIds = formData.questionIds;
    if (currentIds.includes(questionId)) {
      setFormData({
        ...formData,
        questionIds: currentIds.filter(id => id !== questionId),
      });
    } else {
      setFormData({
        ...formData,
        questionIds: [...currentIds, questionId],
      });
    }
  };

  const handleStudentSelection = (studentId) => {
    const currentIds = formData.assignedStudents;
    if (currentIds.includes(studentId)) {
      setFormData({
        ...formData,
        assignedStudents: currentIds.filter(id => id !== studentId),
      });
    } else {
      setFormData({
        ...formData,
        assignedStudents: [...currentIds, studentId],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      setError('Exam title is required');
      return;
    }

    if (formData.questionIds.length === 0) {
      setError('Please select at least one question');
      return;
    }

    if (formData.assignedStudents.length === 0) {
      setError('Please assign at least one student');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let result;
      const examData = {
        ...formData,
        organizationId: userData.organizationId,
        createdBy: userData.uid,
        totalQuestions: formData.questionIds.length,
      };
      
      if (isEdit) {
        result = await updateExam(exam.id, examData);
      } else {
        result = await createExam(examData);
      }

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setError(result.error || `Failed to ${isEdit ? 'update' : 'create'} exam`);
      }
    } catch (error) {
      console.error('Exam form error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

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
            {isEdit ? 'Exam Updated!' : 'Exam Created!'}
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isEdit 
              ? 'Exam has been updated successfully.' 
              : 'Exam has been created successfully.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEdit ? 'Edit Exam' : 'Create New Exam'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isEdit ? 'Update exam details' : 'Create a new exam'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {/* Basic Info */}
        <Input
          type="text"
          name="title"
          label="Exam Title"
          placeholder="Enter exam title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <Input
          type="text"
          name="description"
          label="Description"
          placeholder="Enter exam description"
          value={formData.description}
          onChange={handleChange}
          disabled={loading}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Subject</label>
            <select
              name="subjectId"
              value={formData.subjectId}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Level</label>
            <select
              name="level"
              value={formData.level}
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

        {/* Timing */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            name="duration"
            label="Duration (minutes)"
            placeholder="Enter duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            disabled={loading}
          />

          <Input
            type="number"
            name="passingMarks"
            label="Passing Marks (%)"
            placeholder="Enter passing marks"
            value={formData.passingMarks}
            onChange={handleChange}
            min="0"
            max="100"
            disabled={loading}
          />
        </div>

        {/* Negative Marking */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="negativeMarking"
            name="negativeMarking"
            checked={formData.negativeMarking}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            disabled={loading}
          />
          <label htmlFor="negativeMarking" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Enable Negative Marking
          </label>
        </div>

        {formData.negativeMarking && (
          <Input
            type="number"
            name="negativeMarkValue"
            label="Negative Mark Value"
            placeholder="Enter negative mark value"
            value={formData.negativeMarkValue}
            onChange={handleChange}
            min="0"
            step="0.25"
            disabled={loading}
          />
        )}

        {/* Schedule */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="datetime-local"
            name="startDate"
            label="Start Date"
            value={formData.startDate}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            type="datetime-local"
            name="endDate"
            label="End Date"
            value={formData.endDate}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {/* Shuffle Options */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="shuffleQuestions"
              name="shuffleQuestions"
              checked={formData.shuffleQuestions}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="shuffleQuestions" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Shuffle Questions
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="shuffleOptions"
              name="shuffleOptions"
              checked={formData.shuffleOptions}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="shuffleOptions" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Shuffle Options
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowResume"
              name="allowResume"
              checked={formData.allowResume}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="allowResume" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Allow Resume
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="detectTabSwitch"
              name="detectTabSwitch"
              checked={formData.detectTabSwitch}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="detectTabSwitch" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Detect Tab Switch
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="requireFullscreen"
              name="requireFullscreen"
              checked={formData.requireFullscreen}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="requireFullscreen" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Require Fullscreen
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="preventCopyPaste"
              name="preventCopyPaste"
              checked={formData.preventCopyPaste}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="preventCopyPaste" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Prevent Copy/Paste
            </label>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <label className="label">Instructions</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newInstruction}
              onChange={(e) => setNewInstruction(e.target.value)}
              placeholder="Add an instruction"
              className="input-field flex-1"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleAddInstruction}
              className="btn-secondary"
              disabled={loading || !newInstruction.trim()}
            >
              Add
            </button>
          </div>
          <div className="mt-2 space-y-1">
            {formData.instructions.map((instruction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {index + 1}. {instruction}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveInstruction(index)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Select Questions */}
        <div>
          <label className="label">Select Questions ({formData.questionIds.length} selected)</label>
          <div className="max-h-[200px] overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-2">
            {questions.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No questions available</p>
            ) : (
              questions.map((question) => (
                <label key={question.id} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                  <input
                    type="checkbox"
                    checked={formData.questionIds.includes(question.id)}
                    onChange={() => handleQuestionSelection(question.id)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 truncate">
                    {question.text}
                  </span>
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    {question.difficulty}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Assign Students */}
        <div>
          <label className="label">Assign Students ({formData.assignedStudents.length} selected)</label>
          <div className="max-h-[200px] overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-2">
            {students.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No students available</p>
            ) : (
              students.map((student) => (
                <label key={student.id} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                  <input
                    type="checkbox"
                    checked={formData.assignedStudents.includes(student.id)}
                    onChange={() => handleStudentSelection(student.id)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {student.name} ({student.email})
                  </span>
                </label>
              ))
            )}
          </div>
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
          {loading ? <Spinner size="sm" /> : (isEdit ? 'Update Exam' : 'Create Exam')}
        </Button>
      </div>
    </form>
  );
};

export default ExamForm;