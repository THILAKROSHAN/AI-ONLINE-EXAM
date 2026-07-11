import React from 'react';
import Button from '../common/Buttons/Button';
import { EXAM_STATUS_LABELS } from '../../utils/constants/examStatus';

const ExamFilters = ({
  filters,
  onFilterChange,
  onApply,
  onReset,
}) => {
  const statuses = ['draft', 'scheduled', 'ongoing', 'completed', 'archived'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="label">Search</label>
          <input
            type="text"
            name="search"
            placeholder="Search by title..."
            value={filters.search}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="label">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="all">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {EXAM_STATUS_LABELS[status] || status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Published</label>
          <select
            name="isPublished"
            value={filters.isPublished}
            onChange={handleChange}
            className="input-field"
          >
            <option value="all">All</option>
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>
        </div>

        <div>
          <label className="label">Subject ID</label>
          <input
            type="text"
            name="subjectId"
            placeholder="Filter by subject ID"
            value={filters.subjectId}
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

export default ExamFilters;