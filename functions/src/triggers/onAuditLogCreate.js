// Audit Log Create Trigger
const admin = require('firebase-admin');

exports.onAuditLogCreate = functions.firestore
  .document('auditLogs/{logId}')
  .onCreate(async (snap, context) => {
    const logData = snap.data();
    const logId = context.params.logId;

    try {
      // Log to console for monitoring
      console.log(`📋 Audit Log Created: ${logId}`);
      console.log(`   Action: ${logData.action}`);
      console.log(`   Type: ${logData.actionType}`);
      console.log(`   Target: ${logData.targetType} - ${logData.targetId}`);
      console.log(`   Performed By: ${logData.performedByEmail} (${logData.performedBy})`);
      console.log(`   Status: ${logData.status}`);

      // Check for suspicious activity
      if (logData.status === 'failure') {
        console.warn(`⚠️ Failed action: ${logData.action}`);
        console.warn(`   Error: ${logData.error}`);

        // Alert on multiple failures
        const recentFailures = await admin.firestore()
          .collection('auditLogs')
          .where('performedBy', '==', logData.performedBy)
          .where('status', '==', 'failure')
          .where('createdAt', '>=', new Date(Date.now() - 5 * 60 * 1000))
          .get();

        if (recentFailures.size >= 5) {
          console.error(`🚨 Multiple failures detected for user: ${logData.performedBy}`);

          // Send alert email (if configured)
          // await sendAlertEmail(logData.performedByEmail, 'Multiple failed attempts detected');
        }
      }

      // Update user stats
      if (logData.performedBy) {
        const userRef = admin.firestore()
          .collection('users')
          .doc(logData.performedBy);

        await userRef.update({
          lastActivity: admin.firestore.FieldValue.serverTimestamp(),
          [`stats.${logData.actionType}`]: admin.firestore.FieldValue.increment(1),
          totalActions: admin.firestore.FieldValue.increment(1),
        });
      }

      // Update organization stats
      if (logData.organizationId) {
        const orgRef = admin.firestore()
          .collection('organizations')
          .doc(logData.organizationId);

        await orgRef.update({
          [`auditStats.${logData.actionType}`]: admin.firestore.FieldValue.increment(1),
          totalAuditLogs: admin.firestore.FieldValue.increment(1),
          lastAuditAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      // Clean up old logs (keep last 30 days)
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);

      const oldLogs = await admin.firestore()
        .collection('auditLogs')
        .where('createdAt', '<=', cutoff)
        .limit(100)
        .get();

      if (oldLogs.size > 0) {
        const batch = admin.firestore().batch();
        oldLogs.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        console.log(`🧹 Cleaned up ${oldLogs.size} old audit logs`);
      }

    } catch (error) {
      console.error('Error processing audit log:', error);
    }
  });