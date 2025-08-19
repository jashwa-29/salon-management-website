import React from 'react';

const ComboViewModal = ({ combo, isOpen, onClose }) => {
  if (!isOpen || !combo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-2xl border border-gold-600">
        <div className="bg-gold-800 text-black px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-bold">Combo Details</h2>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gold-500 mb-2">{combo.name}</h3>
          <p className="text-gray-300 mb-6">{combo.description || 'No description available'}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <SummaryCard 
              title="Total Duration" 
              value={`${combo.totalDuration || 0} minutes`} 
            />
            <SummaryCard 
              title="Total Price" 
              value={`₹${(combo.totalPrice || 0).toFixed(2)}`} 
              subtitle={combo.discount > 0 ? `${combo.discount}% discount applied` : null}
            />
          </div>
          
          <h4 className="text-lg font-semibold text-gold-500 mb-3">Included Services</h4>
          <ServiceList services={combo.services || []} />
          
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="bg-gold-600 hover:bg-gold-700 text-black font-bold py-2 px-6 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, subtitle }) => (
  <div className="bg-gray-800 p-4 rounded-lg">
    <h3 className="text-gold-500 mb-1">{title}</h3>
    <p className="text-xl">{value}</p>
    {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
  </div>
);

const ServiceList = ({ services }) => (
  <div className="bg-gray-800 rounded-lg p-4">
    {services.length === 0 ? (
      <p className="text-gray-400 text-center">No services in this combo</p>
    ) : (
      <ul className="divide-y divide-gray-700">
        {services
          .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
          .map((svc, index) => (
            <ServiceItem key={index} service={svc} />
          ))}
      </ul>
    )}
  </div>
);

const ServiceItem = ({ service }) => {
  // Safely extract service details with fallbacks
  const serviceName = service.service.name || 'Unknown Service';
  const duration = service.service.duration || 0;
  const price = service?.price || service?.service?.price || 0;
  const sequence = service?.sequence || 0;

  return (
    <li className="py-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{serviceName}</p>
          <p className="text-sm text-gray-400">
            Duration: {duration} mins | Price: ₹{price.toFixed(2)}
          </p>
        </div>
        <span className="bg-gray-700 text-xs px-2 py-1 rounded">
          Sequence: {sequence}
        </span>
      </div>
    </li>
  );
};

export default ComboViewModal;