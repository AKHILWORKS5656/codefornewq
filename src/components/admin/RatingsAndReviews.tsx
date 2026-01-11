
import React, { useState, useEffect } from 'react';
import { Review } from '../../types';
import { api } from '../../mockApi';

const RatingsAndReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal States
  const [viewingReview, setViewingReview] = useState<Review | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<Review | null>(null);

  // Edit form states
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchReviews = async () => {
    const data = await api.getReviews();
    setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
    const handleUpdate = () => fetchReviews();
    window.addEventListener('beauzead_reviews_updated', handleUpdate);
    return () => window.removeEventListener('beauzead_reviews_updated', handleUpdate);
  }, []);

  const handleEditOpen = (rev: Review) => {
    setEditingReview(rev);
    setEditRating(rev.rating);
    setEditComment(rev.comment);
  };

  const handleSaveEdit = async () => {
    if (!editingReview) return;
    setIsSaving(true);
    try {
      await api.updateReview(editingReview.id, { rating: editRating, comment: editComment });
      setSuccessMsg('Successfully Updated Review');
      setEditingReview(null);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert('Handshake failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmingDelete) return;
    setIsSaving(true);
    try {
      await api.deleteReview(confirmingDelete.id);
      setSuccessMsg('Successfully Removed Review');
      setConfirmingDelete(null);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert('Deletion sequence interrupted.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Success Notification */}
      {successMsg && (
        <div className="fixed top-24 right-10 z-[3000] bg-[#1e293b] text-white px-8 py-4 rounded-2xl shadow-2xl border border-green-500/30 flex items-center animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-4 text-green-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3"/></svg>
          </div>
          <span className="font-black text-xs uppercase tracking-widest">{successMsg}</span>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewingReview && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#1e293b] border border-white/10 rounded-[3rem] w-full max-w-lg p-12 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-start mb-10">
              <div>
                <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em] mb-1">Review Audit</p>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Client Testimony</h3>
              </div>
              <button onClick={() => setViewingReview(null)} className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5"/></svg>
              </button>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-[#2874f0] font-black text-xl">
                  {viewingReview.userName.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-black text-lg">{viewingReview.userName}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">ID: {viewingReview.userId}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">Subject Asset</p>
                <p className="text-sm font-black text-blue-400 uppercase">{viewingReview.productName}</p>
              </div>

              <div>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3">Certified Appraisal</p>
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-6 h-6 ${i < viewingReview.rating ? 'fill-current' : 'text-gray-700'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-gray-400 text-sm font-medium leading-relaxed italic border-l-2 border-[#D4AF37]/30 pl-4 py-1">
                  "{viewingReview.comment}"
                </p>
              </div>
            </div>
            
            <button onClick={() => setViewingReview(null)} className="w-full mt-10 py-4 bg-white/5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-all">Dismiss Audit</button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingReview && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#1e293b] border border-white/10 rounded-[3rem] w-full max-w-md p-10 shadow-2xl animate-fade-in">
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-1">Modify Appraisal</h3>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-8">User: {editingReview.userName}</p>
            
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Rating Calibration</label>
                <div className="flex space-x-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => setEditRating(s)} className={`transition-all ${editRating >= s ? 'text-yellow-400 scale-110' : 'text-gray-700'}`}>
                      <svg className="w-8 h-8 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Commentary Logic</label>
                <textarea 
                  className="w-full bg-[#0f172a] border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none focus:border-[#D4AF37] text-white transition-all h-32 resize-none"
                  value={editComment}
                  onChange={e => setEditComment(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <button onClick={() => setEditingReview(null)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">Cancel</button>
                <button 
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="flex-1 py-4 bg-[#D4AF37] text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-yellow-500/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                >
                  {isSaving ? <div className="w-4 h-4 border-2 border-t-transparent border-gray-900 rounded-full animate-spin"></div> : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REMOVE MODAL */}
      {confirmingDelete && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-[#1e293b] border border-red-500/20 rounded-[3rem] w-full max-w-sm p-12 shadow-2xl animate-fade-in text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2"/></svg>
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">Erase Appraisal?</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-10 leading-relaxed">
              Confirm removal of review <span className="text-[#D4AF37]">{confirmingDelete.id}</span> from the global feed.
            </p>
            
            <div className="flex gap-4">
              <button onClick={() => setConfirmingDelete(null)} className="flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-white/5 transition-all">Cancel</button>
              <button 
                onClick={handleConfirmDelete}
                disabled={isSaving}
                className="flex-1 py-4 bg-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl shadow-red-500/10 hover:bg-red-700 transition-all flex items-center justify-center"
              >
                {isSaving ? <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#1e293b]/50 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-white/5">
            <tr>
              <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">User & Product</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Rating</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Comment</th>
              <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {reviews.map(rev => (
              <tr key={rev.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-10 py-6">
                  <p className="text-sm font-black text-white">{rev.userName}</p>
                  <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{rev.productName || 'PRODUCT NODE'}</p>
                </td>
                <td className="px-10 py-6">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-black text-orange-400">{rev.rating}</span>
                    <svg className="w-3.5 h-3.5 text-orange-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <p className="text-xs font-bold text-gray-400 max-w-xs line-clamp-1 italic">"{rev.comment}"</p>
                </td>
                <td className="px-10 py-6 text-right space-x-4">
                  <button onClick={() => setViewingReview(rev)} className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:underline">View</button>
                  <button onClick={() => handleEditOpen(rev)} className="text-[10px] font-black text-green-400 uppercase tracking-widest hover:underline">Edit</button>
                  <button onClick={() => setConfirmingDelete(rev)} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reviews.length === 0 && !loading && (
          <div className="py-24 text-center">
             <p className="text-gray-600 font-black uppercase text-xs tracking-[0.3em]">Zero appraisal records identifyed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingsAndReviews;
