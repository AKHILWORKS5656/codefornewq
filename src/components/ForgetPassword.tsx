
import React, { useState } from 'react';
import { api } from '../mockApi';
import { AuthView } from '../types';

interface ForgetPasswordProps {
  onSetEmail: (email: string) => void;
  onNavigate: (view: AuthView) => void;
}

const ForgetPassword: React.FC<ForgetPasswordProps> = ({ onSetEmail, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const exists = await api.checkEmailExists(email);
      if (exists) {
        onSetEmail(email);
        onNavigate('forget_password_otp');
      } else {
        setError('No Account registered with this email.');
      }
    } catch (err) {
      setError('Error checking account. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
        <button onClick={() => onNavigate('login')} className="mb-6 text-gray-400 hover:text-gray-600 flex items-center text-sm font-medium">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
          Back to Login
        </button>

        <h2 className="text-2xl font-extrabold text-[#2874f0] mb-2">Reset Password</h2>
        <p className="text-gray-500 text-sm mb-6">Enter your registered email to receive an OTP.</p>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">{error}</div>}

        <form onSubmit={handleSendOtp} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-white px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2874f0] outline-none text-black font-medium"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2874f0] text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors shadow-lg disabled:bg-blue-300"
          >
            {loading ? 'Checking Account...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
