// Organization Validation and Access Control
const admin = require('firebase-admin');

exports.validateOrganizationAccess = async (userId, organizationId) => {
  try {
    if (!userId || !organizationId) {
      return { valid: false, error: 'User ID and Organization ID are required' };
    }

    // Get user document
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      return { valid: false, error: 'User not found' };
    }

    const userData = userDoc.data();

    // Super admin has access to all organizations
    if (userData.role === 'super_admin') {
      return { valid: true };
    }

    // Check if user belongs to the organization
    if (userData.organizationId !== organizationId) {
      return { valid: false, error: 'User does not belong to this organization' };
    }

    // Check if organization is active
    const orgDoc = await admin.firestore()
      .collection('organizations')
      .doc(organizationId)
      .get();

    if (!orgDoc.exists) {
      return { valid: false, error: 'Organization not found' };
    }

    const orgData = orgDoc.data();
    if (!orgData.isActive) {
      return { valid: false, error: 'Organization is not active' };
    }

    return { valid: true };
  } catch (error) {
    console.error('Error validating organization access:', error);
    return { valid: false, error: error.message };
  }
};

exports.isOrganizationAdmin = async (userId, organizationId) => {
  try {
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      return false;
    }

    const userData = userDoc.data();
    return userData.role === 'organization_admin' &&
           userData.organizationId === organizationId;
  } catch (error) {
    console.error('Error checking organization admin:', error);
    return false;
  }
};

exports.isOrganizationMember = async (userId, organizationId) => {
  try {
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      return false;
    }

    const userData = userDoc.data();
    return userData.organizationId === organizationId;
  } catch (error) {
    console.error('Error checking organization member:', error);
    return false;
  }
};

module.exports = exports;