import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { ParkingCircle, Car, DollarSign, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, description }) => (
  <div className="card p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</p>
        <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
        {description && (
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        )}
      </div>
      <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${bgClass}`}>
        <Icon size={22} className={colorClass} strokeWidth={2} />
      </span>
    </div>
    <div className={`h-1 w-full rounded-full ${bgClass}`} />
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalParkings: 0,
    totalCarsCurrentlyParked: 0,
    totalRevenueToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
        setStats(response.data.data);
      } catch {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="spinner h-10 w-10" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Parkings',
      value: stats.totalParkings,
      icon: ParkingCircle,
      colorClass: 'text-navy-500',
      bgClass: 'bg-navy-100',
      description: 'Registered locations',
    },
    {
      title: 'Currently Parked',
      value: stats.totalCarsCurrentlyParked,
      icon: Car,
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-50',
      description: 'Vehicles in system',
    },
    {
      title: "Today's Revenue",
      value: `${(stats.totalRevenueToday ?? 0).toLocaleString()} RWF`,
      icon: DollarSign,
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-50',
      description: 'Collected today',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">
            {greeting()}, {user?.firstName} 👋
          </h1>
          <p className="page-subtitle">{today}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          <TrendingUp size={12} />
          Live
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Quick actions banner */}
      <div className="card p-5 flex items-center justify-between gap-4 bg-gradient-to-r from-navy-900 to-navy-700 border-navy-800">
        <div>
          <p className="text-sm font-semibold text-white">Quick Actions</p>
          <p className="text-xs text-navy-300 mt-0.5">Record vehicle entries and exits instantly</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/cars/entry"
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-semibold text-white border border-white/10 transition-colors"
          >
            Record Entry
          </a>
          <a
            href="/cars/exit"
            className="inline-flex items-center gap-2 rounded-lg bg-navy-500 hover:bg-navy-400 px-4 py-2 text-sm font-semibold text-white transition-colors"
          >
            Record Exit
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
