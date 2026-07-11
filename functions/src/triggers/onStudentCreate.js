// Cloud Function: On Student Create
const admin = require('firebase-admin');

exports.onStudentCreate = functions.firestore
  .document('students/{studentId}')
  .onCreate(async (snap, context) => {
    const studentData = snap.data();
    const studentId = context.params.studentId;

    try {
      console.log(`👨‍🎓 New student created: ${studentId}`);

      // Update organization stats
      if (studentData.organizationId) {
        const orgRef = admin.firestore()
          .collection('organizations')
          .doc(studentData.organizationId);

        await orgRef.update({
          totalStudents: admin.firestore.FieldValue.increment(1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      // Log audit
      await admin.firestore().collection('auditLogs').add({
        action: 'student_created',
        actionType: 'create',
        targetType: 'student',
        targetId: studentId,
        targetName: studentData.name || 'New Student',
        organizationId: studentData.organizationId || null,
        performedBy: studentData.createdBy || null,
        status: 'success',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        details: {
          email: studentData.email,
          studentId: studentData.studentId,
          department: studentData.department,
          semester: studentData.semester,
        },
      });

    } catch (error) {
      console.error('❌ Error in onStudentCreate:', error);
    }
  });

module.exports = exports;