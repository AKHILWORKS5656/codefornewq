import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { api } from '../mockApi';
import { COUNTRIES } from '../constants';

interface CartProps {
  onBack: () => void;
  onCheckout: (items: CartItem[]) => void;
  onCartChange: (count: number) => void;
  userCountry?: string;
}

const Cart: React.FC<CartProps> = ({ onBack, onCheckout, onCartChange, userCountry }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const countryMeta = COUNTRIES.find(c => c.name === userCountry) || COUNTRIES[0];
  const symbol = countryMeta.symbol;
  const rate = countryMeta.conversionRate;

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const cart = await api.getCart();
    setItems(cart);
    onCartChange(cart.reduce((sum, item) => sum + item.quantity, 0));
    setLoading(false);
  };

  const handleUpdateQty = async (cartId: string, delta: number) => {
    const updated = await api.updateCartQuantity(cartId, delta);
    setItems(updated);
    onCartChange(updated.reduce((sum, item) => sum + item.quantity, 0));
  };

  const handleRemove = async (cartId: string) => {
    const updated = await api.removeFromCart(cartId);
    setItems(updated);
    onCartChange(updated.reduce((sum, item) => sum + item.quantity, 0));
  };

  const calculateTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const originalSubtotal = items.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
    return { subtotal, originalSubtotal, discount: originalSubtotal - subtotal };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-[#2874f0] border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  const { subtotal, originalSubtotal, discount } = calculateTotal();

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center space-x-2 text-[10px] font-black text-[#2874f0] uppercase tracking-[0.2em] bg-white px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3"/></svg>
          <span>RETURN TO MARKET</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-[70%] space-y-6">
            <div className="bg-white p-6 rounded-[1.5rem] shadow-sm flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Your Collection ({items.length})</h2>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Syncing with {userCountry || 'United Kingdom'}</div>
            </div>

            {items.length === 0 ? (
              <div className="bg-white p-20 text-center rounded-[2rem] shadow-xl border border-gray-50">
                <div className="text-6xl mb-6">🛍️</div>
                <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">Collection Empty</h3>
                <p className="text-gray-400 mb-10 font-medium">Add signature assets to your selection.</p>
                <button onClick={onBack} className="bg-[#2874f0] text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all">Start Shopping</button>
              </div>
            ) : (
              <div className="bg-white shadow-xl rounded-[2rem] overflow-hidden border border-gray-50">
                {items.map((item) => (
                  <div key={item.cartId} className="p-8 border-b border-gray-50 flex gap-8 group hover:bg-gray-50/30 transition-all">
                    <div className="w-24 h-32 flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-2">
                       <img src={item.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight pr-4">{item.title}</h3>
                        <button onClick={() => handleRemove(item.cartId)} className="text-red-400 hover:text-red-600 transition-colors">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2"/></svg>
                        </button>
                      </div>
                      <div className="flex items-center space-x-3 mb-6">
                        <span className="text-xl font-black text-gray-900">{symbol}{(item.price * rate).toFixed(0)}</span>
                        {item.originalPrice && <span className="text-sm text-gray-400 line-through font-bold">{symbol}{(item.originalPrice * rate).toFixed(0)}</span>}
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center bg-gray-100 rounded-xl p-1 shadow-inner">
                           <button onClick={() => handleUpdateQty(item.cartId, -1)} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-black" disabled={item.quantity <= 1}>–</button>
                           <span className="px-4 font-black text-sm">{item.quantity}</span>
                           <button onClick={() => handleUpdateQty(item.cartId, 1)} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-black">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-8 bg-gray-50 flex justify-end">
                   <button onClick={() => onCheckout(items)} className="bg-black text-white px-16 py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all">Proceed to Checkout</button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-[30%]">
            <div className="bg-white shadow-xl rounded-[2rem] sticky top-24 border border-gray-50 p-8 space-y-6">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 pb-4">Transaction Audit</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold text-gray-600"><span>Assets ({items.length})</span><span>{symbol}{(originalSubtotal * rate).toFixed(0)}</span></div>
                <div className="flex justify-between text-sm font-bold text-green-500"><span>Market Discount</span><span>− {symbol}{(discount * rate).toFixed(0)}</span></div>
                <div className="flex justify-between text-sm font-bold text-gray-600"><span>Logistics Charge</span><span>FREE</span></div>
                <div className="pt-6 border-t border-dashed border-gray-200 flex justify-between items-end">
                  <span className="text-lg font-black uppercase tracking-tighter">Total Due</span>
                  <span className="text-3xl font-black text-[#2874f0] tracking-tighter">{symbol}{(subtotal * rate).toFixed(0)}</span>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-2xl text-[10px] font-black text-green-600 uppercase tracking-widest text-center border border-green-100">
                You saved {symbol}{(discount * rate).toFixed(0)} on this acquisition
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;