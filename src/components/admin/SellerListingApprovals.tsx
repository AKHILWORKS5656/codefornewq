import React, { useState, useEffect } from 'react';
import { api } from '../../mockApi';

interface ListingRequest {
  id: string;
  store: string;
  product: string;
  price: string;
  date: string;
  category: string;
  stock: string;
  description: string;
  image: string;
}

const SellerListingApprovals: React.FC = () => {
  const [listings, setListings] = useState<ListingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<ListingRequest | null>(null);
  const [confirming, setConfirming] = useState<{ id: string; type: 'APPROVE' | 'REJECT' } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const data = await api.getListingRequests();
      setListings(data || []);
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
      setListings(prev => prev.filter(l => l.id !== confirming.id));
      setSuccessMsg(`Successfully ${confirming.type === 'APPROVE' ? 'Approved' : 'Rejected'} Listing`);
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
        {loading && listings.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]"><div className="w-10 h-10 border-4 border-t-[#D4AF37] border-white/10 rounded-full animate-spin"></div></div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-white/5">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Store</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Product</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Price</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {listings.map(l => (
                <tr key={l.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-6 text-sm font-bold text-gray-400">{l.store}</td>
                  <td className="px-10 py-6 text-sm font-black text-white">{l.product}</td>
                  <td className="px-10 py-6 text-sm font-black text-blue-400">{l.price}</td>
                  <td className="px-10 py-6 text-right space-x-6">
                    <button onClick={() => setViewing(l)} className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:underline">VIEW</button>
                    <button onClick={() => setConfirming({ id: l.id, type: 'APPROVE' })} className="text-[10px] font-black text-green-400 uppercase tracking-widest hover:underline">APPROVE</button>
                    <button onClick={() => setConfirming({ id: l.id, type: 'REJECT' })} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:underline">REJECT</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && listings.length === 0 && (
          <div className="py-24 text-center"><p className="text-gray-600 font-black uppercase text-xs tracking-[0.3em]">No pending listings identified.</p></div>
        )}
      </div>
    </div>
  );
};

export default SellerListingApprovals;