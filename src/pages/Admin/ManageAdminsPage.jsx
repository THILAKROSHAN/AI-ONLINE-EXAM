import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminList from '../../components/admin/AdminList';
import AdminForm from '../../components/admin/AdminForm';
import AdminPermissions from '../../components/admin/AdminPermissions';
import Modal from '../../components/common/Modals/Modal';
import { ROLES } from '../../utils/constants/roles';

const ManageAdminsPage = () => {
  const { userData } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const handleAddAdmin = () => {
    setSelectedAdmin(null);
    setShowForm(true);
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    setShowForm(true);
  };

  const handleManagePermissions = (admin) => {
    setSelectedAdmin(admin);
    setShowPermissions(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedAdmin(null);
  };

  const handleClosePermissions = () => {
    setShowPermissions(false);
    setSelectedAdmin(null);
  };

  const handleSuccess = () => {
    // Refresh admin list
  };

  const canManageAdmins = userData?.role === ROLES.SUPER_ADMIN || 
                         userData?.role === ROLES.ORGANIZATION_ADMIN;

  if (!canManageAdmins) {
    return (
      <div className="container-custom py-6">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to manage admins.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Administrators
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add, edit, and manage admin accounts for your organization
        </p>
      </div>

      <AdminList 
        onEdit={handleEditAdmin}
        onPermissions={handleManagePermissions}
        onAdd={handleAddAdmin}
      />

      <Modal
        isOpen={showForm}
        onClose={handleCloseForm}
        size="lg"
        title={selectedAdmin ? 'Edit Admin' : 'Add New Admin'}
      >
        <AdminForm
          admin={selectedAdmin}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
        />
      </Modal>

      <Modal
        isOpen={showPermissions}
        onClose={handleClosePermissions}
        size="lg"
        title="Manage Permissions"
      >
        <AdminPermissions
          admin={selectedAdmin}
          onClose={handleClosePermissions}
          onSuccess={handleSuccess}
        />
      </Modal>
    </div>
  );
};

export default ManageAdminsPage;