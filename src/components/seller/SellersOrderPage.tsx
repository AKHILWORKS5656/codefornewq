import React, { useState, useEffect } from 'react';
import { User, Order, OrderStatus } from '../../types';
import { api } from '../../mockApi';

interface SellersOrderPageProps {
  user: User;
}

const SellersOrderPage: React.FC<SellersOrderPageProps> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<{ id: string; type: 'APPROVE' | 'REJECT' } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [user.id]);

  const fetchOrders = async () => {
    setLoading(true);
    const data = await api.getSellerOrders(user.id);
    setOrders(data);
    setLoading(false);
  };

  const handleAction = async () => {
    if (!confirming) return;
    setLoading(true);
    try {
      const newStatus: OrderStatus = confirming.type === 'APPROVE' ? 'APPROVED' : 'CANCELLED';
      await api.updateOrderStatus(confirming.id, newStatus);
      setOrders(prev => prev.map(o => o.orderId === confirming.id ? { ...o, orderStatus: newStatus } : o));
      setSuccessMsg(`Order ${confirming.id} successfully ${confirming.type === 'APPROVE' ? 'approved' : 'rejected'}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } finally {
      setConfirming(null);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {successMsg && (
        <div className="fixed top-24 right-10 z-[3000] bg-[#1e293b] text-white px-8 py-4 rounded-2xl shadow-2xl border border-green-500/30 flex items-center animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-4 text-green-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <span className="font-black text-xs uppercase tracking-widest">{successMsg}</span>
        </div>
      )}

      {confirming && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#1e293b] border border-white/10 rounded-[3rem] w-full max-w-sm p-12 shadow-2xl animate-fade-in text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${confirming.type === 'APPROVE' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">{confirming.type === 'APPROVE' ? 'Approve Order?' : 'Reject Order?'}</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-10 leading-relaxed">
              Target Node: <span className="text-[#D4AF37]">{confirming.id}</span>
            </p>
            <div className="flex gap-4">
              <button onClick={() => setConfirming(null)} className="flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={handleAction} className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl transition-all ${confirming.type === 'APPROVE' ? 'bg-green-600 shadow-green-500/10' : 'bg-red-600 shadow-red-500/10'}`}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#1e293b]/50 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl min-h-[400px]">
        {loading && orders.length === 0 ? (
          <div className="flex items-center justify-center h-[400px]"><div className="w-10 h-10 border-4 border-t-[#D4AF37] border-white/10 rounded-full animate-spin"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Order ID & Date</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Asset Details</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Customer Location</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest text-right">Execution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map(order => (
                  <tr key={order.orderId} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-6">
                      <p className="text-sm font-black text-white">{order.orderId}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-4">
                        <img src={order.productImage} className="w-10 h-12 object-cover rounded-lg" />
                        <div>
                          <p className="text-sm font-bold text-white truncate max-w-[150px]">{order.productName}</p>
                          <p className="text-xs font-black text-[#D4AF37]">{order.currencySymbol}{order.totalPaid.toLocaleString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <p className="text-xs font-bold text-gray-400">{order.address.city}</p>
                       <p className="text-[10px] font-black text-gray-600 uppercase">{order.address.country}</p>
                    </td>
                    <td className="px-10 py-6">
                       <div className={`px-4 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest w-fit ${
                         order.orderStatus === 'DELIVERED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                         order.orderStatus === 'CANCELLED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                         'bg-orange-500/10 text-orange-400 border-orange-500/20'
                       }`}>
                         {order.orderStatus}
                       </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                       {order.orderStatus === 'PENDING' ? (
                         <div className="flex items-center justify-end space-x-3">
                           <button onClick={() => setConfirming({ id: order.orderId, type: 'APPROVE' })} className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-xl shadow-lg transition-all active:scale-90">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                           </button>
                           <button onClick={() => setConfirming({ id: order.orderId, type: 'REJECT' })} className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-xl shadow-lg transition-all active:scale-90">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                           </button>
                         </div>
                       ) : (
                         <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Finalized</span>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && !loading && (
              <div className="py-32 text-center">
                 <p className="text-gray-600 font-black uppercase text-xs tracking-[0.4em]">Zero order transmissions detected.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellersOrderPage;