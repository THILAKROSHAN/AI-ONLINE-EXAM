import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  generateReport, 
  REPORT_TYPES, 
  REPORT_FORMATS,
  getReportTemplates,
  saveReportTemplate,
} from '../../services/api/report';
import { getOrganizationStudents } from '../../services/api/student';
import { getOrganizationExams } from '../../services/api/exam';
import Button from '../common/Buttons/Button';
import Input from '../common/Forms/Input';
import Spinner from '../common/Loading/Spinner';
import Toast from '../common/Notifications/Toast';
import ReportTypes from './ReportTypes';
import ReportFilters from './ReportFilters';

const ReportGenerator = ({ onSuccess, onClose }) => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reportData, setReportData] = useState(null);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [formData, setFormData] = useState({
    type: REPORT_TYPES.STUDENT,
    format: REPORT_FORMATS.PDF,
    title: '',
    description: '',
    dateRange: {
      start: '',
      end: '',
    },
    filters: {},
    includeCharts: true,
    includeSummary: true,
    includeDetailed: false,
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [studentsResult, examsResult, templatesResult] = await Promise.all([
        getOrganizationStudents(userData.organizationId, { isActive: true }),
        getOrganizationExams(userData.organizationId, { isPublished: true }),
        getReportTemplates(userData.organizationId),
      ]);

      if (studentsResult.success) setStudents(studentsResult.data);
      if (examsResult.success) setExams(examsResult.data);
      if (templatesResult.success) setTemplates(templatesResult.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleDateRangeChange = (field, value) => {
    setFormData({
      ...formData,
      dateRange: {
        ...formData.dateRange,
        [field]: value,
      },
    });
  };

  const handleFilterChange = (filters) => {
    setFormData({
      ...formData,
      filters: { ...formData.filters, ...filters },
    });
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    if (template) {
      setFormData({
        ...formData,
        type: template.type || formData.type,
        title: template.title || formData.title,
        description: template.description || formData.description,
        filters: template.filters || formData.filters,
        includeCharts: template.includeCharts !== undefined ? template.includeCharts : formData.includeCharts,
        includeSummary: template.includeSummary !== undefined ? template.includeSummary : formData.includeSummary,
        includeDetailed: template.includeDetailed !== undefined ? template.includeDetailed : formData.includeDetailed,
      });
    }
  };

  const handleSaveTemplate = async () => {
    try {
      const templateData = {
        name: formData.title || 'Untitled Template',
        description: formData.description,
        type: formData.type,
        filters: formData.filters,
        includeCharts: formData.includeCharts,
        includeSummary: formData.includeSummary,
        includeDetailed: formData.includeDetailed,
        organizationId: userData.organizationId,
      };

      const result = await saveReportTemplate(templateData);
      if (result.success) {
        setSuccess('Template saved successfully');
        await loadData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleGenerate = async () => {
    if (!formData.type) {
      setError('Please select a report type');
      return;
    }

    setLoading(true);
    setError('');
    setReportData(null);

    try {
      const reportParams = {
        type: formData.type,
        format: formData.format,
        organizationId: userData.organizationId,
        title: formData.title,
        description: formData.description,
        dateRange: formData.dateRange,
        filters: formData.filters,
        includeCharts: formData.includeCharts,
        includeSummary: formData.includeSummary,
        includeDetailed: formData.includeDetailed,
      };

      const result = await generateReport(reportParams);

      if (result.success) {
        setReportData(result.data);
        setSuccess('Report generated successfully');
        if (onSuccess) onSuccess(result.data);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Generation error:', error);
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Generate Report
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Create custom reports with filters and formatting options
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <Toast
          type="success"
          message={success}
          duration={3000}
          onClose={() => setSuccess('')}
        />
      )}

      <div className="space-y-6">
        {/* Templates */}
        {templates.length > 0 && (
          <div>
            <label className="label">Load Template</label>
            <select
              value={selectedTemplate?.id || ''}
              onChange={(e) => {
                const template = templates.find(t => t.id === e.target.value);
                handleTemplateSelect(template);
              }}
              className="input-field"
              disabled={loading}
            >
              <option value="">Select a template</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Report Type */}
        <ReportTypes
          selectedType={formData.type}
          onTypeChange={(type) => setFormData({ ...formData, type })}
          disabled={loading}
        />

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            name="title"
            label="Report Title"
            placeholder="Enter report title"
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
          />

          <div>
            <label className="label">Format</label>
            <select
              name="format"
              value={formData.format}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              {Object.values(REPORT_FORMATS).map((format) => (
                <option key={format} value={format}>
                  {format.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          type="text"
          name="description"
          label="Description"
          placeholder="Enter report description"
          value={formData.description}
          onChange={handleChange}
          disabled={loading}
        />

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Start Date"
            value={formData.dateRange.start}
            onChange={(e) => handleDateRangeChange('start', e.target.value)}
            disabled={loading}
          />

          <Input
            type="date"
            label="End Date"
            value={formData.dateRange.end}
            onChange={(e) => handleDateRangeChange('end', e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Filters */}
        <ReportFilters
          type={formData.type}
          filters={formData.filters}
          onFilterChange={handleFilterChange}
          students={students}
          exams={exams}
          disabled={loading}
        />

        {/* Options */}
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeSummary"
              checked={formData.includeSummary}
              onChange={(e) => setFormData({ ...formData, includeSummary: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="includeSummary" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Include Summary
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeCharts"
              checked={formData.includeCharts}
              onChange={(e) => setFormData({ ...formData, includeCharts: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="includeCharts" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Include Charts
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeDetailed"
              checked={formData.includeDetailed}
              onChange={(e) => setFormData({ ...formData, includeDetailed: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={loading}
            />
            <label htmlFor="includeDetailed" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Include Detailed Data
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : 'Generate Report'}
          </Button>

          <Button
            variant="secondary"
            onClick={handleSaveTemplate}
            disabled={loading}
          >
            Save as Template
          </Button>

          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>

        {/* Preview */}
        {reportData && (
          <div className="mt-6">
            <ReportPreview reportData={reportData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportGenerator;