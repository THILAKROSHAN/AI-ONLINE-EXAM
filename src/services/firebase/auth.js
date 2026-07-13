// Firebase Authentication Service
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  updatePassword,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { auth } from './config';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './config';

console.log('📦 auth.js loaded');

// Set persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log('✅ Auth persistence set to local'))
  .catch((error) => console.warn('⚠️ Auth persistence warning:', error));

// ==================== SUPER ADMIN CREATION ====================

export const createSuperAdmin = async (email, password, userData) => {
  console.log('📝 Creating Super Admin:', email);

  try {
    const usersQuery = query(collection(db, 'users'), where('role', '==', 'super_admin'));
    const usersSnapshot = await getDocs(usersQuery);

    if (!usersSnapshot.empty) {
      return { success: false, error: 'Super Admin already exists' };
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('✅ Super Admin Firebase user created:', user.uid);

    if (userData.displayName) {
      await updateProfile(user, {
        displayName: userData.displayName,
        photoURL: userData.photoURL || null,
      });
    }

    const userDoc = {
      uid: user.uid,
      email: user.email,
      displayName: userData.displayName || '',
      photoURL: userData.photoURL || '',
      role: 'super_admin',
      organizationId: null,
      isActive: true,
      emailVerified: user.emailVerified,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', user.uid), userDoc);
    console.log('✅ Super Admin user document created');

    await setDoc(doc(db, 'admins', user.uid), {
      uid: user.uid,
      name: userData.displayName || '',
      email: email,
      phone: userData.phone || '',
      role: 'super_admin',
      organizationId: null,
      permissions: ['all'],
      isActive: true,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Super Admin admin document created');

    if (userData.sendVerification !== false) {
      await sendEmailVerification(user);
    }

    return { success: true, user, userData: userDoc };
  } catch (error) {
    console.error('❌ Super Admin creation error:', error);
    return { success: false, error: error.message, code: error.code };
  }
};

// ==================== ADMIN CREATION ====================

export const createAdmin = async (adminData, password) => {
  console.log('📝 Creating Admin:', adminData.email);

  try {
    const adminsQuery = query(
      collection(db, 'admins'),
      where('organizationId', '==', adminData.organizationId),
      where('isActive', '==', true)
    );
    const adminsSnapshot = await getDocs(adminsQuery);

    if (adminsSnapshot.size >= 5) {
      return { success: false, error: 'Maximum 5 admins allowed per organization' };
    }

    const userCredential = await createUserWithEmailAndPassword(auth, adminData.email, password);
    const user = userCredential.user;
    console.log('✅ Admin Firebase user created:', user.uid);

    if (adminData.displayName) {
      await updateProfile(user, {
        displayName: adminData.displayName,
        photoURL: adminData.photoURL || null,
      });
    }

    const userDoc = {
      uid: user.uid,
      email: user.email,
      displayName: adminData.displayName || '',
      photoURL: adminData.photoURL || '',
      role: 'admin',
      organizationId: adminData.organizationId,
      isActive: true,
      emailVerified: user.emailVerified,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: null,
    };

    await setDoc(doc(db, 'users', user.uid), userDoc);
    console.log('✅ Admin user document created');

    await setDoc(doc(db, 'admins', user.uid), {
      uid: user.uid,
      name: adminData.displayName || '',
      email: adminData.email,
      phone: adminData.phone || '',
      role: 'admin',
      organizationId: adminData.organizationId,
      permissions: adminData.permissions || [],
      department: adminData.department || '',
      title: adminData.title || '',
      isActive: true,
      createdBy: adminData.createdBy,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Admin admin document created');

    return { success: true, user, userData: userDoc };
  } catch (error) {
    console.error('❌ Admin creation error:', error);
    return { success: false, error: error.message, code: error.code };
  }
};

// ==================== STUDENT CREATION ====================

export const createStudent = async (studentData, password) => {
  console.log('📝 Creating Student:', studentData.email);

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, studentData.email, password);
    const user = userCredential.user;
    console.log('✅ Student Firebase user created:', user.uid);

    if (studentData.displayName) {
      await updateProfile(user, {
        displayName: studentData.displayName,
        photoURL: studentData.photoURL || null,
      });
    }

    const userDoc = {
      uid: user.uid,
      email: user.email,
      displayName: studentData.displayName || '',
      photoURL: studentData.photoURL || '',
      role: 'student',
      organizationId: studentData.organizationId,
      isActive: true,
      emailVerified: user.emailVerified,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: null,
    };

    await setDoc(doc(db, 'users', user.uid), userDoc);
    console.log('✅ Student user document created');

    await setDoc(doc(db, 'students', user.uid), {
      uid: user.uid,
      name: studentData.displayName || '',
      email: studentData.email,
      phone: studentData.phone || '',
      studentId: studentData.studentId || `STU${Date.now().toString().slice(-6)}`,
      organizationId: studentData.organizationId,
      department: studentData.department || '',
      semester: studentData.semester || '',
      year: studentData.year || '',
      course: studentData.course || '',
      batch: studentData.batch || '',
      rollNumber: studentData.rollNumber || '',
      dateOfBirth: studentData.dateOfBirth || '',
      gender: studentData.gender || '',
      address: studentData.address || '',
      city: studentData.city || '',
      state: studentData.state || '',
      country: studentData.country || '',
      postalCode: studentData.postalCode || '',
      parentName: studentData.parentName || '',
      parentPhone: studentData.parentPhone || '',
      parentEmail: studentData.parentEmail || '',
      profilePhoto: studentData.profilePhoto || '',
      createdBy: studentData.createdBy,
      isActive: true,
      enrolledDate: new Date(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      totalExams: 0,
      averageScore: 0,
    });
    console.log('✅ Student document created');

    return { success: true, user, userData: userDoc };
  } catch (error) {
    console.error('❌ Student creation error:', error);
    return { success: false, error: error.message, code: error.code };
  }
};

// ==================== LOGIN ====================

export const loginUser = async (email, password) => {
  console.log('🔑 Login attempt:', email);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('✅ Authenticated:', user.uid);

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      console.log('❌ User document not found');
      await signOut(auth);
      return { success: false, error: 'User not found', code: 'auth/user-not-found' };
    }

    const userData = userDoc.data();
    console.log('📋 User data retrieved, role:', userData.role);

    if (!userData.isActive) {
      console.log('❌ Account is deactivated');
      await signOut(auth);
      return { success: false, error: 'Account is deactivated', code: 'auth/account-disabled' };
    }

    await updateDoc(doc(db, 'users', user.uid), {
      lastLogin: serverTimestamp(),
    });

    console.log('✅ Login successful');
    return { success: true, user, userData };
  } catch (error) {
    console.error('❌ Login error:', error);
    return { success: false, error: error.message, code: error.code };
  }
};

// ==================== GOOGLE SIGN-IN - SIMPLIFIED ====================

// Process Google sign-in result
const processGoogleSignInResult = async (user) => {
  console.log('👤 Processing Google user:', user.email);
  console.log('🆔 UID:', user.uid);

  const userDoc = await getDoc(doc(db, 'users', user.uid));

  if (userDoc.exists()) {
    const userData = userDoc.data();
    console.log('📋 Existing user, role:', userData.role);

    if (!userData.isActive) {
      console.log('❌ Account is deactivated');
      await signOut(auth);
      return { success: false, error: 'Account is deactivated', code: 'auth/account-disabled' };
    }

    await updateDoc(doc(db, 'users', user.uid), {
      lastLogin: serverTimestamp(),
    });

    console.log('✅ Existing user logged in via Google');
    return { success: true, user, userData };
  } else {
    const usersQuery = query(collection(db, 'users'));
    const usersSnapshot = await getDocs(usersQuery);

    if (usersSnapshot.empty) {
      console.log('👑 First user - creating Super Admin');

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        role: 'super_admin',
        organizationId: null,
        isActive: true,
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      console.log('✅ Super Admin user document created');

      await setDoc(doc(db, 'admins', user.uid), {
        uid: user.uid,
        name: user.displayName || '',
        email: user.email,
        phone: '',
        role: 'super_admin',
        organizationId: null,
        permissions: ['all'],
        isActive: true,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log('✅ Super Admin admin document created');

      return { success: true, user, userData };
    } else {
      console.log('❌ New user attempted self-registration via Google');
      await signOut(auth);
      return {
        success: false,
        error: 'Self-registration is not allowed. Please contact your administrator.',
        code: 'auth/self-registration-not-allowed'
      };
    }
  }
};

// Google Sign-In with Popup
export const googleSignInPopup = async () => {
  console.log('🔄 Starting Google Sign-In popup...');

  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ 
      prompt: 'select_account',
    });

    console.log('📤 Opening Google Sign-In popup...');
    const result = await signInWithPopup(auth, provider);
    console.log('✅ Google popup successful!');
    return await processGoogleSignInResult(result.user);
  } catch (error) {
    console.error('❌ Google popup error:', error);
    
    let errorMessage = error.message;
    let errorCode = error.code;

    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed. Please try again.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Pop-up was blocked. Please allow popups for this site and try again.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Multiple sign-in requests. Please try again.';
    }

    return { success: false, error: errorMessage, code: errorCode };
  }
};

// Google Sign-In with Redirect (Fallback)
export const googleSignInRedirect = async () => {
  console.log('🔄 Starting Google Sign-In redirect...');

  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ 
      prompt: 'select_account',
    });

    await signInWithRedirect(auth, provider);
    console.log('🔄 Redirecting to Google...');
    return { success: true, redirecting: true };
  } catch (error) {
    console.error('❌ Google redirect error:', error);
    return { success: false, error: error.message };
  }
};

