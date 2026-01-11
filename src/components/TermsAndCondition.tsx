
import React from 'react';

interface TermsAndConditionProps {
  onBack: () => void;
}

const TermsAndCondition: React.FC<TermsAndConditionProps> = ({ onBack }) => {
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
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2 font-cinzel">Terms & Conditions</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Updated: 01 January 2026</p>
            <div className="h-1 w-20 bg-[#D4AF37] mt-4 rounded-full"></div>
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 space-y-8 font-medium leading-relaxed">
            <section>
              <p>
                Welcome to Beauzead (“we”, “our”, “us”). By accessing or using our website, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3 font-cinzel">1. Use of Website</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>You must be at least 18 years old to use this website.</li>
                <li>You agree to provide accurate and complete information when placing orders or creating accounts.</li>
                <li>Any misuse, fraudulent activity, or attempt to disrupt the platform may result in account suspension or termination.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3 font-cinzel">2. Products & Orders</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>All product descriptions and prices are subject to change without notice.</li>
                <li>Orders are confirmed only after successful payment.</li>
                <li>We reserve the right to refuse or cancel any order due to availability, pricing errors, or suspected fraud.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3 font-cinzel">3. Payments</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Payments are securely processed via third-party payment gateways (e.g. Stripe).</li>
                <li>All prices are displayed in GBP (£) and include applicable taxes unless stated otherwise.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3 font-cinzel">4. Account Responsibility</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>Any activity under your account is considered your responsibility.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3 font-cinzel">5. Limitation of Liability</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>We are not liable for indirect, incidental, or consequential damages arising from the use of our services.</li>
                <li>Our maximum liability is limited to the amount paid for the order in question.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3 font-cinzel">6. Governing Law</h2>
              <p>These terms are governed by the laws of England and Wales.</p>
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

export default TermsAndCondition;
