// services/appointmentsApi.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/appointments";

// Function to get admin token from localStorage
const getToken = () => localStorage.getItem("adminToken");

// GET: Fetch all appointments with optional filters
export const fetchAppointmentsApi = async (filters = {}) => {
  const params = {};
  if (filters.date) params.date = filters.date;
  if (filters.status) params.status = filters.status;

  const res = await axios.get(BASE_URL, {
    params,
    headers: { "x-auth-token": getToken() },
  });
  return res.data;
};


export const fetchtodayAppointmentsApi = async () => {


  const res = await axios.get(`${BASE_URL}/today`, {
  
    headers: { "x-auth-token": getToken() },
  });
  console.log("Today Appointments:", res.data);
  return res.data;
};

// PUT: Update appointment status
export const updateAppointmentStatusApi = async (appointmentId, status) => {
  const res = await axios.put(
    `${BASE_URL}/${appointmentId}/status`,
    { status },
    { headers: { "x-auth-token": getToken() } }
  );
  return res.data;
};

// PUT: Reschedule appointment
export const rescheduleAppointmentApi = async (
  appointmentId,
  { appointmentDate, timeSlot }
) => {
  const res = await axios.put(
    `${BASE_URL}/${appointmentId}/reschedule`,
    { appointmentDate, timeSlot },
    { headers: { "x-auth-token": getToken() } }
  );
  return res.data;
};
