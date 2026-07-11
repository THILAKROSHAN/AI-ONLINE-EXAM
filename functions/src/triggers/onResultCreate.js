// Cloud Function: On Result Create
const admin = require('firebase-admin');

exports.onResultCreate = functions.firestore
  .document('results/{resultId}')
  .onCreate(async (snap, context) => {
    const resultData = snap.data();
    const resultId = context.params.resultId;

    try {
      console.log(`📊 New result created: ${resultId}`);

      // Update student stats
      if (resultData.studentId) {
        const studentRef = admin.firestore()
          .collection('students')
          .doc(resultData.studentId);

        const studentDoc = await studentRef.get();
        if (studentDoc.exists) {
          const studentData = studentDoc.data();
          const totalExams = (studentData.totalExams || 0) + 1;
          const currentAvg = studentData.averageScore || 0;
          const newAvg = ((currentAvg * (totalExams - 1)) + (resultData.percentage || 0)) / totalExams;

          await studentRef.update({
            totalExams: totalExams,
            averageScore: newAvg,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }

      // Update exam stats
      if (resultData.examId) {
        const examRef = admin.firestore()
          .collection('exams')
          .doc(resultData.examId);

        await examRef.update({
          totalResults: admin.firestore.FieldValue.increment(1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      // Log audit
      await admin.firestore().collection('auditLogs').add({
        action: 'result_created',
        actionType: 'create',
        targetType: 'result',
        targetId: resultId,
        organizationId: resultData.organizationId || null,
        status: 'success',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        details: {
          studentId: resultData.studentId,
          examId: resultData.examId,
          percentage: resultData.percentage,
          isPassed: resultData.isPassed,
        },
      });

    } catch (error) {
      console.error('❌ Error in onResultCreate:', error);
    }
  });

module.exports = exports;