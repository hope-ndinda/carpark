import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { FileBarChart2, TrendingUp, TrendingDown, Search, DollarSign } from 'lucide-react';

const TAB_CONFIG = [
  { id: 'outgoing', label: 'Revenue Report', icon: TrendingUp, description: 'Exited cars & amounts collected' },
  { id: 'incoming', label: 'Incoming Cars', icon: TrendingDown, description: 'Newly entered vehicles' },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState('outgoing');
  const [reports, setReports] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setHasSearched(true);
      const fromDate = `${data.fromDate}T00:00:00`;
      const toDate = `${data.toDate}T23:59:59`;
      const endpoint = activeTab === 'outgoing' ? '/reports/outgoing' : '/reports/incoming';
      const response = await api.get(`${endpoint}?from=${fromDate}&to=${toDate}`);
      setReports(response.data.data);
      if (activeTab === 'outgoing') {
        setTotalAmount(response.data.totalAmountCollected);
      }
    } catch {
      toast.error('Failed to generate report');
      setReports([]);
      setTotalAmount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setReports([]);
    setTotalAmount(0);
    setHasSearched(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-100 flex-shrink-0">
          <FileBarChart2 size={20} className="text-navy-600" strokeWidth={2} />
        </span>
        <div>
          <h1 className="page-title">System Reports</h1>
          <p className="page-subtitle">Generate reports by date range for incoming and outgoing vehicles.</p>
        </div>
      </div>

      {/* Tab selector + filter card */}
      <div className="card overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-app-border">
          {TAB_CONFIG.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-5 text-sm font-semibold border-b-2 transition-colors ${
                  active
                    ? 'border-navy-500 text-navy-600 bg-navy-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter form */}
        <div className="p-5">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="form-label">Date From</label>
              <input
                type="date"
                {...register('fromDate', { required: true })}
                className="form-input w-44"
              />
              {errors.fromDate && <p className="form-error">Required</p>}
            </div>
            <div>
              <label className="form-label">Date To</label>
              <input
                type="date"
                {...register('toDate', { required: true })}
                className="form-input w-44"
              />
              {errors.toDate && <p className="form-error">Required</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <>
                  <span className="spinner h-4 w-4" />
                  <span>Generating…</span>
                </>
              ) : (
                <>
                  <Search size={15} />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      {reports.length > 0 && (
        <div className="space-y-4">
          {/* Summary bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-800">{reports.length}</span> record{reports.length !== 1 ? 's' : ''} found
            </p>
            {activeTab === 'outgoing' && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2">
                <DollarSign size={15} className="text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-800">
                  Total: {totalAmount?.toLocaleString()} RWF
                </span>
              </div>
            )}
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Plate</th>
                    <th>Parking</th>
                    <th>Entry Date</th>
                    {activeTab === 'outgoing' && (
                      <>
                        <th>Exit Date</th>
                        <th className="text-right">Amount (RWF)</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td>
                        <span className="font-mono font-bold text-slate-900 text-sm tracking-wide">
                          {report.plateNumber}
                        </span>
                      </td>
                      <td className="text-slate-500">{report.parking?.name}</td>
                      <td className="text-slate-500">{format(new Date(report.entryDateTime), 'MMM d, yyyy · HH:mm')}</td>
                      {activeTab === 'outgoing' && (
                        <>
                          <td className="text-slate-500">{format(new Date(report.exitDateTime), 'MMM d, yyyy · HH:mm')}</td>
                          <td className="text-right font-semibold text-slate-800">{report.chargedAmount}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {hasSearched && !loading && reports.length === 0 && (
        <div className="card flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
          <FileBarChart2 size={36} strokeWidth={1} />
          <p className="text-sm font-medium">No data found for the selected date range</p>
          <p className="text-xs text-slate-300">Try adjusting the filters above</p>
        </div>
      )}

      {!hasSearched && (
        <div className="card flex flex-col items-center justify-center py-16 gap-3 text-slate-300">
          <Search size={36} strokeWidth={1} />
          <p className="text-sm text-slate-400">Select a date range and click Generate Report</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
