import React, { useMemo, useState } from 'react';
import { FiEdit2, FiTrash2, FiFilter, FiChevronLeft, FiChevronRight, FiChevronDown, FiChevronUp, FiInfo } from 'react-icons/fi';

const ComboTable = ({ 
  combos, 
  searchTerm, 
  sortConfig, 
  requestSort, 
  openEditModal, 
  deleteCombo, 
  toggleComboStatus,
  openViewModal 
}) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRowExpansion = (comboId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(comboId)) {
      newExpanded.delete(comboId);
    } else {
      newExpanded.add(comboId);
    }
    setExpandedRows(newExpanded);
  };

  const filteredCombos = useMemo(() => {
    let filtered = [...combos];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(combo => 
        statusFilter === 'active' ? combo.isActive : !combo.isActive
      );
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(combo =>
        combo.name.toLowerCase().includes(term) ||
        (combo.description && combo.description.toLowerCase().includes(term))
      );
    }
    
    return filtered;
  }, [combos, statusFilter, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCombos.length / itemsPerPage);
  const paginatedCombos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCombos.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCombos, currentPage, itemsPerPage]);

  const handleEditClick = (combo, e) => {
    e.stopPropagation();
    if (!combo || !combo._id) {
      console.error('Invalid combo data:', combo);
      AlertPopup.error('Cannot edit - invalid combo data');
      return;
    }
    openEditModal(combo);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gold-600">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-900 border-b border-gold-600 gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <div className="relative flex items-center">
            <FiFilter className="text-gold-400 mr-2" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-gray-800 border border-gold-600 rounded-lg py-1 px-3 text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          
          <div className="relative flex items-center">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-gray-800 border border-gold-600 rounded-lg py-1 px-3 text-gold-100 focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
        <div className="text-sm text-gold-300 whitespace-nowrap">
          Showing {paginatedCombos.length} of {filteredCombos.length} combos (Page {currentPage} of {totalPages})
        </div>
      </div>

      <div className="overflow-auto max-h-[calc(100vh-250px)]">
        <table className="min-w-full divide-y divide-gold-600">
          <thead className="bg-gray-900 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider w-8">
                {/* Expand/collapse column header */}
              </th>
              <SortableHeader 
                title="Name" 
                sortKey="name" 
                sortConfig={sortConfig} 
                requestSort={requestSort} 
              />
              <th className="px-4 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">
                Services
              </th>
              <SortableHeader 
                title="Duration" 
                sortKey="totalDuration" 
                sortConfig={sortConfig} 
                requestSort={requestSort} 
              />
              <SortableHeader 
                title="Price (₹)" 
                sortKey="totalPrice" 
                sortConfig={sortConfig} 
                requestSort={requestSort} 
              />
              <SortableHeader 
                title="Discount" 
                sortKey="discount" 
                sortConfig={sortConfig} 
                requestSort={requestSort} 
              />
              <th className="px-4 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-black divide-y divide-gold-600">
            {paginatedCombos.length > 0 ? (
              paginatedCombos.map((combo) => (
                <React.Fragment key={combo._id}>
                  <ComboRow 
                    combo={combo} 
                    onEdit={handleEditClick}
                    deleteCombo={deleteCombo}
                    toggleComboStatus={toggleComboStatus}
                    openViewModal={openViewModal}
                    isExpanded={expandedRows.has(combo._id)}
                    toggleExpansion={() => toggleRowExpansion(combo._id)}
                  />
                  {expandedRows.has(combo._id) && (
                    <tr className="bg-gray-900">
                      <td colSpan={9} className="px-6 py-4">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="text-gold-400 font-semibold mb-2">Description</h4>
                            <p className="text-gold-200 text-sm">
                              {combo.description || "No description available"}
                            </p>
                          </div>
                          
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-sm text-gold-300">
                  {combos.length === 0 ? 'No combos available' : `No combos match your filters${searchTerm ? ` (Search: "${searchTerm}")` : ''}`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {filteredCombos.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-gray-900 border-t border-gold-600">
          <div className="text-sm text-gold-300 mb-2 sm:mb-0">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCombos.length)} of {filteredCombos.length} combos
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`p-2 rounded ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-gold-400 hover:bg-gray-800'}`}
              title="First page"
            >
              <FiChevronLeft className="w-4 h-4" />
              <FiChevronLeft className="w-4 h-4 -ml-2" />
            </button>
            
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-gold-400 hover:bg-gray-800'}`}
              title="Previous page"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center mx-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-full text-sm mx-0.5 ${currentPage === pageNum ? 'bg-gold-600 text-white' : 'text-gold-300 hover:bg-gray-800'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && (
                <span className="text-gold-400 text-sm mx-1">...</span>
              )}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-gold-400 hover:bg-gray-800'}`}
              title="Next page"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'text-gold-400 hover:bg-gray-800'}`}
              title="Last page"
            >
              <FiChevronRight className="w-4 h-4" />
              <FiChevronRight className="w-4 h-4 -ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SortableHeader = ({ title, sortKey, sortConfig, requestSort }) => {
  const isActive = sortConfig.key === sortKey;
  return (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800 transition-colors"
      onClick={() => requestSort(sortKey)}
    >
      <div className="flex items-center">
        {title}
        {isActive && (
          <span className="ml-1">
            {sortConfig.direction === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );
};

const ComboRow = ({ combo, onEdit, deleteCombo, toggleComboStatus, openViewModal, isExpanded, toggleExpansion }) => {
  const getServiceName = (svc) => {
    return svc.service?.name || svc.name || 'Unknown Service';
  };

  return (
    <>
      <tr className="hover:bg-gray-900 transition duration-150">
        <td className="px-2 py-4 whitespace-nowrap cursor-pointer" onClick={toggleExpansion}>
          <div className="text-gold-400 hover:text-gold-300 transition-colors">
            {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap cursor-pointer" onClick={() => openViewModal(combo)}>
          <div className="flex items-center">
            <div className="text-sm font-medium text-gold-200">{combo.name}</div>
            {combo.description && (
              <FiInfo className="ml-1 text-gold-500 text-xs" title="Has description" />
            )}
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap" onClick={() => openViewModal(combo)}>
          <GenderBadge gender={combo.gender} />
        </td>
        <td className="px-4 py-4" onClick={() => openViewModal(combo)}>
          <ServiceTags services={combo.services} />
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gold-300" onClick={() => openViewModal(combo)}>
          {combo.totalDuration} mins
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gold-300" onClick={() => openViewModal(combo)}>
          ₹{combo.totalPrice?.toFixed(2) || '0.00'}
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gold-300" onClick={() => openViewModal(combo)}>
          {combo.discount || 0}%
        </td>
        <td className="px-4 py-4 whitespace-nowrap" onClick={() => openViewModal(combo)}>
          <StatusToggle 
            isActive={combo.isActive} 
            toggleStatus={(e) => {
              e.stopPropagation();
              toggleComboStatus(combo._id);
            }} 
          />
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
          <ActionButtons 
            onEdit={(e) => {
              e.stopPropagation();
              onEdit(combo, e);
            }}
            onDelete={(e) => {
              e.stopPropagation();
              deleteCombo(combo._id);
            }}
          />
        </td>
      </tr>
    </>
  );
};

const GenderBadge = ({ gender }) => {
  const badgeStyles = {
    male: 'bg-blue-900 text-blue-200',
    female: 'bg-pink-900 text-pink-200',
    unisex: 'bg-purple-900 text-purple-200'
  };

  const displayText = {
    male: 'Male',
    female: 'Female',
    unisex: 'Unisex'
  };

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badgeStyles[gender] || badgeStyles.unisex}`}>
      {displayText[gender] || displayText.unisex}
    </span>
  );
};

const ServiceTags = ({ services = [] }) => (
  <div className="flex flex-wrap gap-1 max-w-xs">
    {services.slice(0, 3).map((svc, index) => {
      const serviceName = svc.service?.name || svc.name || 'Unknown';
      const duration = svc.duration || 0;
      const price = svc.price || 0;
      
      return (
        <span 
          key={index} 
          className="bg-gold-900 text-gold-200 text-xs px-2 py-1 rounded whitespace-nowrap"
          title={`${serviceName} (${duration} mins, ₹${price})`}
        >
          {serviceName}
        </span>
      );
    })}
    {services.length > 3 && (
      <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
        +{services.length - 3}
      </span>
    )}
  </div>
);

const StatusToggle = ({ isActive, toggleStatus }) => (
  <button
    onClick={toggleStatus}
    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors ${
      isActive ? 'bg-green-900 text-green-200 hover:bg-green-800' : 'bg-red-900 text-red-200 hover:bg-red-800'
    }`}
  >
    {isActive ? 'Active' : 'Inactive'}
  </button>
);

const ActionButtons = ({ onEdit, onDelete }) => (
  <div className="flex space-x-2">
    <button
      onClick={onEdit}
      className="text-gold-500 hover:text-gold-400 transition duration-150"
      title="Edit combo"
    >
      <FiEdit2 className="text-xl" />
    </button>
    <button
      onClick={onDelete}
      className="text-red-500 hover:text-red-400 transition duration-150"
      title="Delete combo"
    >
      <FiTrash2 className="text-xl" />
    </button>
  </div>
);

export default ComboTable;