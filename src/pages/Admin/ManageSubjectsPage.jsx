import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SubjectList from '../../components/subjects/SubjectList';
import SubjectForm from '../../components/subjects/SubjectForm';
import Modal from '../../components/common/Modals/Modal';

const ManageSubjectsPage = () => {
  const { userData } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const handleAddSubject = () => {
    setSelectedSubject(null);
    setShowForm(true);
  };

  const handleEditSubject = (subject) => {
    setSelectedSubject(subject);
    setShowForm(true);
  };

  const handleViewSubject = (subject) => {
    setSelectedSubject(subject);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedSubject(null);
  };

  const handleSuccess = () => {
    // Refresh subject list
  };

  return (
    <div className="container-custom py-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Subjects
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add, edit, and manage subjects for your organization
          </p>
        </div>
        <button onClick={handleAddSubject} className="btn-primary">
          Add Subject
        </button>
      </div>

      <SubjectList
        onEdit={handleEditSubject}
        onView={handleViewSubject}
      />

      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        size="lg"
        title={selectedSubject ? 'Edit Subject' : 'Add New Subject'}
      >
        <SubjectForm
          subject={selectedSubject}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  );
};

export default ManageSubjectsPage;