import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrganization } from '../../services/api/organization';
import { registerAdmin } from '../../services/firebase/auth'; // Changed from registerUser
import Button from '../common/Buttons/Button';
import Input from '../common/Forms/Input';
import Spinner from '../common/Loading/Spinner';

const OrganizationSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Organization Details
    orgName: '',
    orgEmail: '',
    orgPhone: '',
    orgAddress: '',
    orgWebsite: '',
    orgPlan: 'free',
    
    // Admin Details
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate Step 1: Organization Details
    if (step === 1) {
      if (!formData.orgName || !formData.orgEmail) {
        setError('Please fill in organization name and email');
        return;
      }
      setStep(2);
      return;
    }

    // Validate Step 2: Admin Details
    if (step === 2) {
      if (!formData.adminName || !formData.adminEmail || !formData.adminPassword) {
        setError('Please fill in all admin details');
        return;
      }

      if (formData.adminPassword !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.adminPassword.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      await createOrganizationAndAdmin();
    }
  };

  const createOrganizationAndAdmin = async () => {
    setLoading(true);
    setError('');

    try {
      // Step 1: Create organization
      const orgResult = await createOrganization({
        name: formData.orgName,
        email: formData.orgEmail,
        phone: formData.orgPhone,
        address: formData.orgAddress,
        website: formData.orgWebsite,
        plan: formData.orgPlan,
      });

      if (!orgResult.success) {
        setError(orgResult.error || 'Failed to create organization');
        setLoading(false);
        return;
      }

      const organizationId = orgResult.id;

      // Step 2: Create admin user using registerAdmin
      const adminResult = await registerAdmin(
        formData.adminEmail,
        formData.adminPassword,
        {
          displayName: formData.adminName,
          role: 'admin',
          organizationId: organizationId,
        }
      );

      if (!adminResult.success) {
        setError(adminResult.error || 'Failed to create admin account');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/login');
      }, 3000);
    } catch (error) {
      console.error('Setup error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Organization Created Successfully!
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Your organization has been set up and admin account created.
              <br />
              A verification email has been sent to your admin email address.
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Rest of the component remains the same...
  // [Keep the existing form JSX from the original OrganizationSetup]
  // The form fields remain unchanged, just the submission logic is updated

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Set Up Your Organization
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {step === 1 ? 'Step 1 of 2: Organization Details' : 'Step 2 of 2: Admin Account'}
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className={`h-2 w-16 rounded-full ${step === 1 ? 'bg-primary-600' : 'bg-primary-300'}`}></div>
            <div className={`h-2 w-16 rounded-full ${step === 2 ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 ? (
            // Organization Details
            <>
              <Input
                type="text"
                name="orgName"
                label="Organization Name"
                placeholder="Enter organization name"
                value={formData.orgName}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <Input
                type="email"
                name="orgEmail"
                label="Organization Email"
                placeholder="Enter organization email"
                value={formData.orgEmail}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <Input
                type="text"
                name="orgPhone"
                label="Phone Number"
                placeholder="Enter phone number"
                value={formData.orgPhone}
                onChange={handleChange}
                disabled={loading}
              />

              <Input
                type="text"
                name="orgAddress"
                label="Address"
                placeholder="Enter organization address"
                value={formData.orgAddress}
                onChange={handleChange}
                disabled={loading}
              />

              <Input
                type="text"
                name="orgWebsite"
                label="Website"
                placeholder="Enter website URL"
                value={formData.orgWebsite}
                onChange={handleChange}
                disabled={loading}
              />

              <div>
                <label className="label">Subscription Plan</label>
                <select
                  name="orgPlan"
                  value={formData.orgPlan}
                  onChange={handleChange}
                  className="input-field"
                  disabled={loading}
                >
                  <option value="free">Free</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </>
          ) : (
            // Admin Details
            <>
              <Input
                type="text"
                name="adminName"
                label="Admin Full Name"
                placeholder="Enter admin full name"
                value={formData.adminName}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <Input
                type="email"
                name="adminEmail"
                label="Admin Email"
                placeholder="Enter admin email"
                value={formData.adminEmail}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <Input
                type="password"
                name="adminPassword"
                label="Admin Password"
                placeholder="Create password (min 6 characters)"
                value={formData.adminPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <Input
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </>
          )}

          <div className="flex justify-between">
            {step === 2 && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              className={step === 1 ? 'w-full' : ''}
              disabled={loading}
            >
              {loading ? (
                <Spinner size="sm" />
              ) : step === 1 ? (
                'Next Step'
              ) : (
                'Create Organization'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationSetup;