import React, { useState } from 'react';

interface SellerForgotPasswordProps {
  onBackToLogin: () => void;
}

const SellerForgotPassword: React.FC<SellerForgotPasswordProps> = ({ onBackToLogin }) => {
  const [step, setStep] = useState<'input' | 'sent'>('input');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    setStep('sent');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[420px] overflow-hidden flex flex-col animate-fade-in">
        
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100 bg-[#f9fbff]/50">
          <h2 className="text-gray-700 text-lg font-medium w-full text-center">
            {step === 'input' ? 'Forgot Password?' : 'Reset Link Sent'}
          </h2>
          <button 
            onClick={onBackToLogin}
            className="text-gray-400 hover:text-gray-600 transition-colors absolute right-8"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 'input' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-gray-600 text-sm leading-relaxed">
                Enter your registered email ID or mobile number.
              </p>

              <div className="relative group">
                <input
                  type="text"
                  required
                  placeholder="Registered Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-blue-400 rounded-lg px-4 py-4 text-gray-800 text-sm font-medium outline-none placeholder:text-gray-400 focus:shadow-[0_0_0_1px_rgba(59,130,246,0.5)] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2874f0] text-white py-4 rounded-lg font-bold hover:bg-blue-600 transition-colors shadow-sm disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  'Send Password Reset link'
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-10 flex flex-col items-center">
              {/* Green Box */}
              <div className="bg-[#c6f1d6] rounded-xl p-8 w-full border border-green-100 flex flex-col items-center text-center space-y-6">
                {/* Checkmark Circle */}
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <p className="text-gray-700 text-sm font-medium leading-relaxed max-w-[280px]">
                  If an account matches in our system with the provided email address, you will soon receive an email with a link to reset the password.
                </p>
              </div>

              {/* Footer Link */}
              <button 
                onClick={onBackToLogin}
                className="text-[#2874f0] font-bold text-sm hover:underline"
              >
                Back to login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerForgotPassword;