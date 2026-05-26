import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Pagination from '../../components/Pagination';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Car } from 'lucide-react';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCars = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/cars?page=${page}&limit=10`);
      setCars(response.data.data);
      setPagination(response.data.pagination);
    } catch {
      toast.error('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCars(); }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title">All Car Entries</h1>
        <p className="page-subtitle">Complete record of all vehicle entries and exits.</p>
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
                  <th>Plate Number</th>
                  <th>Parking</th>
                  <th>Entry Time</th>
                  <th>Exit Time</th>
                  <th>Amount (RWF)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {cars.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                        <Car size={32} strokeWidth={1.5} />
                        <p className="text-sm">No car entries found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  cars.map((car) => (
                    <tr key={car.id}>
                      <td>
                        <span className="font-mono font-bold text-slate-900 text-sm tracking-wide">
                          {car.plateNumber}
                        </span>
                      </td>
                      <td className="text-slate-500">{car.parking?.name || car.parkingCode}</td>
                      <td className="text-slate-500">{format(new Date(car.entryDateTime), 'MMM d, yyyy · HH:mm')}</td>
                      <td className="text-slate-500">
                        {car.exitDateTime
                          ? format(new Date(car.exitDateTime), 'MMM d, yyyy · HH:mm')
                          : <span className="text-slate-300">—</span>}
                      </td>
                      <td>
                        {car.chargedAmount != null && car.chargedAmount !== ''
                          ? <span className="font-semibold text-slate-800">{car.chargedAmount}</span>
                          : <span className="text-slate-300">—</span>}
                      </td>
                      <td>
                        <span className={car.exitDateTime ? 'badge-gray' : 'badge-green'}>
                          {car.exitDateTime ? 'Exited' : 'Parked'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && <Pagination pagination={pagination} onPageChange={fetchCars} />}
      </div>
    </div>
  );
};

export default CarList;
