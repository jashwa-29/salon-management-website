import React from 'react';

const StaffItem = ({ staff, onEdit, onDelete, onToggleStatus }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <tr key={staff._id} className="hover:bg-gray-750">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-yellow-500">
            {staff.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-white">{staff.name}</div>
            <div className="text-sm text-gray-400">{staff.gender} | Age: {staff.age}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-white">{staff.phone}</div>
        <div className="text-sm text-gray-400">Aadhaar: {staff.aadhaar}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${staff.role === 'Manager' ? 'bg-purple-900 text-purple-200' :
            staff.role === 'Stylist' ? 'bg-blue-900 text-blue-200' :
              staff.role === 'Receptionist' ? 'bg-green-900 text-green-200' :
                'bg-yellow-900 text-yellow-200'}`}>
          {staff.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
        {formatDate(staff.joiningDate)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          onClick={() => onToggleStatus(staff)}
          className={`cursor-pointer px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${staff.isActive ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
          {staff.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEdit(staff)}
          className="text-yellow-500 hover:text-yellow-400 mr-3"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(staff)}
          className="text-red-500 hover:text-red-400"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default StaffItem;