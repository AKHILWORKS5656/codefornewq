
import React, { useState } from 'react';
import { User, ShippingAddress } from '../types';
import { COUNTRIES } from '../constants';
import { api } from '../mockApi';

interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  onBack: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Personal Info State
  const [name, setName] = useState(user.name);
  const [email] = useState(user.email); // Email usually isn't editable for security without verification
  const [country, setCountry] = useState(user.country);

  // Address State
  // Fix: Added missing required email property to ShippingAddress initializer to resolve TypeScript type mismatch
  const [address, setAddress] = useState<ShippingAddress>(user.address || {
    fullName: user.name,
    phone: '',
    email: user.email,
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
    country: user.country
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    try {
      const updatedUser = await api.updateUserProfile(user.id, {
        name,
        country,
        address
      });
      onUpdate(updatedUser);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">My Profile</h2>
          <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-1">Manage your account and delivery details</p>
        </div>
        <button 
          onClick={onBack}
          className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
        >
          Back to Home
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Information Card */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 bg-gray-50/30">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Personal Information</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                disabled
                className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-400 cursor-not-allowed outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Preferred Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              >
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Address Section Card */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 bg-gray-50/30">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Default Shipping Address</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Full Name (for delivery)</label>
                <input 
                  type="text" 
                  value={address.fullName}
                  onChange={(e) => setAddress({...address, fullName: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Contact Phone</label>
                <input 
                  type="tel" 
                  value={address.phone}
                  onChange={(e) => setAddress({...address, phone: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="+44 ..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Postcode</label>
                <input 
                  type="text" 
                  value={address.postcode}
                  onChange={(e) => setAddress({...address, postcode: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all uppercase"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Address Line 1</label>
                <input 
                  type="text" 
                  value={address.addressLine1}
                  onChange={(e) => setAddress({...address, addressLine1: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">City</label>
                <input 
                  type="text" 
                  value={address.city}
                  onChange={(e) => setAddress({...address, city: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Country</label>
                <select
                  value={address.country}
                  onChange={(e) => setAddress({...address, country: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            {success && (
              <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-100 animate-fade-in">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                <span className="text-[10px] font-black uppercase tracking-widest">Changes Saved</span>
              </div>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className={`px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center space-x-3 ${
              loading 
                ? 'bg-gray-200 text-gray-400 cursor-wait' 
                : 'bg-[#2874f0] text-white hover:bg-blue-600 active:scale-95 shadow-blue-500/20'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                <span>SAVE CHANGES</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
