
import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { api } from '../../mockApi';

interface ListProductPageProps {
  onProductClick: (p: Product) => void;
  onAddClick: () => void;
}

const ListProductPage: React.FC<ListProductPageProps> = ({ onProductClick, onAddClick }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await api.getProducts();
      setProducts(data);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#1e293b]/50 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Global Catalog</h2>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Real-time inventory mapping active</p>
        </div>
        
        <div className="flex items-center space-x-4 flex-grow max-w-xl">
          <div className="relative flex-grow">
            <input 
              type="text" 
              placeholder="Search products by ID, Name or Seller..." 
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-12 py-3 text-sm focus:border-[#D4AF37] outline-none text-white font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          </div>
          <button 
            onClick={onAddClick}
            className="bg-[#D4AF37] text-gray-900 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-yellow-500/10 whitespace-nowrap"
          >
            Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-t-[#D4AF37] border-white/10 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(p => (
            <div 
              key={p.id}
              onClick={() => onProductClick(p)}
              className="bg-[#1e293b]/50 border border-white/5 rounded-[2rem] overflow-hidden group hover:border-[#D4AF37]/30 transition-all cursor-pointer shadow-xl flex flex-col h-full"
            >
              <div className="aspect-[1080/1350] relative overflow-hidden bg-[#0f172a]">
                <img 
                  src={p.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt={p.title} 
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                   <p className="text-[10px] font-black text-white">{p.rating} ⭐</p>
                </div>
                {p.stock < 10 && (
                  <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">
                    Critical Stock: {p.stock}
                  </div>
                )}
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">{p.category}</span>
                  <span className={`w-2 h-2 rounded-full ${p.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                </div>
                <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 min-h-[40px] leading-relaxed">{p.title}</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mb-6">Seller: {p.seller}</p>
                
                <div className="mt-auto flex items-end justify-between">
                   <div>
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Live Price</p>
                     <p className="text-xl font-black text-white">£{p.price.toFixed(2)}</p>
                   </div>
                   <button className="bg-white/5 hover:bg-[#D4AF37] hover:text-gray-900 w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center transition-all group/btn">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeWidth="2.5"/></svg>
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListProductPage;
