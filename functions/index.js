// Firebase Cloud Functions
const admin = require('firebase-admin');
const functions = require('firebase-functions');

// Initialize Firebase Admin
admin.initializeApp();

// Import email functions
const { sendCredentials } = require('./src/emails/sendCredentials');
const { sendExamReminder } = require('./src/emails/sendExamReminder');
const { sendResultNotification } = require('./src/emails/sendResultNotification');
const { sendPasswordReset } = require('./src/emails/sendPasswordReset');

// ==================== Email Functions ====================

exports.sendStudentCredentials = functions.https.onCall(sendCredentials);
exports.sendExamReminder = functions.https.onCall(sendExamReminder);
exports.sendResultNotification = functions.https.onCall(sendResultNotification);
exports.sendPasswordResetEmail = functions.https.onCall(sendPasswordReset);

// ==================== Student Functions ====================

exports.generateStudentId = functions.https.onCall(async (data, context) => {
  // Authentication check
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const { organizationId } = data;

  try {
    // Get count of existing students
    const studentsQuery = await admin.firestore()
      .collection('students')
      .where('organizationId', '==', organizationId)
      .get();

    const count = studentsQuery.size + 1;
    const prefix = 'STU';
    const paddedCount = String(count).padStart(4, '0');
    const studentId = `${prefix}${paddedCount}`;

    return { success: true, studentId };
  } catch (error) {
    console.error('Error generating student ID:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate student ID');
  }
});

exports.generateSecurePassword = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return { success: true, password };
});

exports.createStudentAccount = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  // Implementation would be here
  return { success: true };
});

// ==================== Import/Export Functions ====================

exports.importStudentsFromExcel = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  // Implementation would be here
  return { success: true, count: 0 };
});

exports.exportStudentsToExcel = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  // Implementation would be here
  return { success: true, url: '' };
});

exports.importQuestionsFromExcel = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  // Implementation would be here
  return { success: true, count: 0 };
});

exports.exportQuestionsToExcel = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  // Implementation would be here
  return { success: true, url: '' };
});

// ==================== Exam Functions ====================

exports.autoSubmitExam = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const { examAttemptId } = data;

  try {
    // Get exam attempt
    const attemptDoc = await admin.firestore()
      .collection('examAttempts')
      .doc(examAttemptId)
      .get();

    if (!attemptDoc.exists) {
      throw new Error('Exam attempt not found');
    }

    const attemptData = attemptDoc.data();

    // Mark as auto-submitted
    await admin.firestore()
      .collection('examAttempts')
      .doc(examAttemptId)
      .update({
        status: 'auto_submitted',
        isSubmitted: true,
        isCompleted: true,
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    // Trigger evaluation
    await exports.evaluateExamResults({ examAttemptId }, { auth: context.auth });

    return { success: true };
  } catch (error) {
    console.error('Error auto-submitting exam:', error);
    throw new functions.https.HttpsError('internal', 'Failed to auto-submit exam');
  }
});
exports.sendStudentCredentials = functions.https.onCall(require('./src/emails/sendCredentials').sendStudentCredentials);

