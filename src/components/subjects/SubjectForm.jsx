import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createSubject, updateSubject, generateSubjectCode } from '../../services/api/subject';
import Button from '../common/Buttons/Button';
import Input from '../common/Forms/Input';
import Spinner from '../common/Loading/Spinner';

const SubjectForm = ({ subject, onClose, onSuccess }) => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    department: '',
    semester: '',
    year: '',
    course: '',
    credits: '',
    hoursPerWeek: '',
    totalHours: '',
    instructor: '',
    instructorEmail: '',
    status: 'draft',
    topics: [],
    prerequisites: [],
    learningOutcomes: [],
    syllabus: '',
    textbook: '',
    references: [],
  });
  const [newTopic, setNewTopic] = useState('');
  const [newOutcome, setNewOutcome] = useState('');

  useEffect(() => {
    if (subject) {
      setIsEdit(true);
      setFormData({
        name: subject.name || '',
        code: subject.code || '',
        description: subject.description || '',
        department: subject.department || '',
        semester: subject.semester || '',
        year: subject.year || '',
        course: subject.course || '',
        credits: subject.credits || '',
        hoursPerWeek: subject.hoursPerWeek || '',
        totalHours: subject.totalHours || '',
        instructor: subject.instructor || '',
        instructorEmail: subject.instructorEmail || '',
        status: subject.status || 'draft',
        topics: subject.topics || [],
        prerequisites: subject.prerequisites || [],
        learningOutcomes: subject.learningOutcomes || [],
        syllabus: subject.syllabus || '',
        textbook: subject.textbook || '',
        references: subject.references || [],
      });
    }
  }, [subject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleGenerateCode = async () => {
    if (!formData.name) {
      setError('Please enter subject name first');
      return;
    }

    try {
      const result = await generateSubjectCode(userData.organizationId, formData.name);
      if (result.success) {
        setFormData({
          ...formData,
          code: result.data.code,
        });
      }
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      setFormData({
        ...formData,
        topics: [...formData.topics, newTopic.trim()],
      });
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (index) => {
    setFormData({
      ...formData,
      topics: formData.topics.filter((_, i) => i !== index),
    });
  };

  const handleAddOutcome = () => {
    if (newOutcome.trim()) {
      setFormData({
        ...formData,
        learningOutcomes: [...formData.learningOutcomes, newOutcome.trim()],
      });
      setNewOutcome('');
    }
  };

  const handleRemoveOutcome = (index) => {
    setFormData({
      ...formData,
      learningOutcomes: formData.learningOutcomes.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!formData.name || !formData.code) {
      setError('Subject name and code are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let result;
      
      if (isEdit) {
        result = await updateSubject(subject.id, formData);
      } else {
        result = await createSubject({
          ...formData,
          organizationId: userData.organizationId,
          createdBy: userData.uid,
        });
      }

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setError(result.error || `Failed to ${isEdit ? 'update' : 'create'} subject`);
      }
    } catch (error) {
      console.error('Subject form error:', error);
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
            {isEdit ? 'Subject Updated!' : 'Subject Created!'}
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isEdit 
              ? 'Subject information has been updated successfully.' 
              : 'Subject has been created successfully.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {isEdit ? 'Edit Subject' : 'Add New Subject'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isEdit ? 'Update subject information' : 'Create a new subject'}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            name="name"
            label="Subject Name"
            placeholder="Enter subject name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <div>
            <label className="label">Subject Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="code"
                placeholder="Enter subject code"
                value={formData.code}
                onChange={handleChange}
                className="input-field flex-1"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleGenerateCode}
                className="btn-secondary whitespace-nowrap"
                disabled={loading}
              >
                Generate
              </button>
            </div>
          </div>
        </div>

        <Input
          type="text"
          name="description"
          label="Description"
          placeholder="Enter subject description"
          value={formData.description}
          onChange={handleChange}
          disabled={loading}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            name="department"
            label="Department"
            placeholder="Enter department"
            value={formData.department}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            type="text"
            name="semester"
            label="Semester"
            placeholder="Enter semester"
            value={formData.semester}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="text"
            name="year"
            label="Year"
            placeholder="Enter year"
            value={formData.year}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            type="text"
            name="course"
            label="Course"
            placeholder="Enter course"
            value={formData.course}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            type="number"
            name="credits"
            label="Credits"
            placeholder="Enter credits"
            value={formData.credits}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            name="hoursPerWeek"
            label="Hours Per Week"
            placeholder="Enter hours per week"
            value={formData.hoursPerWeek}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            type="number"
            name="totalHours"
            label="Total Hours"
            placeholder="Enter total hours"
            value={formData.totalHours}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            name="instructor"
            label="Instructor"
            placeholder="Enter instructor name"
            value={formData.instructor}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            type="email"
            name="instructorEmail"
            label="Instructor Email"
            placeholder="Enter instructor email"
            value={formData.instructorEmail}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

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

        {/* Topics */}
        <div>
          <label className="label">Topics</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Add a topic"
              className="input-field flex-1"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleAddTopic}
              className="btn-secondary"
              disabled={loading || !newTopic.trim()}
            >
              Add
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.topics.map((topic, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
              >
                {topic}
                <button
                  type="button"
                  onClick={() => handleRemoveTopic(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  disabled={loading}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Learning Outcomes */}
        <div>
          <label className="label">Learning Outcomes</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newOutcome}
              onChange={(e) => setNewOutcome(e.target.value)}
              placeholder="Add a learning outcome"
              className="input-field flex-1"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleAddOutcome}
              className="btn-secondary"
              disabled={loading || !newOutcome.trim()}
            >
              Add
            </button>
          </div>
          <div className="mt-2 space-y-1">
            {formData.learningOutcomes.map((outcome, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">{outcome}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveOutcome(index)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <Input
          type="text"
          name="syllabus"
          label="Syllabus"
          placeholder="Enter syllabus URL or description"
          value={formData.syllabus}
          onChange={handleChange}
          disabled={loading}
        />

        <Input
          type="text"
          name="textbook"
          label="Textbook"
          placeholder="Enter textbook name"
          value={formData.textbook}
          onChange={handleChange}
          disabled={loading}
        />
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
          {loading ? <Spinner size="sm" /> : (isEdit ? 'Update Subject' : 'Create Subject')}
        </Button>
      </div>
    </form>
  );
};

export default SubjectForm;