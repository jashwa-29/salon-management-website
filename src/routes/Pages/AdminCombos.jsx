import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FiPlus } from 'react-icons/fi';
import AlertPopup from '../../Components/serviceComponents/AlertPopup';
import ComboTable from '../../Components/comboComponents/ComboTable';
import ComboFormModal from '../../Components/comboComponents/ComboFormModal';
import ComboViewModal from '../../Components/comboComponents/ComboViewModal';

const AdminCombos = () => {
  const [combos, setCombos] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentCombo, setCurrentCombo] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    gender: 'unisex',
    services: [],
    discount: 0,
  });
  const [serviceInput, setServiceInput] = useState('');
  const [sequenceInput, setSequenceInput] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const token = localStorage.getItem("adminToken");
  useEffect(() => {
  console.log('Form data changed:', formData);
}, [formData]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [combosRes, servicesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/combos', {
          headers: { 'x-auth-token': token },
        }),
        axios.get('http://localhost:5000/api/services', {
          headers: { 'x-auth-token': token },
        }),
      ]);
      setCombos(combosRes.data);
      setServices(servicesRes.data);
    } catch (err) {
      AlertPopup.error('Failed to fetch data');
      console.error('Fetch error:', err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addService = () => {
    if (!serviceInput) {
      AlertPopup.warning('Please select a service');
      return;
    }
    
    const selectedService = services.find(s => s._id === serviceInput);
    if (!selectedService) {
      AlertPopup.error('Selected service not found');
      return;
    }
    
    const newService = {
      service: serviceInput,
      sequence: sequenceInput || 1,
      name: selectedService.name,
      duration: selectedService.duration,
      price: selectedService.price,
    };
    
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, newService],
    }));
    
    setServiceInput('');
    setSequenceInput(1);
  };

  const removeService = (index) => {
    setFormData(prev => {
      const updatedServices = [...prev.services];
      updatedServices.splice(index, 1);
      return { ...prev, services: updatedServices };
    });
  };

  const openCreateModal = () => {
    setCurrentCombo(null);
    setFormData({
      name: '',
      description: '',
      gender: 'unisex',
      services: [],
      discount: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (combo) => {
    if (!combo || !combo._id) {
      AlertPopup.error('Invalid combo data');
      return;
    }

    setCurrentCombo(combo);
    
    // Safely map services with proper null checks
    const mappedServices = combo.services.map(svc => {
      // Handle both populated and unpopulated service cases
      const serviceId = svc.service?._id || svc.service;
      if (!serviceId) {
        console.warn('Invalid service in combo:', svc);
        return null;
      }

      return {
        service: serviceId,
        sequence: svc.sequence || 1,
        name: svc.name || svc.service?.name || 'Unknown Service',
        duration: svc.duration || svc.service?.duration || 0,
        price: svc.price || svc.service?.price || 0
      };
    }).filter(Boolean); // Remove any null entries

    setFormData({
      name: combo.name,
      description: combo.description || '',
      gender: combo.gender || 'unisex',
      discount: combo.discount || 0,
      services: mappedServices
    });
    
    setIsModalOpen(true);
  };

  const openViewModal = (combo) => {
    setCurrentCombo(combo);
    setIsViewModalOpen(true);
  };

  const calculateTotalPrice = useMemo(() => {
    const subtotal = formData.services.reduce((sum, svc) => sum + (svc.price || 0), 0);
    return subtotal - (subtotal * (formData.discount || 0) / 100);
  }, [formData.services, formData.discount]);

  const calculateTotalDuration = useMemo(() => {
    return formData.services.reduce((sum, svc) => sum + (svc.duration || 0), 0);
  }, [formData.services]);

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Debug: Log current form state
  console.log('Current form data:', formData);
  
  try {
    const comboData = {
      name: formData.name,
      description: formData.description,
      gender: formData.gender,
      discount: formData.discount, // No need for Number() conversion now
      services: formData.services.map(svc => ({
        service: svc.service,
        sequence: svc.sequence || 1
      }))
    };

    // Debug: Log what will be sent to API
    console.log('Data being sent to API:', comboData);

    const config = {
      headers: { 
        'x-auth-token': token,
        'Content-Type': 'application/json'
      }
    };

    if (currentCombo) {
      const response = await axios.put(
        `http://localhost:5000/api/combos/${currentCombo._id}`,
        comboData,
        config
      );
      console.log('API Response:', response.data);
      AlertPopup.success('Combo updated successfully');
    } else {
      const response = await axios.post(
        'http://localhost:5000/api/combos',
        comboData,
        config
      );
      console.log('API Response:', response.data);
      AlertPopup.success('Combo created successfully');
    }
    
    await fetchData();
    setIsModalOpen(false);
  } catch (err) {
    console.error('Full error:', err);
    console.error('Error response:', err.response?.data);
    AlertPopup.error(err.response?.data?.msg || 'Error saving combo');
  }
};

  const toggleComboStatus = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/combos/${id}/status`, 
        {}, 
        {
          headers: { 'x-auth-token': token }
        }
      );
      
      setCombos(prev => prev.map(combo => 
        combo._id === id ? { ...combo, isActive: !combo.isActive } : combo
      ));
      
      AlertPopup.success('Combo status updated');
    } catch (err) {
      console.error('Status toggle error:', err.response?.data || err.message);
      AlertPopup.error('Failed to update combo status');
    }
  };

  const deleteCombo = async (id) => {
    AlertPopup.confirm(
      'Are you sure you want to delete this combo?',
      async () => {
        try {
          await axios.delete(
            `http://localhost:5000/api/combos/${id}`,
            {
              headers: { 'x-auth-token': token }
            }
          );
          
          setCombos(prev => prev.filter(combo => combo._id !== id));
          AlertPopup.success('Combo deleted successfully');
        } catch (err) {
          console.error('Delete error:', err.response?.data || err.message);
          AlertPopup.error(err.response?.data?.msg || 'Failed to delete combo');
        }
      }
    );
  };

  const requestSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredCombos = useMemo(() => {
    let filtered = [...combos];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(combo =>
        combo.name.toLowerCase().includes(term) ||
        (combo.description && combo.description.toLowerCase().includes(term))
      );
    }
    
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [combos, searchTerm, sortConfig]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gold-100 p-6">
      <div className="flex justify-between items-center mb-8 border-b border-gold-500 pb-4">
        <h1 className="text-3xl font-bold text-gold-400">Combos Management</h1>
        <button
          onClick={openCreateModal}
          className="bg-gold-600 hover:bg-gold-700 text-black font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center"
        >
          <FiPlus className="mr-2" />
          Create New Combo
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search combos..."
            className="w-full bg-gray-900 border border-gold-600 rounded-lg py-2 px-4 text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="absolute right-3 top-2.5 h-5 w-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <ComboTable
        combos={filteredCombos}
        searchTerm={searchTerm}
        sortConfig={sortConfig}
        requestSort={requestSort}
        openEditModal={openEditModal}
        deleteCombo={deleteCombo}
        toggleComboStatus={toggleComboStatus}
        openViewModal={openViewModal}
      />

      <ComboFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        services={services}
        serviceInput={serviceInput}
        setServiceInput={setServiceInput}
        sequenceInput={sequenceInput}
        setSequenceInput={setSequenceInput}
        addService={addService}
        removeService={removeService}
        calculateTotalPrice={calculateTotalPrice}
        calculateTotalDuration={calculateTotalDuration}
        currentCombo={currentCombo}
      />

      <ComboViewModal
        combo={currentCombo}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />
    </div>
  );
};

export default AdminCombos;