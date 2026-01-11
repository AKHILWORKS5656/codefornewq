import React, { useState } from 'react';
import { User, AuthView } from '../types';

interface HeaderProps {
  onLogoClick: () => void;
  onAuthClick: () => void;
  onLogout: () => void;
  onNavigate: (view: AuthView) => void;
  onSearch: (query: string) => void;
  user: User | null;
  cartCount: number;
  isSellerView?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, onAuthClick, onLogout, onNavigate, onSearch, user, cartCount, isSellerView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#004aad] shadow-2xl border-b border-blue-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-28 gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center h-full cursor-pointer group" onClick={onLogoClick}>
            <h1 className="logo-font text-3xl md:text-5xl font-black text-[#D4AF37] tracking-[0.15em] select-none transition-all group-hover:scale-105 group-active:scale-95 drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)] leading-none whitespace-nowrap uppercase">
              {isSellerView ? 'Sellers' : 'BEAUZEAD'}
            </h1>
          </div>

          {/* Right Actions */}
          {!isSellerView && (
            <div className="flex items-center space-x-6 md:space-x-10 h-full ml-auto">
              {/* Seller Button */}
              <button 
                onClick={() => onNavigate('sellers_landing')}
                className="hidden lg:flex items-center space-x-3 text-white hover:text-[#D4AF37] transition-all whitespace-nowrap group hover:-translate-y-0.5"
              >
                <div className="p-2 bg-white/5 rounded-full group-hover:bg-[#D4AF37]/20 transition-colors">
                  <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <span className="text-sm font-black uppercase tracking-widest">Sell Now</span>
              </button>

              {user ? (
                <div className="relative group flex items-center h-full">
                  <button className="flex items-center space-x-2 text-white hover:text-[#D4AF37] transition-all py-2 whitespace-nowrap h-full group-hover:-translate-y-0.5">
                    <span className="hidden sm:inline text-sm font-black uppercase tracking-widest">Account</span>
                    <svg width="16" height="16" className="transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 top-[70%] w-64 bg-white shadow-2xl rounded-2xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] mt-2 translate-y-2 group-hover:translate-y-0 overflow-hidden">
                    <div className="relative bg-white">
                      {user.role === 'admin' && (
                        <button 
                          className="w-full flex items-center justify-between px-6 py-4 text-sm text-gray-700 hover:bg-orange-50 transition-colors border-b border-gray-50 group/adm"
                          onClick={() => onNavigate('admin_dashboard')}
                        >
                          <div className="flex items-center space-x-3">
                            <svg width="18" height="18" className="text-orange-500 group-hover/adm:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span className="font-black text-orange-600 uppercase tracking-widest">Admin Control</span>
                          </div>
                        </button>
                      )}

                      <button 
                        className="w-full flex items-center justify-between px-6 py-4 text-sm text-gray-700 hover:bg-blue-50 transition-colors border-b border-gray-50 group/prof"
                        onClick={() => onNavigate('user_profile')}
                      >
                        <div className="flex items-center space-x-3">
                          <svg width="18" height="18" className="text-[#2874f0] group-hover/prof:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-black uppercase tracking-widest">Identity</span>
                        </div>
                      </button>

                      <button 
                        onClick={onLogout}
                        className="w-full flex items-center space-x-3 px-6 py-4 text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all group/out"
                      >
                        <svg width="18" height="18" className="group-hover/out:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-black uppercase tracking-widest">Terminate</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={onAuthClick}
                  className="bg-[#D4AF37] text-gray-900 px-8 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#c2a032] transition-all shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap h-12 flex items-center justify-center border-b-4 border-[#a6892b]"
                >
                  Login
                </button>
              )}

              {/* Cart Icon */}
              <div 
                onClick={() => onNavigate('checkout_cart')}
                className="relative cursor-pointer group flex items-center text-white hover:text-[#D4AF37] transition-all h-full hover:-translate-y-0.5"
              >
                <div className="p-2.5 bg-white/5 rounded-full group-hover:bg-[#D4AF37]/20 transition-colors">
                  <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="hidden md:inline ml-3 font-black uppercase tracking-widest text-sm">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 md:-right-1 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center border-2 border-[#004aad] shadow-lg animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>

              {/* Hamburger Mobile */}
              <button 
                className="md:hidden p-3 rounded-xl text-white bg-white/5 hover:bg-blue-800 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg width="26" height="26" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                </svg>
              </button>
            </div>
          )}
          
          {isSellerView && (
            <div className="flex items-center h-full ml-auto">
              <button 
                onClick={onLogoClick}
                className="text-white hover:text-[#D4AF37] text-xs font-black uppercase tracking-[0.2em] transition-all border-2 border-white/20 px-8 py-3 rounded-xl hover:bg-white/10"
              >
                Marketplace Hub
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {!isSellerView && isMenuOpen && (
        <div className="md:hidden bg-[#004aad] border-t border-blue-900/50 px-6 py-10 space-y-6 animate-fade-in shadow-inner">
          <button onClick={() => { onLogoClick(); setIsMenuOpen(false); }} className="block w-full text-left text-white font-black uppercase tracking-widest text-lg py-3 hover:text-[#D4AF37] transition-colors">Home</button>
          <button onClick={() => { onNavigate('sellers_landing'); setIsMenuOpen(false); }} className="block w-full text-left text-white font-black uppercase tracking-widest text-lg py-3 hover:text-[#D4AF37] transition-colors">Become a Seller</button>
          {!user && (
             <button onClick={() => { onAuthClick(); setIsMenuOpen(false); }} className="block w-full bg-[#D4AF37] text-gray-900 font-black uppercase tracking-[0.2em] py-5 rounded-2xl text-center shadow-2xl border-b-4 border-[#a6892b] active:translate-y-1">Login</button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;