// Cloud Function: On User Delete
const admin = require('firebase-admin');

exports.onUserDelete = functions.auth.user().onDelete(async (user) => {
  try {
    const { uid, email } = user;

    console.log(`🗑️ User deleted: ${email} (${uid})`);

    // Delete user document from Firestore
    await admin.firestore()
      .collection('users')
      .doc(uid)
      .delete();

    console.log(`✅ User document deleted: ${uid}`);

    // Delete student document if exists
    const studentDoc = await admin.firestore()
      .collection('students')
      .doc(uid)
      .get();

    if (studentDoc.exists) {
      await admin.firestore()
        .collection('students')
        .doc(uid)
        .delete();
      console.log(`✅ Student document deleted: ${uid}`);
    }

    // Delete admin document if exists
    const adminDoc = await admin.firestore()
      .collection('administrators')
      .doc(uid)
      .get();

    if (adminDoc.exists) {
      await admin.firestore()
        .collection('administrators')
        .doc(uid)
        .delete();
      console.log(`✅ Admin document deleted: ${uid}`);
    }

    // Log audit
    await admin.firestore().collection('auditLogs').add({
      action: 'user_deleted',
      actionType: 'delete',
      targetType: 'user',
      targetId: uid,
      status: 'success',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: {
        email: email,
      },
    });

  } catch (error) {
    console.error('❌ Error in onUserDelete:', error);
  }
});

module.exports = exports;