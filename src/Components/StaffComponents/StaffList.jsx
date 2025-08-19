import React, { useState } from 'react';
import StaffItem from './StaffItem';

const StaffList = ({ staff, loading, onEdit, onDelete, onToggleStatus }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
        <span className="ml-4 text-gold-200">Loading staff...</span>
      </div>
    );
  }

  // Empty state
  if (staff.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 mb-4 text-gold-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gold-100">No staff members found</h3>
        <p className="mt-1 text-sm text-gold-300">Add your first staff member to get started</p>
      </div>
    );
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = staff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(staff.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gold-600 rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gold-700">
              <thead className="bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gold-300 uppercase tracking-wider border-b border-gold-600">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gold-300 uppercase tracking-wider border-b border-gold-600 hidden md:table-cell">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gold-300 uppercase tracking-wider border-b border-gold-600">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gold-300 uppercase tracking-wider border-b border-gold-600 hidden sm:table-cell">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gold-300 uppercase tracking-wider border-b border-gold-600">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gold-300 uppercase tracking-wider border-b border-gold-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-black divide-y divide-gold-600">
                {currentItems.map((staffMember) => (
                  <StaffItem
                    key={staffMember._id}
                    staff={staffMember}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleStatus={onToggleStatus}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {staff.length > itemsPerPage && (
        <div className="mt-4 flex items-center justify-between px-4 py-3 bg-black border border-gold-600 rounded-lg">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gold-300">
                Showing <span className="font-medium text-gold-100">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium text-gold-100">
                  {Math.min(indexOfLastItem, staff.length)}
                </span>{' '}
                of <span className="font-medium text-gold-100">{staff.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gold-600 bg-black text-sm font-medium ${currentPage === 1 ? 'text-gold-700 cursor-not-allowed' : 'text-gold-300 hover:bg-gold-900 hover:text-gold-100'}`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === number ? 'z-10 bg-gold-600 border-gold-600 text-black font-bold' : 'bg-black border-gold-600 text-gold-300 hover:bg-gold-900'}`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gold-600 bg-black text-sm font-medium ${currentPage === totalPages ? 'text-gold-700 cursor-not-allowed' : 'text-gold-300 hover:bg-gold-900 hover:text-gold-100'}`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffList;