import React, { useState } from 'react';
import { X, UserPlus, Phone, Mail, User } from 'lucide-react';
import { createCustomerApi } from '../../services/customerService';

const CreateCustomerModal = ({ onClose, onCustomerCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [existingCustomer, setExistingCustomer] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

const validateForm = () => {
  const newErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = 'Name is required';
  }

  // Indian phone number validation
  const phonePattern = /^[6-9]\d{9}$/;
  if (!formData.phone.trim()) {
    newErrors.phone = 'Phone number is required';
  } else if (!phonePattern.test(formData.phone.trim())) {
    newErrors.phone = 'Enter a valid 10-digit Indian phone number';
  }

  // Optional email validation
  if (formData.email.trim()) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setExistingCustomer(null);
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await createCustomerApi(formData);
      
      if (response.existingCustomer) {
        // Handle case where customer already exists
        setExistingCustomer(response.existingCustomer);
      } else {
        // Success case
        onCustomerCreated(response.customer);
        onClose();
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      
      if (error.response) {
        if (error.response.data.field) {
          setErrors(prev => ({
            ...prev,
            [error.response.data.field]: error.response.data.message
          }));
        } else {
          setApiError(error.response.data.message || 'Failed to create customer');
        }
      } else {
        setApiError('Network error. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-md">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-yellow-500 flex items-center space-x-2">
            <UserPlus className="w-5 h-5" />
            <span>Add New Customer</span>
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {apiError && (
            <div className="mb-4 p-3 bg-red-500/10 text-red-400 rounded-lg text-sm">
              {apiError}
            </div>
          )}
          
          {existingCustomer && (
            <div className="mb-4 p-3 bg-yellow-500/10 text-yellow-400 rounded-lg">
              <p className="font-medium">Customer already exists:</p>
              <div className="mt-2 p-2 bg-gray-800 rounded">
                <p className="text-white">{existingCustomer.name}</p>
                <p className="text-sm text-gray-400">{existingCustomer.phone}</p>
                {existingCustomer.email && (
                  <p className="text-sm text-gray-400">{existingCustomer.email}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 text-sm text-yellow-500 hover:underline"
              >
                Close
              </button>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                  placeholder="John Doe"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
            </div>
            
            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Phone Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 border ${errors.phone ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                  placeholder="+1 (555) 123-4567"
                  disabled={isSubmitting}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email (Optional)
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                  placeholder="john@example.com"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Customer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomerModal;