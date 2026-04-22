/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { X, Mail, CheckCircle, AlertCircle, Send } from 'lucide-react';

interface EmailOTPLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any, orders: any[]) => void;
  message?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EmailOTPLogin = ({ isOpen, onClose, onLogin, message }: EmailOTPLoginProps) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && resendDisabled) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer, resendDisabled]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`${API_URL}/email-otp/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      console.log('Send OTP response:', data);
      
      if (data.success) {
        setSuccess('OTP sent to your email!');
        setStep('otp');
        setTimer(60);
        setResendDisabled(true);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/email-otp/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      
      const data = await response.json();
      console.log('Verify OTP response:', data);
      
      if (data.success) {
        localStorage.setItem('tiinyberry_token', data.token);
        localStorage.setItem('tiinyberry_user', JSON.stringify(data.user));
        localStorage.setItem('tiinyberry_email', email);
        
        if (data.orders && data.orders.length > 0) {
          localStorage.setItem('tiinyberry_orders', JSON.stringify(data.orders));
        }
        
        onLogin(data.user, data.orders || []);
        onClose();
        resetForm();
        window.location.reload();
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/email-otp/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('OTP resent to your email!');
        setTimer(60);
        setResendDisabled(true);
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('email');
    setEmail('');
    setOtp('');
    setError('');
    setSuccess('');
    setTimer(0);
    setResendDisabled(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md p-6 border border-purple-200/50 animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-purple-100 rounded-full transition-all duration-300 hover:scale-110"
        >
          <X size={20} className="text-gray-500 hover:text-purple-600" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
            <Mail size={28} className="text-purple-500" />
          </div>
          <h2 className="text-2xl font-heading font-light bg-gradient-to-r from-[#1e1b4b] to-[#5b21b6] bg-clip-text text-transparent">
            {step === 'email' ? 'Login with Email' : 'Enter OTP'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {step === 'email' 
              ? 'Enter your email address to get OTP' 
              : `OTP sent to ${email}`}
          </p>
        </div>
        
        {message && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-600 text-sm animate-fadeIn">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm animate-shake">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-600 text-sm animate-fadeIn">
            <CheckCircle size={16} />
            {success}
          </div>
        )}
        
        {step === 'email' ? (
          <form onSubmit={handleSendOTP} className="animate-fadeIn">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-[#1e1b4b]">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all bg-white/80"
                  placeholder="your@email.com"
                  autoFocus
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                We'll send a 6-digit OTP to this email address
              </p>
              <p className="text-xs text-purple-500 mt-1">
                ✓ One account per email address
              </p>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-purple-300/30 disabled:opacity-50 disabled:hover:scale-100 bg-gradient-to-r from-purple-500 via-purple-400 to-blue-400"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="animate-fadeIn">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-[#1e1b4b]">Enter 6-Digit OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all bg-white/80 text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                autoFocus
                required
              />
              <p className="text-xs text-gray-500 text-center mt-2">
                Check your email inbox (and spam folder)
              </p>
            </div>
            
            <div className="text-center mb-4">
              {timer > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend OTP in <span className="font-semibold text-purple-600">{timer}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendDisabled}
                  className="text-sm text-purple-500 hover:text-purple-600 hover:underline transition-all"
                >
                  Resend OTP
                </button>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-purple-300/30 disabled:opacity-50 disabled:hover:scale-100 bg-gradient-to-r from-purple-500 via-purple-400 to-blue-400"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
          </form>
        )}
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default EmailOTPLogin;