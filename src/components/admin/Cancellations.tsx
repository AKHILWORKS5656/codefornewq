import React, { useState, useEffect } from 'react';
import { api } from '../../mockApi';

interface Cancellation {
  id: string;
  reason: string;
  user: string;
  amount: string;
  date: string;
  status: string;
}

const Cancellations: React.FC = () => {
  const [cancellations, setCancellations] = useState<Cancellation[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<{ id: string; type: 'approve' | 'reject' } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchCancellations();
  }, []);

  const fetchCancellations = async () => {
    try {
      const data = await api.getCancellations();
      setCancellations(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleActionClick = (id: string, action: 'approve' | 'reject') => {
    setConfirming({ id, type: action });
  };

  const processAction = async () => {
    if (!confirming) return;
    const { id, type } = confirming;
    setLoading(true);
    try {
      await api.updateOrderStatus(id, type === 'approve' ? 'CANCELLED' : 'SHIPPED');
      setCancellations(prev => prev.filter(c => c.id !== id));
      setSuccessMsg(`Successfully ${type === 'approve' ? 'Approved' : 'Rejected'}`);
    } catch (err) {
      alert('System error: Request handshake failed.');
    } finally {
      setLoading(false);
      setConfirming(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {successMsg && (
        <div className="fixed top-24 right-10 z-[1000] bg-[#1e293b] text-white px-8 py-4 rounded-2xl shadow-2xl border border-green-500/30 flex items-center animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-4 text-green-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <span className="font-black text-xs uppercase tracking-widest">{successMsg}</span>
        </div>
      )}

      {confirming && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#1e293b] border border-white/10 rounded-[3rem] w-full max-w-sm p-12 shadow-2xl animate-fade-in text-center">
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">{confirming.type === 'approve' ? 'Approve Cancellation?' : 'Reject Request?'}</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-10 leading-relaxed">Confirm decision for order <span className="text-[#D4AF37]">{confirming.id}</span>?</p>
            <div className="flex gap-4">
              <button onClick={() => setConfirming(null)} className="flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-white/5 border border-white/5 transition-all">CANCEL</button>
              <button onClick={processAction} disabled={loading} className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl transition-all flex items-center justify-center ${confirming.type === 'approve' ? 'bg-green-600' : 'bg-red-600'}`}>
                {loading ? <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : 'YES'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#1e293b]/50 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]"><div className="w-10 h-10 border-4 border-t-[#D4AF37] border-white/10 rounded-full animate-spin"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Order ID</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Reason</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Requester</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {cancellations.map(c => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-10 py-6 text-sm font-black text-white">{c.id}</td>
                    <td className="px-10 py-6 text-sm font-bold text-gray-400">{c.reason}</td>
                    <td className="px-10 py-6 text-sm font-bold text-gray-300">{c.user}</td>
                    <td className="px-10 py-6 space-x-4">
                      <button onClick={() => handleActionClick(c.id, 'approve')} className="text-[10px] font-black text-green-400 uppercase tracking-widest hover:underline">APPROVE</button>
                      <button onClick={() => handleActionClick(c.id, 'reject')} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:underline">REJECT</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {cancellations.length === 0 && (
              <div className="py-24 text-center"><p className="text-gray-500 font-black uppercase text-xs tracking-[0.3em]">No pending cancellation requests detected.</p></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cancellations;