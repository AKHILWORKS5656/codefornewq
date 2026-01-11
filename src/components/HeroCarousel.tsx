import React, { useState, useEffect } from 'react';
import { BANNERS } from '../constants';

const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-white">
      {/* 
        Max-width container to prevent images from stretching too wide on 4K monitors.
        Pure white background ensures a clean, 'Apple-style' aesthetic.
      */}
      <div className="max-w-[1440px] mx-auto relative overflow-hidden group md:px-4 py-4">
        
        <div className="relative w-full h-[250px] md:h-[450px] rounded-none md:rounded-[2.5rem] overflow-hidden shadow-sm bg-white">
          {/* Main Slide Container */}
          <div 
            className="flex transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1) h-full w-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {BANNERS.map((banner) => (
              <div key={banner.id} className="w-full h-full flex-shrink-0 relative cursor-pointer">
                {/* No black overlays, no gradients - pure image clarity */}
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className="w-full h-full object-cover object-center select-none"
                  draggable="false"
                />
              </div>
            ))}
          </div>

          {/* Navigation Controls - Ultra-clean White Glassmorphism */}
          <button 
            onClick={prev}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-4 rounded-full text-gray-900 shadow-2xl backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-gray-100 active:scale-90 z-20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={next}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-4 rounded-full text-gray-900 shadow-2xl backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 border border-gray-100 active:scale-90 z-20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Pagination Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-500 rounded-full h-1.5 ${
                  currentIndex === idx 
                    ? 'bg-[#2874f0] w-12 shadow-lg shadow-blue-500/20' 
                    : 'bg-gray-300 w-2 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;