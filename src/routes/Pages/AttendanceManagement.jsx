import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AttendanceManagement = () => {
  // State variables
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [action, setAction] = useState('checkIn');
  const [manualDate, setManualDate] = useState('');
  const [manualTime, setManualTime] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayNotes, setHolidayNotes] = useState('');
  const [summaryData, setSummaryData] = useState(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [showDeleteHolidayModal, setShowDeleteHolidayModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showStaffListModal, setShowStaffListModal] = useState(false);
  const [showTodaysStatusModal, setShowTodaysStatusModal] = useState(false);
  const [todaysAttendance, setTodaysAttendance] = useState({
    date: '',
    totalStaff: 0,
    presentCount: 0,
    absentCount: 0,
    holidayCount: 0,
    presentStaff: [],
    absentStaff: [],
    holidayStaff: []
  });
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  // API base URL
  const API_URL = 'http://localhost:5000/api';

  // Fetch staff list on component mount
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`${API_URL}/staff`);
        setStaffList(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch staff list');
      }
    };
    fetchStaff();
  }, []);

  // Fetch today's attendance and upcoming holidays
  useEffect(() => {
    const fetchTodaysData = async () => {
      try {
        // Fetch today's attendance using the new endpoint
        const attendanceRes = await axios.get(`${API_URL}/attendance/today`);
        setTodaysAttendance(attendanceRes.data.data);

        // Fetch upcoming holidays (next 30 days)
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const nextMonth = new Date();
        nextMonth.setDate(nextMonth.getDate() + 30);
        
        const holidaysRes = await axios.get(`${API_URL}/attendance`, {
          params: {
            startDate: todayStr,
            endDate: nextMonth.toISOString().split('T')[0],
            isHoliday: true
          }
        });
        setUpcomingHolidays(holidaysRes.data.data);
      } catch (error) {
        console.error('Error fetching todays data:', error);
        toast.error('Failed to fetch today\'s attendance data');
      }
    };
    
    fetchTodaysData();
  }, []);

  // Handle attendance recording
  const handleRecordAttendance = async () => {
    try {
      const payload = {
        staffId: selectedStaff,
        action,
        ...(manualDate && { date: manualDate }),
        ...(manualTime && { time: manualTime })
      };

      const response = await axios.post(`${API_URL}/attendance`, payload);
      
      toast.success(response.data.message);
      setShowRecordModal(false);
      // Refresh data
      fetchAttendanceRecords();
      fetchTodaysData(); // Refresh today's attendance
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to record attendance');
    }
  };

  // Handle holiday declaration
  const handleDeclareHoliday = async () => {
    try {
      const payload = {
        date: holidayDate,
        notes: holidayNotes
      };

      const response = await axios.post(`${API_URL}/attendance/holiday`, payload);
      
      toast.success(response.data.message);
      setShowHolidayModal(false);
      // Refresh data
      fetchAttendanceRecords();
      fetchTodaysData(); // Refresh upcoming holidays
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to declare holiday');
    }
  };

  // Handle holiday deletion
  const handleDeleteHoliday = async () => {
    try {
      const response = await axios.delete(`${API_URL}/attendance/holiday`, {
        data: { date: holidayDate }
      });
      
      toast.success(response.data.message);
      setShowDeleteHolidayModal(false);
      // Refresh data
      fetchAttendanceRecords();
      fetchTodaysData(); // Refresh upcoming holidays
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete holiday');
    }
  };

  // Fetch attendance records by date range
  const fetchAttendanceRecords = async () => {
    if (!startDate || !endDate) return;
    
    try {
      const response = await axios.get(`${API_URL}/attendance`, {
        params: { startDate, endDate }
      });
      
      setAttendanceRecords(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to fetch attendance records');
    }
  };

  // Fetch today's attendance and upcoming holidays
  const fetchTodaysData = async () => {
    try {
      // Fetch today's attendance using the new endpoint
      const attendanceRes = await axios.get(`${API_URL}/attendance/today`);
      setTodaysAttendance(attendanceRes.data.data);

      // Fetch upcoming holidays (next 30 days)
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const nextMonth = new Date();
      nextMonth.setDate(nextMonth.getDate() + 30);
      
      const holidaysRes = await axios.get(`${API_URL}/attendance`, {
        params: {
          startDate: todayStr,
          endDate: nextMonth.toISOString().split('T')[0],
          isHoliday: true
        }
      });
      setUpcomingHolidays(holidaysRes.data.data);
    } catch (error) {
      console.error('Error fetching todays data:', error);
      toast.error('Failed to fetch today\'s attendance data');
    }
  };

  // Fetch attendance summary for a staff member
  const fetchAttendanceSummary = async (staffId) => {
    try {
      const today = new Date();
      const response = await axios.get(`${API_URL}/staff/${staffId}/attendance/summary`, {
        params: { 
          month: today.getMonth() + 1,
          year: today.getFullYear()
        }
      });
      
      setSummaryData(response.data.data);
      setShowSummaryModal(true);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to fetch attendance summary');
    }
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format date to YYYY-MM-DD
  const formatDateInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="min-h-screen bg-black text-gold-500">
      {/* Header */}
      <header className="bg-black shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gold-500">
            <span className="text-gold-500">Attendance</span> Management
          </h1>
          <div className="text-sm text-gray-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'dashboard' ? 'border-gold-500 text-gold-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'records' ? 'border-gold-500 text-gold-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
            >
              Attendance Records
            </button>
            <button
              onClick={() => setActiveTab('holidays')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'holidays' ? 'border-gold-500 text-gold-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
            >
              Holidays
            </button>
            <button
              onClick={() => { setShowStaffListModal(true); }}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'staff' ? 'border-gold-500 text-gold-400' : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'}`}
            >
              Staff List
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg shadow p-4 border-l-4 border-gold-500">
                <h3 className="text-sm font-medium text-gray-300">Total Staff</h3>
                <p className="text-2xl font-bold">{todaysAttendance.totalStaff}</p>
              </div>
              <div className="bg-gray-800 rounded-lg shadow p-4 border-l-4 border-green-500">
                <h3 className="text-sm font-medium text-gray-300">Present Today</h3>
                <p className="text-2xl font-bold">{todaysAttendance.presentCount}</p>
              </div>
              <div className="bg-gray-800 rounded-lg shadow p-4 border-l-4 border-red-500">
                <h3 className="text-sm font-medium text-gray-300">Absent Today</h3>
                <p className="text-2xl font-bold">{todaysAttendance.absentCount}</p>
              </div>
              <div className="bg-gray-800 rounded-lg shadow p-4 border-l-4 border-purple-500">
                <h3 className="text-sm font-medium text-gray-300">On Holiday</h3>
                <p className="text-2xl font-bold">{todaysAttendance.holidayCount}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowRecordModal(true)}
                className="bg-gold-600 hover:bg-gold-700 text-black font-bold py-2 px-4 rounded flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Record Attendance
              </button>
              <button
                onClick={() => setShowTodaysStatusModal(true)}
                className="bg-gray-700 hover:bg-black text-gold-500 font-bold py-2 px-4 rounded flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Today's Status
              </button>
              <button
                onClick={() => setShowHolidayModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-gold-500 font-bold py-2 px-4 rounded flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Declare Holiday
              </button>
            </div>

            {/* Upcoming Holidays Section */}
            {upcomingHolidays.length > 0 && (
              <div className="bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gold-400">Upcoming Holidays</h2>
                  <button 
                    onClick={() => setShowDeleteHolidayModal(true)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Remove Holiday
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingHolidays.map((holiday) => (
                    <div key={holiday._id} className="bg-gray-700 p-4 rounded-lg border-l-4 border-purple-500">
                      <h3 className="font-semibold text-lg">{formatDate(holiday.date)}</h3>
                      <p className="text-gray-300 mt-1">{holiday.notes || 'Public Holiday'}</p>
                      <div className="mt-2 text-sm text-purple-300">
                        {Math.floor((new Date(holiday.date) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Records Tab */}
        {activeTab === 'records' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 text-gold-400">Attendance Records</h2>
              <div className="flex flex-wrap gap-4 items-center mb-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-gray-700 border border-black rounded py-2 px-3"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-gray-700 border border-black rounded py-2 px-3"
                  />
                </div>
                <button
                  onClick={fetchAttendanceRecords}
                  className="bg-gold-600 hover:bg-gold-700 text-black font-bold py-2 px-4 rounded mt-6"
                >
                  Fetch Records
                </button>
              </div>

              {attendanceRecords.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">Staff</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">Check In</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">Check Out</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {attendanceRecords.map((record) => (
                        <tr key={record._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {record.staffId?.name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{record.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{formatTime(record.checkIn)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{formatTime(record.checkOut)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              record.status === 'Present' ? 'bg-green-600' :
                              record.status === 'Absent' ? 'bg-red-600' :
                              record.status === 'Late' ? 'bg-yellow-600' :
                              record.status === 'Half-Day' ? 'bg-blue-600' :
                              'bg-purple-600' // Holiday
                            }`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => fetchAttendanceSummary(record.staffId._id)}
                              className="text-gold-400 hover:text-gold-300 mr-2"
                            >
                              Summary
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  {startDate && endDate ? 'No records found for the selected date range' : 'Select a date range to view attendance records'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Holidays Tab */}
        {activeTab === 'holidays' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gold-400">Holiday Management</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowHolidayModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-gold-500 font-bold py-2 px-4 rounded"
                  >
                    Declare Holiday
                  </button>
                  <button
                    onClick={() => setShowDeleteHolidayModal(true)}
                    className="bg-gray-700 hover:bg-black text-gold-500 font-bold py-2 px-4 rounded"
                  >
                    Remove Holiday
                  </button>
                </div>
              </div>

              {upcomingHolidays.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">Day</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">Notes</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">Days Remaining</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {upcomingHolidays.map((holiday) => (
                        <tr key={holiday._id}>
                          <td className="px-6 py-4 whitespace-nowrap">{holiday.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long' })}
                          </td>
                          <td className="px-6 py-4">{holiday.notes || 'Public Holiday'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {Math.floor((new Date(holiday.date) - new Date()) / (1000 * 60 * 60 * 24))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No upcoming holidays scheduled
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      
      {/* Record Attendance Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gold-400">Record Attendance</h2>
              <button 
                onClick={() => setShowRecordModal(false)}
                className="text-gray-400 hover:text-gold-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Staff Member</label>
                <select
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                  className="w-full bg-gray-700 border border-black rounded py-2 px-3 focus:border-gold-500 focus:ring-gold-500"
                >
                  <option value="">Select Staff</option>
                  {staffList.map(staff => (
                    <option key={staff._id} value={staff._id}>
                      {staff.name} ({staff.role})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Action</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={action === 'checkIn'}
                      onChange={() => setAction('checkIn')}
                      className="text-gold-600 focus:ring-gold-500"
                    />
                    <span className="ml-2">Check In</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={action === 'checkOut'}
                      onChange={() => setAction('checkOut')}
                      className="text-gold-600 focus:ring-gold-500"
                    />
                    <span className="ml-2">Check Out</span>
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Manual Date</label>
                  <input
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full bg-gray-700 border border-black rounded py-2 px-3 focus:border-gold-500 focus:ring-gold-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Manual Time</label>
                  <input
                    type="time"
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    className="w-full bg-gray-700 border border-black rounded py-2 px-3 focus:border-gold-500 focus:ring-gold-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowRecordModal(false)}
                className="bg-black hover:bg-gray-500 text-gold-500 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordAttendance}
                className="bg-gold-600 hover:bg-gold-700 text-black font-bold py-2 px-4 rounded"
                disabled={!selectedStaff}
              >
                Record
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Declare Holiday Modal */}
      {showHolidayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gold-400">Declare Holiday</h2>
              <button 
                onClick={() => setShowHolidayModal(false)}
                className="text-gray-400 hover:text-gold-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Holiday Date</label>
                <input
                  type="date"
                  value={holidayDate}
                  onChange={(e) => setHolidayDate(e.target.value)}
                  className="w-full bg-gray-700 border border-black rounded py-2 px-3 focus:border-gold-500 focus:ring-gold-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={holidayNotes}
                  onChange={(e) => setHolidayNotes(e.target.value)}
                  className="w-full bg-gray-700 border border-black rounded py-2 px-3 focus:border-gold-500 focus:ring-gold-500"
                  rows="3"
                  placeholder="Optional description of the holiday"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowHolidayModal(false)}
                className="bg-black hover:bg-gray-500 text-gold-500 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeclareHoliday}
                className="bg-purple-600 hover:bg-purple-700 text-gold-500 font-bold py-2 px-4 rounded"
                disabled={!holidayDate}
              >
                Declare Holiday
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Holiday Modal */}
      {showDeleteHolidayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gold-400">Remove Holiday</h2>
              <button 
                onClick={() => setShowDeleteHolidayModal(false)}
                className="text-gray-400 hover:text-gold-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Holiday Date</label>
                <input
                  type="date"
                  value={holidayDate}
                  onChange={(e) => setHolidayDate(e.target.value)}
                  className="w-full bg-gray-700 border border-black rounded py-2 px-3 focus:border-gold-500 focus:ring-gold-500"
                />
              </div>
              
              <p className="text-yellow-200 text-sm">
                This will remove the holiday declaration for all staff on this date.
              </p>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowDeleteHolidayModal(false)}
                className="bg-black hover:bg-gray-500 text-gold-500 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteHoliday}
                className="bg-red-600 hover:bg-red-700 text-gold-500 font-bold py-2 px-4 rounded"
                disabled={!holidayDate}
              >
                Remove Holiday
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Attendance Summary Modal */}
      {showSummaryModal && summaryData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gold-400">Attendance Summary</h2>
              <button 
                onClick={() => setShowSummaryModal(false)}
                className="text-gray-400 hover:text-gold-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 p-3 rounded border-l-4 border-gold-500">
                  <h3 className="text-sm font-medium text-gray-300">Month</h3>
                  <p className="text-lg font-semibold">
                    {new Date(summaryData.year, summaryData.month - 1).toLocaleString('default', { month: 'long' })} {summaryData.year}
                  </p>
                </div>
                <div className="bg-gray-700 p-3 rounded border-l-4 border-gold-500">
                  <h3 className="text-sm font-medium text-gray-300">Total Days</h3>
                  <p className="text-lg font-semibold">{summaryData.totalDays}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-900 p-3 rounded border-l-4 border-green-500">
                  <h3 className="text-sm font-medium text-gray-300">Present</h3>
                  <p className="text-lg font-semibold">{summaryData.present}</p>
                </div>
                <div className="bg-red-900 p-3 rounded border-l-4 border-red-500">
                  <h3 className="text-sm font-medium text-gray-300">Absent</h3>
                  <p className="text-lg font-semibold">{summaryData.absent}</p>
                </div>
                <div className="bg-yellow-900 p-3 rounded border-l-4 border-yellow-500">
                  <h3 className="text-sm font-medium text-gray-300">Late</h3>
                  <p className="text-lg font-semibold">{summaryData.late}</p>
                </div>
                <div className="bg-blue-900 p-3 rounded border-l-4 border-blue-500">
                  <h3 className="text-sm font-medium text-gray-300">Half-Day</h3>
                  <p className="text-lg font-semibold">{summaryData.halfDay}</p>
                </div>
              </div>
              
              <div className="bg-gray-700 p-3 rounded border-l-4 border-gold-500">
                <h3 className="text-sm font-medium text-gray-300">Holidays</h3>
                <p className="text-lg font-semibold">{summaryData.holidays}</p>
              </div>
              
              <div className="bg-purple-900 p-3 rounded border-l-4 border-purple-500">
                <h3 className="text-sm font-medium text-gray-300">Total Working Hours</h3>
                <p className="text-lg font-semibold">{summaryData.workingHours.toFixed(2)} hrs</p>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="bg-black hover:bg-gray-500 text-gold-500 font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff List Modal */}
      {showStaffListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gold-400">Staff List</h2>
              <button 
                onClick={() => setShowStaffListModal(false)}
                className="text-gray-400 hover:text-gold-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">Role</th>
                  
                    <th className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {staffList.map((staff) => (
                    <tr key={staff._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gold-400">
                            {staff.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">{staff.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{staff.role}</div>
                      </td>
                    
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{staff.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => {
                            setSelectedStaff(staff._id);
                            setShowRecordModal(true);
                            setShowStaffListModal(false);
                          }}
                          className="text-gold-400 hover:text-gold-300 mr-3"
                        >
                          Mark Attendance
                        </button>
                        <button
                          onClick={() => {
                            fetchAttendanceSummary(staff._id);
                            setShowStaffListModal(false);
                          }}
                          className="text-gold-400 bg-black px-3 py-2 rounded-lg hover:text-gold-300"
                        >
                          View Summary
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowStaffListModal(false)}
                className="bg-black hover:bg-gray-500 text-gold-500 font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Today's Status Modal */}
      {showTodaysStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gold-400">
                Today's Attendance - {todaysAttendance.date || formatDateInput(new Date())}
              </h2>
              <button 
                onClick={() => setShowTodaysStatusModal(false)}
                className="text-gray-400 hover:text-gold-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Present Staff Table */}
            {todaysAttendance.presentStaff.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 text-green-400">Present Staff ({todaysAttendance.presentCount})</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Check In</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Check Out</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Hours</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {todaysAttendance.presentStaff.map((staff) => (
                        <tr key={staff.staffId}>
                          <td className="px-4 py-2 whitespace-nowrap">{staff.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{staff.role}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{formatTime(staff.checkIn)}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{formatTime(staff.checkOut)}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{staff.workingHours || '--'}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <button
                              onClick={() => {
                                fetchAttendanceSummary(staff.staffId);
                                setShowTodaysStatusModal(false);
                              }}
                              className="text-gold-400 hover:text-gold-300 text-sm"
                            >
                              Summary
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Absent Staff Table */}
            {todaysAttendance.absentStaff.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 text-red-400">Absent Staff ({todaysAttendance.absentCount})</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {todaysAttendance.absentStaff.map((staff) => (
                        <tr key={staff.staffId}>
                          <td className="px-4 py-2 whitespace-nowrap">{staff.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{staff.role}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className="px-2 py-1 rounded-full text-xs bg-red-600">
                              {staff.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <button
                              onClick={() => {
                                fetchAttendanceSummary(staff.staffId);
                                setShowTodaysStatusModal(false);
                              }}
                              className="text-gold-400 hover:text-gold-300 text-sm"
                            >
                              Summary
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Holiday Staff Table */}
            {todaysAttendance.holidayStaff.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2 text-purple-400">Staff on Holiday ({todaysAttendance.holidayCount})</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {todaysAttendance.holidayStaff.map((staff) => (
                        <tr key={staff.staffId}>
                          <td className="px-4 py-2 whitespace-nowrap">{staff.name}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{staff.role}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className="px-2 py-1 rounded-full text-xs bg-purple-600">
                              {staff.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <button
                              onClick={() => {
                                fetchAttendanceSummary(staff.staffId);
                                setShowTodaysStatusModal(false);
                              }}
                              className="text-gold-400 hover:text-gold-300 text-sm"
                            >
                              Summary
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowTodaysStatusModal(false)}
                className="bg-black hover:bg-gray-500 text-gold-500 font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;