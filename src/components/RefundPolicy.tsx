
import React from 'react';

interface RefundPolicyProps {
  onBack: () => void;
}

const RefundPolicy: React.FC<RefundPolicyProps> = ({ onBack }) => {
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
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2 font-cinzel">Refund Policy</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Updated: 01 January 2026</p>
            <div className="h-1 w-20 bg-[#D4AF37] mt-4 rounded-full"></div>
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 space-y-8 font-medium leading-relaxed">
            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3 font-cinzel">1. Order Cancellations</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Orders can be cancelled before shipping.</li>
                <li>Once shipped, cancellations are subject to approval.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3 font-cinzel">2. Refund Eligibility</h2>
              <p className="mb-2">Refunds may be issued if:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>The product is damaged or defective</li>
                <li>The wrong item is delivered</li>
                <li>The order is cancelled and approved</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3 font-cinzel">3. Non-Refundable Cases</h2>
              <p className="mb-2">We cannot offer refunds in the following scenarios:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Change of mind after delivery</li>
                <li>Products damaged due to misuse</li>
                <li>Digital or downloadable items (if applicable)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3 font-cinzel">4. Refund Processing</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Approved refunds are processed to the original payment method.</li>
                <li>Refunds typically take 5–10 business days to reflect, depending on the bank.</li>
              </ul>
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

export default RefundPolicy;
