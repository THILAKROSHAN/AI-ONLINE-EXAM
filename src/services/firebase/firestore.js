// Firestore Service
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  addDoc,
  serverTimestamp,
  writeBatch,
  runTransaction,
} from 'firebase/firestore';
import { db } from './config';

console.log('📦 firestore.js loaded');

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  ORGANIZATIONS: 'organizations',
  ADMINISTRATORS: 'administrators',
  STUDENTS: 'students',
  SUBJECTS: 'subjects',
  QUESTIONS: 'questions',
  EXAMS: 'exams',
  EXAM_ATTEMPTS: 'examAttempts',
  RESULTS: 'results',
  AUDIT_LOGS: 'auditLogs',
  NOTIFICATIONS: 'notifications',
  REPORTS: 'reports',
  SETTINGS: 'settings',
  QUESTION_BANK: 'questionBank',
};

// CRUD Operations
export const createDocument = async (collectionName, data, id = null) => {
  try {
    const docRef = id 
      ? doc(db, collectionName, id)
      : doc(collection(db, collectionName));
    
    const docData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(docRef, docData);
    return { success: true, id: docRef.id, data: docData };
  } catch (error) {
    console.error(`❌ Error creating document:`, error);
    return { success: false, error: error.message };
  }
};

export const getDocument = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return { success: false, error: 'Document not found' };
    }
    
    return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
  } catch (error) {
    console.error(`❌ Error reading document:`, error);
    return { success: false, error: error.message };
  }
};

export const updateDocument = async (collectionName, id, data) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error(`❌ Error updating document:`, error);
    return { success: false, error: error.message };
  }
};

export const deleteDocument = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error(`❌ Error deleting document:`, error);
    return { success: false, error: error.message };
  }
};

// Query Operations
export const queryDocuments = async (collectionName, conditions = [], orderByField = null, orderDirection = 'asc', limitCount = null) => {
  try {
    let q = collection(db, collectionName);
    
    conditions.forEach((condition) => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });
    
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: results };
  } catch (error) {
    console.error(`❌ Error querying:`, error);
    return { success: false, error: error.message };
  }
};

export const getAllDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: results };
  } catch (error) {
    console.error(`❌ Error getting all documents:`, error);
    return { success: false, error: error.message };
  }
};

// Real-time Listeners
export const listenToDocument = (collectionName, id, callback) => {
  const docRef = doc(db, collectionName, id);
  return onSnapshot(docRef, 
    (docSnap) => {
      if (docSnap.exists()) {
        callback({ success: true, data: { id: docSnap.id, ...docSnap.data() } });
      } else {
        callback({ success: false, error: 'Document not found' });
      }
    },
    (error) => {
      console.error(`❌ Error listening to document:`, error);
      callback({ success: false, error: error.message });
    }
  );
};

export const listenToCollection = (collectionName, conditions = [], orderByField = null, orderDirection = 'asc', callback) => {
  let q = collection(db, collectionName);
  
  conditions.forEach((condition) => {
    q = query(q, where(condition.field, condition.operator, condition.value));
  });
  
  if (orderByField) {
    q = query(q, orderBy(orderByField, orderDirection));
  }
  
  return onSnapshot(q,
    (querySnapshot) => {
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      callback({ success: true, data: results });
    },
    (error) => {
      console.error(`❌ Error listening to collection:`, error);
      callback({ success: false, error: error.message });
    }
  );
};

// Batch Operations
export const batchWrite = async (operations) => {
  try {
    const batch = writeBatch(db);
    
    operations.forEach((op) => {
      const docRef = op.id 
        ? doc(db, op.collection, op.id)
        : doc(collection(db, op.collection));
      
      switch (op.type) {
        case 'set':
          batch.set(docRef, { ...op.data, updatedAt: serverTimestamp() });
          break;
        case 'update':
          batch.update(docRef, { ...op.data, updatedAt: serverTimestamp() });
          break;
        case 'delete':
          batch.delete(docRef);
          break;
        default:
          throw new Error(`Unknown operation type: ${op.type}`);
      }
    });
    
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('❌ Batch operation error:', error);
    return { success: false, error: error.message };
  }
};

// Transaction Operations
export const runTransactionOperation = async (transactionFunction) => {
  try {
    const result = await runTransaction(db, transactionFunction);
    return { success: true, result };
  } catch (error) {
    console.error('❌ Transaction error:', error);
    return { success: false, error: error.message };
  }
};

export { db };