// Send Student Credentials Email
const admin = require('firebase-admin');
const { getEmailTemplate } = require('../utils/helpers');

exports.sendStudentCredentials = async (data, context) => {
  // Authentication check
  if (!context.auth) {
    throw new Error('Authentication required');
  }

  const { studentId, email, password, organizationId, name } = data;

  try {
    // Get organization details
    const orgDoc = await admin.firestore()
      .collection('organizations')
      .doc(organizationId)
      .get();

    const orgData = orgDoc.exists ? orgDoc.data() : null;
    const orgName = orgData?.name || 'AI Examination Portal';

    // Get student details
    let studentName = name || 'Student';
    let studentEmail = email;

    if (studentId && !name) {
      const studentDoc = await admin.firestore()
        .collection('students')
        .doc(studentId)
        .get();

      if (studentDoc.exists) {
        const studentData = studentDoc.data();
        studentName = studentData.displayName || studentData.name || 'Student';
        studentEmail = studentData.email || email;
      }
    }

    // Prepare email template
    const templateData = {
      name: studentName,
      email: studentEmail,
      password: password,
      organization: orgName,
      loginUrl: `${process.env.APP_URL || 'http://localhost:3000'}/student/login`,
      supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
      role: 'student',
    };

    const html = getEmailTemplate('credentials', templateData);

    // Send email
    await admin.firestore().collection('mail').add({
      to: studentEmail,
      message: {
        subject: `Welcome to ${orgName} - Your Student Account Credentials`,
        html: html,
      },
    });

    // Log activity
    await admin.firestore().collection('auditLogs').add({
      action: 'send_student_credentials',
      targetType: 'student',
      targetId: studentId || email,
      organizationId: organizationId,
      performedBy: context.auth.uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: {
        email: studentEmail,
        role: 'student',
      },
    });

    return { success: true, message: 'Credentials sent successfully' };
  } catch (error) {
    console.error('Error sending credentials:', error);
    throw new Error(`Failed to send credentials: ${error.message}`);
  }
};