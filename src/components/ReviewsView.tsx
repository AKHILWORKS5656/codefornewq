
import React, { useState, useEffect } from 'react';
import { Product, Review } from '../types';
import { api } from '../mockApi';

interface ReviewsViewProps {
  productId: string;
  onBack: () => void;
  products: Product[];
}

const ReviewsView: React.FC<ReviewsViewProps> = ({ productId, onBack, products }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const product = products.find(p => p.id === productId);

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await api.getReviews(productId);
      setReviews(data);
      setLoading(false);
    };
    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className="bg-[#f8fafc] min-h-screen py-12 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-[#2874f0] border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-bold uppercase text-xs tracking-widest animate-pulse">Loading all reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-black text-[#2874f0] bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all mb-8 uppercase tracking-widest"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
          <span>Back to Product</span>
        </button>

        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-gray-50 pb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">Customer Testimonials</h2>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                Reviews for: <span className="text-[#2874f0]">{product?.title || 'Unknown Product'}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-4xl font-black text-gray-900">{product?.rating.toFixed(1)}</div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < Math.floor(product?.rating || 0) ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {reviews.map(review => (
              <div key={review.id} className="pb-8 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-black text-sm">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-gray-900">{review.userName}</h4>
                      <div className="flex text-yellow-400 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Fixed review.date to review.createdAt */}
                  <div className="text-[11px] font-black text-gray-400 uppercase bg-gray-50 px-3 py-1.5 rounded-full">
                    Posted on {new Date(review.createdAt).toLocaleDateString()} at {new Date(review.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="pl-0 md:pl-14">
                  <p className="text-gray-600 text-sm font-medium leading-relaxed italic border-l-4 border-blue-50 pl-6 py-2">
                    "{review.comment}"
                  </p>
                </div>
              </div>
            ))}
            
            {reviews.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No detailed reviews available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsView;
