import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getOrganizationSettings, updateOrganizationSettings } from '../../services/api/organization';
import Button from '../common/Buttons/Button';
import Spinner from '../common/Loading/Spinner';
import Toast from '../common/Notifications/Toast';

const AIConfig = () => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [config, setConfig] = useState({
    enabled: true,
    maxQuestionsPerGeneration: 20,
    defaultDifficulty: 'medium',
    allowedTypes: ['mcq', 'true_false', 'fill_blank', 'descriptive', 'paragraph'],
    requireReview: true,
    saveToBank: true,
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const result = await getOrganizationSettings(userData.organizationId);
      if (result.success && result.data?.aiConfig) {
        setConfig(result.data.aiConfig);
      }
    } catch (error) {
      console.error('Error loading AI config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setConfig({
      ...config,
      [field]: value,
    });
  };

  const handleTypeToggle = (type) => {
    const newTypes = config.allowedTypes.includes(type)
      ? config.allowedTypes.filter(t => t !== type)
      : [...config.allowedTypes, type];
    
    if (newTypes.length === 0) {
      setError('At least one question type must be allowed');
      return;
    }
    
    setConfig({
      ...config,
      allowedTypes: newTypes,
    });
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const result = await updateOrganizationSettings(userData.organizationId, {
        aiConfig: config,
      });

      if (result.success) {
        setSuccess('AI configuration saved successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving AI config:', error);
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const questionTypeLabels = {
    mcq: 'Multiple Choice',
    true_false: 'True/False',
    fill_blank: 'Fill in the Blank',
    descriptive: 'Descriptive',
    paragraph: 'Paragraph',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        AI Configuration
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Configure AI question generation settings
      </p>

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

      <div className="space-y-4">
        {/* Enable AI */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="enabled"
            checked={config.enabled}
            onChange={(e) => handleChange('enabled', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            disabled={saving}
          />
          <label htmlFor="enabled" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Enable AI Question Generation
          </label>
        </div>

        {/* Max Questions */}
        <div>
          <label className="label">Maximum Questions Per Generation</label>
          <input
            type="number"
            min="1"
            max="50"
            value={config.maxQuestionsPerGeneration}
            onChange={(e) => handleChange('maxQuestionsPerGeneration', parseInt(e.target.value) || 1)}
            className="input-field max-w-[150px]"
            disabled={saving}
          />
        </div>

        {/* Default Difficulty */}
        <div>
          <label className="label">Default Difficulty</label>
          <select
            value={config.defaultDifficulty}
            onChange={(e) => handleChange('defaultDifficulty', e.target.value)}
            className="input-field max-w-[200px]"
            disabled={saving}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Allowed Types */}
        <div>
          <label className="label">Allowed Question Types</label>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(questionTypeLabels).map(([type, label]) => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeToggle(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  config.allowedTypes.includes(type)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={saving}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Require Review */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="requireReview"
            checked={config.requireReview}
            onChange={(e) => handleChange('requireReview', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            disabled={saving}
          />
          <label htmlFor="requireReview" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Require manual review before saving
          </label>
        </div>

        {/* Save to Bank */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="saveToBank"
            checked={config.saveToBank}
            onChange={(e) => handleChange('saveToBank', e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            disabled={saving}
          />
          <label htmlFor="saveToBank" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Automatically save generated questions to question bank
          </label>
        </div>

        <div className="pt-4">
          <Button
            onClick={handleSave}
            variant="primary"
            disabled={saving}
          >
            {saving ? <Spinner size="sm" /> : 'Save Configuration'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIConfig;