import React from 'react';
import { Order } from '../types';
import CheckoutSteps from './CheckoutSteps';

interface SummaryPageProps {
  order: Order;
  onDone: () => void;
}

const SummaryPage: React.FC<SummaryPageProps> = ({ order, onDone }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CheckoutSteps currentStep={3} />
      
      <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden text-center p-12 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
        
        <div className="mb-10 inline-flex items-center justify-center w-24 h-24 bg-green-100 text-green-600 rounded-full shadow-inner animate-bounce">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        
        <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">Payment Successful!</h2>
        <p className="text-gray-500 font-bold text-sm mb-12">Thank you for your premium purchase at Beauzead. Your order is being processed.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-left bg-gray-50 p-8 rounded-3xl border border-gray-100">
          <div>
            <div className="mb-6">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Booking ID</p>
              <p className="text-xl font-black text-[#2874f0] tracking-tighter font-mono">{order.orderId}</p>
            </div>
            <div className="mb-6">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
              <p className="text-2xl font-black text-gray-900">£{order.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Items</p>
              <p className="text-sm font-bold text-gray-700">{order.productName} (x{order.quantity})</p>
            </div>
          </div>
          
          <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-8">
            <div className="mb-6">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Date</p>
              <p className="text-sm font-black text-gray-900">{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div className="mb-6">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Est. Delivery Date</p>
              <p className="text-lg font-black text-green-600">
                {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Processing'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <span className="inline-block bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Processing</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={onDone}
            className="bg-black text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            Continue Shopping
          </button>
          <button className="bg-white border-2 border-gray-100 text-gray-400 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:text-black hover:border-black transition-all">
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;