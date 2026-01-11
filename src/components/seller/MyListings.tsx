import React, { useState, useEffect } from 'react';
import { User, Product } from '../../types';
import { api } from '../../mockApi';

interface MyListingsProps {
  user: User;
  onEdit: (product: Product) => void;
}

const MyListings: React.FC<MyListingsProps> = ({ user, onEdit }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await api.getSellerProducts(user.id);
      setProducts(data);
      setLoading(false);
    };
    load();
  }, [user.id]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Erase this listing from Global Catalog?')) {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const filtered = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toolbar */}
      <div className="bg-[#1e293b]/50 p-8 rounded-[2.5rem] border border-white/5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative flex-grow max-w-xl">
           <input 
             type="text" 
             placeholder="Search your inventory..." 
             className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-14 py-4 text-sm font-medium outline-none focus:border-[#D4AF37] text-white transition-all shadow-inner"
             value={search}
             onChange={e => setSearch(e.target.value)}
           />
           <span className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30 text-xl">🔍</span>
        </div>
        <div className="flex items-center space-x-4">
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Found {filtered.length} Listings</p>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-t-[#D4AF37] border-white/10 rounded-full animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           {filtered.map(p => (
             <div key={p.id} className="bg-[#1e293b]/50 border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-[#D4AF37]/30 transition-all flex flex-col shadow-2xl relative">
                <div className="aspect-[4/5] overflow-hidden bg-[#0f172a]">
                  <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100" />
                  <div className="absolute top-6 right-6 flex flex-col gap-2">
                     <button 
                       onClick={() => onEdit(p)}
                       className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-[#D4AF37] hover:text-gray-900 transition-all shadow-xl border border-white/10"
                     >
                       ✏️
                     </button>
                     <button 
                       onClick={() => handleDelete(p.id)}
                       className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl border border-white/10"
                     >
                       🗑️
                     </button>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                   <div className="flex items-center justify-between mb-4">
                     <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.2em] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-yellow-500/10">{p.category}</span>
                     <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">ID: {p.id.slice(-6)}</span>
                   </div>
                   <h3 className="text-sm font-bold text-white line-clamp-2 mb-6 min-h-[40px] leading-relaxed group-hover:text-[#D4AF37] transition-colors">{p.title}</h3>
                   <div className="mt-auto flex items-end justify-between border-t border-white/5 pt-6">
                      <div>
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Live Valuation</p>
                        <p className="text-xl font-black text-white tracking-tighter">£{p.price.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Stock</p>
                         <p className={`text-sm font-black ${p.stock < 10 ? 'text-red-400' : 'text-green-400'}`}>{p.stock} Units</p>
                      </div>
                   </div>
                </div>
             </div>
           ))}
           
           {filtered.length === 0 && (
             <div className="col-span-full py-40 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                <div className="text-5xl mb-6 opacity-30">📦</div>
                <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-xs">No active listings identified</p>
                <button onClick={() => onEdit({} as Product)} className="mt-8 text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.2em] hover:underline">Launch New Listing Node</button>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default MyListings;