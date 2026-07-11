// Send Password Reset Email
const admin = require('firebase-admin');
const { getEmailTemplate } = require('../utils/helpers');

exports.sendPasswordReset = async (data, context) => {
  const { email, resetLink } = data;

  try {
    // Get user details
    const userQuery = await admin.firestore()
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    let userName = 'User';
    let organizationId = null;

    if (!userQuery.empty) {
      const userData = userQuery.docs[0].data();
      userName = userData.displayName || 'User';
      organizationId = userData.organizationId;
    }

    // Get organization details
    let orgName = 'AI Examination Portal';
    if (organizationId) {
      const orgDoc = await admin.firestore()
        .collection('organizations')
        .doc(organizationId)
        .get();

      if (orgDoc.exists) {
        orgName = orgDoc.data()?.name || 'AI Examination Portal';
      }
    }

    // Prepare email template
    const templateData = {
      name: userName,
      email: email,
      resetLink: resetLink,
      organization: orgName,
      supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
    };

    const html = getEmailTemplate('passwordReset', templateData);

    // Send email
    await admin.firestore().collection('mail').add({
      to: email,
      message: {
        subject: `Password Reset Request - ${orgName}`,
        html: html,
      },
    });

    // Log activity
    if (organizationId) {
      await admin.firestore().collection('auditLogs').add({
        action: 'send_password_reset',
        targetType: 'user',
        targetId: email,
        organizationId: organizationId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        details: {
          email: email,
        },
      });
    }

    return { success: true, message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error('Error sending password reset:', error);
    throw new Error(`Failed to send password reset: ${error.message}`);
  }
};