import React, { useState, useEffect } from 'react';
import { useOrganization } from '../../contexts/OrganizationContext';
import { updateOrganizationSettings } from '../../services/api/organization';
import Button from '../common/Buttons/Button';
import Input from '../common/Forms/Input';
import Spinner from '../common/Loading/Spinner';
import Toast from '../common/Notifications/Toast';

const OrganizationSettings = () => {
  const { organization, refreshOrganization } = useOrganization();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    logo: '',
    allowStudentRegistration: false,
    defaultLanguage: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    theme: 'light',
  });

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        email: organization.email || '',
        phone: organization.phone || '',
        address: organization.address || '',
        website: organization.website || '',
        logo: organization.logo || '',
        allowStudentRegistration: organization.settings?.allowStudentRegistration || false,
        defaultLanguage: organization.settings?.defaultLanguage || 'en',
        timezone: organization.settings?.timezone || 'UTC',
        dateFormat: organization.settings?.dateFormat || 'MM/DD/YYYY',
        theme: organization.settings?.theme || 'light',
      });
    }
  }, [organization]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      setError('Organization name and email are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await updateOrganizationSettings(organization.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        website: formData.website,
        logo: formData.logo,
        allowStudentRegistration: formData.allowStudentRegistration,
        defaultLanguage: formData.defaultLanguage,
        timezone: formData.timezone,
        dateFormat: formData.dateFormat,
        theme: formData.theme,
      });

      if (result.success) {
        await refreshOrganization();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to update settings');
      }
    } catch (error) {
      setError('An unexpected error occurred');
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!organization) {
    return (
      <div className="text-center py-8">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading organization settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Organization Settings</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your organization profile and preferences
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
          message="Organization settings updated successfully!"
          duration={3000}
          onClose={() => setSuccess(false)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            General Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              name="name"
              label="Organization Name"
              placeholder="Enter organization name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Input
              type="email"
              name="email"
              label="Organization Email"
              placeholder="Enter organization email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Input
              type="text"
              name="phone"
              label="Phone Number"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />

            <Input
              type="text"
              name="website"
              label="Website"
              placeholder="Enter website URL"
              value={formData.website}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="mt-4">
            <Input
              type="text"
              name="address"
              label="Address"
              placeholder="Enter organization address"
              value={formData.address}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Preferences
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="allowStudentRegistration"
                id="allowStudentRegistration"
                checked={formData.allowStudentRegistration}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                disabled={loading}
              />
              <label htmlFor="allowStudentRegistration" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Allow student self-registration
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Default Language</label>
                <select
                  name="defaultLanguage"
                  value={formData.defaultLanguage}
                  onChange={handleChange}
                  className="input-field"
                  disabled={loading}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>

              <div>
                <label className="label">Time Zone</label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="input-field"
                  disabled={loading}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Asia/Kolkata">India</option>
                  <option value="Asia/Dubai">Dubai</option>
                  <option value="Australia/Sydney">Sydney</option>
                </select>
              </div>

              <div>
                <label className="label">Date Format</label>
                <select
                  name="dateFormat"
                  value={formData.dateFormat}
                  onChange={handleChange}
                  className="input-field"
                  disabled={loading}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="label">Theme</label>
                <select
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="input-field"
                  disabled={loading}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OrganizationSettings;