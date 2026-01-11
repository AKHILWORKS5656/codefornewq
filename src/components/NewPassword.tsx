
import React, { useState } from 'react';
import { api } from '../mockApi';
import { AuthView } from '../types';

interface NewPasswordProps {
  email: string;
  onNavigate: (view: AuthView) => void;
}

const NewPassword: React.FC<NewPasswordProps> = ({ email, onNavigate }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Please create a secured password (Min 8 characters).');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.updatePassword(email, password);
      alert('Password updated successfully! Please login.');
      onNavigate('login');
    } catch (err) {
      setError('Failed to update password. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-extrabold text-[#2874f0] mb-2">Create New Password</h2>
        <p className="text-gray-500 text-sm mb-8">Choose a strong password for your account.</p>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              className="w-full bg-white px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2874f0] outline-none text-black font-medium"
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.888 9.888L2 2m11.38 11.38L22 22" /></svg>
              )}
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              className="w-full bg-white px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2874f0] outline-none text-black font-medium"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2874f0] text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors shadow-lg disabled:bg-blue-300"
          >
            {loading ? 'Updating...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
