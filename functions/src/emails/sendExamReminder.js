// Send Exam Reminder Email
const admin = require('firebase-admin');
const { getEmailTemplate } = require('../utils/helpers');

exports.sendExamReminder = async (data, context) => {
  if (!context.auth) {
    throw new Error('Authentication required');
  }

  const { examId, studentIds } = data;

  try {
    // Get exam details
    const examDoc = await admin.firestore()
      .collection('exams')
      .doc(examId)
      .get();

    if (!examDoc.exists) {
      throw new Error('Exam not found');
    }

    const examData = examDoc.data();
    const organizationId = examData.organizationId;

    // Get organization details
    const orgDoc = await admin.firestore()
      .collection('organizations')
      .doc(organizationId)
      .get();

    const orgName = orgDoc.exists ? orgDoc.data()?.name : 'AI Examination Portal';

    // Get students
    const students = [];
    for (const studentId of studentIds) {
      const studentDoc = await admin.firestore()
        .collection('students')
        .doc(studentId)
        .get();

      if (studentDoc.exists) {
        students.push({
          id: studentId,
          ...studentDoc.data(),
        });
      }
    }

    // Send emails
    const emails = students.map((student) => {
      const templateData = {
        name: student.name || 'Student',
        examTitle: examData.title || 'Exam',
        examDate: examData.startDate 
          ? new Date(examData.startDate).toLocaleDateString() 
          : 'N/A',
        examTime: examData.startDate 
          ? new Date(examData.startDate).toLocaleTimeString() 
          : 'N/A',
        duration: examData.duration || 60,
        organization: orgName,
        examUrl: `${process.env.APP_URL}/student/exam/${examId}`,
        instructions: examData.instructions || [],
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
      };

      return {
        to: student.email,
        message: {
          subject: `Reminder: ${examData.title} - Upcoming Exam`,
          html: getEmailTemplate('examReminder', templateData),
        },
      };
    });

    // Batch send
    for (const email of emails) {
      await admin.firestore().collection('mail').add(email);
    }

    // Log activity
    await admin.firestore().collection('auditLogs').add({
      action: 'send_exam_reminder',
      targetType: 'exam',
      targetId: examId,
      organizationId: organizationId,
      performedBy: context.auth.uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: {
        studentCount: students.length,
        examTitle: examData.title,
      },
    });

    return { 
      success: true, 
      message: `Exam reminders sent to ${students.length} students`,
      sentCount: students.length,
    };
  } catch (error) {
    console.error('Error sending exam reminders:', error);
    throw new Error(`Failed to send exam reminders: ${error.message}`);
  }
};