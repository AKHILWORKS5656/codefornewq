
import React from 'react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
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
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2 font-cinzel">Privacy Policy</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Updated: 01 January 2026</p>
            <div className="h-1 w-20 bg-[#D4AF37] mt-4 rounded-full"></div>
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 space-y-8 font-medium leading-relaxed">
            <section>
              <p>Your privacy matters to us. This policy explains how we collect, use, and protect your data.</p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3">1. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Personal details (name, email, phone number, address)</li>
                <li>Order and payment information</li>
                <li>Device and usage data (IP address, browser type)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>To process orders and payments</li>
                <li>To provide customer support</li>
                <li>To improve our services</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3">3. Data Sharing</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>We do not sell your personal data.</li>
                <li>Data is shared only with trusted service providers (payment processors, delivery partners).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3">4. Data Security</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>We use industry-standard security measures to protect your information.</li>
                <li>Payment details are handled securely by third-party gateways.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3">5. Your Rights</h2>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Access your data</li>
                <li>Request correction or deletion</li>
                <li>Withdraw consent where applicable</li>
              </ul>
              <p className="mt-4">Contact us to exercise your rights.</p>
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

export default PrivacyPolicy;
