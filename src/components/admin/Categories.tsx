
import React, { useState, useEffect } from 'react';
import { api } from '../../mockApi';
import { Category } from '../../types';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);

  // Sub Category Dialog State
  const [showSubModal, setShowSubModal] = useState(false);
  const [subModalData, setSubModalData] = useState<{ catId: string; catName: string; subName: string }>({ catId: '', catName: '', subName: '' });

  // Delete Confirmation Dialog State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState<{ id: string; name: string }>({ id: '', name: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || isAddingCat) return;

    setIsAddingCat(true);
    try {
      await api.addCategory(newCatName.trim());
      setNewCatName('');
      await fetchCategories();
    } finally {
      setIsAddingCat(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModalData.id) return;
    try {
      await api.deleteCategory(deleteModalData.id);
      setShowDeleteModal(false);
      await fetchCategories();
    } catch (err) {
      alert('Failed to delete category.');
    }
  };

  const handleCreateSub = async () => {
    if (!subModalData.subName.trim()) return;
    try {
      await api.addSubCategory(subModalData.catId, subModalData.subName.trim());
      setShowSubModal(false);
      setSubModalData({ catId: '', catName: '', subName: '' });
      await fetchCategories();
    } catch (err) {
      alert('Failed to add sub-category.');
    }
  };

  const handleDeleteSub = async (catId: string, subName: string) => {
    if (window.confirm(`Delete sub-mapping "${subName}"?`)) {
      try {
        await api.deleteSubCategory(catId, subName);
        await fetchCategories();
      } catch (err) {
        alert('Failed to delete sub-category.');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in relative">
      
      {/* LEFT: TAXONOMY MANAGER */}
      <div className="lg:col-span-3 bg-[#1e293b]/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl h-fit">
        <h3 className="text-xl font-black text-white uppercase tracking-widest mb-10 border-b border-white/5 pb-6">Taxonomy Manager</h3>
        
        {loading ? (
          <div className="py-20 flex flex-col items-center">
            <div className="w-8 h-8 border-3 border-t-[#D4AF37] border-white/10 rounded-full animate-spin"></div>
            <p className="text-[10px] text-gray-500 font-black uppercase mt-4 tracking-widest">Polling Schema...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white/[0.02] p-6 rounded-3xl border border-white/5 group hover:bg-white/[0.04] transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                
                <div className="flex items-center justify-between mb-6">
                  <span className="font-black text-[#D4AF37] uppercase tracking-[0.2em] text-sm">{cat.name}</span>
                  <button 
                    onClick={() => {
                      setDeleteModalData({ id: cat.id, name: cat.name });
                      setShowDeleteModal(true);
                    }}
                    className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white px-3 py-1 rounded-lg border border-red-500/20 transition-all"
                  >
                    Delete
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {cat.subCategories.map((sub, idx) => (
                    <div 
                      key={idx} 
                      className="group/sub px-4 py-2 bg-[#0f172a] rounded-xl text-[10px] font-black text-gray-400 border border-white/5 hover:border-white/20 transition-all flex items-center space-x-2"
                    >
                      <span className="uppercase tracking-widest">{sub}</span>
                      <button 
                        onClick={() => handleDeleteSub(cat.id, sub)}
                        className="w-4 h-4 rounded-full hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center transition-colors opacity-0 group-hover/sub:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => {
                      setSubModalData({ catId: cat.id, catName: cat.name, subName: '' });
                      setShowSubModal(true);
                    }}
                    className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black text-gray-500 border border-dashed border-white/10 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all"
                  >
                    + Add Sub
                  </button>
                </div>
              </div>
            ))}

            {categories.length === 0 && (
              <div className="text-center py-20 bg-black/20 rounded-[2rem] border-2 border-dashed border-white/5">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">No active taxonomies detected.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT: ADD NEW CATEGORY */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-[#1e293b]/50 p-10 rounded-[3rem] border border-white/5 shadow-2xl h-fit sticky top-10">
          <h3 className="text-xl font-black text-white uppercase tracking-widest mb-10">Add New Category</h3>
          
          <form onSubmit={handleAddCategory} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Primary Name</label>
              <input 
                required
                type="text" 
                placeholder="e.g. LUXURY LIFESTYLE" 
                className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-[#D4AF37] transition-all text-white"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
            </div>
            
            <button 
              disabled={isAddingCat}
              className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center space-x-3 ${
                isAddingCat ? 'bg-gray-700 text-gray-500' : 'bg-[#D4AF37] text-gray-900 hover:scale-[1.02] active:scale-95 shadow-[#D4AF37]/10'
              }`}
            >
              {isAddingCat ? (
                <>
                  <div className="w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
                  <span>Syncing Schema...</span>
                </>
              ) : (
                'Create Category'
              )}
            </button>
          </form>

          <div className="mt-12 bg-black/20 p-6 rounded-2xl border border-white/5">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">System Guidance</h4>
            <p className="text-xs text-gray-400 font-medium leading-relaxed italic">
              Primary mappings represent top-level global categories. Sub-mapping allows for granular product filtering and faceted navigation across the Beauzead platform.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL: ADD SUB CATEGORY */}
      {showSubModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1e293b] border border-white/10 rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-fade-in">
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">New Sub-Category</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-8">Parent: <span className="text-[#D4AF37]">{subModalData.catName}</span></p>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Sub Category Name</label>
                <input 
                  autoFocus
                  type="text" 
                  className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-[#D4AF37] text-white"
                  placeholder="e.g. Premium Accessories"
                  value={subModalData.subName}
                  onChange={(e) => setSubModalData({ ...subModalData, subName: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateSub()}
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowSubModal(false)}
                  className="flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateSub}
                  className="flex-1 py-4 bg-[#D4AF37] rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-900 shadow-xl shadow-yellow-500/10 hover:scale-105 active:scale-95 transition-all"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRM DELETE */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-[#1e293b] border border-red-500/20 rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-fade-in text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-3">Permanent Action</h3>
            <p className="text-sm text-gray-400 font-medium leading-relaxed mb-10">
              Are you sure you want to delete <span className="text-white font-bold">"{deleteModalData.name.toUpperCase()}"</span>? This will remove all associated sub-category mappings instantly.
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-white/5 border border-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-4 bg-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl shadow-red-500/10 hover:bg-red-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Categories;