exports.evaluateExamResults = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const { examAttemptId } = data;

  try {
    // Get exam attempt
    const attemptDoc = await admin.firestore()
      .collection('examAttempts')
      .doc(examAttemptId)
      .get();

    if (!attemptDoc.exists) {
      throw new Error('Exam attempt not found');
    }

    const attemptData = attemptDoc.data();
    const { examId, studentId, answers } = attemptData;

    // Get exam details
    const examDoc = await admin.firestore()
      .collection('exams')
      .doc(examId)
      .get();

    if (!examDoc.exists) {
      throw new Error('Exam not found');
    }

    const examData = examDoc.data();

    // Get questions
    const questionIds = examData.questionIds || [];
    const questions = [];
    for (const qId of questionIds) {
      const qDoc = await admin.firestore()
        .collection('questions')
        .doc(qId)
        .get();
      if (qDoc.exists) {
        questions.push({ id: qId, ...qDoc.data() });
      }
    }

    // Evaluate answers
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;
    let obtainedMarks = 0;
    let totalMarks = 0;
    const questionResults = [];

    questions.forEach((question, index) => {
      const userAnswer = answers?.[index];
      const isCorrect = userAnswer === question.correctAnswer;
      const isAttempted = userAnswer !== undefined && userAnswer !== '';

      if (isAttempted) {
        if (isCorrect) {
          correct++;
          obtainedMarks += question.marks || 1;
        } else {
          wrong++;
          if (examData.negativeMarking) {
            obtainedMarks -= examData.negativeMarkValue || 0.25;
          }
        }
      } else {
        unattempted++;
      }

      totalMarks += question.marks || 1;

      questionResults.push({
        questionId: question.id,
        questionText: question.text,
        userAnswer: userAnswer || null,
        correctAnswer: question.correctAnswer,
        isCorrect: isCorrect,
        isAttempted: isAttempted,
        marks: question.marks || 1,
      });
    });

    const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
    const isPassed = percentage >= (examData.passingMarks || 40);

    // Save result
    const resultData = {
      examId: examId,
      studentId: studentId,
      organizationId: examData.organizationId,
      examTitle: examData.title,
      totalMarks: totalMarks,
      obtainedMarks: Math.max(0, obtainedMarks),
      percentage: Math.max(0, percentage),
      correctAnswers: correct,
      wrongAnswers: wrong,
      unattempted: unattempted,
      isPassed: isPassed,
      isPublished: false,
      status: 'evaluated',
      timeSpent: attemptData.timeSpent || 0,
      startedAt: attemptData.startTime,
      submittedAt: attemptData.submittedAt,
      completedAt: new Date(),
      answers: answers,
      questionResults: questionResults,
      isAutoEvaluated: true,
      isManualEvaluated: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const resultRef = await admin.firestore()
      .collection('results')
      .add(resultData);

    // Update exam attempt
    await admin.firestore()
      .collection('examAttempts')
      .doc(examAttemptId)
      .update({
        score: obtainedMarks,
        percentage: percentage,
        correctAnswers: correct,
        wrongAnswers: wrong,
        unattempted: unattempted,
        isEvaluated: true,
        evaluatedAt: admin.firestore.FieldValue.serverTimestamp(),
        resultId: resultRef.id,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    // Send result notification
    await exports.sendResultNotification({
      resultId: resultRef.id,
      studentId: studentId,
      examId: examId,
    }, { auth: context.auth });

    return { success: true, resultId: resultRef.id };
  } catch (error) {
    console.error('Error evaluating exam:', error);
    throw new functions.https.HttpsError('internal', 'Failed to evaluate exam');
  }
});

exports.publishExamResults = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const { examId, studentIds } = data;

  try {
    // Get all results for the exam
    const resultsQuery = await admin.firestore()
      .collection('results')
      .where('examId', '==', examId)
      .get();

    const batch = admin.firestore().batch();
    let publishedCount = 0;

    resultsQuery.docs.forEach((doc) => {
      const resultData = doc.data();
      if (studentIds && !studentIds.includes(resultData.studentId)) {
        return;
      }

      batch.update(doc.ref, {
        isPublished: true,
        status: 'published',
        publishedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      publishedCount++;
    });

    await batch.commit();

    // Update exam
    await admin.firestore()
      .collection('exams')
      .doc(examId)
      .update({
        resultsPublished: true,
        resultsPublishedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    // Send notifications to students
    for (const doc of resultsQuery.docs) {
      const resultData = doc.data();
      if (studentIds && !studentIds.includes(resultData.studentId)) {
        continue;
      }
      await exports.sendResultNotification({
        resultId: doc.id,
        studentId: resultData.studentId,
        examId: examId,
      }, { auth: context.auth });
    }

    return { success: true, publishedCount };
  } catch (error) {
    console.error('Error publishing results:', error);
    throw new functions.https.HttpsError('internal', 'Failed to publish results');
  }
});