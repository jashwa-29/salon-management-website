import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ServiceModal from "../../Components/serviceComponents/ServiceModal";
import ServiceTable from "../../Components/serviceComponents/ServiceTable";
import AlertPopup from "../../Components/serviceComponents/AlertPopup";

import {
  fetchServicesApi,
  createServiceApi,
  updateServiceApi,
  deleteServiceApi,
  toggleServiceStatusApi,
} from "../../services/servicesApi";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    category: "",
    gender: "",
    isActive: true,
  });
  const [categories] = useState(["Hair", "Nails", "Skin", "Massage", "Other"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });

  const navigate = useNavigate();

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchServicesApi();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
      AlertPopup.error("Failed to load services");
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(loading);
    }, 300);
    return () => clearTimeout(timer);
  }, [loading]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newService = await createServiceApi(formData);
      AlertPopup.success("Service created successfully!");
      setServices((prev) => [newService, ...prev]);
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating service:", error);
      AlertPopup.error("Failed to create service");
    }
  };

  const handleEdit = useCallback((service) => {
    setCurrentService(service);
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
      category: service.category,
      gender: service.gender || "",
      isActive: service.isActive,
    });
    setIsEditModalOpen(true);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedService = await updateServiceApi(currentService._id, formData);
      AlertPopup.success("Service updated successfully!");
      setServices((prev) =>
        prev.map((service) => (service._id === currentService._id ? updatedService : service))
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating service:", error);
      AlertPopup.error("Failed to update service");
    }
  };

  const handleDelete = useCallback((id) => {
    AlertPopup.confirm("Are you sure you want to delete this service?", async () => {
      try {
        await deleteServiceApi(id);
        AlertPopup.success("Service deleted successfully!");
        setServices((prev) => prev.filter((service) => service._id !== id));
      } catch (error) {
        console.error("Error deleting service:", error);
        AlertPopup.error("Failed to delete service");
      }
    });
  }, []);

  const toggleStatus = useCallback(async (id, currentStatus) => {
    try {
      const updated = await toggleServiceStatusApi(id);
      AlertPopup.success(`Service ${updated.isActive ? "activated" : "deactivated"}!`);
      setServices((prev) =>
        prev.map((service) =>
          service._id === id ? { ...service, isActive: updated.isActive } : service
        )
      );
    } catch (error) {
      console.error("Error toggling service status:", error);
      AlertPopup.error("Failed to update service status");
    }
  }, []);

  const requestSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      duration: "",
      price: "",
      category: "",
      gender: "",
      isActive: true,
    });
  };

  const filteredServices = useMemo(() => {
    let filtered = [...services];

    if (filter === "active") {
      filtered = filtered.filter((service) => service.isActive);
    } else if (filter === "inactive") {
      filtered = filtered.filter((service) => !service.isActive);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(term) ||
          service.description.toLowerCase().includes(term) ||
          service.category.toLowerCase().includes(term) ||
          (service.gender && service.gender.toLowerCase().includes(term))
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [services, filter, searchTerm, sortConfig]);

  return (
    <div className="min-h-screen bg-black text-gold-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-gold-500 pb-4">
        <h1 className="text-3xl font-bold text-gold-400">Services Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gold-600 hover:bg-gold-700 text-black font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Service
        </button>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search services..."
            className="w-full bg-gray-800 border border-gold-600 rounded-lg py-2 px-4 text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="absolute right-3 top-2.5 h-5 w-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select
          className="bg-gray-800 border border-gold-600 rounded-lg py-2 px-4 text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Services</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Services Table */}
      <ServiceTable
        services={filteredServices}
        loading={showLoader}
        sortConfig={sortConfig}
        requestSort={requestSort}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        toggleStatus={toggleStatus}
      />

      {/* Modals */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        categories={categories}
        title="Add New Service"
        submitText="Create Service"
      />

      <ServiceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdate}
        formData={formData}
        handleChange={handleChange}
        categories={categories}
        title="Edit Service"
        submitText="Update Service"
      />
    </div>
  );
};

export default AdminServices;