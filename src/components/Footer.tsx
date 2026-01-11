
import React from 'react';
import { AuthView } from '../types';

interface FooterProps {
  onNavigate?: (view: AuthView) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#172337] text-gray-300 pt-16 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-gray-700 pb-12">
          
          {/* Brand & Address */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Brand & Address</h3>
            <div className="space-y-4">
              <p className="font-semibold text-white">Beauzead Store</p>
              <div className="flex items-start space-x-3 text-sm leading-relaxed">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>23, MK6 5HH<br />United Kingdom</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Contact Details</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center space-x-3 hover:text-white transition-colors cursor-pointer">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@beauzead.com</span>
              </div>
              <div className="flex items-center space-x-3 hover:text-white transition-colors cursor-pointer">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+44 7555 393 4997</span>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Legal Information</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate?.('terms_and_conditions')}
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block transform duration-200 text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('privacy_policy')}
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block transform duration-200 text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('refund_policy')}
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block transform duration-200 text-left"
                >
                  Refund Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('shipping_policy')}
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block transform duration-200 text-left"
                >
                  Shipping Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="p-3 bg-gray-700/50 hover:bg-[#2874f0] rounded-full transition-all text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.247 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.247-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.247-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.247 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="p-3 bg-gray-700/50 hover:bg-[#2874f0] rounded-full transition-all text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
        
        <div className="text-center text-xs text-gray-500 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Beauzead Store. All rights reserved.</p>
          <div className="flex space-x-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
            {/* Payment Icons Simulation */}
            <div className="w-10 h-6 bg-white rounded-sm"></div>
            <div className="w-10 h-6 bg-white rounded-sm"></div>
            <div className="w-10 h-6 bg-white rounded-sm"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
