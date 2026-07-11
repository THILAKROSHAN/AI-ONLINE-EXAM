import React from 'react';
import Button from '../common/Buttons/Button';

const StudentFilters = ({
  filters,
  onFilterChange,
  onApply,
  onReset,
  onImport,
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
            placeholder="Search by name, email, ID..."
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
            <option value="all">All Students</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
            Import Students
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => window.location.href = '/admin/students/export'}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </Button>
      </div>
    </div>
  );
};

export default StudentFilters;