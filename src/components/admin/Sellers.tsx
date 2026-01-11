import React, { useState, useEffect } from 'react';
import { api } from '../../mockApi';

interface SellerData {
  id: string;
  store: string;
  email: string;
  rating: string;
  sales: string;
  status: 'ACTIVE' | 'BANNED';
}

const Sellers: React.FC = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<{ id: string; store: string; type: 'BAN' | 'UNBAN' | 'REMOVE' } | null>(null);
  const [sellers, setSellers] = useState<SellerData[]>([]);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const data = await api.getSellers();
      setSellers(data || []);
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

  const handleActionClick = (id: string, store: string, type: 'BAN' | 'UNBAN' | 'REMOVE') => {
    setConfirming({ id, store, type });
  };

  const processAction = async () => {
    if (!confirming) return;
    const { id, type } = confirming;
    setLoading(true);

    try {
      if (type === 'REMOVE') {
        await api.deleteSeller(id);
        setSellers(prev => prev.filter(s => s.id !== id));
        setSuccessMsg(`Successfully Removed Seller ${id}`);
      } else {
        const newStatus = type === 'BAN' ? 'banned' : 'active';
        await api.updateSellerStatus(id, newStatus);
        setSellers(prev => prev.map(s => s.id === id ? { ...s, status: type === 'BAN' ? 'BANNED' : 'ACTIVE' } : s));
        setSuccessMsg(`Successfully ${type === 'BAN' ? 'Banned' : 'Unbanned'} Seller ${id}`);
      }
    } catch (err) {
      console.error('Handshake failed:', err);
    } finally {
      setLoading(false);
      setConfirming(null);
    }
  };

  const filtered = sellers.filter(s => 
    s.store.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

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
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              confirming.type === 'BAN' ? 'bg-orange-500/10 text-orange-400' : 
              confirming.type === 'UNBAN' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
            }`}>
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 {confirming.type === 'REMOVE' ? (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                 ) : (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 )}
               </svg>
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">{confirming.type} Seller?</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-10 leading-relaxed">Confirm action for <span className="text-white">{confirming.store}</span>?</p>
            <div className="flex gap-4">
              <button onClick={() => setConfirming(null)} className="flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-white/5 transition-all">CANCEL</button>
              <button onClick={processAction} disabled={loading} className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl transition-all flex items-center justify-center ${confirming.type === 'BAN' ? 'bg-orange-600' : confirming.type === 'UNBAN' ? 'bg-green-600' : 'bg-red-600'}`}>
                {loading ? <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : 'YES'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#1e293b]/50 p-8 rounded-[3rem] border border-white/5 shadow-xl">
        <div className="relative max-w-xl">
          <input type="text" placeholder="Search sellers..." className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-14 py-4 text-sm focus:border-[#D4AF37] outline-none text-white font-medium" value={search} onChange={(e) => setSearch(e.target.value)} />
          <span className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30 text-xl">🏢</span>
        </div>
      </div>

      <div className="bg-[#1e293b]/50 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-[300px]"><div className="w-10 h-10 border-4 border-t-[#D4AF37] border-white/10 rounded-full animate-spin"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Store Details</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Gross Sales</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Performance</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(seller => (
                  <tr key={seller.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-6">
                      <p className="text-sm font-black text-white">{seller.store}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{seller.email}</p>
                    </td>
                    <td className="px-10 py-6 text-sm font-black text-[#D4AF37]">{seller.sales}</td>
                    <td className="px-10 py-6 text-sm font-bold text-orange-400">{seller.rating}</td>
                    <td className="px-10 py-6">
                      <div className={`${seller.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'} px-4 py-1 rounded-full border w-fit`}>
                        <span className="text-[9px] font-black uppercase tracking-widest">{seller.status}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right space-x-6">
                      <button onClick={() => handleActionClick(seller.id, seller.store, seller.status === 'ACTIVE' ? 'BAN' : 'UNBAN')} className={`text-[10px] font-black uppercase tracking-widest hover:underline ${seller.status === 'ACTIVE' ? 'text-orange-400' : 'text-green-400'}`}>{seller.status === 'ACTIVE' ? 'BAN' : 'UNBAN'}</button>
                      <button onClick={() => handleActionClick(seller.id, seller.store, 'REMOVE')} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">REMOVE</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-24 text-center"><p className="text-gray-600 font-black uppercase text-xs tracking-[0.3em]">Zero seller records identified.</p></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sellers;