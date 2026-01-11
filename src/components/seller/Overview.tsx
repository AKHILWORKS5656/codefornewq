import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { api } from '../../mockApi';

interface OverviewProps {
  user: User;
}

const Overview: React.FC<OverviewProps> = ({ user }) => {
  const [stats, setStats] = useState({
    monthlySales: 0,
    activeProducts: 0,
    pendingOrders: 0,
    totalEarnings: 0,
    rating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await api.getSellerStats(user.id);
      setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, [user.id]);

  const cards = [
    { label: 'Current Month Sales', value: '£' + stats.monthlySales.toLocaleString(), icon: '📈', color: 'text-blue-400' },
    { label: 'Active Listings', value: stats.activeProducts, icon: '💎', color: 'text-purple-400' },
    { label: 'Pending Dispatch', value: stats.pendingOrders, icon: '📦', color: 'text-orange-400' },
    { label: 'Total Net Earnings', value: '£' + stats.totalEarnings.toLocaleString(), icon: '💰', color: 'text-green-400' },
  ];

  if (loading) return <div className="animate-pulse flex space-x-4">Loading stats...</div>;

  return (
    <div className="space-y-10">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-[#1e293b]/50 p-8 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all group shadow-2xl relative overflow-hidden">
             <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 blur-[40px] rounded-full group-hover:bg-white/10 transition-all"></div>
             <div className="flex items-center space-x-4 mb-6">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-white/5">
                 {card.icon}
               </div>
               <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">
                 {card.label}
               </span>
             </div>
             <h3 className={`text-3xl font-black ${card.color} tracking-tighter`}>
               {card.value}
             </h3>
          </div>
        ))}
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 bg-[#1e293b]/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
           <div className="flex items-center justify-between mb-12">
             <h3 className="text-xl font-black text-white uppercase tracking-widest">Revenue Velocity</h3>
             <div className="flex items-center space-x-2 bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20">
               <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Live Node Sync</span>
             </div>
           </div>
           
           <div className="h-64 flex items-end justify-between px-4 gap-6">
             {[40, 65, 45, 80, 55, 95, 75].map((h, i) => (
               <div key={i} className="flex-1 group relative">
                 <div 
                    className="w-full bg-gradient-to-t from-[#D4AF37]/10 to-[#D4AF37] rounded-xl transition-all duration-700 cursor-pointer group-hover:scale-x-110 shadow-lg shadow-yellow-500/5"
                    style={{ height: `${h}%` }}
                 ></div>
                 <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-black text-gray-600 uppercase tracking-widest">Day 0{i+1}</span>
               </div>
             ))}
           </div>
        </div>

        <div className="xl:col-span-4 bg-[#1e293b]/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col justify-between">
           <div className="text-center pt-6">
              <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] mb-4">Partner Quality Score</p>
              <div className="relative inline-block">
                <h4 className="text-8xl font-black text-[#D4AF37] tracking-tighter">{stats.rating.toFixed(1)}</h4>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-yellow-500/30 rounded-full blur-md"></div>
              </div>
              <div className="flex justify-center mt-4 space-x-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-lg">★</span>
                ))}
              </div>
           </div>

           <div className="bg-white/5 p-6 rounded-3xl border border-white/5 mt-10">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">Fulfillment Health</p>
              <div className="space-y-4">
                 <div className="flex justify-between text-[10px] font-black uppercase text-gray-500">
                   <span>On-Time Dispatch</span>
                   <span className="text-green-400">98%</span>
                 </div>
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[98%] shadow-[0_0_10px_#22c55e]"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;