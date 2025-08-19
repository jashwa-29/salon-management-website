// components/dashboard/DashboardHeader.jsx
export default function DashboardHeader() {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gold-500">
          <span className="text-yellow-500">Salon</span> Dashboard
        </h1>
        <div className="text-sm text-gray-400 bg-black px-3 py-1 rounded-full">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
          })}
        </div>
      </div>
      <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
    </div>
  );
}
