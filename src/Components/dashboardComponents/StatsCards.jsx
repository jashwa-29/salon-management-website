// components/dashboard/StatsCards.jsx
import { Calendar, Scissors, Layers, Users, ChevronRight } from 'lucide-react';

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index}
          onClick={stat.onClick || (() => {})}
          className={`group bg-black p-6 rounded-xl border border-gray-800 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10 transition-all ${stat.onClick ? 'cursor-pointer' : ''} transform hover:-translate-y-1`}
        >
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-500">
              {stat.icon}
            </div>
            {stat.onClick && <ChevronRight className="text-gray-500 group-hover:text-yellow-500 transition-colors" />}
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-white">{stat.count}</p>
            <p className="text-lg font-medium text-yellow-500">{stat.title}</p>
            <p className="text-sm text-gray-400 mt-1">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
