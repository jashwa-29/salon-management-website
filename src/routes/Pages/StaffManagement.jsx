import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StaffList from '../../Components/StaffComponents/StaffList';
import StaffFilters from '../../Components/StaffComponents/StaffFilters';
import { StaffModal, DeleteModal } from '../../Components/StaffComponents/StaffModals';

const StaffManagement = () => {
  // State for staff data and UI
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    aadhaar: '',
    dob: '',
    gender: '',
    address: '',
    salary: '',
    role: '',
    isActive: true
  });

  // Roles for dropdown
  const roles = ['Barber', 'Stylist', 'Receptionist', 'Manager'];

  // Fetch all staff on component mount
  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/staff');
      setStaffList(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch staff data');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // Filter staff based on search and filters
  useEffect(() => {
    let result = staffList;
    
    if (searchTerm) {
      result = result.filter(staff => 
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.phone.includes(searchTerm) ||
        staff.aadhaar.includes(searchTerm)
      );
    }
    
    if (filterRole !== 'all') {
      result = result.filter(staff => staff.role === filterRole);
    }
    
    if (filterStatus !== 'all') {
      result = result.filter(staff => staff.isActive === (filterStatus === 'active'));
    }
    
    setFilteredStaff(result);
  }, [staffList, searchTerm, filterRole, filterStatus]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      phone: '',
      aadhaar: '',
      dob: '',
      gender: '',
      address: '',
      salary: '',
      role: '',
      isActive: true
    });
  }, []);

  // Open add staff modal
  const openAddModal = useCallback(() => {
    resetForm();
    setShowAddModal(true);
  }, [resetForm]);

  // Open edit staff modal
  const openEditModal = useCallback((staff) => {
    setCurrentStaff(staff);
    setFormData({
      name: staff.name,
      phone: staff.phone,
      aadhaar: staff.aadhaar,
      dob: staff.dob.split('T')[0], // Format date for input
      gender: staff.gender,
      address: staff.address,
      salary: staff.salary,
      role: staff.role,
      isActive: staff.isActive
    });
    setShowEditModal(true);
  }, []);

  // Open delete confirmation modal
  const openDeleteModal = useCallback((staff) => {
    setCurrentStaff(staff);
    setShowDeleteModal(true);
  }, []);

  // Add new staff member
  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/staff', formData);
      setStaffList([...staffList, response.data.data]);
      setShowAddModal(false);
      toast.success('Staff member added successfully');
    } catch (error) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to add staff member');
      }
    }
  };

  // Update staff member
  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/api/staff/${currentStaff._id}`,
        formData
      );
      
      setStaffList(staffList.map(staff => 
        staff._id === currentStaff._id ? response.data.data : staff
      ));
      
      setShowEditModal(false);
      toast.success('Staff member updated successfully');
    } catch (error) {
      if (error.response && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to update staff member');
      }
    }
  };

  // Delete staff member
  const handleDeleteStaff = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/staff/${currentStaff._id}`);
      setStaffList(staffList.filter(staff => staff._id !== currentStaff._id));
      setShowDeleteModal(false);
      toast.success('Staff member deleted successfully');
    } catch (error) {
      toast.error('Failed to delete staff member');
    }
  };

  // Toggle staff active status
  const toggleStaffStatus = async (staff) => {
    try {
      const updatedStaff = { ...staff, isActive: !staff.isActive };
      const response = await axios.put(
        `http://localhost:5000/api/staff/${staff._id}`,
        { isActive: !staff.isActive }
      );
      
      setStaffList(staffList.map(s => 
        s._id === staff._id ? response.data.data : s
      ));
      
      toast.success(`Staff member ${updatedStaff.isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      toast.error('Failed to update staff status');
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gold-500">
          <span className="text-yellow-500">Staff</span> Management
        </h1>
        <button
          onClick={openAddModal}
          className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-2 px-4 rounded-lg flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Staff
        </button>
      </div>

      {/* Filters and Search */}
      <StaffFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        roles={roles}
      />

      {/* Staff Table */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <StaffList
          staff={filteredStaff}
          loading={loading}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onToggleStatus={toggleStaffStatus}
        />
      </div>

      {/* Add Staff Modal */}
      <StaffModal
        title="Add New Staff Member"
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleAddStaff}
        roles={roles}
      />

      {/* Edit Staff Modal */}
      <StaffModal
        title="Edit Staff Member"
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleUpdateStaff}
        roles={roles}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal
          staff={currentStaff}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteStaff}
        />
      )}
    </div>
  );
};

export default StaffManagement;