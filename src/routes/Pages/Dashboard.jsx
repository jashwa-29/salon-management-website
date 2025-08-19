// pages/Dashboard/Dashboard.jsx
import { Calendar, Scissors, Layers, Users } from 'lucide-react';
import useDashboardData from '../../hooks/useDashboardData';
import DashboardHeader from '../../Components/dashboardComponents/DashboardHeader';
import StatsCards from '../../Components/dashboardComponents/StatsCards';
import UpcomingAppointments from '../../Components/dashboardComponents/UpcomingAppointments';
import QuickActions from '../../Components/dashboardComponents/QuickActions';
import AllAppointmentsModal from '../../Components/dashboardComponents/AllAppointmentsModal';
import CreateCustomerModal from '../../Components/dashboardComponents/CreateCustomerModal';
import { useState } from 'react';

export default function Dashboard() {
  const { todaysAppointments, services, combos, customers, isLoading, handleStatusUpdate } = useDashboardData();
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [showAllAppointments, setShowAllAppointments] = useState(false);

  const filteredAppointments = todaysAppointments.filter(
    app => ['confirmed', 'pending', 'rescheduled'].includes(app.status)
  );

  const stats = [
    { title: "Today's Appointments", count: filteredAppointments.length, icon: <Calendar className="w-6 h-6" />, onClick: () => setShowAllAppointments(true) },
    { title: "Services", count: services.length, icon: <Scissors className="w-6 h-6" /> },
    { title: "Combos", count: combos.length, icon: <Layers className="w-6 h-6" /> },
    { title: "Customers", count: customers.length, icon: <Users className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen bg-black p-6 space-y-8">
      <DashboardHeader />
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      ) : (
        <>
          <StatsCards stats={stats} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       
<UpcomingAppointments
  appointments={filteredAppointments}
  onStatusUpdate={handleStatusUpdate}
  onViewAll={() => setShowAllAppointments(true)}
/>

            <QuickActions onAddCustomer={() => setShowCreateCustomerModal(true)} />
          </div>
        </>
      )}
      {showAllAppointments && (
        <AllAppointmentsModal 
          appointments={filteredAppointments} 
          onClose={() => setShowAllAppointments(false)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
      {showCreateCustomerModal && (
        <CreateCustomerModal 
          onClose={() => setShowCreateCustomerModal(false)}
          onCustomerCreated={(newCustomer) => setCustomers(prev => [...prev, newCustomer])}
        />
      )}
    </div>
  );
}
