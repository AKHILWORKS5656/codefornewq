import React, { useState } from 'react';

interface HomeSearchProps {
  onSearch: (query: string) => void;
}

const HomeSearch: React.FC<HomeSearchProps> = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <div className="w-full bg-[#004aad] py-6 px-4 shadow-inner">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative flex flex-col md:flex-row items-stretch gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <svg width="20" height="20" className="text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Search for luxury brands, electronics, or fashion..."
              className="w-full bg-white border-none rounded-xl pl-14 pr-6 py-4 text-base font-bold text-gray-900 placeholder-gray-400 outline-none shadow-xl focus:ring-4 focus:ring-white/20 transition-all"
            />
          </div>
          <button
            type="submit"
            className="bg-[#D4AF37] hover:bg-[#c2a032] text-gray-900 px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-3 whitespace-nowrap"
          >
            <span>Search</span>
            <svg width="18" height="18" className="transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-2-9-9-2 2 9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19L21 21" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomeSearch;