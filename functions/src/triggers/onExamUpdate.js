// Cloud Function: On Exam Update
const admin = require('firebase-admin');

exports.onExamUpdate = functions.firestore
  .document('exams/{examId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const examId = context.params.examId;

    try {
      console.log(`📝 Exam updated: ${examId}`);

      // Check if exam was published
      if (!before.isPublished && after.isPublished) {
        console.log(`📢 Exam published: ${examId}`);

        // Send notifications to assigned students
        if (after.assignedStudents && after.assignedStudents.length > 0) {
          // Implementation depends on your notification system
          console.log(`📧 Sending notifications to ${after.assignedStudents.length} students`);
        }
      }

      // Check if results were published
      if (!before.resultsPublished && after.resultsPublished) {
        console.log(`📊 Results published for exam: ${examId}`);

        // Send result notifications
        if (after.assignedStudents && after.assignedStudents.length > 0) {
          console.log(`📧 Sending result notifications to ${after.assignedStudents.length} students`);
        }
      }

      // Log audit
      await admin.firestore().collection('auditLogs').add({
        action: 'exam_updated',
        actionType: 'update',
        targetType: 'exam',
        targetId: examId,
        targetName: after.title || 'Untitled Exam',
        organizationId: after.organizationId || null,
        status: 'success',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        details: {
          changes: {
            title: before.title !== after.title ? { before: before.title, after: after.title } : null,
            isPublished: before.isPublished !== after.isPublished ? { before: before.isPublished, after: after.isPublished } : null,
            status: before.status !== after.status ? { before: before.status, after: after.status } : null,
          },
        },
      });

    } catch (error) {
      console.error('❌ Error in onExamUpdate:', error);
    }
  });

module.exports = exports;