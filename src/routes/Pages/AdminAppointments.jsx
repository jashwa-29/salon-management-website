import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiX, 
  FiCheck, 
  FiRefreshCw, 
  FiEdit,
  FiChevronLeft,
  FiChevronRight,
  FiFilter
} from 'react-icons/fi';
import StatusUpdateModal from '../../Components/appointmentComponents/StatusUpdateModal';
import RescheduleModal from '../../Components/appointmentComponents/RescheduleModal';
import StatusBadge from '../../Components/appointmentComponents/StatusBadge';
import ServiceTag from '../../Components/appointmentComponents/ServiceTag';
import StatsCard from '../../Components/appointmentComponents/StatsCard';
import { fetchAppointmentsApi, rescheduleAppointmentApi, updateAppointmentStatusApi } from '../../services/appointmentService';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ date: '', status: '' });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadAppointments();
  }, [filters]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await fetchAppointmentsApi(filters);
      setAppointments(data || []);
      setCurrentPage(1); // Reset to first page when filters change
    } catch (err) {
      toast.error('Failed to fetch appointments');
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtered appointments
  const filteredAppointments = useMemo(() => {
    return [...appointments].reverse(); // Reverse to show latest first
  }, [appointments]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAppointments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAppointments, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateAppointmentStatusApi(selectedAppointment._id, newStatus);
      toast.success('Appointment status updated successfully');
      loadAppointments();
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to update appointment status');
      console.error(err);
    }
  };

  const handleReschedule = async ({ appointmentDate, timeSlot }) => {
    try {
      await rescheduleAppointmentApi(selectedAppointment._id, {
        appointmentDate,
        timeSlot,
      });
      toast.success('Appointment rescheduled successfully');
      loadAppointments();
      setIsRescheduleModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to reschedule appointment');
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'No time';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const calculateTotal = (appointment) => {
    if (!appointment) return 0;
    return appointment.combo
      ? appointment.combo.totalPrice
      : (appointment.services || []).reduce((sum, service) => sum + (service.price || 0), 0);
  };

  const clearFilters = () => setFilters({ date: '', status: '' });

  const stats = useMemo(() => [
    {
      title: 'Total',
      value: appointments.length,
      color: 'gold',
      icon: <FiCalendar className="text-gold-500" />,
    },
    {
      title: 'Pending',
      value: appointments.filter((a) => a.status === 'pending').length,
      color: 'blue',
      icon: <FiClock className="text-blue-500" />,
    },
    {
      title: 'Confirmed',
      value: appointments.filter((a) => a.status === 'confirmed').length,
      color: 'green',
      icon: <FiCheck className="text-green-500" />,
    },
    {
      title: 'Completed',
      value: appointments.filter((a) => a.status === 'completed').length,
      color: 'purple',
      icon: <FiCheck className="text-purple-500" />,
    },
    {
      title: 'Cancelled',
      value: appointments.filter((a) => a.status === 'cancelled').length,
      color: 'red',
      icon: <FiX className="text-red-500" />,
    },
  ], [appointments]);

  return (
    <div className="min-h-screen bg-black text-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gold-500 pb-4 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gold-500 flex items-center">
          <FiCalendar className="inline mr-2" />
          Appointment Management
        </h1>
        
        <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
          <div className="relative flex-1 md:flex-none md:w-48">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiFilter className="text-gold-400" />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full bg-gray-800 border border-gold-500 text-gold-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">All Statuses</option>
              {['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'].map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative flex-1 md:flex-none md:w-48">
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full bg-gray-800 border border-gold-500 text-gold-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          
          {(filters.date || filters.status) && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-gold-200 px-4 py-2 rounded-lg transition"
            >
              <FiX className="mr-1" /> Clear
            </button>
          )}
          
          <button
            onClick={loadAppointments}
            className="flex items-center justify-center bg-gold-500 hover:bg-gold-600 text-gray-900 px-4 py-2 rounded-lg transition"
          >
            <FiRefreshCw className="mr-1" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Appointments Table */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gold-500">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500 mx-auto"></div>
            <p className="mt-4 text-gold-500">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400">No appointments found matching your criteria</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-gold-500 hover:underline flex items-center justify-center mx-auto"
            >
              <FiX className="mr-1" /> Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto max-h-[calc(100vh-300px)]">
              <table className="min-w-full divide-y divide-gold-500/30">
                <thead className="bg-gray-900 sticky top-0">
                  <tr>
                    {['Customer', 'Date & Time', 'Services', 'Total', 'Status', 'Actions'].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-xs font-medium text-gold-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-black divide-y divide-gold-500/30">
                  {paginatedAppointments.map((appointment) => (
                    <tr 
                      key={appointment._id} 
                      className="hover:bg-gray-700/50 transition cursor-pointer"
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setIsModalOpen(true);
                      }}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                            <FiUser className="text-gold-500" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gold-200 line-clamp-1">
                              {appointment.customer?.name || 'Unknown Customer'}
                            </div>
                            <div className="text-xs text-gray-400 line-clamp-1">
                              {appointment.customer?.phone || appointment.customer?.email || 'No contact'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gold-200">{formatDate(appointment.appointmentDate)}</div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <FiClock className="mr-1" /> {formatTime(appointment.timeSlot)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {appointment.combo ? (
                            <ServiceTag name={appointment.combo.name || 'Combo'} isCombo />
                          ) : (
                            (appointment.services || []).slice(0, 2).map((service) => (
                              <ServiceTag key={service._id} name={service.name || 'Service'} />
                            ))
                          )}
                          {(appointment.services || []).length > 2 && (
                            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                              +{(appointment.services || []).length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gold-200">
                        ₹{calculateTotal(appointment).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={appointment.status} />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppointment(appointment);
                              setIsModalOpen(true);
                            }}
                            className="text-gold-500 hover:text-gold-400 transition p-1"
                            title="Update Status"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppointment(appointment);
                              setIsRescheduleModalOpen(true);
                            }}
                            className="text-blue-500 hover:text-blue-400 transition p-1"
                            title="Reschedule"
                          >
                            <FiRefreshCw />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredAppointments.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-gray-700 border-t border-gold-500/30">
                <div className="text-sm text-gold-300 mb-2 sm:mb-0">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredAppointments.length)} of{' '}
                  {filteredAppointments.length} appointments
                </div>
                
                <div className="flex items-center space-x-1">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-gray-800 border border-gold-500/50 text-gold-200 rounded px-2 py-1 text-sm"
                  >
                    {[5, 10, 20, 50].map(size => (
                      <option key={size} value={size}>{size} per page</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className={`p-1 rounded ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-gold-400 hover:bg-gray-600'}`}
                  >
                    <FiChevronLeft className="w-5 h-5" />
                    <span className="sr-only">First</span>
                  </button>
                  
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-1 rounded ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-gold-400 hover:bg-gray-600'}`}
                  >
                    <FiChevronLeft className="w-5 h-5" />
                    <span className="sr-only">Previous</span>
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded text-sm ${currentPage === pageNum ? 'bg-gold-600 text-white' : 'text-gold-300 hover:bg-gray-600'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-1 rounded ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-gold-400 hover:bg-gray-600'}`}
                  >
                    <FiChevronRight className="w-5 h-5" />
                    <span className="sr-only">Next</span>
                  </button>
                  
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`p-1 rounded ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-gold-400 hover:bg-gray-600'}`}
                  >
                    <FiChevronRight className="w-5 h-5" />
                    <span className="sr-only">Last</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <StatusUpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={selectedAppointment}
        onUpdate={handleStatusUpdate}
      />

      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        appointment={selectedAppointment}
        onReschedule={handleReschedule}
      />
    </div>
  );
};

export default AdminAppointments;