// Cloud Functions Helpers
const fs = require('fs');
const path = require('path');

exports.getEmailTemplate = (templateName, data) => {
  try {
    const templatePath = path.join(__dirname, '../emails/templates', `${templateName}.html`);
    let html = fs.readFileSync(templatePath, 'utf8');

    // Replace template variables
    for (const [key, value] of Object.entries(data)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, value);
    }

    return html;
  } catch (error) {
    console.error(`Error loading email template ${templateName}:`, error);
    return `<p>Error loading email template. Please contact support.</p>`;
  }
};

exports.generateRandomString = (length = 12) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

exports.formatDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

exports.getDocument = async (collection, id) => {
  const admin = require('firebase-admin');
  const doc = await admin.firestore()
    .collection(collection)
    .doc(id)
    .get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

exports.getDocuments = async (collection, conditions = []) => {
  const admin = require('firebase-admin');
  let query = admin.firestore().collection(collection);

  for (const condition of conditions) {
    query = query.where(condition.field, condition.operator, condition.value);
  }

  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

exports.updateDocument = async (collection, id, data) => {
  const admin = require('firebase-admin');
  await admin.firestore()
    .collection(collection)
    .doc(id)
    .update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
};

exports.createDocument = async (collection, data) => {
  const admin = require('firebase-admin');
  const docRef = await admin.firestore()
    .collection(collection)
    .add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  return docRef.id;
};

exports.logAudit = async (auditData) => {
  const admin = require('firebase-admin');
  await admin.firestore()
    .collection('auditLogs')
    .add({
      ...auditData,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
};

exports.sendEmail = async (to, subject, html) => {
  const admin = require('firebase-admin');
  await admin.firestore()
    .collection('mail')
    .add({
      to: to,
      message: {
        subject: subject,
        html: html,
      },
    });
};

exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

exports.isValidPhone = (phone) => {
  const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
  return phoneRegex.test(phone);
};

exports.isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

module.exports = exports;