// Handle Redirect Result
export const handleRedirectResult = async () => {
  console.log('🔄 Processing redirect result...');

  try {
    const result = await getRedirectResult(auth);
    if (!result) {
      console.log('ℹ️ No redirect result found');
      return { success: false, noResult: true };
    }

    console.log('✅ Redirect result found!');
    return await processGoogleSignInResult(result.user);
  } catch (error) {
    console.error('❌ Redirect error:', error);
    return { success: false, error: error.message, code: error.code };
  }
};

// Main Google Sign-In - Try popup first, then redirect
export const googleSignIn = async () => {
  console.log('🔄 Starting Google Sign-In...');
  
  // Try popup first
  const popupResult = await googleSignInPopup();
  
  // If popup was blocked or closed, try redirect
  if (!popupResult.success && 
      (popupResult.code === 'auth/popup-blocked' || 
       popupResult.code === 'auth/popup-closed-by-user' ||
       popupResult.code === 'auth/cancelled-popup-request')) {
    console.log('🔄 Popup failed, falling back to redirect...');
    return await googleSignInRedirect();
  }
  
  return popupResult;
};

// ==================== LOGOUT ====================

export const logoutUser = async () => {
  console.log('🔓 Logging out...');
  try {
    await signOut(auth);
    console.log('✅ Logged out successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Logout error:', error);
    return { success: false, error: error.message };
  }
};

