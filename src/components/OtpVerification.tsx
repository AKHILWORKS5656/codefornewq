import React, { useState, useEffect } from 'react';
import { api } from '../mockApi';

interface OtpVerificationProps {
  email: string;
  onVerify: (otp: string) => void;
  title: string;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ email, onVerify, title }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(30);
      setOtp(['', '', '', '', '', '']);
      setError('');
      alert('A security code has been regenerated for ' + email);
    }
  };

  const validate = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError('6-digit payload required.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await api.verifyOtp(email, code);
      onVerify(code);
    } catch (err: any) {
      setError(err.message || 'Handshake failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-100 text-center">
        <h2 className="text-2xl font-extrabold text-[#2874f0] mb-2">{title}</h2>
        <p className="text-gray-500 text-sm mb-8">Enter the code dispatched to <br/><span className="font-bold text-gray-800">{email}</span></p>

        {error && (
          <div className="mb-6 p-2 bg-red-50 text-red-600 text-xs rounded border border-red-100 uppercase font-black">
            {error}
          </div>
        )}

        <div className="flex justify-between gap-2 mb-8">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              maxLength={1}
              className="w-full h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-[#2874f0] focus:ring-0 outline-none transition-all bg-white text-black"
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
            />
          ))}
        </div>

        <div className="mb-8">
          <p className="text-sm text-gray-500">
            {timer > 0 ? (
              <span>Renew code in <span className="font-bold text-[#2874f0]">{timer}s</span></span>
            ) : (
              <button onClick={handleResend} className="text-[#2874f0] font-bold hover:underline">Resend Verification</button>
            )}
          </p>
        </div>

        <button
          onClick={validate}
          disabled={loading}
          className={`w-full text-white py-3 rounded-lg font-bold transition-all shadow-lg flex items-center justify-center space-x-2 ${
            loading ? 'bg-gray-400' : 'bg-[#2874f0] hover:bg-blue-600'
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              <span>Verifying...</span>
            </>
          ) : (
            'Authenticate Session'
          )}
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;