import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { format } from 'date-fns';
import { Printer } from 'lucide-react';

const TicketView = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await api.get(`/cars/${id}/ticket`);
        setTicket(response.data.ticket);
        setTimeout(() => window.print(), 600);
      } catch {
        setError('Ticket not found');
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-sm text-gray-500 font-medium">Loading ticket…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-sm text-red-500 font-medium">{error}</p>
      </div>
    );
  }
  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-xs bg-white rounded-2xl shadow-xl overflow-hidden font-mono">
        {/* Header band */}
        <div className="bg-[#011F5B] px-6 py-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300 mb-1">Parking Ticket</p>
          <h1 className="text-xl font-black text-white tracking-tight">XWZ LTD</h1>
          <p className="text-[11px] text-blue-400 mt-0.5">{ticket.location}</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-0">
          {/* Plate number highlight */}
          <div className="text-center py-4 border-b border-dashed border-gray-200">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Plate Number</p>
            <p className="text-2xl font-black tracking-widest text-gray-900">{ticket.plateNumber}</p>
          </div>

          <div className="py-4 space-y-3">
            {[
              { label: 'Ticket ID',   value: ticket.ticketId.slice(0, 8).toUpperCase() },
              { label: 'Parking',     value: ticket.parkingName },
              { label: 'Date',        value: format(new Date(ticket.entryDateTime), 'dd MMM yyyy') },
              { label: 'Time In',     value: format(new Date(ticket.entryDateTime), 'HH:mm:ss') },
              { label: 'Attendant',   value: ticket.attendantName },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-baseline gap-4">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 flex-shrink-0">{label}</span>
                <span className="text-[13px] font-semibold text-gray-800 text-right">{value}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-gray-200 pt-4 text-center space-y-1">
            <p className="text-[10px] text-gray-400">Keep this ticket safe.</p>
            <p className="text-[10px] text-gray-400">Required for exit &amp; billing.</p>
          </div>
        </div>

        {/* Print button — hidden in print */}
        <div className="px-6 pb-5 no-print">
          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#011F5B] text-white text-sm font-semibold py-2.5 hover:bg-[#0236A0] transition-colors"
          >
            <Printer size={15} />
            Print Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketView;
