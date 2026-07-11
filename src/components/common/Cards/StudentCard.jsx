import React from 'react';
import Button from '../Buttons/Button';

const StudentCard = ({ student, onEdit, onView, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg">
            {student.name?.[0]?.toUpperCase() || 'S'}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {student.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {student.studentId || 'No ID'}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Email</span>
            <span className="text-gray-900 dark:text-white">{student.email}</span>
          </div>
          {student.department && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Department</span>
              <span className="text-gray-900 dark:text-white">{student.department}</span>
            </div>
          )}
          {student.semester && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Semester</span>
              <span className="text-gray-900 dark:text-white">Semester {student.semester}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Status</span>
            <span className={`px-2 py-0.5 text-xs rounded-full ${
              student.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {student.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="primary" size="sm" className="flex-1" onClick={() => onView(student)}>
            View
          </Button>
          <Button variant="secondary" size="sm" className="flex-1" onClick={() => onEdit(student)}>
            Edit
          </Button>
          {onDelete && (
            <Button variant="danger" size="sm" className="flex-1" onClick={() => onDelete(student)}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCard;