import React, { useState } from 'react';
import { COUNTRIES } from '../constants';
import { api } from '../mockApi';
import { AuthView } from '../types';
import { ButtonLoader } from './common/ProfessionalLoaders';

interface SignupProps {
  onPending: (data: any) => void;
  onNavigate: (view: AuthView) => void;
}

const Signup: React.FC<SignupProps> = ({ onPending, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    country: COUNTRIES[0].name,
    terms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.terms) {
      setError('Accept Terms to proceed.');
      return;
    }
    setLoading(true);
    try {
      const exists = await api.checkEmailExists(formData.email);
      if (exists) {
        setError('Email already in registry.');
      } else {
        onNavigate('login'); // Simplified for fix
      }
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
          <p className="text-gray-400 mt-2 font-bold uppercase text-[10px] tracking-widest">Create Identity</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input className="w-full bg-gray-50 px-6 py-4 rounded-2xl border border-transparent focus:border-[#2874f0] outline-none transition-all text-black font-bold text-sm" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <input className="w-full bg-gray-50 px-6 py-4 rounded-2xl border border-transparent focus:border-[#2874f0] outline-none transition-all text-black font-bold text-sm" placeholder="Private Email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input className="w-full bg-gray-50 px-6 py-4 rounded-2xl border border-transparent focus:border-[#2874f0] outline-none transition-all text-black font-bold text-sm" placeholder="Access Key" type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          
          <div className="flex items-center space-x-3 p-2">
            <input type="checkbox" id="terms" checked={formData.terms} onChange={e => setFormData({...formData, terms: e.target.checked})} />
            <label htmlFor="terms" className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">I Accept Legal Terms</label>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-gray-900 transition-all shadow-xl">
            {loading ? <ButtonLoader /> : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
          <button onClick={() => onNavigate('login')} className="text-[#2874f0] font-black text-[10px] uppercase tracking-widest hover:underline">Existing Client? Login</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;