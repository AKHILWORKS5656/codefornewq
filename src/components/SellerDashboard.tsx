import React, { useState } from 'react';
import { User } from '../types';
import Overview from './seller/Overview';
import MyListings from './seller/MyListings';
import NewListing from './seller/NewListing';
import SellersOrderPage from './seller/SellersOrderPage';
import EarningsPage from './seller/EarningsPage';

interface SellerDashboardProps {
  user: User;
  onLogout: () => void;
  onBack: () => void;
}

type SellerTab = 'Overview' | 'My Listings' | 'New Listing' | 'Orders' | 'Earnings';

const SellerDashboard: React.FC<SellerDashboardProps> = ({ user, onLogout, onBack }) => {
  const [activeTab, setActiveTab] = useState<SellerTab>('Overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview': return <Overview user={user} />;
      case 'My Listings': return <MyListings user={user} onEdit={() => setActiveTab('New Listing')} />;
      case 'New Listing': return <NewListing user={user} onSuccess={() => setActiveTab('My Listings')} />;
      case 'Orders': return <SellersOrderPage user={user} />;
      case 'Earnings': return <EarningsPage user={user} />;
      default: return <Overview user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 p-8 flex flex-col h-screen sticky top-0 bg-[#111827]">
        <div className="mb-12 cursor-pointer" onClick={onBack}>
          <h1 className="logo-font text-3xl font-bold text-[#D4AF37] tracking-widest">BEAUZEAD</h1>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2">Partner Central</p>
        </div>

        <nav className="flex-grow space-y-2">
          <NavItem icon="📊" label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
          <NavItem icon="💎" label="My Listings" active={activeTab === 'My Listings'} onClick={() => setActiveTab('My Listings')} />
          <NavItem icon="➕" label="New Listing" active={activeTab === 'New Listing'} onClick={() => setActiveTab('New Listing')} />
          <NavItem icon="📦" label="Orders" active={activeTab === 'Orders'} onClick={() => setActiveTab('Orders')} />
          <NavItem icon="💰" label="Earnings" active={activeTab === 'Earnings'} onClick={() => setActiveTab('Earnings')} />
        </nav>

        <div className="mt-auto space-y-4">
          <button 
            onClick={onBack}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition-all border border-transparent hover:border-white/5"
          >
            <span className="text-lg">🏪</span>
            <span className="text-xs font-black uppercase tracking-widest">Store Front</span>
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all border border-transparent"
          >
            <span className="text-lg">🚪</span>
            <span className="text-xs font-black uppercase tracking-widest">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-10 overflow-y-auto">
        <header className="flex items-center justify-between mb-12">
           <div>
             <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{activeTab}</h2>
             <p className="text-sm text-gray-400 font-medium tracking-wide">Enterprise Resource Management Node</p>
           </div>
           <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center space-x-4">
             <div className="text-right">
               <p className="text-xs font-black text-white uppercase tracking-widest">{user.name}</p>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Verified Partner</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-gray-900 flex items-center justify-center font-black text-sm">
               {user.name.charAt(0)}
             </div>
           </div>
        </header>
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: string; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-4 rounded-2xl transition-all duration-300 ${
      active 
        ? 'bg-[#D4AF37] text-gray-900 shadow-xl shadow-yellow-500/10' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <span className="text-xl mr-4">{icon}</span>
    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);

export default SellerDashboard;