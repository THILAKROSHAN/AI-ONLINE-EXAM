import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentByUid, updateStudent, uploadStudentPhoto } from '../../services/api/student';
import Button from '../../components/common/Buttons/Button';
import Input from '../../components/common/Forms/Input';
import Spinner from '../../components/common/Loading/Spinner';
import Toast from '../../components/common/Notifications/Toast';

const StudentProfilePage = () => {
  const { user, userData, refreshUserData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [student, setStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: '',
    semester: '',
    year: '',
    course: '',
    batch: '',
    rollNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
  });

  useEffect(() => {
    if (user?.uid) {
      loadStudent();
    }
  }, [user]);

  const loadStudent = async () => {
    setLoading(true);
    try {
      const result = await getStudentByUid(user.uid);
      if (result.success && result.data.length > 0) {
        const studentData = result.data[0];
        setStudent(studentData);
        setFormData({
          name: studentData.name || '',
          phone: studentData.phone || '',
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
        });
      }
    } catch (error) {
      console.error('Error loading student:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const result = await uploadStudentPhoto(student.id, file);
      if (result.success) {
        setSuccess('Profile photo updated successfully');
        await refreshUserData();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      setError('Name is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const result = await updateStudent(student.id, formData);
      if (result.success) {
        setSuccess('Profile updated successfully');
        await refreshUserData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
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
      <div className="container-custom py-12">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Student profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Profile
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          View and update your personal information
        </p>
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
          <div className="flex flex-col items-center mb-6">
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
            <div className="mt-2 text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {student.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {student.studentId} • {student.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={saving}
              />

              <Input
                type="text"
                name="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                disabled={saving}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="text"
                name="department"
                label="Department"
                value={formData.department}
                onChange={handleChange}
                disabled={saving}
              />

              <Input
                type="text"
                name="semester"
                label="Semester"
                value={formData.semester}
                onChange={handleChange}
                disabled={saving}
              />

              <Input
                type="text"
                name="year"
                label="Year"
                value={formData.year}
                onChange={handleChange}
                disabled={saving}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                name="course"
                label="Course"
                value={formData.course}
                onChange={handleChange}
                disabled={saving}
              />

              <Input
                type="text"
                name="batch"
                label="Batch"
                value={formData.batch}
                onChange={handleChange}
                disabled={saving}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                name="dateOfBirth"
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                disabled={saving}
              />

              <div>
                <label className="label">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-field"
                  disabled={saving}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleChange}
                disabled={saving}
              />

              <Input
                type="text"
                name="city"
                label="City"
                value={formData.city}
                onChange={handleChange}
                disabled={saving}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="text"
                name="state"
                label="State"
                value={formData.state}
                onChange={handleChange}
                disabled={saving}
              />

              <Input
                type="text"
                name="country"
                label="Country"
                value={formData.country}
                onChange={handleChange}
                disabled={saving}
              />

              <Input
                type="text"
                name="postalCode"
                label="Postal Code"
                value={formData.postalCode}
                onChange={handleChange}
                disabled={saving}
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Parent/Guardian Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="text"
                  name="parentName"
                  label="Parent Name"
                  value={formData.parentName}
                  onChange={handleChange}
                  disabled={saving}
                />

                <Input
                  type="text"
                  name="parentPhone"
                  label="Parent Phone"
                  value={formData.parentPhone}
                  onChange={handleChange}
                  disabled={saving}
                />

                <Input
                  type="email"
                  name="parentEmail"
                  label="Parent Email"
                  value={formData.parentEmail}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
              >
                {saving ? <Spinner size="sm" /> : 'Update Profile'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;