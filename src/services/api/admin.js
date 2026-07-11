// Admin API Service
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
import { registerAdmin } from '../firebase/auth'; // Changed from registerUser

// Create a new admin
export const createAdmin = async (adminData, password) => {
  try {
    // First create Firebase Auth user using registerAdmin
    const authResult = await registerAdmin(
      adminData.email,
      password,
      {
        displayName: adminData.name,
        role: adminData.role || 'admin',
        organizationId: adminData.organizationId,
        createdBy: adminData.createdBy || null,
      }
    );

    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    // Then create admin document
    const data = {
      uid: authResult.user.uid,
      name: adminData.name,
      email: adminData.email,
      phone: adminData.phone || '',
      role: adminData.role || 'admin',
      organizationId: adminData.organizationId,
      permissions: adminData.permissions || [],
      department: adminData.department || '',
      title: adminData.title || '',
      isActive: true,
      createdBy: adminData.createdBy || null,
      lastLogin: null,
      profilePhoto: adminData.profilePhoto || '',
    };

    const result = await createDocument(COLLECTIONS.ADMINISTRATORS, data);
    return result;
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    return { success: false, error: error.message };
  }
};

// Get admin by ID
export const getAdmin = async (adminId) => {
  try {
    const result = await getDocument(COLLECTIONS.ADMINISTRATORS, adminId);
    return result;
  } catch (error) {
    console.error('❌ Error getting admin:', error);
    return { success: false, error: error.message };
  }
};

// Get admin by UID
export const getAdminByUid = async (uid) => {
  try {
    const result = await queryDocuments(COLLECTIONS.ADMINISTRATORS, [
      { field: 'uid', operator: '==', value: uid }
    ]);
    return result;
  } catch (error) {
    console.error('❌ Error getting admin by UID:', error);
    return { success: false, error: error.message };
  }
};

// Update admin
export const updateAdmin = async (adminId, data) => {
  try {
    const result = await updateDocument(COLLECTIONS.ADMINISTRATORS, adminId, data);
    return result;
  } catch (error) {
    console.error('❌ Error updating admin:', error);
    return { success: false, error: error.message };
  }
};

// Delete admin
export const deleteAdmin = async (adminId) => {
  try {
    const result = await deleteDocument(COLLECTIONS.ADMINISTRATORS, adminId);
    return result;
  } catch (error) {
    console.error('❌ Error deleting admin:', error);
    return { success: false, error: error.message };
  }
};

// Get all admins for an organization
export const getOrganizationAdmins = async (organizationId) => {
  try {
    const result = await queryDocuments(COLLECTIONS.ADMINISTRATORS, [
      { field: 'organizationId', operator: '==', value: organizationId },
      { field: 'isActive', operator: '==', value: true }
    ]);
    return result;
  } catch (error) {
    console.error('❌ Error getting organization admins:', error);
    return { success: false, error: error.message };
  }
};

// Get all admins (Super Admin only)
export const getAllAdmins = async () => {
  try {
    const result = await getAllDocuments(COLLECTIONS.ADMINISTRATORS);
    return result;
  } catch (error) {
    console.error('❌ Error getting all admins:', error);
    return { success: false, error: error.message };
  }
};

// Update admin permissions
export const updateAdminPermissions = async (adminId, permissions) => {
  try {
    const result = await updateDocument(COLLECTIONS.ADMINISTRATORS, adminId, {
      permissions: permissions,
    });
    return result;
  } catch (error) {
    console.error('❌ Error updating admin permissions:', error);
    return { success: false, error: error.message };
  }
};

// Toggle admin status
export const toggleAdminStatus = async (adminId, isActive) => {
  try {
    const result = await updateDocument(COLLECTIONS.ADMINISTRATORS, adminId, {
      isActive: isActive,
    });
    return result;
  } catch (error) {
    console.error('❌ Error toggling admin status:', error);
    return { success: false, error: error.message };
  }
};

// Get admin statistics
export const getAdminStats = async (organizationId) => {
  try {
    const adminsResult = await queryDocuments(COLLECTIONS.ADMINISTRATORS, [
      { field: 'organizationId', operator: '==', value: organizationId },
    ]);

    if (!adminsResult.success) {
      return { success: false, error: adminsResult.error };
    }

    const admins = adminsResult.data;
    const stats = {
      total: admins.length,
      active: admins.filter(a => a.isActive).length,
      inactive: admins.filter(a => !a.isActive).length,
      byRole: {
        admin: admins.filter(a => a.role === 'admin' || a.role === 'organization_admin').length,
        sub_admin: admins.filter(a => a.role === 'sub_admin').length,
        super_admin: admins.filter(a => a.role === 'super_admin').length,
      },
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error('❌ Error getting admin stats:', error);
    return { success: false, error: error.message };
  }
};

// Cloud Functions for admin
export const sendAdminCredentials = async (adminId, email, password) => {
  return await callFunction('sendAdminCredentials', { adminId, email, password });
};

export const resetAdminPassword = async (adminId) => {
  return await callFunction('resetAdminPassword', { adminId });
};

export const generateAdminReport = async (organizationId, dateRange) => {
  return await callFunction('generateAdminReport', { organizationId, dateRange });
};