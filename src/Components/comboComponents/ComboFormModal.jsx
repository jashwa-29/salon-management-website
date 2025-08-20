import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

const ComboFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  handleInputChange,
  services,
  serviceInput,
  setServiceInput,
  sequenceInput,
  setSequenceInput,
  addService,
  removeService,
  calculateTotalPrice,
  calculateTotalDuration,
  currentCombo
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-gold-600">
        <div className="flex justify-between items-center border-b border-gold-600 p-4">
          <h3 className="text-lg font-medium text-gold-300">
            {currentCombo ? 'Edit Combo' : 'Create New Combo'}
          </h3>
          <button
            onClick={onClose}
            className="text-gold-400 hover:text-gold-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Scrollable content area */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={onSubmit} className="p-6">
            <FormInput
              label="Combo Name *"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            
            <FormTextarea
              label="Description"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />

            <GenderSelector
              label="Gender *"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            />
            
            <ServiceSelector
              services={services}
              serviceInput={serviceInput}
              setServiceInput={setServiceInput}
              sequenceInput={sequenceInput}
              setSequenceInput={setSequenceInput}
              addService={addService}
              selectedGender={formData.gender}
            />
            
            <SelectedServicesList
              services={formData.services}
              removeService={removeService}
            />
            
            <FormInput
              label="Discount (%)"
              id="discount"
              name="discount"
              type="number"
              min="0"
              max="100"
              value={formData.discount}
              onChange={handleInputChange}
            />
            
            <SummaryCards
              duration={calculateTotalDuration}
              price={calculateTotalPrice}
              originalPrice={formData.services.reduce((sum, svc) => sum + svc.price, 0)}
              discount={formData.discount}
            />
            
            <FormActions onClose={onClose} isEdit={!!currentCombo} />
          </form>
        </div>
      </div>
    </div>
  );
};

// Component for Gender Selector
const GenderSelector = ({ label, id, name, value, onChange }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gold-300 mb-1">
      {label}
    </label>
    <select
      id={id}
      name={name}
      className="w-full bg-gray-800 border border-gold-600 rounded-lg py-2 px-3 text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
      value={value}
      onChange={onChange}
      required
    >
      <option value="">Select gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
    </select>
  </div>
);

const FormInput = ({ label, id, name, type = 'text', value, onChange, required = false, min, max }) => {
  const handleChange = (e) => {
    if (type === 'number') {
      // For numbers, convert empty string to 0 and parse numbers properly
      const value = e.target.value === '' ? 0 : Number(e.target.value);
      onChange({ target: { name: e.target.name, value } });
    } else {
      onChange(e);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gold-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        required={required}
        min={min}
        max={max}
        className="w-full bg-gray-800 border border-gold-600 rounded-lg py-2 px-3 text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

// Component for Form Textarea
const FormTextarea = ({ label, id, name, value, onChange }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gold-300 mb-1">
      {label}
    </label>
    <textarea
      id={id}
      name={name}
      rows="3"
      className="w-full bg-gray-800 border border-gold-600 rounded-lg py-2 px-3 text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
      value={value}
      onChange={onChange}
    ></textarea>
  </div>
);

// Component for Service Selector
const ServiceSelector = ({ 
  services, 
  serviceInput, 
  setServiceInput, 
  sequenceInput, 
  setSequenceInput, 
  addService,
  selectedGender 
}) => {
  // Filter services based on selected gender
  const filteredServices = selectedGender 
    ? services.filter(service => 
        service.gender === selectedGender || 
        service.gender === 'unisex' ||
        !service.gender
      )
    : services;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gold-300 mb-1">
        Add Services
      </label>
      <div className="flex gap-2 mb-2">
        <select
          value={serviceInput}
          onChange={(e) => setServiceInput(e.target.value)}
          className="flex-1 bg-gray-800 border border-gold-600 rounded-lg py-2 px-3 text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
        >
          <option value="">Select a service</option>
          {filteredServices.map((service) => (
         <option key={service._id} value={service._id}>
  {service.name} (₹{service.price}, {service.duration} mins)
</option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          value={sequenceInput}
          onChange={(e) => setSequenceInput(parseInt(e.target.value) || 1)}
          className="w-20 bg-gray-800 border border-gold-600 rounded-lg py-2 px-3 text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
          placeholder="Sequence"
        />
        <button
          type="button"
          onClick={addService}
          className="bg-gold-600 hover:bg-gold-700 text-black font-bold py-2 px-4 rounded-lg transition duration-150"
        >
          Add
        </button>
      </div>
    </div>
  );
};

// Component for Selected Services List
const SelectedServicesList = ({ services, removeService }) => (
  <div className="bg-gray-800 rounded-lg p-4 max-h-40 overflow-y-auto border border-gold-600 mb-4">
    {services.length === 0 ? (
      <p className="text-gold-300 text-center">No services added</p>
    ) : (
      <ul className="divide-y divide-gold-600">
        {services.map((svc, index) => (
          <li key={index} className="py-2 flex justify-between items-center">
            <div>
              <span className="font-medium text-gold-200">{svc.name}</span>
              <span className="text-xs text-gold-400 ml-2">
                (Seq: {svc.sequence}, ₹{svc.price}, {svc.duration} mins)
              </span>
            </div>
            <button
              type="button"
              onClick={() => removeService(index)}
              className="text-red-500 hover:text-red-400 transition duration-150"
            >
              <FiTrash2 />
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

// Component for Summary Cards
const SummaryCards = ({ duration, price, originalPrice, discount }) => (
  <div className="grid grid-cols-2 gap-4 mb-6">
    <div className="bg-gray-800 p-4 rounded-lg border border-gold-600">
      <h3 className="text-sm font-medium text-gold-300 mb-1">Total Duration</h3>
      <p className="text-lg text-gold-200">{duration} minutes</p>
    </div>
    <div className="bg-gray-800 p-4 rounded-lg border border-gold-600">
      <h3 className="text-sm font-medium text-gold-300 mb-1">Total Price</h3>
      <p className="text-lg text-gold-200">₹{price.toFixed(2)}</p>
      {discount > 0 && (
        <p className="text-xs text-gold-400">
          Original: ₹{originalPrice.toFixed(2)}
        </p>
      )}
    </div>
  </div>
);

// Component for Form Actions
const FormActions = ({ onClose, isEdit }) => (
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
      {isEdit ? 'Update Combo' : 'Create Combo'}
    </button>
  </div>
);

export default ComboFormModal;