// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

console.log('🔧 Firebase Config loading...');

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

console.log('🔧 Firebase Config loaded:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey,
});

let app;
let auth;
let db;
let storage;
let functions;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  // Set persistence once here with error handling
  setPersistence(auth, browserLocalPersistence)
    .then(() => console.log('✅ Auth persistence set to local'))
    .catch((error) => console.warn('⚠️ Auth persistence warning:', error));

  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);

  console.log('✅ Firebase initialized successfully');
  console.log(`📦 Project: ${firebaseConfig.projectId}`);
  console.log('🔐 Auth instance created:', !!auth);
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

export { app, auth, db, storage, functions, firebaseConfig };