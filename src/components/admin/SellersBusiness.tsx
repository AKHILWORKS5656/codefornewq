import React, { useState, useEffect } from 'react';
import { api } from '../../mockApi';

const SellersBusiness: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const businessData = await api.getSellersBusiness();
        setData(businessData || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[#1e293b]/50 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl min-h-[300px]">
        <div className="p-8 border-b border-white/5">
           <h3 className="text-xl font-black text-white uppercase tracking-tighter">Settlement Ledger</h3>
           <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Formula: Payable = (P+S) - (Platform Fixed + 3.5% Commission)</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]"><div className="w-10 h-10 border-4 border-t-[#D4AF37] border-white/10 rounded-full animate-spin"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Seller Store</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Gross (P+S)</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-red-400">Total Profit</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-green-400">Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.map((item, i) => {
                  const gross = item.productAmount + item.shippingCharge;
                  const platformProfitShare = gross * 0.035;
                  const totalPlatformProfit = item.platformCharge + platformProfitShare;
                  const payableToSeller = gross - totalPlatformProfit;
                  return (
                    <tr key={i} className="hover:bg-white/[0.02] transition-all">
                      <td className="px-6 py-5"><p className="text-sm font-black text-white">{item.seller}</p><p className="text-[9px] text-gray-500 font-black uppercase">Tax Verified</p></td>
                      <td className="px-6 py-5 text-sm font-bold text-gray-300">£{gross.toFixed(2)}</td>
                      <td className="px-6 py-5 text-sm font-black text-red-400">£{totalPlatformProfit.toFixed(2)}</td>
                      <td className="px-6 py-5"><div className="bg-green-400/10 px-4 py-2 rounded-xl border border-green-400/20 text-center"><span className="text-sm font-black text-green-400">£{payableToSeller.toFixed(2)}</span></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellersBusiness;