import React from 'react';
import Button from '../common/Buttons/Button';

const SubjectFilters = ({
  filters,
  onFilterChange,
  onApply,
  onReset,
}) => {
  const departments = [
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering',
    'Business',
    'Arts',
    'Others',
  ];

  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

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
            placeholder="Search by name, code..."
            value={filters.search}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="label">Department</label>
          <select
            name="department"
            value={filters.department}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Semester</label>
          <select
            name="semester"
            value={filters.semester}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">All Semesters</option>
            {semesters.map(sem => (
              <option key={sem} value={sem}>Semester {sem}</option>
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

export default SubjectFilters;