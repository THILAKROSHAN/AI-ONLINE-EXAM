import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ResultList from '../../components/results/ResultList';
import ResultDetails from '../../components/results/ResultDetails';
import ResultAnalytics from '../../components/results/ResultAnalytics';
import ResultExport from '../../components/results/ResultExport';
import ResultPDF from '../../components/results/ResultPDF';
import Modal from '../../components/common/Modals/Modal';

const ResultsPage = () => {
  const [searchParams] = useSearchParams();
  const { userData } = useAuth();
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});

  const examId = searchParams.get('examId');

  const handleViewResult = (result) => {
    setSelectedResult(result);
    setShowDetails(true);
  };

  const handleExportResults = () => {
    setShowExport(true);
  };

  const handleGeneratePDF = () => {
    setShowPDF(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedResult(null);
  };

  const handleCloseExport = () => {
    setShowExport(false);
  };

  const handleClosePDF = () => {
    setShowPDF(false);
  };

  const handleFiltersChange = (filters) => {
    setCurrentFilters(filters);
  };

  return (
    <div className="container-custom py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Results & Analytics
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          View and manage exam results for your organization
        </p>
      </div>

      <ResultList
        onView={handleViewResult}
        onExport={handleExportResults}
        examId={examId}
        onFiltersChange={handleFiltersChange}
      />

      <Modal
        isOpen={showDetails}
        onClose={handleCloseDetails}
        size="lg"
        title="Result Details"
      >
        <ResultDetails
          result={selectedResult}
          onClose={handleCloseDetails}
          onExport={handleGeneratePDF}
        />
        {selectedResult && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <ResultAnalytics result={selectedResult} />
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showExport}
        onClose={handleCloseExport}
        size="md"
        title="Export Results"
      >
        <ResultExport
          onClose={handleCloseExport}
          filters={currentFilters}
        />
      </Modal>

      <Modal
        isOpen={showPDF}
        onClose={handleClosePDF}
        size="md"
        title="Generate PDF Report"
      >
        <ResultPDF
          resultId={selectedResult?.id}
          onClose={handleClosePDF}
        />
      </Modal>
    </div>
  );
};

export default ResultsPage;