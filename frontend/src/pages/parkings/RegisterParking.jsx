import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ParkingCircle, ChevronLeft } from 'lucide-react';

const RegisterParking = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        totalSpaces: parseInt(data.totalSpaces, 10),
        chargingFeePerHour: parseFloat(data.chargingFeePerHour),
      };
      await api.post('/parkings', payload);
      toast.success('Parking registered successfully');
      navigate('/parkings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register parking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/parkings"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-app-border bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="page-title">Register New Parking</h1>
          <p className="page-subtitle">Add a new parking lot to the system.</p>
        </div>
      </div>

      {/* Form card */}
      <div className="card p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-app-border">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-100">
            <ParkingCircle size={18} className="text-navy-600" strokeWidth={2} />
          </span>
          <div>
            <p className="font-semibold text-slate-900 text-sm">Parking Details</p>
            <p className="text-xs text-slate-400">Fill in all required fields</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="form-label">Parking Code</label>
              <input
                type="text"
                {...register('code', { required: 'Code is required' })}
                className="form-input uppercase font-mono tracking-wide"
                placeholder="e.g. PKG004"
              />
              {errors.code && <p className="form-error">{errors.code.message}</p>}
            </div>

            <div>
              <label className="form-label">Name</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="form-input"
                placeholder="e.g. Central Parking"
              />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="form-label">Location</label>
              <input
                type="text"
                {...register('location', { required: 'Location is required' })}
                className="form-input"
                placeholder="e.g. Kigali, CBD"
              />
              {errors.location && <p className="form-error">{errors.location.message}</p>}
            </div>

            <div>
              <label className="form-label">Total Spaces</label>
              <input
                type="number"
                min="1"
                {...register('totalSpaces', {
                  required: 'Total spaces required',
                  min: { value: 1, message: 'Must be at least 1' },
                })}
                className="form-input"
                placeholder="e.g. 50"
              />
              {errors.totalSpaces && <p className="form-error">{errors.totalSpaces.message}</p>}
            </div>

            <div>
              <label className="form-label">Fee per Hour (RWF)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                {...register('chargingFeePerHour', {
                  required: 'Fee is required',
                  min: { value: 0, message: 'Must be positive' },
                })}
                className="form-input"
                placeholder="e.g. 500"
              />
              {errors.chargingFeePerHour && <p className="form-error">{errors.chargingFeePerHour.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate('/parkings')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <>
                  <span className="spinner h-4 w-4" />
                  <span>Saving…</span>
                </>
              ) : (
                'Save Parking'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterParking;
