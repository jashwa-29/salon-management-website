import { FiCheck } from 'react-icons/fi';

const ServiceTag = ({ name, isCombo = false }) => (
  <span
    className={`${isCombo ? 'bg-purple-500/20 text-purple-500' : 'bg-blue-500/20 text-blue-500'} px-2 py-1 rounded text-xs flex items-center`}
  >
    <FiCheck className="mr-1" />
    {name}
  </span>
);

export default ServiceTag;
