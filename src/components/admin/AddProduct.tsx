import React, { useState } from 'react';
import { CATEGORIES } from '../../constants';
import { api } from '../../mockApi';

interface AddProductProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    importantNote: '',
    category: CATEGORIES[1],
    price: '',
    originalPrice: '',
    stock: '',
  });
  const [images, setImages] = useState<string[]>(Array(5).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await api.addProduct({
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stock: parseInt(formData.stock),
        images: images.filter(url => url !== ''),
        image: images[0] || ''
      });
      onSuccess();
    } catch (err) {
      alert('Node rejected publish request. Check gateway logs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateImage = (idx: number, url: string) => {
    const newImgs = [...images];
    newImgs[idx] = url;
    setImages(newImgs);
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between bg-[#1e293b]/50 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">New Product Listing</h2>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Direct upload to Beauzead Global Node</p>
        </div>
        <button onClick={onCancel} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-white transition-colors">Cancel & Return</button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#1e293b]/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl space-y-6">
            <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-[0.2em]">01. Primary Attributes</h3>
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-500 uppercase">Full Product Title</label>
              <input 
                required 
                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-[#D4AF37] text-white" 
                placeholder="e.g. Beauzead Signature Gold Watch"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-500 uppercase">Detailed Description</label>
              <textarea 
                required 
                rows={6} 
                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-[#D4AF37] resize-none text-white" 
                placeholder="Indulge in our most sought-after signature piece..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-red-400 uppercase">Important Quality Note</label>
              <textarea 
                className="w-full bg-red-500/5 border border-red-500/20 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-red-500 text-white" 
                placeholder="Limited edition release notification..."
                value={formData.importantNote}
                onChange={e => setFormData({...formData, importantNote: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div className="bg-[#1e293b]/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-500 uppercase">Category Allocation</label>
              <select 
                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-[#D4AF37] appearance-none text-white"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-500 uppercase">Inventory Stock Count</label>
              <input 
                required 
                type="number" 
                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-[#D4AF37] text-white" 
                placeholder="0"
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-500 uppercase">Market Value (Price GBP)</label>
              <input 
                required 
                type="number" 
                step="0.01" 
                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-[#D4AF37] text-white" 
                placeholder="0.00"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-500 uppercase">Original Price (Strike-through)</label>
              <input 
                type="number" 
                step="0.01" 
                className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-5 py-4 text-sm font-bold outline-none focus:border-[#D4AF37] text-white" 
                placeholder="0.00"
                value={formData.originalPrice}
                onChange={e => setFormData({...formData, originalPrice: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#1e293b]/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl h-fit">
            <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-8">02. Media Gallery (Exactly 5)</h3>
            <div className="space-y-4">
              {images.map((img, i) => (
                <div key={i} className="space-y-2">
                   <label className="block text-[8px] font-black text-gray-600 uppercase">IMAGE URL SLOT {i+1}</label>
                   <input 
                     type="text" 
                     className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold outline-none focus:border-[#D4AF37] text-white" 
                     placeholder="https://..."
                     value={img}
                     onChange={(e) => updateImage(i, e.target.value)}
                   />
                </div>
              ))}
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-10 bg-[#D4AF37] text-gray-900 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:bg-gray-700 disabled:text-gray-500 flex items-center justify-center space-x-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-t-transparent border-gray-900 rounded-full animate-spin"></div>
                  <span>Syncing Node...</span>
                </>
              ) : (
                'Publish to Catalog'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;