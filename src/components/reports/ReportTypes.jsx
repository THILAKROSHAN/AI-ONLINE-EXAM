import React from 'react';
import { REPORT_TYPES } from '../../services/api/report';

const ReportTypes = ({ selectedType, onTypeChange, disabled }) => {
  const types = [
    {
      id: REPORT_TYPES.STUDENT,
      label: 'Student Report',
      icon: '👨‍🎓',
      description: 'Comprehensive student performance report',
    },
    {
      id: REPORT_TYPES.EXAM,
      label: 'Exam Report',
      icon: '📝',
      description: 'Detailed exam analysis and results',
    },
    {
      id: REPORT_TYPES.ORGANIZATION,
      label: 'Organization Report',
      icon: '🏢',
      description: 'Organization-wide performance overview',
    },
    {
      id: REPORT_TYPES.PERFORMANCE,
      label: 'Performance Report',
      icon: '📊',
      description: 'Individual and group performance analytics',
    },
    {
      id: REPORT_TYPES.QUESTION,
      label: 'Question Report',
      icon: '❓',
      description: 'Question bank and usage statistics',
    },
    {
      id: REPORT_TYPES.ATTENDANCE,
      label: 'Attendance Report',
      icon: '📋',
      description: 'Student attendance and participation',
    },
  ];

  return (
    <div>
      <label className="label">Report Type</label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {types.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => onTypeChange(type.id)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              selectedType === type.id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={disabled}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{type.icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {type.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {type.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReportTypes;