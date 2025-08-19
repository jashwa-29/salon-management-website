import React from 'react';
import { toast } from 'react-toastify';

const AlertPopup = {
  confirm: (message, onConfirm, onCancel) => {
    toast(
      <div className="p-4">
        <div className="text-white mb-4">{message}</div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              onCancel && onCancel();
              toast.dismiss();
            }}
            className="px-3 py-1 border border-gold-600 rounded text-white hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              toast.dismiss();
            }}
            className="px-3 py-1 bg-gold-600 rounded text-black hover:bg-gold-700 transition"
          >
            Confirm
          </button>
        </div>
      </div>,
      {
        position: 'top-center',
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
        className: 'bg-gray-900 border border-gold-600 rounded-lg'
      }
    );
  },

  success: (message) => {
    toast.success(message, {
    
 
    });
  },

  error: (message) => {
    toast.error(message, {

  
    });
  }
};

export default AlertPopup;