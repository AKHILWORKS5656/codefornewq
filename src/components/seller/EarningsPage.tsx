import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { api } from '../../mockApi';

interface EarningsProps {
  user: User;
}

const EarningsPage: React.FC<EarningsProps> = ({ user }) => {
  const [earnings, setEarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ total: 0, pending: 0, month: 0 });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await api.getSellerEarnings(user.id);
      setEarnings(data);
      
      // Compute summary (Mock logic)
      setSummary({
        total: 84200,
        pending: 2450,
        month: 12450
      });
      setLoading(false);
    };
    loadData();
  }, [user.id]);

  const cards = [
    { label: 'Cumulative Settlements', value: '£' + summary.total.toLocaleString(), icon: '🏦', color: 'text-green-400' },
    { label: 'Escrow / Pending', value: '£' + summary.pending.toLocaleString(), icon: '⏳', color: 'text-orange-400' },
    { label: 'Net Monthly Performance', value: '£' + summary.month.toLocaleString(), icon: '📊', color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-[#1e293b]/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
             <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-white/5">
                  {card.icon}
                </div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{card.label}</span>
             </div>
             <h3 className={`text-4xl font-black ${card.color} tracking-tighter mb-4`}>{card.value}</h3>
             <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-white/20 w-1/2"></div>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-[#1e293b]/50 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl min-h-[400px]">
        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
           <div>
             <h3 className="text-xl font-black uppercase tracking-widest text-white">Financial Ledger</h3>
             <p className="text-[10px] text-gray-500 font-black uppercase mt-1">Audit-ready settlement history</p>
           </div>
           <button className="bg-white/5 hover:bg-white/10 text-gray-400 px-6 py-3 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all">Download Report</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-white/5">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Transaction ID</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Date & Time</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Order Node</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Net Payable</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest text-right">State</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
                {earnings.map((tx, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-10 py-6 text-sm font-bold text-gray-400">TX-{tx.id.slice(-8)}</td>
                    <td className="px-10 py-6 text-xs font-black text-gray-600 uppercase">{tx.date}</td>
                    <td className="px-10 py-6 text-sm font-black text-blue-400">{tx.orderId}</td>
                    <td className="px-10 py-6 text-sm font-black text-white">£{tx.amount.toFixed(2)}</td>
                    <td className="px-10 py-6 text-right">
                       <span className="bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full border border-green-500/20 text-[9px] font-black uppercase tracking-widest">Settled</span>
                    </td>
                  </tr>
                ))}
             </tbody>
          </table>
          {earnings.length === 0 && !loading && (
             <div className="py-32 text-center">
               <p className="text-gray-600 font-black uppercase text-xs tracking-[0.4em]">Settlement queue initialized. No history detected.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;