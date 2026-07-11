import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import StudentList from '../../components/students/StudentList';
import StudentForm from '../../components/students/StudentForm';
import StudentProfile from '../../components/students/StudentProfile';
import StudentImport from '../../components/students/StudentImport';
import Modal from '../../components/common/Modals/Modal';

const ManageStudentsPage = () => {
  const { userData } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowForm(true);
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowProfile(true);
  };

  const handleImportStudents = () => {
    setShowImport(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedStudent(null);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    setSelectedStudent(null);
  };

  const handleCloseImport = () => {
    setShowImport(false);
  };

  const handleSuccess = () => {
    // Refresh student list
  };

  return (
    <div className="container-custom py-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Students
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add, edit, and manage student accounts for your organization
          </p>
        </div>
        <button onClick={handleAddStudent} className="btn-primary">
          Add Student
        </button>
      </div>

      <StudentList
        onEdit={handleEditStudent}
        onView={handleViewStudent}
        onImport={handleImportStudents}
      />

      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        size="lg"
        title={selectedStudent ? 'Edit Student' : 'Add New Student'}
      >
        <StudentForm
          student={selectedStudent}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      </Modal>

      <Modal
        isOpen={showProfile}
        onClose={handleCloseProfile}
        size="lg"
        title="Student Profile"
      >
        <StudentProfile
          studentId={selectedStudent?.id}
          onClose={handleCloseProfile}
        />
      </Modal>

      <Modal
        isOpen={showImport}
        onClose={handleCloseImport}
        size="lg"
        title="Import Students"
      >
        <StudentImport
          onClose={handleCloseImport}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  );
};

export default ManageStudentsPage;