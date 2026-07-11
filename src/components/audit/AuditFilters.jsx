import React from 'react';
import Button from '../common/Buttons/Button';
import { ACTION_TYPES, TARGET_TYPES } from '../../services/api/audit';

const AuditFilters = ({
  filters,
  onFilterChange,
  onApply,
  onReset,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const actionTypeOptions = {
    create: 'Create',
    update: 'Update',
    delete: 'Delete',
    login: 'Login',
    logout: 'Logout',
    password_change: 'Password Change',
    exam_create: 'Exam Create',
    exam_update: 'Exam Update',
    exam_delete: 'Exam Delete',
    question_create: 'Question Create',
    question_update: 'Question Update',
    question_delete: 'Question Delete',
    result_publish: 'Result Publish',
    student_create: 'Student Create',
    student_update: 'Student Update',
    student_delete: 'Student Delete',
    admin_create: 'Admin Create',
    admin_update: 'Admin Update',
    admin_delete: 'Admin Delete',
    subject_create: 'Subject Create',
    subject_update: 'Subject Update',
    subject_delete: 'Subject Delete',
  };

  const targetTypeOptions = {
    student: 'Student',
    admin: 'Admin',
    exam: 'Exam',
    question: 'Question',
    subject: 'Subject',
    result: 'Result',
    organization: 'Organization',
    user: 'User',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="label">Search</label>
          <input
            type="text"
            name="search"
            placeholder="Search by action, target..."
            value={filters.search}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="label">Action Type</label>
          <select
            name="actionType"
            value={filters.actionType}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">All Actions</option>
            {Object.entries(actionTypeOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Target Type</label>
          <select
            name="targetType"
            value={filters.targetType}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">All Targets</option>
            {Object.entries(targetTypeOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="label">Start Date</label>
          <input
            type="datetime-local"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="label">End Date</label>
          <input
            type="datetime-local"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <Button
          variant="primary"
          onClick={onApply}
        >
          Apply Filters
        </Button>
        <Button
          variant="secondary"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default AuditFilters;