import React, {memo} from 'react';

const ServiceTable = memo(
  ({
    services,
    loading,
    sortConfig,
    requestSort,
    handleEdit,
    handleDelete,
    toggleStatus,
  }) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500" />
        </div>
      );
    }

    if (services.length === 0) {
      return (
        <div className="overflow-x-auto rounded-lg border border-gold-600">
          <div className="px-6 py-4 text-center text-sm text-gold-300">
            No services found.
          </div>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto rounded-lg border border-gold-600">
        <table className="min-w-full divide-y divide-gold-600">
          <thead className="bg-gray-900">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('name')}
              >
                <div className="flex items-center">
                  Name
                  {sortConfig.key === 'name' &&
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">
                Description
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('category')}
              >
                <div className="flex items-center">
                  Category
                  {sortConfig.key === 'category' &&
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('gender')}
              >
                <div className="flex items-center">
                  Gender
                  {sortConfig.key === 'gender' &&
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('duration')}
              >
                <div className="flex items-center">
                  Duration (min)
                  {sortConfig.key === 'duration' &&
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('price')}
              >
                <div className="flex items-center">
                  Price (₹)
                  {sortConfig.key === 'price' &&
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gold-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-black divide-y divide-gold-600">
            {services.map(service => (
              <tr
                key={service._id}
                className="hover:bg-gray-900 transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gold-200">
                    {service.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gold-300 line-clamp-2">
                    {service.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gold-900 text-gold-200">
                    {service.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    bg-blue-900 text-blue-200 capitalize">
                    {service.gender}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gold-300">
                  {service.duration}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gold-300">
                  ₹{service.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    onClick={() => toggleStatus(service._id, service.isActive)}
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${service.isActive ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-gold-400 hover:text-gold-300 transition duration-150"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="text-red-500 hover:text-red-400 transition duration-150"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

export default ServiceTable;