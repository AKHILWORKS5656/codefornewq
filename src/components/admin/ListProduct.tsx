
import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { api } from '../../mockApi';

interface ListProductProps {
  onProductClick: (p: Product) => void;
  onAddClick: () => void;
}

const ListProduct: React.FC<ListProductProps> = ({ onProductClick, onAddClick }) => {
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

  const filtered = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.seller.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-[#1e293b]/50 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Global Catalog</h2>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Direct management of master listings</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map(p => (
            <div 
              key={p.id}
              onClick={() => onProductClick(p)}
              className="bg-[#1e293b]/50 border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-[#D4AF37]/30 transition-all cursor-pointer shadow-2xl flex flex-col h-full relative"
            >
              {/* Product ID Badge */}
              <div className="absolute top-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/10">ID: {p.id}</span>
              </div>

              <div className="aspect-[1080/1350] relative overflow-hidden bg-[#0f172a]">
                <img 
                  src={p.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  alt={p.title} 
                />
                <div className="absolute top-6 right-6 bg-white text-gray-900 px-3 py-1 rounded-full shadow-lg z-20">
                   <p className="text-[10px] font-black">{p.rating} ★</p>
                </div>
                {p.stock < 10 && (
                  <div className="absolute bottom-6 left-6 bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse z-20">
                    CRITICAL: {p.stock} LEFT
                  </div>
                )}
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center p-8">
                   <button className="w-full bg-[#D4AF37] text-gray-900 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transform translate-y-4 group-hover:translate-y-0 transition-transform">Quick Edit</button>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] bg-[#D4AF37]/10 px-3 py-1 rounded-full">{p.category}</span>
                  <div className="flex items-center space-x-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${p.isActive ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`}></div>
                    <span className="text-[8px] font-black text-gray-500 uppercase">{p.isActive ? 'Active' : 'Offline'}</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-white line-clamp-2 mb-2 min-h-[48px] leading-relaxed group-hover:text-[#D4AF37] transition-colors">{p.title}</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-8">Vendor: {p.seller}</p>
                
                <div className="mt-auto flex items-end justify-between border-t border-white/5 pt-6">
                   <div>
                     <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-1">Live Market Value</p>
                     <p className="text-2xl font-black text-white">£{p.price.toFixed(2)}</p>
                   </div>
                   <button 
                    onClick={(e) => { e.stopPropagation(); alert('Initiating Secure Checkout Node...'); }}
                    className="bg-white/5 hover:bg-[#D4AF37] hover:text-gray-900 px-6 py-3 rounded-xl border border-white/10 flex items-center justify-center transition-all font-black text-[10px] uppercase tracking-widest"
                   >
                      Buy Now
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

export default ListProduct;
