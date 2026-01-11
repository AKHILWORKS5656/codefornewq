import React, { useState } from 'react';
import { api } from '../mockApi';
import { User, AuthView } from '../types';

interface SellersLoginPageProps {
  onSuccess: (user: User) => void;
  onNavigate: (view: AuthView) => void;
}

const SellersLoginPage: React.FC<SellersLoginPageProps> = ({ onSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await api.login(email, password);
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-brand-bg min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] w-full max-w-[440px] overflow-hidden flex flex-col border border-white/50">
        {/* Header */}
        <div className="px-10 py-8 flex items-center justify-between border-b border-gray-50 bg-gray-50/80 backdrop-blur-md">
          <h2 className="text-gray-900 text-2xl font-black uppercase tracking-tight">Partner Login</h2>
          <button 
            onClick={() => onNavigate('sellers_landing')}
            className="text-gray-400 hover:text-gray-600 transition-all bg-white p-2.5 rounded-full shadow-sm hover:scale-110 active:scale-90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-10 pt-14">
          {error && (
            <div className="mb-8 p-5 bg-red-50 text-red-600 text-xs font-black rounded-2xl border border-red-100 animate-fade-in uppercase tracking-widest text-center shadow-inner">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-10">
            <div className="relative group">
              <div className="absolute -top-3 left-6 bg-white px-2 z-10 transition-colors group-focus-within:text-blue-600">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap group-focus-within:text-blue-600">
                  Node Identifier
                </label>
              </div>
              <div className="flex items-center w-full bg-gray-50 border-2 border-gray-100 rounded-[1.25rem] px-6 py-5 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-[0_10px_25px_rgba(59,130,246,0.1)] transition-all">
                <input
                  type="text"
                  value={email}
                  placeholder="Email / Store ID"
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow bg-transparent text-gray-800 text-sm font-bold outline-none placeholder:text-gray-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 relative group">
              <div className="absolute -top-3 left-6 bg-white px-2 z-10 transition-colors group-focus-within:text-blue-600">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap group-focus-within:text-blue-600">
                  Security Token
                </label>
              </div>
              <div className="flex items-center w-full bg-gray-50 border-2 border-gray-100 rounded-[1.25rem] px-6 py-5 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-[0_10px_25px_rgba(59,130,246,0.1)] transition-all">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-grow bg-transparent text-gray-800 text-sm font-bold outline-none placeholder:text-gray-300"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-blue-500 transition-all hover:scale-125"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <div className="flex justify-end pt-1">
                <button 
                  type="button"
                  onClick={() => onNavigate('sellers_forgot_password')}
                  className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline"
                >
                  Forgot Entry Key?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2874f0] text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/30 disabled:bg-blue-300 active:scale-95"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                   <div className="w-5 h-5 border-3 border-t-transparent border-white rounded-full animate-spin"></div>
                   <span>Authorizing...</span>
                </div>
              ) : 'Authenticate Session'}
            </button>
          </form>

          <div className="mt-14 pt-10 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-8">New Enterprise Partner?</p>
            <button
              type="button"
              onClick={() => onNavigate('sellers_signup')}
              className="w-full border-2 border-gray-900 text-gray-900 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.25em] hover:bg-gray-900 hover:text-white transition-all hover:shadow-xl active:scale-95"
            >
              Initialize Onboarding
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellersLoginPage;