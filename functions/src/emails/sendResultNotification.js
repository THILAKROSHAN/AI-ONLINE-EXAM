// Send Result Notification Email
const admin = require('firebase-admin');
const { getEmailTemplate } = require('../utils/helpers');

exports.sendResultNotification = async (data, context) => {
  if (!context.auth) {
    throw new Error('Authentication required');
  }

  const { resultId, studentId, examId } = data;

  try {
    // Get result details
    const resultDoc = await admin.firestore()
      .collection('results')
      .doc(resultId)
      .get();

    if (!resultDoc.exists) {
      throw new Error('Result not found');
    }

    const resultData = resultDoc.data();
    const organizationId = resultData.organizationId;

    // Get exam details
    const examDoc = await admin.firestore()
      .collection('exams')
      .doc(examId || resultData.examId)
      .get();

    const examData = examDoc.exists ? examDoc.data() : null;

    // Get student details
    const studentDoc = await admin.firestore()
      .collection('students')
      .doc(studentId || resultData.studentId)
      .get();

    if (!studentDoc.exists) {
      throw new Error('Student not found');
    }

    const studentData = studentDoc.data();

    // Get organization details
    const orgDoc = await admin.firestore()
      .collection('organizations')
      .doc(organizationId)
      .get();

    const orgName = orgDoc.exists ? orgDoc.data()?.name : 'AI Examination Portal';

    // Prepare email template
    const templateData = {
      name: studentData.name || 'Student',
      examTitle: examData?.title || resultData.examTitle || 'Exam',
      score: resultData.percentage?.toFixed(1) || 0,
      obtainedMarks: resultData.obtainedMarks || 0,
      totalMarks: resultData.totalMarks || 0,
      grade: getGrade(resultData.percentage),
      status: resultData.isPassed ? 'Passed' : 'Failed',
      rank: resultData.rank || 'N/A',
      organization: orgName,
      resultUrl: `${process.env.APP_URL}/student/results?attemptId=${resultId}`,
      supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
    };

    const html = getEmailTemplate('resultNotification', templateData);

    // Send email
    await admin.firestore().collection('mail').add({
      to: studentData.email,
      message: {
        subject: `Your Exam Results: ${examData?.title || 'Exam'}`,
        html: html,
      },
    });

    // Log activity
    await admin.firestore().collection('auditLogs').add({
      action: 'send_result_notification',
      targetType: 'result',
      targetId: resultId,
      organizationId: organizationId,
      performedBy: context.auth.uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: {
        studentEmail: studentData.email,
        examTitle: examData?.title || 'Exam',
        score: resultData.percentage,
      },
    });

    return { success: true, message: 'Result notification sent successfully' };
  } catch (error) {
    console.error('Error sending result notification:', error);
    throw new Error(`Failed to send result notification: ${error.message}`);
  }
};

// Helper function
function getGrade(percentage) {
  if (percentage >= 80) return 'A';
  if (percentage >= 60) return 'B';
  if (percentage >= 40) return 'C';
  if (percentage >= 30) return 'D';
  return 'F';
}