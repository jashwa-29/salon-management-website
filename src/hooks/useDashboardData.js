// hooks/useDashboardData.js
import { useEffect, useState } from 'react';
import { fetchtodayAppointmentsApi, updateAppointmentStatusApi } from '../services/appointmentService';
import { fetchServicesApi } from '../services/servicesApi';
import { fetchCombos } from '../services/comboService';
import { fetchCustomerApi } from '../services/customerService';

export default function useDashboardData() {
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [combos, setCombos] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [appointments, servicesData, combosData, customersData] = await Promise.all([
        fetchtodayAppointmentsApi(),
        fetchServicesApi(),
        fetchCombos(),
        fetchCustomerApi()
      ]);

      const sortedAppointments = appointments.sort((a, b) => {
        const statusOrder = { 'confirmed': 1, 'pending': 2 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return a.timeSlot.localeCompare(b.timeSlot);
      });

      setTodaysAppointments(sortedAppointments);
      setServices(servicesData);
      setCombos(combosData);
      setCustomers(customersData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatusApi(appointmentId, newStatus);
      setTodaysAppointments(prev => 
        prev.map(app => app._id === appointmentId ? { ...app, status: newStatus } : app)
      );
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  return {
    todaysAppointments,
    services,
    combos,
    customers,
    isLoading,
    fetchDashboardData,
    handleStatusUpdate
  };
}
