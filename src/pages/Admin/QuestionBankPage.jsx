import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import QuestionBank from '../../components/questions/QuestionBank';
import QuestionForm from '../../components/questions/QuestionForm';
import QuestionPreview from '../../components/questions/QuestionPreview';
import QuestionImport from '../../components/questions/QuestionImport';
import QuestionExport from '../../components/questions/QuestionExport';
import Modal from '../../components/common/Modals/Modal';

const QuestionBankPage = () => {
  const { userData } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});

  const handleAddQuestion = () => {
    setSelectedQuestion(null);
    setShowForm(true);
  };

  const handleEditQuestion = (question) => {
    setSelectedQuestion(question);
    setShowForm(true);
  };

  const handleViewQuestion = (question) => {
    setSelectedQuestion(question);
    setShowPreview(true);
  };

  const handleImportQuestions = () => {
    setShowImport(true);
  };

  const handleExportQuestions = () => {
    setShowExport(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedQuestion(null);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedQuestion(null);
  };

  const handleCloseImport = () => {
    setShowImport(false);
  };

  const handleCloseExport = () => {
    setShowExport(false);
  };

  const handleSuccess = () => {
    // Refresh question list
  };

  const handleFiltersChange = (filters) => {
    setCurrentFilters(filters);
  };

  return (
    <div className="container-custom py-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Question Bank
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your question bank with manual and AI-generated questions
          </p>
        </div>
        <button onClick={handleAddQuestion} className="btn-primary">
          Add Question
        </button>
      </div>

      <QuestionBank
        onEdit={handleEditQuestion}
        onView={handleViewQuestion}
        onImport={handleImportQuestions}
        onExport={handleExportQuestions}
        onFiltersChange={handleFiltersChange}
      />

      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        size="lg"
        title={selectedQuestion ? 'Edit Question' : 'Add New Question'}
      >
        <QuestionForm
          question={selectedQuestion}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      </Modal>

      <Modal
        isOpen={showPreview}
        onClose={handleClosePreview}
        size="lg"
        title="Question Preview"
      >
        <QuestionPreview
          question={selectedQuestion}
          onClose={handleClosePreview}
        />
      </Modal>

      <Modal
        isOpen={showImport}
        onClose={handleCloseImport}
        size="lg"
        title="Import Questions"
      >
        <QuestionImport
          onClose={handleCloseImport}
          onSuccess={handleSuccess}
        />
      </Modal>

      <Modal
        isOpen={showExport}
        onClose={handleCloseExport}
        size="lg"
        title="Export Questions"
      >
        <QuestionExport
          onClose={handleCloseExport}
          filters={currentFilters}
        />
      </Modal>
    </div>
  );
};

export default QuestionBankPage;