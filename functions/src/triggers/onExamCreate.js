// Cloud Function: On Exam Create
const admin = require('firebase-admin');

exports.onExamCreate = functions.firestore
  .document('exams/{examId}')
  .onCreate(async (snap, context) => {
    const examData = snap.data();
    const examId = context.params.examId;

    try {
      console.log(`📝 New exam created: ${examId} - ${examData.title}`);

      // Update organization stats
      if (examData.organizationId) {
        const orgRef = admin.firestore()
          .collection('organizations')
          .doc(examData.organizationId);

        await orgRef.update({
          totalExams: admin.firestore.FieldValue.increment(1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      // Log audit
      await admin.firestore().collection('auditLogs').add({
        action: 'exam_created',
        actionType: 'create',
        targetType: 'exam',
        targetId: examId,
        targetName: examData.title || 'Untitled Exam',
        organizationId: examData.organizationId || null,
        performedBy: examData.createdBy || null,
        status: 'success',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        details: {
          title: examData.title,
          duration: examData.duration,
          totalQuestions: examData.totalQuestions,
          assignedStudents: examData.assignedStudents?.length || 0,
        },
      });

      // Schedule exam reminder if start date is set
      if (examData.startDate) {
        const startDate = new Date(examData.startDate);
        const now = new Date();
        const timeUntilStart = startDate.getTime() - now.getTime();

        // Send reminder 1 day before exam if start date is more than 1 day away
        if (timeUntilStart > 24 * 60 * 60 * 1000) {
          const reminderTime = timeUntilStart - 24 * 60 * 60 * 1000;
          // Schedule reminder (implementation depends on your scheduler)
          console.log(`⏰ Exam reminder scheduled for: ${new Date(now.getTime() + reminderTime)}`);
        }
      }

    } catch (error) {
      console.error('❌ Error in onExamCreate:', error);
    }
  });

module.exports = exports;