
import React, { useState, useEffect } from 'react';
import { User, Order, OrderStatus } from '../types';
import { api } from '../mockApi';

interface MyOrdersProps {
  user: User;
}

const MyOrders: React.FC<MyOrdersProps> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [activeTrackOrder, setActiveTrackOrder] = useState<Order | null>(null);
  const [activeCancelOrder, setActiveCancelOrder] = useState<Order | null>(null);
  const [activeReturnOrder, setActiveReturnOrder] = useState<Order | null>(null);
  
  const [cancelReason, setCancelReason] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [modalMessage, setModalMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getUserOrders(user.id);
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user.id]);

  const closeModals = () => {
    setActiveTrackOrder(null);
    setActiveCancelOrder(null);
    setActiveReturnOrder(null);
    setCancelReason('');
    setReturnReason('');
    setModalMessage(null);
  };

  const check24hrWindow = (baseDateStr: string | undefined) => {
    if (!baseDateStr) return false;
    const baseTime = new Date(baseDateStr).getTime();
    const nowTime = new Date().getTime();
    return (nowTime - baseTime) <= (24 * 60 * 60 * 1000);
  };

  const handleCancelRequest = async () => {
    if (!activeCancelOrder) return;
    if (!check24hrWindow(activeCancelOrder.createdAt)) {
      setModalMessage({ type: 'error', text: 'Cancellation time period exceeded' });
      return;
    }
    // Mock API Call
    setModalMessage({ type: 'success', text: 'Cancellation requested' });
    setTimeout(() => {
        setOrders(prev => prev.map(o => o.orderId === activeCancelOrder.orderId ? { ...o, orderStatus: 'CANCELLED' as OrderStatus } : o));
        closeModals();
    }, 2000);
  };

  const handleReturnRequest = async () => {
    if (!activeReturnOrder) return;
    if (!check24hrWindow(activeReturnOrder.deliveryDate)) {
      setModalMessage({ type: 'error', text: 'Return request time exceeded' });
      return;
    }
    // Mock API Call
    setModalMessage({ type: 'success', text: 'Return Request processing' });
    setTimeout(() => {
        setOrders(prev => prev.map(o => o.orderId === activeReturnOrder.orderId ? { ...o, orderStatus: 'RETURN_REQUESTED' as OrderStatus } : o));
        closeModals();
    }, 2000);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="w-10 h-10 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-8 px-4 relative">
      <div className="max-w-6xl mx-auto space-y-5">
        {orders.map((order) => {
          const bookingDate = new Date(order.createdAt);
          const expectedDelivery = new Date(bookingDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          const isDelivered = order.orderStatus === 'DELIVERED';
          const canCancel = order.orderStatus === 'PROCESSING' || order.orderStatus === 'PACKED';

          return (
            <div key={order.orderId} className="flex flex-col group">
              {order.sharingInfo && (
                <div className="ml-4 w-fit bg-[#fff7e6] text-[#8c6d1f] text-[11px] font-bold px-4 py-1.5 rounded-t-lg border-x border-t border-gray-200">
                  {order.sharingInfo}
                </div>
              )}
              
              <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded">
                  <img 
                    src={order.productImage} 
                    alt={order.productName} 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <div className="flex-grow min-w-0">
                  <h3 className="text-sm font-medium text-gray-800 mb-1 truncate md:whitespace-normal">
                    {order.productName}
                  </h3>
                  {order.variantInfo && (
                    <p className="text-xs text-gray-400 mb-2">{order.variantInfo}</p>
                  )}
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Order ID: {order.orderId}</p>
                  
                  {order.paymentStatus === 'failed' && (
                    <div className="bg-white border border-blue-400 rounded-sm text-[11px] text-gray-700 px-3 py-1.5 inline-block">
                      Payment not successful. Please contact your bank for any money deducted.
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 mt-4">
                     <button 
                        onClick={() => setActiveTrackOrder(order)}
                        className="px-4 py-1.5 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-[#2874f0] border border-blue-100 rounded hover:bg-blue-50 transition-all"
                     >
                        Track Order
                     </button>
                     
                     {canCancel && (
                        <button 
                            onClick={() => setActiveCancelOrder(order)}
                            className="px-4 py-1.5 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-red-500 border border-red-100 rounded hover:bg-red-50 transition-all"
                        >
                            Cancel Order
                        </button>
                     )}

                     {isDelivered && (
                        <button 
                            onClick={() => setActiveReturnOrder(order)}
                            className="px-4 py-1.5 bg-[#111827] text-[10px] font-black uppercase tracking-widest text-[#D4AF37] border border-gray-800 rounded hover:bg-black transition-all"
                        >
                            Return Item
                        </button>
                     )}
                  </div>
                </div>

                <div className="w-24 flex-shrink-0 text-sm font-bold text-gray-900 md:pt-1">
                  {order.currencySymbol}{order.unitPrice.toLocaleString()}
                </div>

                <div className="w-64 flex-shrink-0 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${
                      isDelivered ? 'bg-[#26a541]' : order.orderStatus === 'CANCELLED' ? 'bg-[#ff6161]' : 'bg-orange-400'
                    }`}></span>
                    <span className="text-sm font-bold text-gray-800">
                      {isDelivered ? `Delivered on ${new Date(order.deliveryDate!).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : 
                       order.orderStatus === 'CANCELLED' ? `Cancelled on ${order.cancelledDate || 'request'}` : 
                       order.orderStatus === 'NOT_PLACED' ? 'Order Not Placed' : 
                       order.orderStatus === 'RETURN_REQUESTED' ? 'Return Requested' :
                       `Expected by ${expectedDelivery.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                    </span>
                  </div>
                  {order.statusMessage && (
                    <p className="text-xs text-gray-500 pl-4 leading-relaxed">
                      {order.statusMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TRACK ORDER MODAL */}
      {activeTrackOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl animate-fade-in relative">
                <button onClick={closeModals} className="absolute top-6 right-6 text-gray-400 hover:text-black">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5"/></svg>
                </button>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-8">Shipment Lifecycle</h3>
                
                <div className="flex flex-col md:flex-row gap-12">
                    <div className="flex-1 space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                        {[
                            { label: 'ORDER ACCEPTED', key: 'PROCESSING' },
                            { label: 'PACKED', key: 'PACKED' },
                            { label: 'SHIPPED', key: 'SHIPPED' },
                            { label: 'DELIVERED', key: 'DELIVERED' }
                        ].map((step, i) => {
                            const isPast = activeTrackOrder.statusHistory.some(h => h.status === step.key);
                            const isCurrent = activeTrackOrder.orderStatus === step.key;
                            
                            return (
                                <div key={i} className="flex items-center space-x-6 relative z-10">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                                        isPast || isCurrent ? 'bg-[#26a541] border-[#26a541] shadow-lg shadow-green-200' : 'bg-white border-gray-200'
                                    }`}>
                                        {(isPast || isCurrent) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="4"/></svg>}
                                    </div>
                                    <div>
                                        <p className={`text-[11px] font-black uppercase tracking-widest ${isPast || isCurrent ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</p>
                                        {isPast && (
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Update Recorded</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="md:w-64 bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Expected Arrival</p>
                        <p className="text-xl font-black text-gray-900 tracking-tighter">
                            {new Date(new Date(activeTrackOrder.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <div className="mt-6 pt-6 border-t border-gray-200">
                           <p className="text-[10px] font-black text-[#2874f0] uppercase tracking-widest">Handshake Verified</p>
                           <p className="text-[9px] text-gray-400 font-bold mt-1">Direct from Beauzead Global Node</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* CANCEL ORDER MODAL */}
      {activeCancelOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 text-center">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-fade-in">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-6">Cancellation Desk</h3>
                
                {modalMessage ? (
                    <div className={`p-6 rounded-2xl mb-6 ${modalMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        <p className="text-sm font-black uppercase tracking-widest">{modalMessage.text}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="text-left space-y-3">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason for Cancellation</label>
                            <textarea 
                                maxLength={350}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all resize-none h-32"
                                placeholder="Please specify your reason (Required)..."
                                value={cancelReason}
                                onChange={e => setCancelReason(e.target.value)}
                            />
                            <p className="text-right text-[9px] font-bold text-gray-300 uppercase">{cancelReason.length}/350</p>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button onClick={closeModals} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 rounded-xl transition-all">Go Back</button>
                            <button 
                                onClick={handleCancelRequest}
                                disabled={!cancelReason.trim()}
                                className="flex-1 py-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
                            >
                                Proceed to Cancel
                            </button>
                        </div>
                    </div>
                )}
                {modalMessage?.type === 'error' && (
                   <button onClick={closeModals} className="mt-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:underline">Close</button>
                )}
            </div>
        </div>
      )}

      {/* RETURN ITEM MODAL */}
      {activeReturnOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl animate-fade-in">
                <div className="text-center mb-8">
                   <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">Return Authority</h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">Authenticated Request Management</p>
                </div>

                {modalMessage ? (
                    <div className={`p-8 rounded-2xl text-center ${modalMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        <p className="text-sm font-black uppercase tracking-widest leading-relaxed">{modalMessage.text}</p>
                        {modalMessage.type === 'error' && (
                             <button onClick={closeModals} className="mt-6 w-full py-4 border-2 border-red-100 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-100 transition-all">Acknowledge</button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                             <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Booking ID</p>
                                <p className="text-sm font-black text-gray-900 truncate">{activeReturnOrder.orderId}</p>
                             </div>
                             <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Invoice Value</p>
                                <p className="text-sm font-black text-gray-900">{activeReturnOrder.currencySymbol}{activeReturnOrder.totalPaid.toLocaleString()}</p>
                             </div>
                             <div className="col-span-2">
                                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Acquisition</p>
                                <p className="text-xs font-bold text-gray-700 truncate">{activeReturnOrder.productName}</p>
                             </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Formal Reason for Return</label>
                            <textarea 
                                maxLength={350}
                                className="w-full bg-white border-2 border-gray-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-[#2874f0] transition-all resize-none h-32"
                                placeholder="Describe the discrepancy clearly..."
                                value={returnReason}
                                onChange={e => setReturnReason(e.target.value)}
                            />
                            <p className="text-right text-[9px] font-bold text-gray-300 uppercase">{returnReason.length}/350</p>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={closeModals} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 rounded-xl transition-all">Cancel</button>
                            <button 
                                onClick={handleReturnRequest}
                                disabled={!returnReason.trim()}
                                className="flex-1 py-4 bg-[#111827] text-[#D4AF37] text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
                            >
                                Proceed to Return
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
