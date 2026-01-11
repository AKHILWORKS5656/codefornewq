
import React from 'react';

interface ShippingPolicyProps {
  onBack: () => void;
}

const ShippingPolicy: React.FC<ShippingPolicyProps> = ({ onBack }) => {
  return (
    <div className="bg-[#f8fafc] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-12">
          <button 
            onClick={onBack}
            className="mb-8 flex items-center space-x-2 text-xs font-black text-[#2874f0] uppercase tracking-widest hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Store</span>
          </button>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2 font-cinzel">Shipping Policy</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Updated: 01 January 2026</p>
            <div className="h-1 w-20 bg-[#D4AF37] mt-4 rounded-full"></div>
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 space-y-8 font-medium leading-relaxed">
            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3 font-cinzel">1. Shipping Locations</h2>
              <p>We currently ship within the United Kingdom.</p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3 font-cinzel">2. Shipping Charges</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Mainland UK: £1.50</li>
                <li>Outer UK regions: £3.00</li>
              </ul>
              <p className="mt-2 text-xs font-bold text-gray-400">Shipping charges are calculated at checkout.</p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3 font-cinzel">3. Delivery Time</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Orders are usually delivered within 3–5 business days after dispatch.</li>
                <li>Delivery times may vary due to unforeseen circumstances.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3 font-cinzel">4. Order Tracking</h2>
              <p>Tracking details will be shared once the order is shipped (if applicable).</p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3 font-cinzel">5. Delays</h2>
              <p>We are not responsible for delays caused by couriers, weather conditions, or public holidays.</p>
            </section>

            <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-4 font-cinzel flex items-center">
                <span className="mr-2">📍</span> Contact Information
              </h2>
              <div className="space-y-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                <div>
                  <p className="text-gray-900 mb-1">Address:</p>
                  <p>23, MK6 5HH</p>
                  <p>United Kingdom</p>
                </div>
                <div>
                  <p className="text-gray-900 mb-1">Email:</p>
                  <p className="text-[#2874f0] lowercase">info@beauzead.com</p>
                </div>
                <div>
                  <p className="text-gray-900 mb-1">Phone:</p>
                  <p>+44 7555 394997</p>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-50 flex justify-center">
            <button 
              onClick={onBack}
              className="bg-black text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              Accept & Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
