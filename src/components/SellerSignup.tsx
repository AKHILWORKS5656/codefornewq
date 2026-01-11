import React, { useState, useEffect, useRef } from 'react';
import { AuthView } from '../types';
import { api } from '../mockApi';
import { COUNTRIES } from '../constants';

interface SellerSignupProps {
  onNavigate: (view: AuthView) => void;
}

type SignupStep = 'account' | 'business' | 'bank';

const SellerSignup: React.FC<SellerSignupProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<SignupStep>('account');
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [passwordError, setPasswordError] = useState('');
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    country: COUNTRIES[0].name,
    fullName: '',
    personalAddress: '',
    district: '',
    state: '',
    pincode: '',
    addressProofType: 'Passport',
    companyType: 'Individual',
    brandName: '',
    regNo: '',
    gstNo: '',
    businessDistrict: '',
    businessState: '',
    businessCountry: COUNTRIES[0].name,
    businessPincode: '',
    bankAccountName: '',
    bankAccountNumber: '',
    ifscCode: '',
    bankName: '',
  });

  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    idFront: null,
    idBack: null,
    taxDoc: null
  });

  const selectedCountryObj = COUNTRIES.find(c => c.name === formData.country) || COUNTRIES[0];

  useEffect(() => {
    let interval: any;
    if (showOtp && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [showOtp, timer]);

  const handleSendOtp = () => {
    if (!formData.email) {
      alert("Please enter Email ID first");
      return;
    }
    setShowOtp(true);
    setTimer(30);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleFileUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
    }
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    const mobileDigits = formData.mobile.replace(/\D/g, '');
    if (mobileDigits.length < selectedCountryObj.phoneLength) {
      alert(`Mobile number for ${selectedCountryObj.name} must be at least ${selectedCountryObj.phoneLength} digits.`);
      return;
    }

    setStep('business');
    window.scrollTo(0, 0);
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('bank');
    window.scrollTo(0, 0);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 2000));
      alert('Onboarding complete! Your application is now under review by the Beauzead Governance Team.');
      onNavigate('sellers_login');
    } catch (err) {
      alert('Error finalizing registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-brand-bg min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto animate-fade-in">
        {/* Progress Tracker */}
        <div className="flex items-center justify-center space-x-4 mb-12">
            <div className={`w-3 h-3 rounded-full ${step === 'account' ? 'bg-blue-600 shadow-[0_0_10px_#2563eb]' : 'bg-gray-300'}`}></div>
            <div className="h-0.5 w-12 bg-gray-200"></div>
            <div className={`w-3 h-3 rounded-full ${step === 'business' ? 'bg-blue-600 shadow-[0_0_10px_#2563eb]' : 'bg-gray-300'}`}></div>
            <div className="h-0.5 w-12 bg-gray-200"></div>
            <div className={`w-3 h-3 rounded-full ${step === 'bank' ? 'bg-blue-600 shadow-[0_0_10px_#2563eb]' : 'bg-gray-300'}`}></div>
        </div>

        <div className="flex-grow">
          {step === 'account' && (
            <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-white animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-500"></div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Account Setup</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Stage 01: Core Credentials</p>
              </div>
              
              <form onSubmit={handleAccountSubmit} className="space-y-10 max-w-2xl mx-auto">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operating Territory</label>
                  <select 
                    className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all cursor-pointer shadow-inner appearance-none"
                    value={formData.country}
                    onChange={e => setFormData({...formData, country: e.target.value, businessCountry: e.target.value})}
                    required
                  >
                    {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Enterprise Email Node</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="business@corp.com"
                      className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      required
                    />
                    <button type="button" onClick={handleSendOtp} className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">Verify</button>
                  </div>
                </div>

                {showOtp && (
                  <div className="p-10 bg-blue-50/30 rounded-[2.5rem] border-2 border-blue-100/50 space-y-8 animate-fade-in shadow-inner">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] text-center">Enter Security Payload</p>
                    <div className="flex justify-center space-x-3 md:space-x-4">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={el => { otpRefs.current[idx] = el; }}
                          type="text"
                          maxLength={1}
                          className="w-12 h-16 md:w-14 md:h-20 text-center text-3xl font-black border-2 border-blue-200 rounded-2xl bg-white outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-lg shadow-blue-200/10"
                          value={digit}
                          onChange={e => handleOtpChange(idx, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(idx, e)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Backbone (Mobile)</label>
                  <div className="flex shadow-inner rounded-2xl overflow-hidden border-2 border-slate-100">
                    <span className="bg-slate-200 text-slate-600 px-6 flex items-center justify-center font-black text-sm border-r border-slate-300">
                      {selectedCountryObj.phonePrefix}
                    </span>
                    <input
                      type="tel"
                      placeholder={`Target Digit Matrix (${selectedCountryObj.phoneLength})`}
                      className="w-full bg-slate-50/50 px-6 py-5 text-sm font-bold outline-none focus:bg-white transition-all"
                      value={formData.mobile}
                      onChange={e => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Master Key</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Confirm Key</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={`w-full border-2 rounded-2xl px-6 py-5 text-sm font-bold outline-none transition-all shadow-inner ${passwordError ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500'}`}
                      value={formData.confirmPassword}
                      onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                </div>
                {passwordError && <p className="text-[10px] text-red-500 font-black uppercase text-center tracking-[0.2em]">{passwordError}</p>}

                <div className="pt-10">
                  <button type="submit" className="w-full bg-[#0052cc] text-white px-10 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-[0_25px_60px_-15px_rgba(0,82,204,0.4)] hover:scale-[1.02] active:scale-95 transition-all">
                    Initiate Registry
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'business' && (
            <div className="space-y-12 animate-fade-in">
              <form onSubmit={handleBusinessSubmit} className="space-y-12">
                <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-white">
                  <h2 className="text-xl font-black text-gray-900 mb-12 border-b border-slate-50 pb-8 uppercase tracking-[0.2em] flex items-center">
                    <span className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-6 shadow-lg shadow-blue-200">1</span>
                    Legal Identity Logic
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Official Entity Name</label>
                      <input required className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Primary Physical Address</label>
                      <input required className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner" value={formData.personalAddress} onChange={e => setFormData({...formData, personalAddress: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">District Node</label>
                      <input required className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">State / Zone</label>
                      <input required className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-white">
                  <h2 className="text-xl font-black text-gray-900 mb-12 border-b border-slate-50 pb-8 uppercase tracking-[0.2em] flex items-center">
                    <span className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-6 shadow-lg shadow-blue-200">2</span>
                    Corporate Taxonomy
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5">Enterprise Structure</label>
                      <select className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white shadow-inner appearance-none cursor-pointer" value={formData.companyType} onChange={e => setFormData({...formData, companyType: e.target.value})}>
                        {['Individual', 'Proprietorship', 'Partnership', 'Private Limited (Pvt Ltd)', 'Public Limited', 'Trust', 'Cooperative', 'Other'].map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Branding Namespace</label>
                      <input required className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner" value={formData.brandName} onChange={e => setFormData({...formData, brandName: e.target.value})} placeholder="e.g. Beauzead Elite" />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Registry Identification</label>
                      <input 
                        required={!['Individual', 'Proprietorship'].includes(formData.companyType)} 
                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner" 
                        value={formData.regNo} 
                        onChange={e => setFormData({...formData, regNo: e.target.value})} 
                        placeholder="Registry ID"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-white">
                   <h2 className="text-xl font-black text-gray-900 mb-10 border-b border-slate-50 pb-8 uppercase tracking-[0.2em]">Taxation Interface</h2>
                   <div className="space-y-4">
                      <div className="relative border-2 border-dashed border-blue-600/20 bg-blue-50/50 rounded-[3rem] p-16 flex flex-col items-center justify-center hover:bg-blue-100/50 transition-all cursor-pointer group shadow-inner">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload('taxDoc', e)} />
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-8 group-hover:scale-110 transition-transform">
                          <span className="text-4xl">📁</span>
                        </div>
                        <p className="text-[12px] font-black text-blue-600 uppercase tracking-[0.4em]">{files.taxDoc ? files.taxDoc.name : 'Deploy Certificate'}</p>
                      </div>
                   </div>
                </div>

                <div className="flex justify-end pt-12">
                   <button type="submit" className="w-full md:w-auto bg-[#0052cc] text-white px-16 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] shadow-[0_25px_50px_-12px_rgba(0,82,204,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-6">
                      <span>Synchronize Next Node</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5-5 5M6 7l5 5-5 5" strokeWidth="3.5"/></svg>
                   </button>
                </div>
              </form>
            </div>
          )}

          {step === 'bank' && (
            <div className="bg-white p-14 rounded-[4rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.2)] border border-white animate-fade-in max-w-2xl mx-auto overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-3 bg-gray-900"></div>
              <div className="text-center mb-12">
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-[0.2em]">Payout Architecture</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">Stage 03: Financial Settlement</p>
              </div>

              <form onSubmit={handleFinalSubmit} className="space-y-10">
                <div className="space-y-10">
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-focus-within:text-blue-600 transition-colors">Holder Identity Protocol</label>
                    <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-gray-900 focus:bg-white transition-all shadow-inner" value={formData.bankAccountName} onChange={e => setFormData({...formData, bankAccountName: e.target.value})} />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-focus-within:text-blue-600 transition-colors">Target Account Index</label>
                    <input required type="password" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-gray-900 focus:bg-white transition-all shadow-inner" value={formData.bankAccountNumber} onChange={e => setFormData({...formData, bankAccountNumber: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div className="group">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-focus-within:text-blue-600 transition-colors">Routing / Swift Code</label>
                      <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-gray-900 focus:bg-white transition-all shadow-inner" value={formData.ifscCode} onChange={e => setFormData({...formData, ifscCode: e.target.value})} />
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-focus-within:text-blue-600 transition-colors">Institutional Hub</label>
                      <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-gray-900 focus:bg-white transition-all shadow-inner" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50/80 p-8 rounded-[2.5rem] border border-orange-100/50 backdrop-blur-sm shadow-inner">
                  <p className="text-[10px] text-orange-800 font-black uppercase tracking-[0.25em] leading-relaxed text-center italic">
                    By submitting, you authorize Beauzead to synchronize this financial node with our global settlement ledger.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-10">
                  <button type="button" onClick={() => setStep('business')} className="flex-1 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-gray-900 transition-colors bg-slate-100/50 rounded-2xl">Backtrack</button>
                  <button 
                    disabled={loading}
                    type="submit" 
                    className="flex-[2] bg-gray-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.5em] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-6"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-3 border-t-transparent border-white rounded-full animate-spin"></div>
                        <span>Syncing Node...</span>
                      </>
                    ) : 'Finalize Registry'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerSignup;