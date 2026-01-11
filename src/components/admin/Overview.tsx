import React, { useState, useEffect } from 'react';
import { api } from '../../mockApi';
import { SectionLoader } from '../common/ProfessionalLoaders';

const Overview: React.FC = () => {
  const [kpis, setKpis] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    platformFees: 0,
    totalCancellations: 0
  });
  const [activeMonth, setActiveMonth] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getAnalytics();
        setKpis(data);
      } catch (err) {
        console.error("Governance Handshake Failure");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'TOTAL REVENUE', value: '£' + kpis.totalRevenue.toLocaleString(), icon: '💰', color: 'text-green-400', progress: 82 },
    { label: 'TOTAL ORDERS', value: kpis.totalOrders.toLocaleString(), icon: '📦', color: 'text-blue-400', progress: 64 },
    { label: 'PLATFORM FEES', value: '£' + kpis.platformFees.toLocaleString(), icon: '🏦', color: 'text-purple-400', progress: 71 },
    { label: 'TOTAL CANCELLATIONS', value: kpis.totalCancellations, icon: '❌', color: 'text-red-400', progress: 12 },
  ];

  const chartData = [
    { m: 'JAN', v: 45 }, { m: 'FEB', v: 55 }, { m: 'MAR', v: 48 }, { m: 'APR', v: 72 },
    { m: 'MAY', v: 64 }, { m: 'JUN', v: 52 }, { m: 'JUL', v: 88 }, { m: 'AUG', v: 68 },
    { m: 'SEP', v: 80 }, { m: 'OCT', v: 60 }, { m: 'NOV', v: 92 }, { m: 'DEC', v: 100 }
  ];

  if (loading) {
    return <SectionLoader message="Polling Global Ledger..." />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-[#1e293b]/50 p-8 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl shadow-inner">
                {card.icon}
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">
                {card.label}
              </span>
            </div>
            <h3 className={`text-4xl font-black ${card.color} tracking-tighter mb-6`}>
              {card.value}
            </h3>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
               <div 
                className="h-full bg-yellow-500/80 shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all duration-1000" 
                style={{ width: `${card.progress}%` }}
               ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 bg-[#1e293b]/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-xl font-black text-white uppercase tracking-widest">Real-Time Market Velocity</h3>
            <div className="flex items-center space-x-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">Live Sync</span>
            </div>
          </div>

          <div className="h-72 flex items-end justify-between px-2 gap-4">
             {chartData.map((d, i) => (
               <div 
                key={i} 
                className="group relative flex-1 flex flex-col items-center h-full justify-end"
                onMouseEnter={() => setActiveMonth(i)}
                onMouseLeave={() => setActiveMonth(null)}
               >
                 {activeMonth === i && (
                   <div className="absolute -top-12 bg-white text-[#0f172a] px-3 py-1 rounded-lg text-[10px] font-black shadow-2xl animate-fade-in z-20 whitespace-nowrap">
                     Performance Node: {d.m}
                   </div>
                 )}
                 <div 
                  className={`w-full max-w-[45px] bg-gradient-to-t from-[#D4AF37]/20 to-[#D4AF37] rounded-xl transition-all duration-700 cursor-pointer ${
                    activeMonth === i ? 'scale-x-110 shadow-[0_0_30px_rgba(212,175,55,0.4)]' : 'opacity-80 hover:opacity-100'
                  }`} 
                  style={{ height: `${d.v}%` }}
                 ></div>
                 <span className="mt-6 text-[9px] font-black text-gray-600 uppercase tracking-widest group-hover:text-white transition-colors">{d.m}</span>
               </div>
             ))}
          </div>
        </div>

        <div className="xl:col-span-4 bg-[#1e293b]/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col justify-between">
            <div className="text-center pt-8">
               <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Platform Efficiency</p>
               <div className="relative inline-block">
                 <h4 className="text-7xl font-black text-[#D4AF37] tracking-tighter">98.4%</h4>
                 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-yellow-500/20 rounded-full blur-sm"></div>
               </div>
            </div>

            <div className="space-y-6 pb-4">
               <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:bg-white/[0.08] transition-colors">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Server Uptime</span>
                    <span className="text-xs font-black text-green-400">99.99%</span>
                 </div>
                 <div className="h-1 w-full bg-white/10 rounded-full">
                    <div className="h-full bg-green-500 w-[99%] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)]"></div>
                 </div>
               </div>

               <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:bg-white/[0.08] transition-colors">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">API Response</span>
                    <span className="text-xs font-black text-blue-400">42ms</span>
                 </div>
                 <div className="h-1 w-full bg-white/10 rounded-full">
                    <div className="h-full bg-blue-400 w-[85%] rounded-full shadow-[0_0_10px_rgba(96,165,250,0.3)]"></div>
                 </div>
               </div>
            </div>

            <div className="bg-yellow-500/5 p-6 rounded-[2rem] border border-yellow-500/10">
               <p className="text-[9px] text-yellow-500/60 font-black uppercase tracking-[0.2em] leading-relaxed">
                 All system nodes responding within peak threshold. Global administration gateway synchronized with AWS London Hub.
               </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;