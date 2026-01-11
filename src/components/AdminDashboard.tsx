import React, { useState, useEffect } from 'react';
import { User, Product } from '../types';
import { api } from '../mockApi';
import Overview from './admin/Overview';
import Users from './admin/Users';
import Sellers from './admin/Sellers';
import Orders from './admin/Orders';
import Cancellations from './admin/Cancellations';
import ListProduct from './admin/ListProduct';
import AddProduct from './admin/AddProduct';
import Categories from './admin/Categories';
import SellerAccountApprovals from './admin/SellerAccountApprovals';
import SellerListingApprovals from './admin/SellerListingApprovals';
import RatingsAndReviews from './admin/RatingsAndReviews';
import ShippingStatus from './admin/ShippingStatus';
import SellersBusiness from './admin/SellersBusiness';
import Accounts from './admin/Accounts';

interface AdminDashboardProps {
  user: User;
  onBack: () => void;
  onNavigateProduct: (p: Product) => void;
}

type AdminTab = 
  | 'Overview' 
  | 'Users' 
  | 'Sellers' 
  | 'Orders' 
  | 'Cancellations'
  | 'Products' 
  | 'Add Product'
  | 'Categories' 
  | 'Account Approvals'
  | 'Listing Approvals'
  | 'Reviews' 
  | 'Shipping' 
  | 'Seller Business'
  | 'Accounts';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onBack, onNavigateProduct }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('Overview');

  const renderSubView = () => {
    switch (activeTab) {
      case 'Overview': return <Overview />;
      case 'Users': return <Users />;
      case 'Sellers': return <Sellers />;
      case 'Orders': return <Orders />;
      case 'Cancellations': return <Cancellations />;
      case 'Products': return <ListProduct onProductClick={onNavigateProduct} onAddClick={() => setActiveTab('Add Product')} />;
      case 'Add Product': return <AddProduct onCancel={() => setActiveTab('Products')} onSuccess={() => setActiveTab('Products')} />;
      case 'Categories': return <Categories />;
      case 'Account Approvals': return <SellerAccountApprovals />;
      case 'Listing Approvals': return <SellerListingApprovals />;
      case 'Reviews': return <RatingsAndReviews />;
      case 'Shipping': return <ShippingStatus />;
      case 'Seller Business': return <SellersBusiness />;
      case 'Accounts': return <Accounts />;
      default: return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex">
      <aside className="w-72 border-r border-white/5 p-8 flex flex-col h-screen sticky top-0 bg-[#111827]">
        <div className="mb-12 cursor-pointer" onClick={onBack}>
          <h1 className="logo-font text-3xl font-bold text-[#D4AF37] tracking-widest">BEAUZEAD</h1>
          <div className="flex items-center space-x-2 mt-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">System Operational</p>
          </div>
        </div>

        <nav className="flex-grow space-y-1 overflow-y-auto hide-scrollbar">
          <NavGroup title="Analytics">
            <NavItem icon="📊" label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
            <NavItem icon="👤" label="Users" active={activeTab === 'Users'} onClick={() => setActiveTab('Users')} />
            <NavItem icon="🏢" label="Sellers" active={activeTab === 'Sellers'} onClick={() => setActiveTab('Sellers')} />
          </NavGroup>

          <NavGroup title="Inventory">
            <NavItem icon="📦" label="Orders" active={activeTab === 'Orders'} onClick={() => setActiveTab('Orders')} />
            <NavItem icon="❌" label="Cancellations" active={activeTab === 'Cancellations'} onClick={() => setActiveTab('Cancellations')} />
            <NavItem icon="💎" label="Products" active={activeTab === 'Products' || activeTab === 'Add Product'} onClick={() => setActiveTab('Products')} />
            <NavItem icon="🏷️" label="Categories" active={activeTab === 'Categories'} onClick={() => setActiveTab('Categories')} />
          </NavGroup>

          <NavGroup title="Governance">
            <NavItem icon="📜" label="Account Approvals" active={activeTab === 'Account Approvals'} onClick={() => setActiveTab('Account Approvals')} />
            <NavItem icon="🛍️" label="Listing Approvals" active={activeTab === 'Listing Approvals'} onClick={() => setActiveTab('Listing Approvals')} />
            <NavItem icon="⭐" label="Reviews" active={activeTab === 'Reviews'} onClick={() => setActiveTab('Reviews')} />
            <NavItem icon="🚚" label="Shipping" active={activeTab === 'Shipping'} onClick={() => setActiveTab('Shipping')} />
          </NavGroup>

          <NavGroup title="Treasury">
            <NavItem icon="🏦" label="Seller Business" active={activeTab === 'Seller Business'} onClick={() => setActiveTab('Seller Business')} />
            <NavItem icon="📒" label="Accounts" active={activeTab === 'Accounts'} onClick={() => setActiveTab('Accounts')} />
          </NavGroup>
        </nav>

        <button 
          onClick={onBack}
          className="mt-8 w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition-all border border-transparent hover:border-white/5"
        >
          <span className="text-lg">🏪</span>
          <span className="text-sm font-black uppercase tracking-tight">Return to Store</span>
        </button>
      </aside>

      <main className="flex-grow p-10 min-h-screen overflow-y-auto">
        <header className="flex items-center justify-between mb-12">
           <div>
             <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{activeTab === 'Add Product' ? 'New Listing' : activeTab}</h2>
             <p className="text-sm text-gray-400 font-medium">Global Administration Gateway</p>
           </div>
           <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex items-center space-x-3">
             <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-black">
               {user.name.charAt(0)}
             </div>
             <span className="text-xs font-black uppercase tracking-widest">{user.name}</span>
           </div>
        </header>
        {renderSubView()}
      </main>
    </div>
  );
};

const NavGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="py-4">
    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4 px-4">{title}</p>
    <div className="space-y-1">{children}</div>
  </div>
);

const NavItem: React.FC<{ icon: string; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${
      active ? 'bg-[#D4AF37] text-gray-900 shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <span className="text-lg mr-3">{icon}</span>
    <span className="text-[11px] font-black uppercase tracking-tight">{label}</span>
  </button>
);

export default AdminDashboard;