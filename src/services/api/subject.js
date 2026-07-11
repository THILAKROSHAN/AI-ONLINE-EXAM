// Subject API Service
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

// Create a new subject
export const createSubject = async (subjectData) => {
  try {
    const data = {
      name: subjectData.name,
      code: subjectData.code,
      description: subjectData.description || '',
      department: subjectData.department || '',
      semester: subjectData.semester || '',
      year: subjectData.year || '',
      course: subjectData.course || '',
      credits: subjectData.credits || 0,
      hoursPerWeek: subjectData.hoursPerWeek || 0,
      totalHours: subjectData.totalHours || 0,
      instructor: subjectData.instructor || '',
      instructorEmail: subjectData.instructorEmail || '',
      organizationId: subjectData.organizationId,
      isActive: true,
      createdBy: subjectData.createdBy || null,
      topics: subjectData.topics || [],
      prerequisites: subjectData.prerequisites || [],
      learningOutcomes: subjectData.learningOutcomes || [],
      syllabus: subjectData.syllabus || '',
      textbook: subjectData.textbook || '',
      references: subjectData.references || [],
      status: subjectData.status || 'draft', // draft, published, archived
      metadata: subjectData.metadata || {},
    };

    const result = await createDocument(COLLECTIONS.SUBJECTS, data);
    return result;
  } catch (error) {
    console.error('❌ Error creating subject:', error);
    return { success: false, error: error.message };
  }
};

// Get subject by ID
export const getSubject = async (subjectId) => {
  try {
    const result = await getDocument(COLLECTIONS.SUBJECTS, subjectId);
    return result;
  } catch (error) {
    console.error('❌ Error getting subject:', error);
    return { success: false, error: error.message };
  }
};

// Get subject by code
export const getSubjectByCode = async (code, organizationId) => {
  try {
    const result = await queryDocuments(COLLECTIONS.SUBJECTS, [
      { field: 'code', operator: '==', value: code },
      { field: 'organizationId', operator: '==', value: organizationId }
    ]);
    return result;
  } catch (error) {
    console.error('❌ Error getting subject by code:', error);
    return { success: false, error: error.message };
  }
};

// Update subject
export const updateSubject = async (subjectId, data) => {
  try {
    const result = await updateDocument(COLLECTIONS.SUBJECTS, subjectId, data);
    return result;
  } catch (error) {
    console.error('❌ Error updating subject:', error);
    return { success: false, error: error.message };
  }
};

// Delete subject
export const deleteSubject = async (subjectId) => {
  try {
    const result = await deleteDocument(COLLECTIONS.SUBJECTS, subjectId);
    return result;
  } catch (error) {
    console.error('❌ Error deleting subject:', error);
    return { success: false, error: error.message };
  }
};

// Get all subjects for an organization
export const getOrganizationSubjects = async (organizationId, filters = {}) => {
  try {
    const conditions = [
      { field: 'organizationId', operator: '==', value: organizationId }
    ];

    if (filters.department) {
      conditions.push({ field: 'department', operator: '==', value: filters.department });
    }

    if (filters.semester) {
      conditions.push({ field: 'semester', operator: '==', value: filters.semester });
    }

    if (filters.status) {
      conditions.push({ field: 'status', operator: '==', value: filters.status });
    }

    if (filters.isActive !== undefined) {
      conditions.push({ field: 'isActive', operator: '==', value: filters.isActive });
    }

    const result = await queryDocuments(
      COLLECTIONS.SUBJECTS,
      conditions,
      'name',
      'asc'
    );
    return result;
  } catch (error) {
    console.error('❌ Error getting organization subjects:', error);
    return { success: false, error: error.message };
  }
};

// Get all subjects (Super Admin only)
export const getAllSubjects = async () => {
  try {
    const result = await getAllDocuments(COLLECTIONS.SUBJECTS);
    return result;
  } catch (error) {
    console.error('❌ Error getting all subjects:', error);
    return { success: false, error: error.message };
  }
};

// Toggle subject status
export const toggleSubjectStatus = async (subjectId, isActive) => {
  try {
    const result = await updateDocument(COLLECTIONS.SUBJECTS, subjectId, {
      isActive: isActive,
    });
    return result;
  } catch (error) {
    console.error('❌ Error toggling subject status:', error);
    return { success: false, error: error.message };
  }
};

