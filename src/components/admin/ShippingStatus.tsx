import React, { useState, useEffect } from 'react';
import { api } from '../../mockApi';
import { OrderStatus } from '../../types';

interface ShipOrder {
  id: string;
  user: string;
  currentStatus: OrderStatus;
  localStatus: OrderStatus;
}

const ShippingStatus: React.FC = () => {
  const [orders, setOrders] = useState<ShipOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const statuses: OrderStatus[] = ['APPROVED', 'PACKED', 'SHIPPED', 'DELIVERED'];

  useEffect(() => {
    const loadQueue = async () => {
      try {
        const data = await api.getShippingOrders();
        setOrders(data.map((o: any) => ({
          id: o.orderId,
          user: o.address?.fullName || 'N/A',
          currentStatus: o.orderStatus,
          localStatus: o.orderStatus
        })));
      } finally {
        setLoading(false);
      }
    };
    loadQueue();
  }, []);

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, localStatus: newStatus } : o));
  };

  const handleSave = async (order: ShipOrder) => {
    if (order.localStatus === order.currentStatus) return;
    
    setIsSaving(order.id);
    try {
      await api.updateOrderStatus(order.id, order.localStatus);
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, currentStatus: o.localStatus } : o));
      setSuccessMsg(`Status Updated for ${order.id}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert('Handshake failed.');
    } finally {
      setIsSaving(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {successMsg && (
        <div className="fixed top-24 right-10 z-[3000] bg-[#1e293b] text-white px-8 py-4 rounded-2xl shadow-2xl border border-green-500/30 flex items-center animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-4 text-green-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3"/></svg>
          </div>
          <span className="font-black text-xs uppercase tracking-widest">{successMsg}</span>
        </div>
      )}

      <div className="bg-[#1e293b]/50 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl min-h-[300px]">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest">Global Shipment Console</h3>
            <p className="text-[10px] text-gray-500 font-black uppercase mt-1">Authorized state transitions ONLY</p>
          </div>
          {loading && <div className="w-5 h-5 border-2 border-t-transparent border-[#D4AF37] rounded-full animate-spin"></div>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Order ID</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Customer</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Current Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-6 text-sm font-black text-white">{o.id}</td>
                  <td className="px-10 py-6 text-sm font-bold text-gray-400">{o.user}</td>
                  <td className="px-10 py-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${o.currentStatus === 'DELIVERED' ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`}></div>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                        {o.currentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end space-x-4">
                      <select 
                        className="bg-[#0f172a] border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase text-[#D4AF37] outline-none focus:border-[#D4AF37]/50"
                        value={o.localStatus}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                      >
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      
                      <button 
                        onClick={() => handleSave(o)}
                        disabled={isSaving === o.id || o.localStatus === o.currentStatus}
                        className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center min-w-[100px] ${
                          o.localStatus === o.currentStatus 
                            ? 'bg-white/5 text-gray-600 cursor-default' 
                            : 'bg-green-600 text-white hover:bg-green-700 shadow-xl shadow-green-500/10'
                        }`}
                      >
                        {isSaving === o.id ? <div className="w-3 h-3 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : 'Save State'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && orders.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-gray-600 font-black uppercase text-xs tracking-[0.3em]">No items in the shipping pipeline.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShippingStatus;