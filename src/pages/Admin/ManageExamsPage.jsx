import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ExamList from '../../components/exams/ExamList';
import ExamForm from '../../components/exams/ExamForm';
import ExamDetails from '../../components/exams/ExamDetails';
import Modal from '../../components/common/Modals/Modal';

const ManageExamsPage = () => {
  const { userData } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const handleAddExam = () => {
    setSelectedExam(null);
    setShowForm(true);
  };

  const handleEditExam = (exam) => {
    setSelectedExam(exam);
    setShowForm(true);
  };

  const handleViewExam = (exam) => {
    setSelectedExam(exam);
    setShowDetails(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedExam(null);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedExam(null);
  };

  const handleSuccess = () => {
    // Refresh exam list
  };

  return (
    <div className="container-custom py-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Exams
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create, manage, and publish exams for your organization
          </p>
        </div>
        <button onClick={handleAddExam} className="btn-primary">
          Create Exam
        </button>
      </div>

      <ExamList
        onEdit={handleEditExam}
        onView={handleViewExam}
        onResults={() => {}}
      />

      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        size="lg"
        title={selectedExam ? 'Edit Exam' : 'Create New Exam'}
      >
        <ExamForm
          exam={selectedExam}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      </Modal>

      <Modal
        isOpen={showDetails}
        onClose={handleCloseDetails}
        size="lg"
        title="Exam Details"
      >
        <ExamDetails
          examId={selectedExam?.id}
          onClose={handleCloseDetails}
        />
      </Modal>
    </div>
  );
};

export default ManageExamsPage;