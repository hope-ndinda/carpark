import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeftFromLine, Printer, CheckCircle2, Receipt } from 'lucide-react';

const CarExit = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [bill, setBill] = useState(null);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await api.put(`/cars/exit/${data.ticketId}`);
      toast.success('Car exit recorded');
      setBill(response.data.bill);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process exit. Check Ticket ID.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (bill) {
      window.open(`/bill/${bill.billId}`, '_blank');
      setBill(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Record Car Exit</h1>
        <p className="page-subtitle">Process a vehicle departure and generate the payment bill.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-app-border">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
              <ArrowLeftFromLine size={18} className="text-amber-600" strokeWidth={2} />
            </span>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Vehicle Exit</p>
              <p className="text-xs text-slate-400">Enter the ticket ID to process</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="form-label">Ticket ID</label>
              <input
                type="text"
                {...register('ticketId', { required: 'Ticket ID is required' })}
                className="form-input font-mono tracking-wide"
                placeholder="Enter Ticket ID"
              />
              {errors.ticketId && <p className="form-error">{errors.ticketId.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <>
                  <span className="spinner h-4 w-4" />
                  <span>Processing…</span>
                </>
              ) : (
                <>
                  <ArrowLeftFromLine size={16} />
                  <span>Process Exit</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bill preview */}
        {bill ? (
          <div className="card p-6 border-2 border-dashed border-emerald-200 bg-emerald-50/30">
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle2 size={20} className="text-emerald-500" />
              <div>
                <p className="font-semibold text-slate-900 text-sm">Bill Generated</p>
                <p className="text-xs text-slate-400">Exit recorded successfully</p>
              </div>
            </div>
            <div className="space-y-3 mb-5">
              {[
                { label: 'Plate', value: bill.plateNumber },
                { label: 'Parking', value: bill.parkingName },
                { label: 'Duration', value: `${bill.durationHours} hr(s)` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
                  <span className="text-sm font-semibold text-slate-800">{value}</span>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-emerald-100 border border-emerald-200 px-4 py-3 flex justify-between items-center mb-5">
              <span className="text-sm font-semibold text-emerald-800">Total Charged</span>
              <span className="text-xl font-bold text-emerald-700">{bill.totalCharged} RWF</span>
            </div>
            <button onClick={handlePrint} className="btn-success w-full">
              <Printer size={16} />
              Print Bill
            </button>
          </div>
        ) : (
          <div className="card p-6 flex flex-col items-center justify-center text-slate-300 gap-3 min-h-[220px]">
            <Receipt size={40} strokeWidth={1} />
            <p className="text-sm text-slate-400">Bill will appear here after exit</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarExit;
