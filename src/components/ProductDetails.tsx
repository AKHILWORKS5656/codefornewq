import React, { useState, useEffect } from 'react';
import { Product, Review, User } from '../types';
import { api } from '../mockApi';
import { ProductPageSkeleton } from './common/ProfessionalLoaders';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onViewAllReviews: (productId: string) => void;
  user: User | null;
  onLoginRequest: () => void;
  onBuyNow: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  product: initialProduct, 
  onBack, 
  onViewAllReviews, 
  user, 
  onLoginRequest,
  onBuyNow,
  onAddToCart
}) => {
  const [product, setProduct] = useState(initialProduct);
  const [selectedImage, setSelectedImage] = useState(initialProduct.image);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSyncing, setIsSyncing] = useState(true);

  // Gallery Requirements: Exactly 5 images
  const gallery = product.images?.slice(0, 5) || [
    product.image,
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1080&h=1350&q=90',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1080&h=1350&q=90',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1080&h=1350&q=90',
    'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1080&h=1350&q=90'
  ];

  useEffect(() => {
    const init = async () => {
      setIsSyncing(true);
      // 1. Fetch initial reviews
      await api.getReviews(product.id).then(setReviews);
      
      // Artificial delay for premium transition
      await new Promise(r => setTimeout(r, 600));
      setIsSyncing(false);

      // 2. Real-time updates subscription
      const unsubscribe = api.subscribeToStockUpdates(product.id, (newStock) => {
        setProduct(prev => ({ ...prev, stock: newStock }));
      });
      
      return () => unsubscribe();
    };
    init();
  }, [product.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return onLoginRequest();
    if (!reviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const newReview = await api.addReview({
        productId: product.id,
        userId: user.id,
        userName: user.name,
        rating: reviewRating,
        comment: reviewComment
      });
      setReviews(prev => [newReview, ...prev]);
      setReviewComment('');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isSyncing) return <ProductPageSkeleton />;

  const isOutOfStock = product.stock === 0;
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="bg-[#f1f3f6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <button 
          onClick={onBack}
          className="mb-8 flex items-center space-x-2 text-xs font-black text-[#2874f0] uppercase tracking-widest hover:bg-white/50 p-2 rounded-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth="2.5"/></svg>
          <span>BACK TO STORE</span>
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-black/5 animate-fade-in">
          <div className="flex flex-col lg:flex-row">
            
            {/* LEFT SECTION: IMAGERY */}
            <div className="lg:w-1/2 p-8 bg-gray-50/50">
              <div className="aspect-[1080/1350] rounded-3xl overflow-hidden shadow-2xl relative bg-white group">
                <img 
                  src={selectedImage} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                  alt={product.title} 
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>

              {/* Gallery Thumbnails (Exactly 5) */}
              <div className="grid grid-cols-5 gap-4 mt-8">
                {gallery.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-[1080/1350] rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-[#2874f0] shadow-lg ring-4 ring-blue-50' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT SECTION: DETAILS */}
            <div className="lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col">
              
              {/* 1. Badge */}
              <div className="mb-4">
                 <span className="bg-yellow-50 text-[#D4AF37] border border-yellow-200 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                   BEAUZEAD SIGNATURE : {product.category.toUpperCase()}
                 </span>
              </div>

              {/* 2. Product Title */}
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6 tracking-tighter">
                {product.title}
              </h1>

              {/* 3. Seller Info */}
              <div className="flex items-center space-x-3 mb-8 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#2874f0] font-black text-sm uppercase">
                  {product.seller.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{product.seller}</span>
                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" className="h-3" alt="Verified" />
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Top Rated Platinum Seller</p>
                </div>
              </div>

              {/* 4. Price Box */}
              <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2rem] mb-10 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Live Market Value</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-5xl font-black text-gray-900 tracking-tighter">£{product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      {product.originalPrice && (
                        <div className="flex flex-col">
                           <span className="text-lg text-gray-400 line-through font-bold">£{product.originalPrice.toLocaleString()}</span>
                           <span className="text-xs font-black text-green-600 uppercase">{discount}% OFF</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col min-w-[150px]">
                    <p className={`text-xs font-black uppercase tracking-tighter mb-2 ${product.stock < 10 ? 'text-red-500' : 'text-gray-500'}`}>
                      {isOutOfStock ? 'Sold Out' : `Real-time Stock: ${product.stock} units`}
                    </p>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                       <div 
                        className={`h-full transition-all duration-1000 ${isOutOfStock ? 'bg-gray-300 w-0' : product.stock < 20 ? 'bg-red-500 w-[15%]' : 'bg-green-500 w-[70%]'}`}
                       ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Quantity Selector */}
              <div className="flex items-center space-x-6 mb-8">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Select Quantity</span>
                <div className="flex items-center bg-gray-100 rounded-2xl p-1.5 shadow-inner">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q-1))}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-gray-600 hover:text-black font-black transition-all active:scale-90"
                  >–</button>
                  <span className="w-12 text-center font-black text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q+1)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm text-gray-600 hover:text-black font-black transition-all active:scale-90"
                  >+</button>
                </div>
              </div>

              {/* 6. Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <button 
                  onClick={() => onAddToCart(product, quantity)}
                  disabled={isOutOfStock}
                  className={`py-5 rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 border-2 ${
                    isOutOfStock ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-white border-black text-black hover:bg-gray-50'
                  }`}
                >
                  CART NOW
                </button>
                <button 
                  onClick={() => onBuyNow(product)}
                  disabled={isOutOfStock}
                  className={`py-5 rounded-2xl font-black text-sm uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 ${
                    isOutOfStock ? 'bg-gray-200 text-gray-400 shadow-none' : 'bg-[#2874f0] text-white hover:bg-blue-600 shadow-blue-500/20'
                  }`}
                >
                  BUY NOW
                </button>
              </div>

              {/* 7. Product Description */}
              <div className="mb-10">
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center">
                  <span>Product Experience</span>
                  <div className="h-px bg-gray-100 flex-grow ml-4"></div>
                </h4>
                <div className="text-gray-500 text-sm leading-relaxed font-semibold whitespace-pre-wrap">
                  {product.description || "Indulge in our most sought-after signature piece. Meticulously engineered for performance, aesthetic longevity, and uncompromising luxury."}
                </div>
              </div>

              {/* 8. Important Note */}
              <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl mb-10">
                 <div className="flex items-center space-x-3 mb-2">
                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    <h5 className="text-[10px] font-black text-orange-800 uppercase tracking-[0.2em]">Quality Advisory</h5>
                 </div>
                 <p className="text-xs text-orange-700 font-bold leading-relaxed">
                   {product.importantNote || "Limited edition release. Each unit undergoes triple-stage verification at our London facility to ensure unmatched craftsmanship."}
                 </p>
              </div>

              {/* 9. Shipping Info */}
              <div className="flex items-center space-x-4 mb-10">
                 <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#2874f0]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5"/></svg>
                 </div>
                 <div>
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Express Global Shipping</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Estimated Delivery: 3-5 Working Days</p>
                 </div>
              </div>

              {/* 10. Payment Icons */}
              <div className="mt-auto pt-8 border-t border-gray-50 flex items-center justify-center space-x-10 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-3" alt="Paypal" />
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOMER FEEDBACK SECTION */}
        <div className="mt-12 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-16">
          <div className="flex flex-col lg:flex-row gap-16">
            
            <div className="lg:w-1/3">
              <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-8">Client Chronicles</h3>
              <div className="flex items-end space-x-4 mb-10">
                <span className="text-7xl font-black text-gray-900 leading-none">{product.rating.toFixed(1)}</span>
                <div className="pb-2">
                   <div className="flex text-yellow-400 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      ))}
                   </div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verified Rating From {reviews.length} Reviews</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <h4 className="text-sm font-black text-gray-900 uppercase mb-6 tracking-widest">Submit Appraisal</h4>
                {!user ? (
                   <div className="text-center py-4">
                     <p className="text-xs text-gray-500 font-bold mb-6">Authenticate to share your experience.</p>
                     <button onClick={onLoginRequest} className="w-full bg-[#2874f0] text-white py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all">SIGN IN</button>
                   </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Your Rating</label>
                      <div className="flex space-x-2">
                        {[1,2,3,4,5].map(s => (
                          <button key={s} type="button" onClick={() => setReviewRating(s)} className={`transition-all ${reviewRating >= s ? 'text-yellow-400 scale-110' : 'text-gray-200'}`}>
                            <svg className="w-8 h-8 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Written Commentary</label>
                      <textarea 
                        required
                        className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm font-semibold focus:ring-4 focus:ring-blue-50 outline-none transition-all resize-none"
                        rows={5}
                        placeholder="Detailed feedback..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                      ></textarea>
                    </div>
                    <button 
                      disabled={isSubmittingReview}
                      className="w-full bg-black text-white py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      {isSubmittingReview ? 'PUBLISHING...' : 'POST APPRAISAL'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="lg:w-2/3">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">Recent Chronicles</h3>
                {reviews.length > 5 && (
                  <button onClick={() => onViewAllReviews(product.id)} className="text-[10px] font-black text-[#2874f0] uppercase tracking-widest hover:underline">View Entire History ({reviews.length})</button>
                )}
              </div>

              <div className="space-y-12">
                {reviews.slice(0, 5).map(rev => (
                  <div key={rev.id} className="group">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-black text-sm uppercase">
                             {rev.userName.charAt(0)}
                          </div>
                          <div>
                             <h5 className="text-sm font-black text-gray-900 tracking-tight">{rev.userName}</h5>
                             <p className="text-[10px] font-bold text-gray-400 uppercase">
                               {new Date(rev.createdAt).toLocaleDateString()} at {new Date(rev.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                             </p>
                          </div>
                       </div>
                       <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          ))}
                       </div>
                    </div>
                    <div className="pl-16">
                       <p className="text-gray-600 text-sm font-medium leading-relaxed italic group-hover:text-gray-900 transition-colors">
                         "{rev.comment}"
                       </p>
                    </div>
                  </div>
                ))}
                
                {reviews.length === 0 && (
                   <div className="text-center py-24 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                     <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Be the first to chronicle this acquisition.</p>
                   </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;