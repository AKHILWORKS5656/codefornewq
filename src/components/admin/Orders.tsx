import React, { useState, useEffect } from 'react';
import { api } from '../../mockApi';

interface OrderItem {
  id: string;
  name: string;
  contact: string;
  address: string;
  amount: string;
  status: string;
  payment: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<{ id: string; type: 'approve' | 'reject' } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await api.getOrders();
      // Map domain model Order to the local list UI model if needed
      setOrders(data.map((o: any) => ({
        id: o.orderId,
        name: o.address?.fullName || 'N/A',
        contact: o.address?.phone || 'N/A',
        address: o.address?.addressLine1 || 'N/A',
        amount: `£${o.totalPaid.toLocaleString()}`,
        status: o.orderStatus,
        payment: o.paymentStatus.toUpperCase()
      })));
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
      await api.updateOrderStatus(id, type === 'approve' ? 'SHIPPED' : 'CANCELLED');
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: type === 'approve' ? 'APPROVED' : 'REJECTED' } : o));
      setSuccessMsg(`Successfully ${type === 'approve' ? 'Approved' : 'Rejected'}`);
    } catch (err) {
      alert('Action failed. System node communication error.');
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
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">{confirming.type === 'approve' ? 'Approve Order?' : 'Reject Order?'}</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-10 leading-relaxed">Confirm action for order <span className="text-[#D4AF37]">{confirming.id}</span>?</p>
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
        {loading && orders.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]"><div className="w-10 h-10 border-4 border-t-[#D4AF37] border-white/10 rounded-full animate-spin"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Order & Amount</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Customer & Contact</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Shipping</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Payment</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-10 py-6"><p className="text-sm font-black text-white">{order.id}</p><p className="text-xs text-[#D4AF37] font-black">{order.amount}</p></td>
                    <td className="px-10 py-6"><p className="text-sm font-bold text-white">{order.name}</p><p className="text-[10px] text-gray-500 font-black tracking-tighter">{order.contact}</p></td>
                    <td className="px-10 py-6"><p className="text-[11px] font-bold text-gray-400 max-w-[200px] leading-tight truncate">{order.address}</p></td>
                    <td className="px-10 py-6"><div className="bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20 w-fit"><span className="text-[10px] font-black text-green-400 uppercase tracking-widest">{order.payment}</span></div></td>
                    <td className="px-10 py-6 text-right space-x-4">
                      {order.status === 'PENDING' ? (
                        <><button onClick={() => handleActionClick(order.id, 'approve')} className="text-[10px] font-black text-green-400 uppercase tracking-widest border border-green-400/20 px-4 py-2 rounded-xl hover:bg-green-500 hover:text-white transition-all">APPROVE</button><button onClick={() => handleActionClick(order.id, 'reject')} className="text-[10px] font-black text-red-400 uppercase tracking-widest border border-red-400/20 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all">REJECT</button></>
                      ) : (
                        <span className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl border ${order.status === 'APPROVED' ? 'text-green-500 border-green-500/10' : 'text-red-500 border-red-500/10'}`}>{order.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;