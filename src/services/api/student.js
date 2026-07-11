// Student API Service
import { 
  createDocument, 
  getDocument, 
  updateDocument, 
  deleteDocument, 
  queryDocuments,
  getAllDocuments,
  COLLECTIONS 
} from '../firebase/firestore';
import { callFunction } from '../firebase/functions';
import { createStudentAccount } from '../firebase/auth'; // Changed from registerUser
import { uploadFile, generateFilePath } from '../firebase/storage';

// Create a new student
export const createStudent = async (studentData, password) => {
  try {
    // Generate student ID
    const idResult = await callFunction('generateStudentId', { 
      organizationId: studentData.organizationId 
    });
    
    if (!idResult.success) {
      return { success: false, error: 'Failed to generate student ID' };
    }

    const studentId = idResult.data.studentId;

    // Create Firebase Auth user using createStudentAccount
    const authResult = await createStudentAccount(
      {
        displayName: studentData.name,
        email: studentData.email,
        phone: studentData.phone || '',
        organizationId: studentData.organizationId,
        createdBy: studentData.createdBy || null,
        studentId: studentId,
        rollNumber: studentData.rollNumber || '',
        department: studentData.department || '',
        semester: studentData.semester || '',
        year: studentData.year || '',
        course: studentData.course || '',
        batch: studentData.batch || '',
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
      },
      password
    );

    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const user = authResult.user;
    const userData = authResult.userData;

    // Create student document (additional student-specific data)
    const studentDocData = {
      uid: user.uid,
      studentId: studentId,
      name: studentData.name,
      email: studentData.email,
      phone: studentData.phone || '',
      organizationId: studentData.organizationId,
      department: studentData.department || '',
      semester: studentData.semester || '',
      year: studentData.year || '',
      course: studentData.course || '',
      batch: studentData.batch || '',
      rollNumber: studentData.rollNumber || '',
      dateOfBirth: studentData.dateOfBirth || null,
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
      isActive: true,
      enrolledDate: new Date(),
      createdBy: studentData.createdBy || null,
      lastLogin: null,
      totalExams: 0,
      averageScore: 0,
      subjects: studentData.subjects || [],
      metadata: studentData.metadata || {},
    };

    const result = await createDocument(COLLECTIONS.STUDENTS, studentDocData);
    
    if (result.success) {
      // Send credentials email
      await callFunction('sendStudentCredentials', {
        studentId: result.id,
        email: studentData.email,
        password: password,
        organizationId: studentData.organizationId,
      });
    }

    return result;
  } catch (error) {
    console.error('❌ Error creating student:', error);
    return { success: false, error: error.message };
  }
};

// Get student by ID
export const getStudent = async (studentId) => {
  try {
    const result = await getDocument(COLLECTIONS.STUDENTS, studentId);
    return result;
  } catch (error) {
    console.error('❌ Error getting student:', error);
    return { success: false, error: error.message };
  }
};

// Get student by UID
export const getStudentByUid = async (uid) => {
  try {
    const result = await queryDocuments(COLLECTIONS.STUDENTS, [
      { field: 'uid', operator: '==', value: uid }
    ]);
    return result;
  } catch (error) {
    console.error('❌ Error getting student by UID:', error);
    return { success: false, error: error.message };
  }
};

// Get student by student ID
export const getStudentByStudentId = async (studentId) => {
  try {
    const result = await queryDocuments(COLLECTIONS.STUDENTS, [
      { field: 'studentId', operator: '==', value: studentId }
    ]);
    return result;
  } catch (error) {
    console.error('❌ Error getting student by student ID:', error);
    return { success: false, error: error.message };
  }
};

// Update student
export const updateStudent = async (studentId, data) => {
  try {
    const result = await updateDocument(COLLECTIONS.STUDENTS, studentId, data);
    return result;
  } catch (error) {
    console.error('❌ Error updating student:', error);
    return { success: false, error: error.message };
  }
};

// Delete student
export const deleteStudent = async (studentId) => {
  try {
    const result = await deleteDocument(COLLECTIONS.STUDENTS, studentId);
    return result;
  } catch (error) {
    console.error('❌ Error deleting student:', error);
    return { success: false, error: error.message };
  }
};

// Get all students for an organization
export const getOrganizationStudents = async (organizationId, filters = {}) => {
  try {
    const conditions = [
      { field: 'organizationId', operator: '==', value: organizationId }
    ];

    if (filters.isActive !== undefined) {
      conditions.push({ field: 'isActive', operator: '==', value: filters.isActive });
    }

    if (filters.department) {
      conditions.push({ field: 'department', operator: '==', value: filters.department });
    }

    if (filters.semester) {
      conditions.push({ field: 'semester', operator: '==', value: filters.semester });
    }

    if (filters.batch) {
      conditions.push({ field: 'batch', operator: '==', value: filters.batch });
    }

    const result = await queryDocuments(
      COLLECTIONS.STUDENTS,
      conditions,
      'name',
      'asc'
    );
    return result;
  } catch (error) {
    console.error('❌ Error getting organization students:', error);
    return { success: false, error: error.message };
  }
};

// Get all students (Super Admin only)
export const getAllStudents = async () => {
  try {
    const result = await getAllDocuments(COLLECTIONS.STUDENTS);
    return result;
  } catch (error) {
    console.error('❌ Error getting all students:', error);
    return { success: false, error: error.message };
  }
};

// Toggle student status
export const toggleStudentStatus = async (studentId, isActive) => {
  try {
    const result = await updateDocument(COLLECTIONS.STUDENTS, studentId, {
      isActive: isActive,
    });
    return result;
  } catch (error) {
    console.error('❌ Error toggling student status:', error);
    return { success: false, error: error.message };
  }
};

// Upload student profile photo
export const uploadStudentPhoto = async (studentId, file) => {
  try {
    const path = generateFilePath('student_photos', file.name, studentId);
    const result = await uploadFile(file, path);
    
    if (result.success) {
      // Update student with photo URL
      await updateDocument(COLLECTIONS.STUDENTS, studentId, {
        profilePhoto: result.url,
      });
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error uploading student photo:', error);
    return { success: false, error: error.message };
  }
};

// Import students from Excel
export const importStudents = async (file, organizationId, createdBy) => {
  try {
    // Upload file
    const path = generateFilePath('student_imports', file.name);
    const uploadResult = await uploadFile(file, path);
    
    if (!uploadResult.success) {
      return { success: false, error: 'Failed to upload file' };
    }

    // Process import via Cloud Function
    const result = await callFunction('importStudentsFromExcel', {
      fileUrl: uploadResult.url,
      organizationId: organizationId,
      createdBy: createdBy,
    });

    return result;
  } catch (error) {
    console.error('❌ Error importing students:', error);
    return { success: false, error: error.message };
  }
};

// Export students to Excel
export const exportStudents = async (organizationId, filters = {}) => {
  try {
    const result = await callFunction('exportStudentsToExcel', {
      organizationId: organizationId,
      filters: filters,
    });
    return result;
  } catch (error) {
    console.error('❌ Error exporting students:', error);
    return { success: false, error: error.message };
  }
};

// Get student statistics
export const getStudentStats = async (organizationId) => {
  try {
    const studentsResult = await queryDocuments(COLLECTIONS.STUDENTS, [
      { field: 'organizationId', operator: '==', value: organizationId },
    ]);

    if (!studentsResult.success) {
      return { success: false, error: studentsResult.error };
    }

    const students = studentsResult.data;
    const stats = {
      total: students.length,
      active: students.filter(s => s.isActive).length,
      inactive: students.filter(s => !s.isActive).length,
      byDepartment: {},
      bySemester: {},
      byGender: {
        male: students.filter(s => s.gender === 'male').length,
        female: students.filter(s => s.gender === 'female').length,
        other: students.filter(s => !s.gender || s.gender === 'other').length,
      },
      averageAge: 0,
    };

    // Calculate department stats
    students.forEach(student => {
      if (student.department) {
        stats.byDepartment[student.department] = (stats.byDepartment[student.department] || 0) + 1;
      }
      if (student.semester) {
        stats.bySemester[student.semester] = (stats.bySemester[student.semester] || 0) + 1;
      }
    });

    return { success: true, data: stats };
  } catch (error) {
    console.error('❌ Error getting student stats:', error);
    return { success: false, error: error.message };
  }
};

// Get student performance analytics
export const getStudentPerformance = async (studentId) => {
  try {
    const result = await callFunction('getStudentPerformance', { studentId });
    return result;
  } catch (error) {
    console.error('❌ Error getting student performance:', error);
    return { success: false, error: error.message };
  }
};

// Generate student ID
export const generateStudentId = async (organizationId) => {
  return await callFunction('generateStudentId', { organizationId });
};

// Generate secure password
export const generateSecurePassword = async () => {
  return await callFunction('generateSecurePassword');
};

// Reset student password
export const resetStudentPassword = async (studentId) => {
  return await callFunction('resetStudentPassword', { studentId });
};