// Organization Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getOrganization, updateOrganization } from '../services/api/organization';

const OrganizationContext = createContext();

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};

export const OrganizationProvider = ({ children }) => {
  const { userData, isAuthenticated } = useAuth();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && userData?.organizationId) {
      loadOrganization(userData.organizationId);
    } else {
      setOrganization(null);
      setLoading(false);
    }
  }, [isAuthenticated, userData?.organizationId]);

  const loadOrganization = async (organizationId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getOrganization(organizationId);
      
      if (result.success) {
        setOrganization(result.data);
      } else {
        setError(result.error);
        setOrganization(null);
      }
    } catch (error) {
      console.error('Error loading organization:', error);
      setError(error.message);
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrganization = async () => {
    if (userData?.organizationId) {
      await loadOrganization(userData.organizationId);
    }
  };

  const updateOrganizationData = async (data) => {
    if (!organization) return { success: false, error: 'No organization loaded' };

    try {
      const result = await updateOrganization(organization.id, data);
      
      if (result.success) {
        await refreshOrganization();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error updating organization:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    organization,
    loading,
    error,
    refreshOrganization,
    updateOrganizationData,
    isActive: organization?.isActive || false,
    subscriptionStatus: organization?.subscription?.status || 'inactive',
    settings: organization?.settings || {},
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};

export default OrganizationContext;