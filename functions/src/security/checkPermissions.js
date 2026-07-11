// Permission Checking
const admin = require('firebase-admin');

exports.checkPermissions = async (userId, requiredPermissions, organizationId = null) => {
  try {
    if (!userId) {
      return { allowed: false, error: 'User ID is required' };
    }

    // Get user document
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      return { allowed: false, error: 'User not found' };
    }

    const userData = userDoc.data();

    // Super admin has all permissions
    if (userData.role === 'super_admin') {
      return { allowed: true };
    }

    // Check if user belongs to the organization
    if (organizationId && userData.organizationId !== organizationId) {
      return { allowed: false, error: 'User does not belong to this organization' };
    }

    // Check if user has required role
    if (requiredPermissions.length === 0) {
      return { allowed: true };
    }

    // Get user permissions
    const userPermissions = userData.permissions || [];

    // Check if user has any of the required permissions
    const hasPermission = requiredPermissions.some(permission =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return { allowed: false, error: 'Insufficient permissions' };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error checking permissions:', error);
    return { allowed: false, error: error.message };
  }
};

exports.checkRole = async (userId, allowedRoles) => {
  try {
    if (!userId) {
      return { allowed: false, error: 'User ID is required' };
    }

    const userDoc = await admin.firestore()
      .collection('users')
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      return { allowed: false, error: 'User not found' };
    }

    const userData = userDoc.data();
    const userRole = userData.role;

    if (!allowedRoles.includes(userRole)) {
      return { allowed: false, error: 'Insufficient role' };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error checking role:', error);
    return { allowed: false, error: error.message };
  }
};

module.exports = exports;