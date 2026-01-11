import React from 'react';

interface SellersLandingPageProps {
  onStartSelling: () => void;
  onBack: () => void;
}

const SellersLandingPage: React.FC<SellersLandingPageProps> = ({ onStartSelling, onBack }) => {
  return (
    <div className="seller-brand-bg min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 drop-shadow-sm">
              From home-grown to well-known with Beauzead
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-10 font-medium max-w-lg mx-auto md:mx-0">
              Connect with millions of customers and scale your brand globally with our premium infrastructure.
            </p>
            <button 
              onClick={onStartSelling}
              className="bg-[#FF6100] hover:bg-[#e65700] text-white px-12 py-4 rounded-full font-black text-lg shadow-[0_20px_50px_rgba(255,97,0,0.3)] transition-all hover:scale-105 active:scale-95"
            >
              Start Selling
            </button>
          </div>
          <div className="flex-1 w-full max-w-[500px] md:max-w-none">
            <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.25)] border-[8px] border-white transition-transform hover:scale-[1.02] duration-500">
              <img 
                src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&q=80&w=1080&h=1350" 
                alt="Beauzead Commerce" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[3.5rem]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 bg-white rounded-[4rem] p-10 md:p-20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-white">
          <h2 className="text-3xl md:text-5xl font-black text-center text-slate-900 mb-20 uppercase tracking-tighter">
            How to sell on Beauzead?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-20 gap-x-16">
            {/* Step 1 */}
            <div className="flex items-start space-x-8 group">
              <div className="w-28 h-28 flex-shrink-0 bg-sky-500 rounded-[2rem] flex items-center justify-center p-6 border-8 border-gray-50 shadow-xl overflow-hidden transition-transform group-hover:rotate-3 group-hover:scale-110">
                 <img src="https://img.icons8.com/clouds/200/iphone-x.png" alt="Phone" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">Step 1: Account Registration</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Join the platform using your Tax ID, legal business credentials, and a verified bank account node.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-8 group">
              <div className="w-28 h-28 flex-shrink-0 bg-sky-500 rounded-[2rem] flex items-center justify-center p-6 border-8 border-gray-50 shadow-xl overflow-hidden transition-transform group-hover:-rotate-3 group-hover:scale-110">
                 <img src="https://img.icons8.com/clouds/200/box.png" alt="Boxes" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">Step 2: Logistics Setup</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Configure your preferred storage, packaging standards, and global shipping protocols for maximum efficiency.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-8 group">
              <div className="w-28 h-28 flex-shrink-0 bg-sky-500 rounded-[2rem] flex items-center justify-center p-6 border-8 border-gray-50 shadow-xl overflow-hidden transition-transform group-hover:rotate-3 group-hover:scale-110">
                 <img src="https://img.icons8.com/clouds/200/laptop.png" alt="Laptop" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">Step 3: Catalog Listing</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Deploy your luxury inventory to our global marketplace with high-fidelity assets and descriptions.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start space-x-8 group">
              <div className="w-28 h-28 flex-shrink-0 bg-sky-500 rounded-[2rem] flex items-center justify-center p-6 border-8 border-gray-50 shadow-xl overflow-hidden transition-transform group-hover:-rotate-3 group-hover:scale-110">
                 <img src="https://img.icons8.com/clouds/200/checked-user-male.png" alt="Check" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">Step 4: Fulfillment & Revenue</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Complete global customer orders and receive secure, scheduled payouts directly to your institution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter uppercase">
            Start selling today
          </h2>
          <p className="text-xl text-gray-700 mb-12 font-medium">
            Deploy your products to millions of discerning customers worldwide.
          </p>
          <button 
            onClick={onStartSelling}
            className="bg-[#FF6100] hover:bg-[#e65700] text-white px-20 py-6 rounded-full font-black text-xl shadow-[0_30px_60px_rgba(255,97,0,0.4)] transition-all hover:scale-110 active:scale-95"
          >
            Launch Store
          </button>
        </div>
      </section>

      {/* Back link */}
      <div className="py-12 text-center border-t border-black/5 bg-black/5">
        <button onClick={onBack} className="text-gray-600 font-black text-xs uppercase tracking-widest hover:text-black transition-colors">
          Return to Global Marketplace
        </button>
      </div>
    </div>
  );
};

export default SellersLandingPage;