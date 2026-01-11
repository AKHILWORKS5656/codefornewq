import React, { useState, useMemo } from 'react';
import { Product, ShippingAddress, Country } from '../utils/types';
import CheckoutSteps from './CheckoutSteps';
import { COUNTRIES } from '../utils/constants';
import { createCheckoutSession, handlePaymentError } from '../utils/stripeClient';

interface PaymentPageProps {
  product: Product;
  quantity: number;
  deliveryCharge: number;
  platformFee: number;
  address: ShippingAddress;
  onPay: () => void;
  onBack: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ 
  product, 
  quantity, 
  deliveryCharge, 
  platformFee, 
  address, 
  onPay, 
  onBack 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const countryMeta = useMemo(() => {
    return COUNTRIES.find(c => c.name === address.country) || COUNTRIES[0];
  }, [address.country]);

  const convert = (val: number) => val * countryMeta.conversionRate;
  const symbol = countryMeta.symbol;

  const localSubtotal = convert(product.price * quantity);
  const localShipping = convert(deliveryCharge);
  const localPlatform = convert(platformFee);
  const localTotal = localSubtotal + localShipping + localPlatform;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Get user email from localStorage or use a default
      const userEmail = localStorage.getItem('user_email') || 'customer@beauzead.com';
      
      // Create checkout session via backend
      const session = await createCheckoutSession({
        productId: product.id,
        quantity: quantity,
        currency: countryMeta.currency,
        amount: localTotal,
        userEmail: userEmail,
        shippingAddress: {
          street: address.addressLine1,
          city: address.city,
          state: address.postcode,
          postalCode: address.postcode,
          country: address.country,
        },
        metadata: {
          productTitle: product.title,
          customerName: address.fullName,
        },
      });

      // Redirect to Stripe checkout
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error('No checkout URL received from server');
      }
    } catch (err) {
      const errorMessage = handlePaymentError(err);
      setError(errorMessage);
      console.error('Stripe checkout error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <CheckoutSteps currentStep={2} />
        
        <div className="bg-[#1e293b] rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-10 border-b lg:border-b-0 lg:border-r border-white/5">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">Review Order</h2>
              
              <div className="flex items-center space-x-6 p-6 bg-white/5 rounded-3xl border border-white/5 mb-8">
                <img src={product.image} className="w-20 h-28 object-cover rounded-2xl shadow-xl" alt={product.title} />
                <div>
                  <h3 className="text-white font-black leading-tight text-lg mb-2">{product.title}</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Qty: {quantity}</span>
                    <span className="text-blue-400 font-black text-xl">{symbol}{convert(product.price).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Destination</h4>
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                    <p className="text-white font-black mb-1">{address.fullName}</p>
                    <p className="text-gray-400 text-sm font-medium">{address.addressLine1}</p>
                    <p className="text-gray-400 text-sm font-medium">{address.city}, {address.postcode}</p>
                    <p className="text-blue-500 font-black uppercase mt-2 text-xs">{address.country}</p>
                  </div>
                </div>

                <button 
                  onClick={onBack}
                  className="w-full py-4 border border-white/10 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:bg-white/5 transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3"/></svg>
                  <span>MODIFY DETAILS</span>
                </button>
              </div>
            </div>

            <div className="lg:w-1/2 p-10 bg-[#161e2e]/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Final Invoice</h3>
                   <div className="flex items-center space-x-2 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                     <span className="text-[10px] font-black text-blue-400 uppercase">Live Stripe</span>
                   </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6">
                    <p className="text-red-400 text-sm font-bold">{error}</p>
                  </div>
                )}

                <div className="space-y-5 mb-10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">Items Subtotal</span>
                    <span className="text-white font-black">{symbol}{localSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">Shipping Fee</span>
                    <span className="text-white font-black">{symbol}{localShipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pb-5 border-b border-white/5">
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">Platform Handling</span>
                    <span className="text-white font-black">{symbol}{localPlatform.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-black text-white uppercase tracking-tighter">Total Due</span>
                    <span className="text-4xl font-black text-blue-500 tracking-tighter">
                      {symbol}{localTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className={`w-full py-6 rounded-[2rem] font-black text-base uppercase tracking-[0.25em] shadow-2xl transition-all flex items-center justify-center space-x-4 overflow-hidden relative ${
                    isProcessing 
                      ? 'bg-gray-700 text-gray-500 cursor-wait' 
                      : 'bg-white text-[#0f172a] hover:scale-[1.02] active:scale-95 shadow-white/10'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-6 h-6 border-3 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                      <span>SECURE HANDSHAKE...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5l-3.47-3.47 1.06-1.06L12 13.38l4.41-4.41 1.06 1.06L13 16.5z"/></svg>
                      <span>SECURE CHECKOUT</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center space-x-6 opacity-40 grayscale hover:grayscale-0 transition-all">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" className="h-5" />
                </div>

                <div className="bg-[#111827] p-6 rounded-3xl border border-white/5">
                  <p className="text-[10px] text-gray-500 font-bold leading-relaxed">
                    🔒 Production Environment: Your payment is processed securely through Stripe's PCI-DSS certified servers. Your card information is never stored on our servers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;