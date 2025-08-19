import { FiClock, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-500/20 text-yellow-500', icon: <FiClock className="mr-1" /> },
    confirmed: { color: 'bg-blue-500/20 text-blue-500', icon: <FiCheck className="mr-1" /> },
    completed: { color: 'bg-green-500/20 text-green-500', icon: <FiCheck className="mr-1" /> },
    cancelled: { color: 'bg-red-500/20 text-red-500', icon: <FiX className="mr-1" /> },
    rescheduled: { color: 'bg-purple-500/20 text-purple-500', icon: <FiRefreshCw className="mr-1" /> },
  };

  const config = statusConfig[status] || { color: 'bg-gray-500/20 text-gray-500', icon: null };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${config.color}`}>
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
