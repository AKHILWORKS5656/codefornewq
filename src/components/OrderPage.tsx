
import React, { useState } from 'react';
import { Product } from '../types';
import CheckoutSteps from './CheckoutSteps';

interface OrderPageProps {
  product: Product;
  onContinue: (quantity: number) => void;
  onCancel: () => void;
}

const OrderPage: React.FC<OrderPageProps> = ({ product, onContinue, onCancel }) => {
  const [quantity, setQuantity] = useState(1);

  const subtotal = product.price * quantity;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CheckoutSteps currentStep={0} />
      
      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Order Overview</h2>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-40 bg-gray-100 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <h3 className="text-lg font-black text-gray-900 leading-tight mb-2">{product.title}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.category}</p>
              
              <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Unit Price</p>
                  <p className="text-xl font-black text-gray-900">£{product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                
                <div className="flex flex-col items-center md:items-start">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Select Quantity</p>
                  <div className="flex items-center bg-white border-2 border-gray-100 rounded-xl px-2 py-1 shadow-sm">
                    <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="p-2 text-gray-400 hover:text-black transition-colors">-</button>
                    <span className="w-12 text-center font-black text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(q => q+1)} className="p-2 text-gray-400 hover:text-black transition-colors">+</button>
                  </div>
                </div>
                
                <div className="text-center md:text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Item Subtotal</p>
                  <p className="text-2xl font-black text-[#2874f0]">£{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-8 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button 
            onClick={onCancel}
            className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
          >
            Cancel Order
          </button>
          
          <button 
            onClick={() => onContinue(quantity)}
            className="bg-black text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center space-x-3"
          >
            <span>Continue to Shipping</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5-5 5M6 7l5 5-5 5" strokeWidth="3"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