// ==================== PASSWORD RESET ====================

export const sendPasswordReset = async (email) => {
  console.log('📧 Sending password reset to:', email);
  try {
    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/reset-password`,
      handleCodeInApp: true,
    });
    console.log('✅ Password reset email sent');
    return { success: true };
  } catch (error) {
    console.error('❌ Password reset error:', error);
    return { success: false, error: error.message, code: error.code };
  }
};

export const verifyResetCode = async (code) => {
  try {
    const email = await verifyPasswordResetCode(auth, code);
    console.log('✅ Reset code verified for:', email);
    return { success: true, email };
  } catch (error) {
    console.error('❌ Code verification error:', error);
    return { success: false, error: error.message };
  }
};

export const resetPassword = async (code, newPassword) => {
  try {
    await confirmPasswordReset(auth, code, newPassword);
    console.log('✅ Password reset successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Password reset error:', error);
    return { success: false, error: error.message, code: error.code };
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    await signInWithEmailAndPassword(auth, user.email, currentPassword);
    await updatePassword(user, newPassword);
    console.log('✅ Password changed successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Password change error:', error);
    return { success: false, error: error.message, code: error.code };
  }
};

// ==================== PROFILE UPDATE ====================

export const updateUserProfile = async (displayName, photoURL) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    await updateProfile(user, { displayName, photoURL });
    await updateDoc(doc(db, 'users', user.uid), {
      displayName,
      photoURL,
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Profile updated successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Profile update error:', error);
    return { success: false, error: error.message };
  }
};

// ==================== GET CURRENT USER DATA ====================

export const getCurrentUserData = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log('ℹ️ No user logged in');
      return { success: false, error: 'No user logged in' };
    }

    console.log('🔍 Fetching user data for:', user.uid);
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      console.log('❌ User document not found');
      return { success: false, error: 'User document not found' };
    }

    const userData = userDoc.data();
    const validRoles = ['super_admin', 'admin', 'student'];
    if (!userData.role || !validRoles.includes(userData.role)) {
      console.log('❌ Invalid user role:', userData.role);
      return { success: false, error: 'Invalid user role' };
    }

    console.log('✅ User data fetched, role:', userData.role);
    return { success: true, data: userData };
  } catch (error) {
    console.error('❌ Error fetching user data:', error);
    return { success: false, error: error.message };
  }
};

// ==================== AUTH STATE OBSERVER ====================

export const onAuthStateChange = (callback) => {
  console.log('👀 Setting up auth state listener...');

  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    console.log('🔥🔥🔥 AUTH STATE CHANGED 🔥🔥🔥');
    console.log('🔄 User:', user ? user.email : 'No user');

    if (user) {
      try {
        console.log('🔍 Fetching Firestore document for:', user.uid);
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log('📋 Firestore data found, role:', userData.role);

          const validRoles = ['super_admin', 'admin', 'student'];
          if (userData.role && validRoles.includes(userData.role)) {
            console.log('✅ Valid role detected:', userData.role);
            callback({ user, userData });
          } else {
            console.log('❌ Invalid role, logging out:', userData.role);
            await signOut(auth);
            callback({ user: null, userData: null });
          }
        } else {
          console.log('❌ No Firestore document found, logging out');
          await signOut(auth);
          callback({ user: null, userData: null });
        }
      } catch (error) {
        console.error('❌ Error in auth state change:', error);
        callback({ user, userData: null });
      }
    } else {
      console.log('🔓 No user logged in');
      callback({ user: null, userData: null });
    }
  });

  console.log('✅ Auth listener set up successfully');
  return unsubscribe;
};

// ==================== ROLE HELPERS ====================

export const hasRole = (userData, role) => {
  if (!userData) return false;
  return userData.role === role;
};

export const hasAnyRole = (userData, roles) => {
  if (!userData) return false;
  return roles.includes(userData.role);
};

export const isUserActive = (userData) => {
  if (!userData) return false;
  return userData.isActive !== false;
};

export const belongsToOrganization = (userData, organizationId) => {
  if (!userData) return false;
  return userData.organizationId === organizationId;
};

export const isSuperAdmin = (userData) => {
  if (!userData) return false;
  return userData.role === 'super_admin';
};

export const isAdmin = (userData) => {
  if (!userData) return false;
  return userData.role === 'admin' || userData.role === 'super_admin';
};

export const isStudent = (userData) => {
  if (!userData) return false;
  return userData.role === 'student';
};

export { auth };