import React, { useState, useEffect } from 'react';
import { api } from '../mockApi';
import { CATEGORIES } from '../constants';
import { Category } from '../types';

interface CategoryBarProps {
  onCategorySelect: (category: string) => void;
  activeCategory: string | null;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ onCategorySelect, activeCategory }) => {
  // Initialize with local defaults for production resilience
  const [categories, setCategories] = useState<string[]>(CATEGORIES);

  const fetchCats = async () => {
    try {
      const data = await api.getCategories();
      // Only override if we actually got data from the production node
      if (data && data.length > 0) {
        const cloudCats = data.map(c => c.name);
        setCategories(['All', ...cloudCats.filter(name => name !== 'All')]);
      }
    } catch (err) {
      // Fail silently in production or log as a low-priority warning
      console.warn("Live categories unreachable, maintaining local hierarchy.");
    }
  };

  useEffect(() => {
    fetchCats();

    // Listen for real-time updates broadcast from admin panel
    const handleUpdate = () => fetchCats();
    window.addEventListener('beauzead_categories_updated', handleUpdate);
    return () => window.removeEventListener('beauzead_categories_updated', handleUpdate);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-100 py-6 shadow-sm overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-12 overflow-x-auto hide-scrollbar whitespace-nowrap py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategorySelect(cat)}
              className={`text-sm md:text-base font-black transition-all relative group py-2 flex flex-col items-center uppercase tracking-[0.1em] ${
                activeCategory === cat ? 'text-[#2874f0] scale-110' : 'text-gray-400 hover:text-gray-900 hover:scale-105'
              }`}
            >
              <span className="mb-2">{cat}</span>
              <span className={`h-1 bg-[#2874f0] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(40,116,240,0.3)] ${
                activeCategory === cat ? 'w-full' : 'w-0 group-hover:w-1/2'
              }`}></span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CategoryBar;