
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      onClick={() => onClick(product)}
      className="bg-white rounded-lg overflow-hidden border border-transparent hover:border-gray-200 transition-all duration-300 hover:shadow-xl group flex flex-col h-full cursor-pointer"
    >
      <div className="relative pt-[100%] overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button 
          onClick={(e) => { e.stopPropagation(); }}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 px-1.5 py-0.5 rounded border border-gray-200 bg-gray-50">
            {product.category}
          </span>
        </div>
        
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-[#2874f0] transition-colors h-10">
          {product.title}
        </h3>

        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center bg-green-600 text-white px-1.5 py-0.5 rounded text-[11px] font-bold">
            {product.rating}
            <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <span className="text-xs text-gray-400 font-medium">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div className="text-lg font-bold text-gray-900">
            £{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <button className="text-[#2874f0] p-1.5 hover:bg-blue-50 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
