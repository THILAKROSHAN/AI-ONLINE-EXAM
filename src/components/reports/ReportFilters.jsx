import React from 'react';

const ReportFilters = ({ type, filters, onFilterChange, students, exams, disabled }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const renderStudentFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="label">Department</label>
        <select
          name="department"
          value={filters.department || ''}
          onChange={handleChange}
          className="input-field"
          disabled={disabled}
        >
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Biology">Biology</option>
          <option value="Engineering">Engineering</option>
          <option value="Business">Business</option>
          <option value="Arts">Arts</option>
        </select>
      </div>

      <div>
        <label className="label">Semester</label>
        <select
          name="semester"
          value={filters.semester || ''}
          onChange={handleChange}
          className="input-field"
          disabled={disabled}
        >
          <option value="">All Semesters</option>
          <option value="1">Semester 1</option>
          <option value="2">Semester 2</option>
          <option value="3">Semester 3</option>
          <option value="4">Semester 4</option>
          <option value="5">Semester 5</option>
          <option value="6">Semester 6</option>
          <option value="7">Semester 7</option>
          <option value="8">Semester 8</option>
        </select>
      </div>

      <div>
        <label className="label">Status</label>
        <select
          name="status"
          value={filters.status || ''}
          onChange={handleChange}
          className="input-field"
          disabled={disabled}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );

  const renderExamFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="label">Exam</label>
        <select
          name="examId"
          value={filters.examId || ''}
          onChange={handleChange}
          className="input-field"
          disabled={disabled}
        >
          <option value="">All Exams</option>
          {exams.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Status</label>
        <select
          name="status"
          value={filters.status || ''}
          onChange={handleChange}
          className="input-field"
          disabled={disabled}
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div>
        <label className="label">Published</label>
        <select
          name="isPublished"
          value={filters.isPublished !== undefined ? String(filters.isPublished) : ''}
          onChange={handleChange}
          className="input-field"
          disabled={disabled}
        >
          <option value="">All</option>
          <option value="true">Published</option>
          <option value="false">Unpublished</option>
        </select>
      </div>
    </div>
  );

  const renderPerformanceFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="label">Student</label>
        <select
          name="studentId"
          value={filters.studentId || ''}
          onChange={handleChange}
          className="input-field"
          disabled={disabled}
        >
          <option value="">All Students</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} ({student.studentId})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Score Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            name="minScore"
            placeholder="Min %"
            value={filters.minScore || ''}
            onChange={handleChange}
            className="input-field"
            disabled={disabled}
            min="0"
            max="100"
          />
          <input
            type="number"
            name="maxScore"
            placeholder="Max %"
            value={filters.maxScore || ''}
            onChange={handleChange}
            className="input-field"
            disabled={disabled}
            min="0"
            max="100"
          />
        </div>
      </div>

      <div>
        <label className="label">Status</label>
        <select
          name="status"
          value={filters.status || ''}
          onChange={handleChange}
          className="input-field"
          disabled={disabled}
        >
          <option value="">All</option>
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
        </select>
      </div>
    </div>
  );

  const renderQuestionFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="label">Type</label>
        <select
          name="type"
          value={filters.type || ''}
          onChange={handleChange}
          className="input-field"
          disabled={disabled}
        >
          <option value="">All Types</option>
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
          name="difficulty"
          value={filters.difficulty || ''}
          onChange={handleChange}
          className="input-field"
          disabled={disabled}
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div>
        <label className="label">Status</label>
        <select
          name="status"
          value={filters.status || ''}
          onChange={handleChange}
          className="input-field"
          disabled={disabled}
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>
    </div>
  );

  const renderTypeFilters = () => {
    switch (type) {
      case 'student':
        return renderStudentFilters();
      case 'exam':
        return renderExamFilters();
      case 'performance':
        return renderPerformanceFilters();
      case 'question':
        return renderQuestionFilters();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Filters
      </h3>
      {renderTypeFilters()}
    </div>
  );
};

export default ReportFilters;