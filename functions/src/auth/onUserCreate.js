// Cloud Function: On User Create
const admin = require('firebase-admin');

exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    const { uid, email, displayName, photoURL } = user;

    console.log(`📝 New user created: ${email} (${uid})`);

    // Check if user already exists in Firestore
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(uid)
      .get();

    if (userDoc.exists) {
      console.log(`ℹ️ User already exists in Firestore: ${uid}`);
      return;
    }

    // Create default user document
    const userData = {
      uid: uid,
      email: email || '',
      displayName: displayName || '',
      photoURL: photoURL || '',
      role: 'student', // Default role
      organizationId: null,
      isActive: true,
      emailVerified: user.emailVerified || false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      totalExams: 0,
      averageScore: 0,
    };

    await admin.firestore()
      .collection('users')
      .doc(uid)
      .set(userData);

    console.log(`✅ User document created for: ${email}`);

    // Log audit
    await admin.firestore().collection('auditLogs').add({
      action: 'user_created',
      actionType: 'create',
      targetType: 'user',
      targetId: uid,
      performedBy: uid,
      performedByEmail: email,
      status: 'success',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: {
        email: email,
        displayName: displayName,
      },
    });

  } catch (error) {
    console.error('❌ Error in onUserCreate:', error);
  }
});

module.exports = exports;