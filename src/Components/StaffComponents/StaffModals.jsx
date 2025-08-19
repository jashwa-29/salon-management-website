import React from 'react';
import StaffForm from './StaffForm';

const DeleteModal = ({ staff, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center border-b border-gray-700 pb-4">
            <h3 className="text-lg font-medium text-white">Confirm Deletion</h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-4">
            <p className="text-gray-300">
              Are you sure you want to delete <span className="font-semibold text-white">{staff?.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-600 rounded-md text-white bg-gray-700 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StaffModal = ({ 
  title, 
  show, 
  onClose, 
  formData, 
  handleInputChange, 
  handleSubmit, 
  roles 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center border-b border-gray-700 pb-4">
            <h3 className="text-lg font-medium text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <StaffForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            onCancel={onClose}
            isEdit={title.includes('Edit')}
            roles={roles}
          />
        </div>
      </div>
    </div>
  );
};

export { StaffModal, DeleteModal };