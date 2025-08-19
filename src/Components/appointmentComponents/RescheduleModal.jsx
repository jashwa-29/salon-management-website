import { useState, useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';

const RescheduleModal = ({ isOpen, onClose, appointment, onReschedule }) => {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (appointment) {
      const formattedDate = new Date(appointment.appointmentDate).toISOString().split('T')[0];
      setDate(formattedDate);
      setTimeSlot(appointment.timeSlot);
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  const handleSubmit = async () => {
    if (!date || !timeSlot) {
      toast.error('Please select both date and time slot');
      return;
    }

    setIsSubmitting(true);
    try {
      await onReschedule({ appointmentDate: date, timeSlot });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gold-500">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gold-500 mb-4">Reschedule Appointment</h3>

          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Customer</label>
            <div className="text-gold-200 font-medium">
              {appointment.customer?.name || 'Unknown Customer'}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Current Date & Time</label>
            <div className="text-gold-200">
              {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.timeSlot}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 mb-2">New Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-gray-700 border border-gray-600 text-gold-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 mb-2">New Time Slot</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-gold-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">Select a time slot</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gold-200 rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-gray-900 font-medium rounded-lg transition flex items-center disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FiRefreshCw className="mr-1" /> Reschedule
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;
