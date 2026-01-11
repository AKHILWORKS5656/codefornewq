import React, { useState, useEffect } from 'react';
import { api } from '../../mockApi';

const Accounts: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getTransactions();
        setTransactions(data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDownload = (report: string) => {
    alert(`Compiling ${report} report. Your download will begin shortly.`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#1e293b]/50 rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden min-h-[300px]">
        <div className="p-10 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tighter">Master Transaction stream</h3>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Live Bank Feed Handshake Active</p>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]"><div className="w-10 h-10 border-4 border-t-[#D4AF37] border-white/10 rounded-full animate-spin"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">ID</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Category</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-10 py-5 text-sm font-bold text-white">{tx.id}</td>
                    <td className="px-10 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">{tx.cat}</td>
                    <td className={`px-10 py-5 text-sm font-black ${tx.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>{tx.amount}</td>
                    <td className="px-10 py-5"><span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase text-gray-400 border border-white/5">{tx.status}</span></td>
                    <td className="px-10 py-5 text-xs font-bold text-gray-500">{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;