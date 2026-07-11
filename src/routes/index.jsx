import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Spinner from '../components/common/Loading/Spinner';

// Auth Pages - Lazy loaded
const AdminLoginPage = React.lazy(() => import('../pages/Auth/AdminLoginPage'));
const StudentLoginPage = React.lazy(() => import('../pages/Auth/StudentLoginPage'));
const UnauthorizedPage = React.lazy(() => import('../pages/Auth/UnauthorizedPage'));
const ForgotPasswordPage = React.lazy(() => import('../pages/Auth/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('../pages/Auth/ResetPasswordPage'));
const RegisterPage = React.lazy(() => import('../pages/Auth/RegisterPage'));

// Admin Pages - Lazy loaded
const AdminDashboardPage = React.lazy(() => import('../pages/Admin/AdminDashboardPage'));
const ManageAdminsPage = React.lazy(() => import('../pages/Admin/ManageAdminsPage'));
const ManageStudentsPage = React.lazy(() => import('../pages/Admin/ManageStudentsPage'));
const AddStudentPage = React.lazy(() => import('../pages/Admin/AddStudentPage'));
const ManageSubjectsPage = React.lazy(() => import('../pages/Admin/ManageSubjectsPage'));
const QuestionBankPage = React.lazy(() => import('../pages/Admin/QuestionBankPage'));
const AIGeneratorPage = React.lazy(() => import('../pages/Admin/AIGeneratorPage'));
const ManageExamsPage = React.lazy(() => import('../pages/Admin/ManageExamsPage'));
const ResultsPage = React.lazy(() => import('../pages/Admin/ResultsPage'));
const ReportsPage = React.lazy(() => import('../pages/Admin/ReportsPage'));
const AuditLogPage = React.lazy(() => import('../pages/Admin/AuditLogPage'));
const SettingsPage = React.lazy(() => import('../pages/Admin/SettingsPage'));

// Student Pages - Lazy loaded
const StudentDashboardPage = React.lazy(() => import('../pages/Student/StudentDashboardPage'));
const StudentExamsPage = React.lazy(() => import('../pages/Student/StudentExamsPage'));
const ExamAttemptPage = React.lazy(() => import('../pages/Student/ExamAttemptPage'));
const ExamResultsPage = React.lazy(() => import('../pages/Student/ExamResultsPage'));
const StudentProfilePage = React.lazy(() => import('../pages/Student/StudentProfilePage'));
const StudentSettingsPage = React.lazy(() => import('../pages/Student/StudentSettingsPage'));

const AppRoutes = () => {
  console.log('🗺️ AppRoutes rendering');

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    }>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/student/login" element={<StudentLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={['super_admin', 'admin']} />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/admins" element={<ManageAdminsPage />} />
          <Route path="/admin/students" element={<ManageStudentsPage />} />
          <Route path="/admin/students/add" element={<AddStudentPage />} />
          <Route path="/admin/subjects" element={<ManageSubjectsPage />} />
          <Route path="/admin/questions" element={<QuestionBankPage />} />
          <Route path="/admin/ai-generator" element={<AIGeneratorPage />} />
          <Route path="/admin/exams" element={<ManageExamsPage />} />
          <Route path="/admin/results" element={<ResultsPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/audit" element={<AuditLogPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>

        {/* Student Routes */}
        <Route element={<PrivateRoute allowedRoles={['student']} />}>
          <Route path="/student" element={<StudentDashboardPage />} />
          <Route path="/student/dashboard" element={<StudentDashboardPage />} />
          <Route path="/student/exams" element={<StudentExamsPage />} />
          <Route path="/student/exam/:examId" element={<ExamAttemptPage />} />
          <Route path="/student/results" element={<ExamResultsPage />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
          <Route path="/student/settings" element={<StudentSettingsPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;