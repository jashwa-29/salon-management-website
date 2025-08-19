const StatsCard = ({ title, value, color, icon }) => {
  const colorClasses = {
    gold: 'border-gold-500 text-gold-500',
    blue: 'border-blue-500 text-blue-500',
    green: 'border-green-500 text-green-500',
    red: 'border-red-500 text-red-500',
    purple: 'border-purple-500 text-purple-500',
    gray: 'border-gray-500 text-gray-500'
  };

  return (
    <div className={`bg-gray-800 border-l-4 ${colorClasses[color]} p-4 rounded-lg shadow-lg flex items-center`}>
      <div className="mr-4 p-2 rounded-full bg-gray-700">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
