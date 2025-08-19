import React from 'react';

const ServiceModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  handleChange, 
  categories, 
  title,
  submitText 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full border border-gold-600">
        <div className="flex justify-between items-center border-b border-gold-600 p-4">
          <h3 className="text-lg font-medium text-gold-300">{title}</h3>
          <button
            onClick={onClose}
            className="text-gold-400 hover:text-gold-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gold-300 mb-1">
              Service Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full bg-gray-800 border border-gold-600 rounded-lg py-2 px-3 text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gold-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className="w-full bg-gray-800 border border-gold-600 rounded-lg py-2 px-3 text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gold-300 mb-1">
                Duration (minutes) *
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                required
                min="1"
                className="w-full bg-gray-800 border border-gold-600 rounded-lg py-2 px-3 text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gold-300 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                className="w-full bg-gray-800 border border-gold-600 rounded-lg py-2 px-3 text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gold-300 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              className="w-full bg-gray-800 border border-gold-600 rounded-lg py-2 px-3 text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
              value={formData.category}
              onChange={handleChange}
            >
              {title === 'Edit Service' ? (
                categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))
              ) : (
                <>
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="gender" className="block text-sm font-medium text-gold-300 mb-1">
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              required
              className="w-full bg-gray-800 border border-gold-600 rounded-lg py-2 px-3 text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              className="h-4 w-4 text-gold-600 focus:ring-gold-500 border-gold-600 rounded"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gold-300">
              Active Service
            </label>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-gold-600">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gold-600 rounded-lg text-gold-300 hover:bg-gray-800 transition duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gold-600 rounded-lg text-black font-medium hover:bg-gold-700 transition duration-150"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;