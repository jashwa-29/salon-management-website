// components/dashboard/QuickActions.jsx
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickActions({ onAddCustomer }) {
  const navigate = useNavigate();

  return (
    <div className="bg-black rounded-xl border border-gray-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-yellow-500 flex items-center space-x-2">
          <span>Quick Actions</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={onAddCustomer}
          className="py-3 px-6 border border-yellow-600/50 text-yellow-500 rounded-lg hover:bg-yellow-600/10 transition-all flex items-center justify-between group"
        >
          <span className="font-medium">Add Customer</span>
          <Plus className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        
        <button 
          onClick={() => navigate('/dashboard/service')}
          className="py-3 px-6 border border-yellow-600/50 text-yellow-500 rounded-lg hover:bg-yellow-600/10 transition-all flex items-center justify-between group"
        >
          <span className="font-medium">Create Service</span>
          <Plus className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );
}
