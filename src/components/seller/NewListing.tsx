import React, { useState } from 'react';
import { User } from '../../types';
import { api } from '../../mockApi';
import { CATEGORIES } from '../../constants';

interface NewListingProps {
  user: User;
  onSuccess: () => void;
}

const NewListing: React.FC<NewListingProps> = ({ user, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(Array(5).fill(''));
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    importantNote: '',
    category: CATEGORIES[1],
    price: '',
    originalPrice: '',
    stock: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.addProduct({
        ...formData,
        sellerId: user.id,
        seller: user.name,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stock: parseInt(formData.stock),
        images: images.filter(url => !!url),
        image: images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'
      });
      onSuccess();
    } catch (err) {
      alert('Listing rejected by gateway.');
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
    <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Col: Details */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-[#1e293b]/50 p-10 md:p-14 rounded-[3.5rem] border border-white/5 shadow-2xl space-y-10">
             <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-[0.4em] border-l-4 border-[#D4AF37] pl-6">01. Identity Matrix</h3>
             
             <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Full Listing Title</label>
                <input required className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-[#D4AF37] text-white shadow-inner" placeholder="e.g. Signature Gold Collection 2026" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
             </div>

             <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Description Logic</label>
                <textarea required rows={8} className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-[#D4AF37] text-white shadow-inner resize-none" placeholder="Elaborate on craftsmanship and material quality..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
             </div>
             
             <div className="space-y-4">
                <label className="block text-[10px] font-black text-red-400/70 uppercase tracking-widest">Quality Advisory (Optional)</label>
                <textarea rows={3} className="w-full bg-red-500/5 border border-red-500/10 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-red-500/50 text-white shadow-inner resize-none" placeholder="Notes for the customer..." value={formData.importantNote} onChange={e => setFormData({...formData, importantNote: e.target.value})} />
             </div>
          </div>

          <div className="bg-[#1e293b]/50 p-10 md:p-14 rounded-[3.5rem] border border-white/5 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-10">
             <h3 className="col-span-full text-xs font-black text-[#D4AF37] uppercase tracking-[0.4em] border-l-4 border-[#D4AF37] pl-6">02. Market Taxonomy</h3>
             
             <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Category</label>
                <select className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-[#D4AF37] text-white shadow-inner appearance-none cursor-pointer" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>

             <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Initial Inventory Stock</label>
                <input required type="number" className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-[#D4AF37] text-white shadow-inner" placeholder="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
             </div>

             <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Live Price (GBP)</label>
                <input required type="number" step="0.01" className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-[#D4AF37] text-white shadow-inner" placeholder="0.00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
             </div>

             <div className="space-y-4">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Strike-through Price (Optional)</label>
                <input type="number" step="0.01" className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-[#D4AF37] text-white shadow-inner" placeholder="0.00" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} />
             </div>
          </div>
        </div>

        {/* Right Col: Media */}
        <div className="lg:col-span-4 space-y-10">
           <div className="bg-[#1e293b]/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl sticky top-10">
              <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-[0.4em] mb-10 border-l-4 border-[#D4AF37] pl-6">03. Media Assets</h3>
              
              <div className="space-y-6">
                {images.map((url, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                       <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Image Protocol {i+1}</label>
                       {url && <span className="text-[8px] font-black text-green-500 uppercase">Loaded</span>}
                    </div>
                    <input 
                      type="text" 
                      placeholder="https://..." 
                      className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-5 py-3 text-[10px] font-bold outline-none focus:border-[#D4AF37] text-white shadow-inner"
                      value={url}
                      onChange={e => updateImage(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-10 border-t border-white/5">
                 <button 
                   type="submit" 
                   disabled={isSubmitting}
                   className="w-full bg-[#D4AF37] text-gray-900 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-yellow-500/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-4"
                 >
                   {isSubmitting ? (
                     <>
                        <div className="w-5 h-5 border-3 border-t-transparent border-gray-900 rounded-full animate-spin"></div>
                        <span>Synchronizing...</span>
                     </>
                   ) : 'Publish Node'}
                 </button>
                 <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest text-center mt-6 leading-relaxed">
                   By publishing, you verify these assets comply with Beauzead Luxury Standards.
                 </p>
              </div>
           </div>
        </div>

      </form>
    </div>
  );
};

export default NewListing;