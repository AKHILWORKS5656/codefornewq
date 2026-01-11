import React from 'react';

export const ButtonLoader: React.FC = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
    <span className="opacity-80">Synchronizing...</span>
  </div>
);

export const SectionLoader: React.FC<{ message?: string }> = ({ message = 'Accessing Node...' }) => (
  <div className="flex flex-col items-center justify-center py-20 w-full bg-white/5 backdrop-blur-sm rounded-[2.5rem] border border-white/5 animate-fade-in">
    <div className="relative w-16 h-16 mb-6">
      <div className="absolute inset-0 border-4 border-[#D4AF37]/10 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-[#D4AF37] rounded-full animate-spin shadow-[0_0_15px_rgba(212,175,55,0.3)]"></div>
      <div className="absolute inset-2 border-2 border-b-blue-400/40 rounded-full animate-spin-reverse"></div>
    </div>
    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{message}</p>
    <style>{`
      @keyframes spin-reverse {
        from { transform: rotate(0deg); }
        to { transform: rotate(-360deg); }
      }
      .animate-spin-reverse {
        animation: spin-reverse 1.5s linear infinite;
      }
    `}</style>
  </div>
);

export const ProductPageSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
    <div className="h-6 w-32 bg-gray-200 rounded-lg mb-8"></div>
    <div className="bg-white rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row shadow-sm border border-gray-100">
      <div className="lg:w-1/2 p-8">
        <div className="aspect-[1080/1350] bg-gray-100 rounded-3xl mb-6"></div>
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-xl"></div>)}
        </div>
      </div>
      <div className="lg:w-1/2 p-8 md:p-12 space-y-6">
        <div className="h-4 w-40 bg-gray-100 rounded-full"></div>
        <div className="h-12 w-full bg-gray-100 rounded-2xl"></div>
        <div className="h-12 w-3/4 bg-gray-100 rounded-2xl"></div>
        <div className="h-32 w-full bg-gray-50 rounded-[2rem]"></div>
        <div className="h-16 w-full bg-gray-100 rounded-2xl"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-14 bg-gray-200 rounded-2xl"></div>
          <div className="h-14 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    </div>
  </div>
);
