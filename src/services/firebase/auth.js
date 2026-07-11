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
  browserSessionPersistence,
  inMemoryPersistence,
} from 'firebase/auth';
import { auth } from './config';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export const setAuthPersistence = async (type = 'local') => {
  try {
    let persistence;
    switch (type) {
      case 'session': persistence = browserSessionPersistence; break;
      case 'none': persistence = inMemoryPersistence; break;
      default: persistence = browserLocalPersistence;
    }
    await setPersistence(auth, persistence);
    console.log('✅ Auth persistence set to:', type);
    return { success: true };
  } catch (error) {
    console.warn('⚠️ Auth persistence warning:', error);
    return { success: false, error: error.message };
  }
};

export const registerAdmin = async (email, password, adminData) => {
  console.log('📝 Registering admin:', email);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('✅ Admin user created:', user.uid);

    if (adminData.displayName) {
      await updateProfile(user, { displayName: adminData.displayName, photoURL: adminData.photoURL || null });
    }

    const userDoc = {
      uid: user.uid,
      email: user.email,
      displayName: adminData.displayName || '',
      photoURL: adminData.photoURL || '',
      role: 'admin',
      organizationId: adminData.organizationId || null,
      isActive: true,
      emailVerified: user.emailVerified,
      createdBy: adminData.createdBy || user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', user.uid), userDoc);
    console.log('✅ Admin Firestore document created');

    if (adminData.sendVerification !== false) {
      await sendEmailVerification(user);
    }

    return { success: true, user, userData: userDoc };
  } catch (error) {
    console.error('❌ Admin registration error:', error);
    return { success: false, error: error.message, code: error.code };
  }
};

export const loginAdmin = async (email, password) => {
  console.log('🔑 Admin login attempt:', email);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('✅ Admin authenticated:', user.uid);

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      console.log('❌ User document not found');
      await signOut(auth);
      return { success: false, error: 'User not found', code: 'auth/user-not-found' };
    }

    const userData = userDoc.data();
    console.log('📋 User data retrieved, role:', userData.role);

    if (userData.role !== 'admin' && userData.role !== 'super_admin') {
      console.log('❌ Invalid role for admin login:', userData.role);
      await signOut(auth);
      return { success: false, error: 'Access denied', code: 'auth/unauthorized' };
    }

    if (!userData.isActive) {
      console.log('❌ Account is deactivated');
      await signOut(auth);
      return { success: false, error: 'Account is deactivated', code: 'auth/account-disabled' };
    }

    await updateDoc(doc(db, 'users', user.uid), { lastLogin: serverTimestamp() });
    console.log('✅ Admin login successful');
    return { success: true, user, userData };
  } catch (error) {
    console.error('❌ Admin login error:', error);
    return { success: false, error: error.message, code: error.code };
  }
};

export const loginStudent = async (email, password) => {
  console.log('🔑 Student login attempt:', email);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('✅ Student authenticated:', user.uid);

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      console.log('❌ Student document not found');
      await signOut(auth);
      return { 
        success: false, 
        error: 'Student account not found', 
        code: 'auth/student-not-found' 
      };
    }

    const userData = userDoc.data();
    console.log('📋 User data retrieved, role:', userData.role);

    if (userData.role !== 'student') {
      console.log('❌ Invalid role for student login:', userData.role);
      await signOut(auth);
      return { 
        success: false, 
        error: 'Access denied', 
        code: 'auth/unauthorized' 
      };
    }

    if (!userData.isActive) {
      console.log('❌ Account is deactivated');
      await signOut(auth);
      return { 
        success: false, 
        error: 'Account is deactivated', 
        code: 'auth/account-disabled' 
      };
    }

    await updateDoc(doc(db, 'users', user.uid), { lastLogin: serverTimestamp() });
    console.log('✅ Student login successful');
    return { success: true, user, userData };
  } catch (error) {
    console.error('❌ Student login error:', error);
    return { success: false, error: error.message, code: error.code };
  }
};

export const createStudentAccount = async (studentData, password) => {
  console.log('📝 Creating student account:', studentData.email);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, studentData.email, password);
    const user = userCredential.user;
    console.log('✅ Student user created:', user.uid);

    if (studentData.displayName) {
      await updateProfile(user, { displayName: studentData.displayName, photoURL: studentData.photoURL || null });
    }

    const userDoc = {
      uid: user.uid,
      email: user.email,
      displayName: studentData.displayName || '',
      photoURL: studentData.photoURL || '',
      role: 'student',
      organizationId: studentData.organizationId,
      createdBy: studentData.createdBy,
      isActive: true,
      emailVerified: user.emailVerified,
      studentId: studentData.studentId || '',
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
      enrolledDate: new Date(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLogin: null,
      totalExams: 0,
      averageScore: 0,
    };

    await setDoc(doc(db, 'users', user.uid), userDoc);
    await setDoc(doc(db, 'students', user.uid), userDoc);
    console.log('✅ Student Firestore documents created');

    return { success: true, user, userData: userDoc };
  } catch (error) {
    console.error('❌ Student creation error:', error);
    return { success: false, error: error.message, code: error.code };
  }
};

// ==================== GOOGLE SIGN-IN ====================

