// components/dashboard/AllAppointmentsModal.jsx
import { Calendar, X, Edit, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function AllAppointmentsModal({ appointments, onClose, onStatusUpdate }) {
  const [editingAppointment, setEditingAppointment] = useState(null);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'confirmed':
        return { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-400', bgColor: 'bg-green-400/10', label: 'Confirmed' };
      case 'pending':
        return { icon: <Clock className="w-4 h-4" />, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', label: 'Pending' };
      default:
        return { icon: <Clock className="w-4 h-4" />, color: 'text-gray-400', bgColor: 'bg-gray-400/10', label: 'Pending' };
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-black rounded-xl border border-gray-800 w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-yellow-500 flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Today's Appointments ({appointments.length})</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6">
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map(appointment => (
                <div key={appointment._id} className="p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-white">
                        {appointment.customer?.name || `Customer #${appointment._id}`}
                      </p>
                      <div className="flex items-center mt-1 space-x-2">
                        <p className="text-sm text-gray-400">
                          {appointment.combo?.name || 'Service Combo'}
                        </p>
                        {appointment.combo?.totalPrice && (
                          <span className="text-xs text-yellow-500">
                            ${appointment.combo.totalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {appointment.notes && (
                        <p className="text-xs text-gray-500 mt-1">Note: {appointment.notes}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {editingAppointment === appointment._id ? (
                        <div className="flex flex-col space-y-2 items-end">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => { onStatusUpdate(appointment._id, 'confirmed'); setEditingAppointment(null); }}
                              className={`px-3 py-1 rounded-full text-sm ${appointment.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-700 text-gray-300 hover:bg-green-500/10'}`}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => { onStatusUpdate(appointment._id, 'pending'); setEditingAppointment(null); }}
                              className={`px-3 py-1 rounded-full text-sm ${appointment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-gray-700 text-gray-300 hover:bg-yellow-500/10'}`}
                            >
                              Set Pending
                            </button>
                          </div>
                          <button
                            onClick={() => setEditingAppointment(null)}
                            className="text-xs text-gray-400 hover:text-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div 
                          onClick={() => setEditingAppointment(appointment._id)}
                          className={`flex items-center space-x-1 text-sm px-3 py-1 rounded-full cursor-pointer ${getStatusInfo(appointment.status).bgColor} ${getStatusInfo(appointment.status).color}`}
                        >
                          {getStatusInfo(appointment.status).icon}
                          <span className="capitalize">{getStatusInfo(appointment.status).label}</span>
                          <Edit className="w-3 h-3 ml-1" />
                        </div>
                      )}
                      <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-medium">
                        {appointment.timeSlot}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No active appointments scheduled for today</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