// Update subject status
export const updateSubjectStatus = async (subjectId, status) => {
  try {
    const result = await updateDocument(COLLECTIONS.SUBJECTS, subjectId, {
      status: status,
    });
    return result;
  } catch (error) {
    console.error('❌ Error updating subject status:', error);
    return { success: false, error: error.message };
  }
};

// Add topics to subject
export const addTopicsToSubject = async (subjectId, topics) => {
  try {
    const result = await updateDocument(COLLECTIONS.SUBJECTS, subjectId, {
      topics: topics,
    });
    return result;
  } catch (error) {
    console.error('❌ Error adding topics to subject:', error);
    return { success: false, error: error.message };
  }
};

// Add learning outcomes to subject
export const addLearningOutcomes = async (subjectId, learningOutcomes) => {
  try {
    const result = await updateDocument(COLLECTIONS.SUBJECTS, subjectId, {
      learningOutcomes: learningOutcomes,
    });
    return result;
  } catch (error) {
    console.error('❌ Error adding learning outcomes:', error);
    return { success: false, error: error.message };
  }
};

// Get subject statistics
export const getSubjectStats = async (organizationId) => {
  try {
    const subjectsResult = await queryDocuments(COLLECTIONS.SUBJECTS, [
      { field: 'organizationId', operator: '==', value: organizationId },
    ]);

    if (!subjectsResult.success) {
      return { success: false, error: subjectsResult.error };
    }

    const subjects = subjectsResult.data;
    const stats = {
      total: subjects.length,
      active: subjects.filter(s => s.isActive).length,
      inactive: subjects.filter(s => !s.isActive).length,
      byDepartment: {},
      bySemester: {},
      byStatus: {
        draft: subjects.filter(s => s.status === 'draft').length,
        published: subjects.filter(s => s.status === 'published').length,
        archived: subjects.filter(s => s.status === 'archived').length,
      },
      totalCredits: subjects.reduce((sum, s) => sum + (s.credits || 0), 0),
      averageCredits: 0,
    };

    // Calculate department stats
    subjects.forEach(subject => {
      if (subject.department) {
        stats.byDepartment[subject.department] = (stats.byDepartment[subject.department] || 0) + 1;
      }
      if (subject.semester) {
        stats.bySemester[subject.semester] = (stats.bySemester[subject.semester] || 0) + 1;
      }
    });

    stats.averageCredits = subjects.length > 0 ? stats.totalCredits / subjects.length : 0;

    return { success: true, data: stats };
  } catch (error) {
    console.error('❌ Error getting subject stats:', error);
    return { success: false, error: error.message };
  }
};

// Get subjects by department
export const getSubjectsByDepartment = async (organizationId, department) => {
  try {
    const result = await queryDocuments(COLLECTIONS.SUBJECTS, [
      { field: 'organizationId', operator: '==', value: organizationId },
      { field: 'department', operator: '==', value: department },
      { field: 'isActive', operator: '==', value: true },
    ]);
    return result;
  } catch (error) {
    console.error('❌ Error getting subjects by department:', error);
    return { success: false, error: error.message };
  }
};

// Get subjects by semester
export const getSubjectsBySemester = async (organizationId, semester) => {
  try {
    const result = await queryDocuments(COLLECTIONS.SUBJECTS, [
      { field: 'organizationId', operator: '==', value: organizationId },
      { field: 'semester', operator: '==', value: semester },
      { field: 'isActive', operator: '==', value: true },
    ]);
    return result;
  } catch (error) {
    console.error('❌ Error getting subjects by semester:', error);
    return { success: false, error: error.message };
  }
};

// Cloud Functions for subject
export const generateSubjectCode = async (organizationId, subjectName) => {
  return await callFunction('generateSubjectCode', { organizationId, subjectName });
};

export const validateSubjectCode = async (code, organizationId) => {
  return await callFunction('validateSubjectCode', { code, organizationId });
};

export const exportSubjects = async (organizationId, format = 'excel') => {
  return await callFunction('exportSubjects', { organizationId, format });
};

export const importSubjects = async (fileUrl, organizationId) => {
  return await callFunction('importSubjects', { fileUrl, organizationId });
};