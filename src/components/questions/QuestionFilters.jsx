import React from 'react';
import Button from '../common/Buttons/Button';
import { QUESTION_TYPES, QUESTION_TYPE_LABELS } from '../../utils/constants/questionTypes';

const QuestionFilters = ({
  filters,
  onFilterChange,
  onApply,
  onReset,
  onImport,
  onExport,
}) => {
  const difficulties = ['easy', 'medium', 'hard'];

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
            placeholder="Search by text, topic..."
            value={filters.search}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="label">Question Type</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">All Types</option>
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
            value={filters.difficulty}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">All Difficulties</option>
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
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
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
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
        {onImport && (
          <Button
            variant="success"
            onClick={onImport}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import
          </Button>
        )}
        {onExport && (
          <Button
            variant="outline"
            onClick={onExport}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuestionFilters;