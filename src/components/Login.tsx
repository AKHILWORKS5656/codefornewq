import React, { useState } from 'react';
import { api } from '../mockApi';
import { User, AuthView } from '../types';
import { ButtonLoader } from './common/ProfessionalLoaders';

interface LoginProps {
  onSuccess: (user: User) => void;
  onNavigate: (view: AuthView) => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess, onNavigate }) => {
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
      setError(err.message || 'Verification Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      <button 
        onClick={() => onNavigate('home')}
        className="mb-8 flex items-center space-x-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:text-[#2874f0] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="3"/></svg>
        <span>BACK TO MARKET</span>
      </button>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="logo-font text-3xl font-extrabold text-[#2874f0] tracking-widest">BEAUZEAD</h2>
          <p className="text-gray-400 mt-2 font-bold uppercase text-[10px] tracking-widest">Client Portal Access</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 flex items-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              required
              className="w-full bg-gray-50 px-6 py-4 rounded-2xl border border-transparent focus:border-[#2874f0] focus:bg-white outline-none transition-all text-black font-bold text-sm"
              placeholder="Private Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full bg-gray-50 px-6 py-4 rounded-2xl border border-transparent focus:border-[#2874f0] focus:bg-white outline-none transition-all text-black font-bold text-sm"
                placeholder="Access Key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#2874f0]"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2874f0] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <ButtonLoader /> : 'AUTHENTICATE'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-50 text-center">
          <button onClick={() => onNavigate('signup')} className="text-[#2874f0] font-black text-[10px] uppercase tracking-widest hover:underline">Register New Account</button>
        </div>
      </div>
    </div>
  );
};

export default Login;