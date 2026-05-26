import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ArrowRightToLine, Printer, CheckCircle2, Car } from 'lucide-react';

const CarEntry = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const response = await api.get('/parkings?limit=100');
        setParkings(response.data.data.filter((p) => p.availableSpaces > 0));
      } catch {
        toast.error('Failed to load parkings');
      }
    };
    fetchParkings();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await api.post('/cars/entry', data);
      toast.success('Car entry recorded');
      setTicket(response.data.ticket);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record entry');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (ticket) {
      window.open(`/ticket/${ticket.ticketId}`, '_blank');
      setTicket(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Record Car Entry</h1>
        <p className="page-subtitle">Register a new vehicle arrival and generate a parking ticket.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-app-border">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-100">
              <ArrowRightToLine size={18} className="text-navy-600" strokeWidth={2} />
            </span>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Vehicle Entry</p>
              <p className="text-xs text-slate-400">Fill in the details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="form-label">Plate Number</label>
              <input
                type="text"
                {...register('plateNumber', { required: 'Plate number is required' })}
                className="form-input uppercase tracking-widest font-mono"
                placeholder="e.g. RAA 123 A"
              />
              {errors.plateNumber && <p className="form-error">{errors.plateNumber.message}</p>}
            </div>

            <div>
              <label className="form-label">Select Parking</label>
              <select
                {...register('parkingCode', { required: 'Please select a parking' })}
                className="form-input"
              >
                <option value="">— Select parking location —</option>
                {parkings.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name} — {p.availableSpaces} space{p.availableSpaces !== 1 ? 's' : ''} left
                  </option>
                ))}
              </select>
              {errors.parkingCode && <p className="form-error">{errors.parkingCode.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <>
                  <span className="spinner h-4 w-4" />
                  <span>Processing…</span>
                </>
              ) : (
                <>
                  <ArrowRightToLine size={16} />
                  <span>Record Entry</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Ticket preview */}
        {ticket ? (
          <div className="card p-6 border-2 border-dashed border-emerald-200 bg-emerald-50/30">
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle2 size={20} className="text-emerald-500" />
              <div>
                <p className="font-semibold text-slate-900 text-sm">Ticket Generated</p>
                <p className="text-xs text-slate-400">Entry has been recorded</p>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Ticket ID', value: ticket.ticketId.slice(0, 8).toUpperCase() },
                { label: 'Plate', value: ticket.plateNumber },
                { label: 'Parking', value: ticket.parkingName },
                { label: 'Entry Time', value: new Date(ticket.entryDateTime).toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
                  <span className="text-sm font-semibold text-slate-800 font-mono">{value}</span>
                </div>
              ))}
            </div>
            <button onClick={handlePrint} className="btn-success w-full">
              <Printer size={16} />
              Print Ticket
            </button>
          </div>
        ) : (
          <div className="card p-6 flex flex-col items-center justify-center text-slate-300 gap-3 min-h-[220px]">
            <Car size={40} strokeWidth={1} />
            <p className="text-sm text-slate-400">Ticket will appear here after entry</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarEntry;