export const adminGoogleSignIn = async () => {
  console.log('🔄 Starting Google Sign-In redirect...');
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ 
      prompt: 'select_account',
    });
    await signInWithRedirect(auth, provider);
    console.log('🔄 Redirect initiated to Google');
    return { success: true, redirecting: true };
  } catch (error) {
    console.error('❌ Admin Google sign-in redirect error:', error);
    return { success: false, error: error.message };
  }
};

export const adminGoogleSignInPopup = async () => {
  console.log('🔄 Starting Google Sign-In popup...');
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ 
      prompt: 'select_account',
    });
    const result = await signInWithPopup(auth, provider);
    console.log('✅ Google popup successful:', result.user.uid);
    
    const user = result.user;
    console.log('👤 User from popup:', user.email);
    
    // Check if user exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('📋 Existing user data, role:', userData.role);
      
      if (userData.role !== 'admin' && userData.role !== 'super_admin') {
        console.log('❌ Invalid role for admin:', userData.role);
        await signOut(auth);
        return { 
          success: false, 
          error: 'Access denied. Admin privileges required.', 
          code: 'auth/unauthorized' 
        };
      }
      
      if (!userData.isActive) {
        console.log('❌ Account is deactivated');
        await signOut(auth);
        return { 
          success: false, 
          error: 'Account is deactivated. Please contact administrator.', 
          code: 'auth/account-disabled' 
        };
      }
      
      await updateDoc(doc(db, 'users', user.uid), { lastLogin: serverTimestamp() });
      console.log('✅ Admin login successful via popup');
      return { success: true, user, userData };
    } else {
      console.log('🆕 New admin user from Google, creating Firestore document...');
      const adminData = {
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        role: 'admin',
        organizationId: null,
        isActive: true,
        emailVerified: user.emailVerified,
        createdBy: user.uid,
      };

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        ...adminData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
      console.log('✅ New admin Firestore document created');

      return { success: true, user, userData: adminData };
    }
  } catch (error) {
    console.error('❌ Admin Google sign-in popup error:', error);
    let errorMessage = error.message;
    let errorCode = error.code;
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in popup was closed. Please try again.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMessage = 'Multiple sign-in requests. Please try again.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Pop-up was blocked. Please allow popups or use the redirect method.';
    }
    
    return { success: false, error: errorMessage, code: errorCode };
  }
};

// ==================== HANDLE REDIRECT RESULT ====================

export const handleRedirectResult = async () => {
  console.log('🔄 Processing redirect result...');
  try {
    const result = await getRedirectResult(auth);
    if (!result) {
      console.log('ℹ️ No redirect result found');
      return { success: false, noResult: true };
    }

    const user = result.user;
    console.log('👤 User from redirect:', user.email);

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      console.log('❌ User document not found in Firestore');
      await signOut(auth);
      return { success: false, error: 'You are not authorized.', code: 'auth/unauthorized' };
    }

    const userData = userDoc.data();
    console.log('📋 User data from Firestore:', { 
      role: userData.role, 
      isActive: userData.isActive,
      email: userData.email 
    });
    
    const validRoles = ['super_admin', 'admin', 'student'];
    if (!userData.role || !validRoles.includes(userData.role)) {
      console.log('❌ Invalid role:', userData.role);
      await signOut(auth);
      return { success: false, error: 'You are not authorized.', code: 'auth/unauthorized' };
    }

    if (userData.isActive === false) {
      console.log('❌ Account is deactivated');
      await signOut(auth);
      return { success: false, error: 'Account is deactivated.', code: 'auth/account-disabled' };
    }

    // Check role-specific access
    if (userData.role !== 'admin' && userData.role !== 'super_admin') {
      console.log('❌ Not an admin role:', userData.role);
      await signOut(auth);
      return { success: false, error: 'Access denied. Admin privileges required.', code: 'auth/unauthorized' };
    }

    await updateDoc(doc(db, 'users', user.uid), { lastLogin: serverTimestamp() });
    console.log('✅ Admin login successful via redirect');
    return { success: true, user, userData };
  } catch (error) {
    console.error('❌ Redirect error:', error);
    return { success: false, error: error.message, code: error.code };
  }
};

export const logoutUser = async () => {
  console.log('🔓 Logging out user...');
  try {
    await signOut(auth);
    console.log('✅ User logged out successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Logout error:', error);
    return { success: false, error: error.message };
  }
};

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

export const updateUserProfile = async (displayName, photoURL) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    await updateProfile(user, { displayName, photoURL });
    await updateDoc(doc(db, 'users', user.uid), { displayName, photoURL, updatedAt: serverTimestamp() });
    console.log('✅ Profile updated successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Profile update error:', error);
    return { success: false, error: error.message };
  }
};

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

export const onAuthStateChange = (callback) => {
  console.log('👀 Setting up auth state listener...');
  return onAuthStateChanged(auth, async (user) => {
    console.log('🔄 Auth state changed:', user ? `User: ${user.email}` : 'No user');
    
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
};

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

export const isAdmin = (userData) => {
  if (!userData) return false;
  return ['super_admin', 'admin'].includes(userData.role);
};

export const isStudent = (userData) => {
  if (!userData) return false;
  return userData.role === 'student';
};

export { auth };