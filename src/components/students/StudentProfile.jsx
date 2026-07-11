import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getStudent, uploadStudentPhoto } from '../../services/api/student';
import Button from '../common/Buttons/Button';
import Spinner from '../common/Loading/Spinner';
import Toast from '../common/Notifications/Toast';

const StudentProfile = ({ studentId, onClose }) => {
  const { userData } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (studentId) {
      loadStudent();
    }
  }, [studentId]);

  const loadStudent = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await getStudent(studentId);
      
      if (result.success) {
        setStudent(result.data);
      } else {
        setError(result.error || 'Failed to load student');
      }
    } catch (error) {
      console.error('Error loading student:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const result = await uploadStudentPhoto(studentId, file);
      
      if (result.success) {
        setSuccess('Profile photo updated successfully');
        await loadStudent();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('An unexpected error occurred');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Student not found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Student Profile
        </h2>
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Close
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <Toast
          type="success"
          message={success}
          duration={3000}
          onClose={() => setSuccess('')}
        />
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Photo */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 text-4xl font-bold overflow-hidden">
                  {student.profilePhoto ? (
                    <img
                      src={student.profilePhoto}
                      alt={student.name}
                      className="h-32 w-32 object-cover"
                    />
                  ) : (
                    student.name?.[0]?.toUpperCase() || 'S'
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-1 bg-primary-600 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              {uploading && <Spinner size="sm" className="mt-2" />}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {student.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {student.studentId} • {student.email}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  student.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {student.isActive ? 'Active' : 'Inactive'}
                </span>
                {student.department && (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {student.department}
                  </span>
                )}
                {student.semester && (
                  <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Semester {student.semester}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {student.phone || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Roll Number</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {student.rollNumber || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Course</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {student.course || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Batch</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {student.batch || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {student.dateOfBirth || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {student.gender ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1) : 'N/A'}
              </p>
            </div>
          </div>

          {/* Address */}
          {(student.address || student.city || student.state || student.country) && (
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {[student.address, student.city, student.state, student.country, student.postalCode]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
          )}

          {/* Parent Info */}
          {(student.parentName || student.parentPhone || student.parentEmail) && (
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Parent/Guardian</p>
              <div className="mt-1 space-y-1">
                {student.parentName && (
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {student.parentName}
                  </p>
                )}
                {student.parentPhone && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Phone: {student.parentPhone}
                  </p>
                )}
                {student.parentEmail && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Email: {student.parentEmail}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Exams</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {student.totalExams || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {student.averageScore || 0}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Enrolled</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {student.enrolledDate?.toDate?.()?.toLocaleDateString() || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;