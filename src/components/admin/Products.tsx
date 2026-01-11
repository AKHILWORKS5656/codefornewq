
import React, { useState } from 'react';
import { PRODUCTS } from '../../constants';

const Products: React.FC = () => {
  const [search, setSearch] = useState('');
  const [productList, setProductList] = useState(PRODUCTS);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProductList(productList.filter(p => p.id !== id));
    }
  };

  const filtered = productList.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[#1e293b]/50 p-6 rounded-[2rem] border border-white/5 shadow-xl flex items-center justify-between">
        <div className="relative flex-grow max-w-md">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-12 py-3 text-sm focus:border-[#D4AF37] outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">💎</span>
        </div>
        <button className="bg-[#D4AF37] text-gray-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest">Add Product</button>
      </div>

      <div className="bg-[#1e293b]/50 rounded-[2.5rem] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Product</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Price</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Category</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Stock</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-white/[0.02]">
                <td className="px-6 py-5 flex items-center space-x-4">
                  <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                  <span className="text-sm font-bold text-white truncate max-w-[200px]">{p.title}</span>
                </td>
                <td className="px-6 py-5 text-sm font-black text-blue-400">£{p.price}</td>
                <td className="px-6 py-5 text-xs font-bold text-gray-400">{p.category}</td>
                <td className="px-6 py-5 text-sm font-bold text-gray-300">{p.stock}</td>
                <td className="px-6 py-5 space-x-3">
                  <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
