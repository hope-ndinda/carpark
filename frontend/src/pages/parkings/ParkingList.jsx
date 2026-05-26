import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Pagination from '../../components/Pagination';
import toast from 'react-hot-toast';
import { ParkingCircle, Plus } from 'lucide-react';

const OccupancyBar = ({ total, available }) => {
  const occupied = total - available;
  const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;
  const color = pct >= 90 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
        {available} free
      </span>
    </div>
  );
};

const ParkingList = () => {
  const [parkings, setParkings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchParkings = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/parkings?page=${page}&limit=10`);
      setParkings(response.data.data);
      setPagination(response.data.pagination);
    } catch {
      toast.error('Failed to load parkings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchParkings(); }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Parking Locations</h1>
          <p className="page-subtitle">All registered parking lots and their current availability.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <Link to="/parkings/new" className="btn-primary flex-shrink-0">
            <Plus size={16} />
            Add Parking
          </Link>
        )}
      </div>

      {/* Table card */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="spinner h-8 w-8" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Occupancy</th>
                  <th>Fee / Hour</th>
                </tr>
              </thead>
              <tbody>
                {parkings.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                        <ParkingCircle size={32} strokeWidth={1.5} />
                        <p className="text-sm">No parking locations found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  parkings.map((parking) => (
                    <tr key={parking.id}>
                      <td>
                        <span className="font-mono font-bold text-navy-600 text-sm tracking-wide">
                          {parking.code}
                        </span>
                      </td>
                      <td className="font-medium text-slate-800">{parking.name}</td>
                      <td className="text-slate-500">{parking.location}</td>
                      <td>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={parking.availableSpaces === 0 ? 'badge-red' : 'badge-green'}>
                              {parking.totalSpaces - parking.availableSpaces}/{parking.totalSpaces}
                            </span>
                          </div>
                          <OccupancyBar total={parking.totalSpaces} available={parking.availableSpaces} />
                        </div>
                      </td>
                      <td>
                        <span className="font-semibold text-slate-800">
                          {parking.chargingFeePerHour.toLocaleString()}
                          <span className="ml-1 text-xs font-normal text-slate-400">RWF/hr</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && <Pagination pagination={pagination} onPageChange={fetchParkings} />}
      </div>
    </div>
  );
};

export default ParkingList;
