// Organization API Service
import { 
  createDocument, 
  getDocument, 
  updateDocument, 
  deleteDocument, 
  queryDocuments,
  getAllDocuments,
  COLLECTIONS 
} from '../firebase/firestore';
import { callFunction } from '../firebase/functions';

// Create a new organization
export const createOrganization = async (organizationData) => {
  try {
    const data = {
      name: organizationData.name,
      email: organizationData.email,
      phone: organizationData.phone || '',
      address: organizationData.address || '',
      website: organizationData.website || '',
      logo: organizationData.logo || '',
      subscription: {
        plan: organizationData.plan || 'free',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
        status: 'active',
      },
      settings: {
        allowStudentRegistration: organizationData.allowStudentRegistration || false,
        defaultLanguage: organizationData.defaultLanguage || 'en',
        timezone: organizationData.timezone || 'UTC',
        dateFormat: organizationData.dateFormat || 'MM/DD/YYYY',
        theme: organizationData.theme || 'light',
        aiConfig: organizationData.aiConfig || {
          enabled: true,
          maxQuestionsPerGeneration: 20,
          defaultDifficulty: 'medium',
          allowedTypes: ['mcq', 'true_false', 'fill_blank', 'descriptive', 'paragraph'],
          requireReview: true,
          saveToBank: true,
        },
      },
      isActive: true,
      createdBy: organizationData.createdBy || null,
      totalStudents: 0,
      totalAdmins: 0,
      totalExams: 0,
      totalQuestions: 0,
    };

    const result = await createDocument(COLLECTIONS.ORGANIZATIONS, data);
    return result;
  } catch (error) {
    console.error('❌ Error creating organization:', error);
    return { success: false, error: error.message };
  }
};

// Get organization by ID
export const getOrganization = async (organizationId) => {
  try {
    const result = await getDocument(COLLECTIONS.ORGANIZATIONS, organizationId);
    return result;
  } catch (error) {
    console.error('❌ Error getting organization:', error);
    return { success: false, error: error.message };
  }
};

// Get organization settings
export const getOrganizationSettings = async (organizationId) => {
  try {
    const result = await getDocument(COLLECTIONS.ORGANIZATIONS, organizationId);
    if (result.success && result.data) {
      return { 
        success: true, 
        data: result.data.settings || {} 
      };
    }
    return result;
  } catch (error) {
    console.error('❌ Error getting organization settings:', error);
    return { success: false, error: error.message };
  }
};

// Update organization settings
export const updateOrganizationSettings = async (organizationId, settingsData) => {
  try {
    const result = await updateDocument(COLLECTIONS.ORGANIZATIONS, organizationId, {
      settings: settingsData,
    });
    return result;
  } catch (error) {
    console.error('❌ Error updating organization settings:', error);
    return { success: false, error: error.message };
  }
};

// Update organization
export const updateOrganization = async (organizationId, data) => {
  try {
    const result = await updateDocument(COLLECTIONS.ORGANIZATIONS, organizationId, data);
    return result;
  } catch (error) {
    console.error('❌ Error updating organization:', error);
    return { success: false, error: error.message };
  }
};

// Delete organization
export const deleteOrganization = async (organizationId) => {
  try {
    const result = await deleteDocument(COLLECTIONS.ORGANIZATIONS, organizationId);
    return result;
  } catch (error) {
    console.error('❌ Error deleting organization:', error);
    return { success: false, error: error.message };
  }
};

// Get all organizations (Super Admin only)
export const getAllOrganizations = async () => {
  try {
    const result = await getAllDocuments(COLLECTIONS.ORGANIZATIONS);
    return result;
  } catch (error) {
    console.error('❌ Error getting all organizations:', error);
    return { success: false, error: error.message };
  }
};

// Get organizations with filters
export const queryOrganizations = async (filters = {}) => {
  try {
    const conditions = [];
    
    if (filters.isActive !== undefined) {
      conditions.push({
        field: 'isActive',
        operator: '==',
        value: filters.isActive,
      });
    }
    
    if (filters.subscriptionStatus) {
      conditions.push({
        field: 'subscription.status',
        operator: '==',
        value: filters.subscriptionStatus,
      });
    }
    
    if (filters.search) {
      // Search by name (case insensitive)
      conditions.push({
        field: 'name',
        operator: '>=',
        value: filters.search,
      });
    }
    
    const result = await queryDocuments(
      COLLECTIONS.ORGANIZATIONS,
      conditions,
      'createdAt',
      'desc'
    );
    return result;
  } catch (error) {
    console.error('❌ Error querying organizations:', error);
    return { success: false, error: error.message };
  }
};

// Update organization subscription
export const updateOrganizationSubscription = async (organizationId, subscriptionData) => {
  try {
    const result = await updateDocument(COLLECTIONS.ORGANIZATIONS, organizationId, {
      subscription: subscriptionData,
    });
    return result;
  } catch (error) {
    console.error('❌ Error updating subscription:', error);
    return { success: false, error: error.message };
  }
};

// Get organization statistics
export const getOrganizationStats = async (organizationId) => {
  try {
    // Get organization
    const orgResult = await getOrganization(organizationId);
    if (!orgResult.success) return orgResult;
    
    // Get students count
    const studentsResult = await queryDocuments(COLLECTIONS.STUDENTS, [
      { field: 'organizationId', operator: '==', value: organizationId },
      { field: 'isActive', operator: '==', value: true },
    ]);
    
    // Get admins count
    const adminsResult = await queryDocuments(COLLECTIONS.ADMINISTRATORS, [
      { field: 'organizationId', operator: '==', value: organizationId },
      { field: 'isActive', operator: '==', value: true },
    ]);
    
    // Get exams count
    const examsResult = await queryDocuments(COLLECTIONS.EXAMS, [
      { field: 'organizationId', operator: '==', value: organizationId },
    ]);
    
    // Get questions count
    const questionsResult = await queryDocuments(COLLECTIONS.QUESTIONS, [
      { field: 'organizationId', operator: '==', value: organizationId },
    ]);
    
    return {
      success: true,
      data: {
        organization: orgResult.data,
        totalStudents: studentsResult.success ? studentsResult.data.length : 0,
        totalAdmins: adminsResult.success ? adminsResult.data.length : 0,
        totalExams: examsResult.success ? examsResult.data.length : 0,
        totalQuestions: questionsResult.success ? questionsResult.data.length : 0,
      },
    };
  } catch (error) {
    console.error('❌ Error getting organization stats:', error);
    return { success: false, error: error.message };
  }
};

// Cloud Functions for organization
export const generateOrganizationId = async () => {
  return await callFunction('generateOrganizationId');
};

export const validateOrganizationName = async (name) => {
  return await callFunction('validateOrganizationName', { name });
};

export const activateOrganization = async (organizationId) => {
  return await callFunction('activateOrganization', { organizationId });
};

export const deactivateOrganization = async (organizationId) => {
  return await callFunction('deactivateOrganization', { organizationId });
};

// Export organization data
export const exportOrganizationData = async (organizationId, format = 'json') => {
  return await callFunction('exportOrganizationData', { organizationId, format });
};