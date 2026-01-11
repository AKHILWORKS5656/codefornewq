import React, { useState, useEffect } from 'react';
import { api } from '../../mockApi';

interface AccountRequest {
  id: string;
  store: string;
  email: string;
  date: string;
  businessType: string;
  taxId: string;
  address: string;
  phone: string;
}

const SellerAccountApprovals: React.FC = () => {
  const [requests, setRequests] = useState<AccountRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<AccountRequest | null>(null);
  const [confirming, setConfirming] = useState<{ id: string; type: 'APPROVE' | 'REJECT' } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await api.getAccountRequests();
      setRequests(data || []);
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

  const handleAction = async () => {
    if (!confirming) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      setRequests(prev => prev.filter(r => r.id !== confirming.id));
      setSuccessMsg(`Successfully ${confirming.type === 'APPROVE' ? 'Approved' : 'Rejected'} Account`);
    } finally {
      setLoading(false);
      setConfirming(null);
      setViewing(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {successMsg && (
        <div className="fixed top-24 right-10 z-[3000] bg-[#1e293b] text-white px-8 py-4 rounded-2xl shadow-2xl border border-green-500/30 flex items-center animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-4 text-green-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <span className="font-black text-xs uppercase tracking-widest">{successMsg}</span>
        </div>
      )}

      <div className="bg-[#1e293b]/50 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl min-h-[300px]">
        {loading && requests.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]"><div className="w-10 h-10 border-4 border-t-[#D4AF37] border-white/10 rounded-full animate-spin"></div></div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-white/5">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Store Name</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Email</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Request Date</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-6 text-sm font-black text-white">{req.store}</td>
                  <td className="px-10 py-6 text-sm font-bold text-gray-400">{req.email}</td>
                  <td className="px-10 py-6 text-xs font-bold text-gray-500">{req.date}</td>
                  <td className="px-10 py-6 text-right space-x-6">
                    <button onClick={() => setViewing(req)} className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:underline">VIEW</button>
                    <button onClick={() => setConfirming({ id: req.id, type: 'APPROVE' })} className="text-[10px] font-black text-green-400 uppercase tracking-widest hover:underline">APPROVE</button>
                    <button onClick={() => setConfirming({ id: req.id, type: 'REJECT' })} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:underline">REJECT</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && requests.length === 0 && (
          <div className="py-24 text-center"><p className="text-gray-600 font-black uppercase text-xs tracking-[0.3em]">Zero pending applications.</p></div>
        )}
      </div>
    </div>
  );
};

export default SellerAccountApprovals;