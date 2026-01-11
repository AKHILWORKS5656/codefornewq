import React, { useState } from 'react';
import { User } from '../types';

interface AuthFormProps {
  onSuccess: (user: User) => void;
  onCancel: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, onCancel }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const lowerEmail = email.toLowerCase();

    if (isLogin) {
      if (lowerEmail === 'admin@admin.com' && password === 'admin@123') {
        onSuccess({ 
          id: '1', email, name: 'Beauzead Admin', role: 'admin',
          country: 'United Kingdom', currency: 'GBP', currencySymbol: '£', status: 'active', createdAt: new Date().toISOString()
        });
      } else if (lowerEmail === 'user@user.com' && password === 'user@123') {
        onSuccess({ 
          id: '2', email, name: 'Demo User', role: 'user',
          country: 'United Kingdom', currency: 'GBP', currencySymbol: '£', status: 'active', createdAt: new Date().toISOString()
        });
      } else if ((lowerEmail === 'seller@seller.com' || lowerEmail === 'seller@sellser.com') && password === 'seller@123') {
        onSuccess({ 
          id: '3', email: 'seller@seller.com', name: 'Beauzead Partner', role: 'seller',
          country: 'United Kingdom', currency: 'GBP', currencySymbol: '£', status: 'active', createdAt: new Date().toISOString()
        });
      } else {
        setError('Invalid email or password. Hint: seller@seller.com / seller@123');
      }
    } else {
      onSuccess({ 
        id: Date.now().toString(), email, name, role: 'user',
        country: 'United Kingdom', currency: 'GBP', currencySymbol: '£', status: 'active', createdAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Login to access your profile' : 'Join our premium shopping platform'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#2874f0] focus:border-[#2874f0] focus:z-10 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#2874f0] focus:border-[#2874f0] focus:z-10 sm:text-sm"
                placeholder="email@example.com"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#2874f0] focus:border-[#2874f0] focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.888 9.888L2 2m11.38 11.38L22 22" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-[#2874f0] focus:ring-[#2874f0] border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-[#2874f0] hover:text-blue-500">Forgot your password?</a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-[#2874f0] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2874f0] transition-all"
            >
              {isLogin ? 'Sign in' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-medium text-[#2874f0] hover:text-blue-500"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
        
        <div className="mt-4 text-center">
          <button onClick={onCancel} className="text-sm text-gray-400 hover:text-gray-600">Cancel and Return Home</button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;