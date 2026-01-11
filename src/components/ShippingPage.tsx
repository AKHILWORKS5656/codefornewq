
import React, { useState, useEffect } from 'react';
import { ShippingAddress, Country } from '../types';
import CheckoutSteps from './CheckoutSteps';
import { COUNTRIES } from '../constants';
import { api } from '../mockApi';

interface ShippingPageProps {
  onContinue: (address: ShippingAddress, deliveryCharge: number) => void;
  onBack: () => void;
}

const ShippingPage: React.FC<ShippingPageProps> = ({ onContinue, onBack }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [showSecondaryPhone, setShowSecondaryPhone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    secondaryPhone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    postcode: '',
    country: COUNTRIES[0].name
  });

  // Load existing user address if available
  useEffect(() => {
    const savedUser = localStorage.getItem('beauzead_current_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.address) {
        setAddress(user.address);
        const countryMatch = COUNTRIES.find(c => c.name === user.address.country);
        if (countryMatch) setSelectedCountry(countryMatch);
        if (user.address.secondaryPhone) setShowSecondaryPhone(true);
      } else {
        setAddress(prev => ({ ...prev, fullName: user.name, email: user.email }));
      }
    }
  }, []);

  const handleCountryChange = (countryName: string) => {
    const country = COUNTRIES.find(c => c.name === countryName) || COUNTRIES[0];
    setSelectedCountry(country);
    setAddress(prev => ({ ...prev, country: countryName }));
    // Reset postcode/phone errors on country change
    setErrors(prev => {
      const { postcode, phone, ...rest } = prev;
      return rest;
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Postcode Validation
    if (!selectedCountry.postcodeRegex.test(address.postcode)) {
      newErrors.postcode = `Invalid postcode for ${selectedCountry.name}`;
    }

    // Phone Validation
    const cleanPhone = address.phone.replace(/\D/g, '');
    if (cleanPhone.length < selectedCountry.phoneLength) {
      newErrors.phone = `Phone number must be at least ${selectedCountry.phoneLength} digits`;
    }

    // Email Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) {
      newErrors.email = "Invalid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const savedUser = localStorage.getItem('beauzead_current_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        await api.saveShippingAddress(user.id, address);
      }
      onContinue(address, selectedCountry.shippingFee);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <CheckoutSteps currentStep={1} />
      
      <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Shipping Destination</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isSaving ? 'bg-orange-400 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {isSaving ? 'Saving...' : 'Syncing Live'}
            </span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Section 1: Country & Contact */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">01. Location & Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Select Country</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                  value={address.country}
                  onChange={e => handleCountryChange(e.target.value)}
                >
                  {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Recipient Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Full Name"
                  value={address.fullName}
                  onChange={e => setAddress({...address, fullName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Notification Email</label>
                <input 
                  required
                  type="email" 
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-4 text-sm font-bold outline-none focus:ring-2 ${errors.email ? 'border-red-300 ring-red-50' : 'border-gray-100 focus:ring-blue-100'}`}
                  placeholder="shipping-updates@example.com"
                  value={address.email}
                  onChange={e => setAddress({...address, email: e.target.value})}
                />
                {errors.email && <p className="text-[9px] text-red-500 font-bold mt-1 uppercase tracking-wider">{errors.email}</p>}
              </div>

              <div className="md:col-span-1">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Primary Phone</label>
                <div className="flex">
                  <span className="bg-gray-200 text-gray-600 px-4 py-4 rounded-l-xl text-sm font-black flex items-center border-r border-gray-300">
                    {selectedCountry.phonePrefix}
                  </span>
                  <input 
                    required
                    type="tel" 
                    className={`w-full bg-gray-50 border rounded-r-xl px-4 py-4 text-sm font-bold outline-none focus:ring-2 ${errors.phone ? 'border-red-300 ring-red-50' : 'border-gray-100 focus:ring-blue-100'}`}
                    placeholder={`e.g. 7890 000 000`}
                    value={address.phone}
                    onChange={e => setAddress({...address, phone: e.target.value.replace(/\D/g, '')})}
                  />
                </div>
                {errors.phone && <p className="text-[9px] text-red-500 font-bold mt-1 uppercase tracking-wider">{errors.phone}</p>}
              </div>

              <div className="flex items-end">
                {!showSecondaryPhone ? (
                  <button 
                    type="button"
                    onClick={() => setShowSecondaryPhone(true)}
                    className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 transition-all mb-2"
                  >
                    + Add Secondary Number
                  </button>
                ) : (
                  <div className="w-full animate-fade-in">
                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Secondary Phone (Optional)</label>
                    <input 
                      type="tel" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="Alternate number"
                      value={address.secondaryPhone}
                      onChange={e => setAddress({...address, secondaryPhone: e.target.value})}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Address Details */}
          <div className="space-y-6 pt-4 border-t border-gray-50">
            <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">02. Address Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Street Address</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="House No, Street, Building Name"
                  value={address.addressLine1}
                  onChange={e => setAddress({...address, addressLine1: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Landmark</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Near Mall, Station, etc."
                  value={address.landmark}
                  onChange={e => setAddress({...address, landmark: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">City / Town</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="City"
                  value={address.city}
                  onChange={e => setAddress({...address, city: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Postcode / Zip</label>
                <input 
                  required
                  type="text" 
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-4 text-sm font-bold outline-none focus:ring-2 uppercase ${errors.postcode ? 'border-red-300 ring-red-50' : 'border-gray-100 focus:ring-blue-100'}`}
                  placeholder="Postcode"
                  value={address.postcode}
                  onChange={e => setAddress({...address, postcode: e.target.value})}
                />
                {errors.postcode && <p className="text-[9px] text-red-500 font-bold mt-1 uppercase tracking-wider">{errors.postcode}</p>}
              </div>

              <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Shipping Rate</p>
                  <p className="text-sm font-black">Beauzead Priority</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black">
                    {selectedCountry.symbol}{selectedCountry.shippingFee.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
            <button 
              type="button"
              onClick={onBack}
              className="text-xs font-black text-gray-300 uppercase tracking-widest hover:text-gray-900 transition-colors"
            >
              Go Back
            </button>
            
            <button 
              type="submit"
              disabled={isSaving}
              className={`px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center space-x-3 ${
                isSaving ? 'bg-gray-200 text-gray-400 cursor-wait' : 'bg-black text-white hover:scale-105 active:scale-95'
              }`}
            >
              <span>{isSaving ? 'VALIDATING...' : 'CONTINUE TO PAYMENT'}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5-5 5M6 7l5 5-5 5" strokeWidth="3"/></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;
