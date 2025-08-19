import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiEdit, FiRefreshCw, FiAlertTriangle, FiFilter, FiSearch, FiX, FiChevronUp, FiChevronDown, FiMinus } from 'react-icons/fi';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showUseModal, setShowUseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    lowStock: false
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'hair',
    quantity: 0,
    unit: 'ml',
    threshold: 5
  });
  const [restockData, setRestockData] = useState({
    amount: 0,
    notes: ''
  });
  const [useData, setUseData] = useState({
    amount: 0,
    serviceId: '',
    notes: ''
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Fetch inventory data
  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/inventory', {
        headers: {
          'x-auth-token': token
        }
      });
      setInventory(response.data?.data || []);
      setFilteredInventory(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch inventory');
      setInventory([]);
      setFilteredInventory([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    if (!inventory || !Array.isArray(inventory)) {
      setFilteredInventory([]);
      return;
    }

    let result = [...inventory];

    // Apply search filter
    if (filters.search) {
      result = result.filter(item =>
        item.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter(item => item.category === filters.category);
    }

    // Apply low stock filter
    if (filters.lowStock) {
      result = result.filter(item => item.quantity < item.threshold);
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredInventory(result);
  }, [inventory, filters, sortConfig]);

  // Initial data fetch
  useEffect(() => {
    fetchInventory();
  }, []);

  // Handle sort request
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      lowStock: false
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle restock input changes
  const handleRestockChange = (e) => {
    const { name, value } = e.target;
    setRestockData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle use input changes
  const handleUseChange = (e) => {
    const { name, value } = e.target;
    setUseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Create new inventory item
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/inventory', formData, {
        headers: {
          'x-auth-token': token
        }
      });
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        category: 'hair',
        quantity: 0,
        unit: 'ml',
        threshold: 5
      });
      fetchInventory();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create item');
    }
  };

  // Update inventory item
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/inventory/${currentItem._id}`, formData, {
        headers: {
          'x-auth-token': token
        }
      });
      setShowEditModal(false);
      fetchInventory();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item');
    }
  };

  // Restock inventory item
  const handleRestock = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/inventory/${currentItem._id}/restock`, restockData, {
        headers: {
          'x-auth-token': token
        }
      });
      setShowRestockModal(false);
      setRestockData({
        amount: 0,
        notes: ''
      });
      fetchInventory();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to restock item');
    }
  };

  // Record inventory usage
  const handleUse = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/inventory/${currentItem._id}/use`, useData, {
        headers: {
          'x-auth-token': token
        }
      });
      setShowUseModal(false);
      setUseData({
        amount: 0,
        serviceId: '',
        notes: ''
      });
      fetchInventory();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record usage');
    }
  };

  // Delete inventory item
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/inventory/${currentItem._id}`, {
        headers: {
          'x-auth-token': token
        }
      });
      setShowDeleteModal(false);
      fetchInventory();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete item');
    }
  };

  // Open edit modal and set current item
  const openEditModal = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      threshold: item.threshold
    });
    setShowEditModal(true);
  };

  // Open restock modal and set current item
  const openRestockModal = (item) => {
    setCurrentItem(item);
    setRestockData({
      amount: 0,
      notes: ''
    });
    setShowRestockModal(true);
  };

  // Open use modal and set current item
  const openUseModal = (item) => {
    setCurrentItem(item);
    setUseData({
      amount: 0,
      serviceId: '',
      notes: ''
    });
    setShowUseModal(true);
  };

  // Open delete modal and set current item
  const openDeleteModal = (item) => {
    setCurrentItem(item);
    setShowDeleteModal(true);
  };

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <FiChevronUp className="inline" /> : <FiChevronDown className="inline" />;
  };

  // Get stock status class
  const getStockStatusClass = (quantity, threshold) => {
    if (quantity === 0) return 'bg-red-900 text-white';
    if (quantity < threshold) return 'bg-yellow-900 text-white';
    return 'bg-green-900 text-white';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gold-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-gray-900 rounded-lg border border-red-600">
          <h2 className="text-2xl font-bold mb-4">Inventory Error</h2>
          <p className="text-lg mb-6">{error}</p>
          <button
            onClick={fetchInventory}
            className="px-6 py-2 bg-gold-600 text-black rounded-lg hover:bg-gold-500 transition font-medium"
          >
            Retry
          </button>
          <button
            onClick={() => navigate(-1)}
            className="ml-4 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-gold-600 pb-4">
        <h1 className="text-3xl font-bold text-gold-500">Inventory Management</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-gold-600 text-black rounded hover:bg-gold-500 transition"
          >
            <FiPlus className="mr-2" /> Add Item
          </button>
          <button
            onClick={fetchInventory}
            className="flex items-center px-4 py-2 bg-gray-800 text-gold-500 rounded hover:bg-gray-700 transition"
          >
            <FiRefreshCw className="mr-2" /> Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 rounded-lg p-4 mb-6 shadow-lg">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-grow max-w-md">
            <FiSearch className="absolute left-3 top-3 text-gold-500" />
            <input
              type="text"
              name="search"
              placeholder="Search items..."
              value={filters.search}
              onChange={handleFilterChange}
              className="pl-10 pr-4 py-2 bg-gray-800 text-white rounded w-full focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            <option value="">All Categories</option>
            <option value="hair">Hair</option>
            <option value="skincare">Skincare</option>
            <option value="tools">Tools</option>
            <option value="chemicals">Chemicals</option>
            <option value="other">Other</option>
          </select>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="lowStock"
              checked={filters.lowStock}
              onChange={handleFilterChange}
              className="form-checkbox h-5 w-5 text-gold-600 rounded focus:ring-gold-500"
            />
            <span className="text-white">Low Stock Only</span>
          </label>
          <button
            onClick={resetFilters}
            className="flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
          >
            <FiX className="mr-2" /> Reset
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gold-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">
                    Name {getSortIndicator('name')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gold-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gold-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('category')}
                >
                  <div className="flex items-center">
                    Category {getSortIndicator('category')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gold-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('quantity')}
                >
                  <div className="flex items-center">
                    Stock {getSortIndicator('quantity')}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gold-500 uppercase tracking-wider"
                >
                  Threshold
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gold-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-800 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-white">
                          {item.name}
                          {item.quantity < item.threshold && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-900 text-yellow-100">
                              <FiAlertTriangle className="mr-1" /> Low Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300 max-w-xs truncate">
                        {item.description || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gold-400 capitalize">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockStatusClass(item.quantity, item.threshold)}`}>
                        {item.quantity} {item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {item.threshold} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-gold-500 hover:text-gold-400 transition"
                          title="Edit"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => openRestockModal(item)}
                          className="text-green-500 hover:text-green-400 transition"
                          title="Restock"
                        >
                          <FiPlus />
                        </button>
                        <button
                          onClick={() => openUseModal(item)}
                          className="text-blue-500 hover:text-blue-400 transition"
                          title="Record Usage"
                        >
                          <FiMinus />
                        </button>
                        <button
                          onClick={() => openDeleteModal(item)}
                          className="text-red-500 hover:text-red-400 transition"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-400">
                    No inventory items found. Try adjusting your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Item Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full border border-gold-600">
            <div className="flex justify-between items-center border-b border-gold-600 p-4">
              <h3 className="text-lg font-medium text-gold-500">Add New Inventory Item</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                  >
                    <option value="hair">Hair</option>
                    <option value="skincare">Skincare</option>
                    <option value="tools">Tools</option>
                    <option value="chemicals">Chemicals</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Unit *</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                    >
                      <option value="ml">ml</option>
                      <option value="g">g</option>
                      <option value="bottles">Bottles</option>
                      <option value="pieces">Pieces</option>
                      <option value="units">Units</option>
                      <option value="packs">Packs</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Low Stock Threshold</label>
                  <input
                    type="number"
                    name="threshold"
                    value={formData.threshold}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold-600 text-black rounded hover:bg-gold-500 transition"
                >
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && currentItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full border border-gold-600">
            <div className="flex justify-between items-center border-b border-gold-600 p-4">
              <h3 className="text-lg font-medium text-gold-500">Edit Inventory Item</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                  >
                    <option value="hair">Hair</option>
                    <option value="skincare">Skincare</option>
                    <option value="tools">Tools</option>
                    <option value="chemicals">Chemicals</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Unit *</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                    >
                      <option value="ml">ml</option>
                      <option value="g">g</option>
                      <option value="bottles">Bottles</option>
                      <option value="pieces">Pieces</option>
                      <option value="units">Units</option>
                      <option value="packs">Packs</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Low Stock Threshold</label>
                  <input
                    type="number"
                    name="threshold"
                    value={formData.threshold}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold-600 text-black rounded hover:bg-gold-500 transition"
                >
                  Update Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {showRestockModal && currentItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full border border-gold-600">
            <div className="flex justify-between items-center border-b border-gold-600 p-4">
              <h3 className="text-lg font-medium text-gold-500">Restock {currentItem.name}</h3>
              <button
                onClick={() => setShowRestockModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleRestock} className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Current Stock</label>
                  <div className="px-3 py-2 bg-gray-800 rounded text-white">
                    {currentItem.quantity} {currentItem.unit}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Amount to Add *</label>
                  <input
                    type="number"
                    name="amount"
                    value={restockData.amount}
                    onChange={handleRestockChange}
                    min="0.01"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={restockData.notes}
                    onChange={handleRestockChange}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRestockModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold-600 text-black rounded hover:bg-gold-500 transition"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Use Modal */}
      {showUseModal && currentItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full border border-gold-600">
            <div className="flex justify-between items-center border-b border-gold-600 p-4">
              <h3 className="text-lg font-medium text-gold-500">Record Usage of {currentItem.name}</h3>
              <button
                onClick={() => setShowUseModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleUse} className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Current Stock</label>
                  <div className="px-3 py-2 bg-gray-800 rounded text-white">
                    {currentItem.quantity} {currentItem.unit}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Amount Used *</label>
                  <input
                    type="number"
                    name="amount"
                    value={useData.amount}
                    onChange={handleUseChange}
                    min="0.01"
                    step="0.01"
                    max={currentItem.quantity}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Service (Optional)</label>
                  <input
                    type="text"
                    name="serviceId"
                    value={useData.serviceId}
                    onChange={handleUseChange}
                    placeholder="Service ID"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={useData.notes}
                    onChange={handleUseChange}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-gold-500 text-white"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUseModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold-600 text-black rounded hover:bg-gold-500 transition"
                >
                  Record Usage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full border border-red-600">
            <div className="flex justify-between items-center border-b border-red-600 p-4">
              <h3 className="text-lg font-medium text-red-500">Confirm Deletion</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-white mb-4">
                Are you sure you want to delete <span className="font-bold">{currentItem.name}</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
                >
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;