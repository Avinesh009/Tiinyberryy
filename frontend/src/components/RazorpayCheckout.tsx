/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

interface RazorpayCheckoutProps {
  amount: number;
  onCreateOrder: () => Promise<string>;
  
  onSuccess: (response: any, orderId: string) => void;
  
  onFailure: (error: any) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const RazorpayCheckout = ({ amount, onCreateOrder, onSuccess, onFailure }: RazorpayCheckoutProps) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert('Failed to load payment gateway. Please refresh and try again.');
        setLoading(false);
        return;
      }
      
      const orderId = await onCreateOrder();
      console.log('Pending order created:', orderId);
      
      const orderResponse = await fetch(`${API_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          receipt: `order_${orderId}`
        })
      });
      
      const orderData = await orderResponse.json();
      
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }
      
      const user = JSON.parse(localStorage.getItem('tiinyberry_user') || '{}');
      
      // Updated theme color to match purple/blue theme
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Aazhi',
        description: 'Baby & Toddler Clothing',
        image: '/logo.png',
        order_id: orderData.order_id,
        handler: async (response: any) => {
          console.log('Payment handler response:', response);
          onSuccess(response, orderId);
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.mobileNumber || ''
        },
        theme: {
          color: '#8b5cf6'  // Changed to light purple to match theme
        },
        modal: {
          ondismiss: () => {
            console.log('Checkout closed');
            setLoading(false);
          }
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      onFailure(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full py-3 rounded-full font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-purple-300/30 disabled:opacity-50 disabled:hover:scale-100 bg-gradient-to-r from-purple-500 via-purple-400 to-blue-400"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        `Pay ₹${amount.toLocaleString()}`
      )}
    </button>
  );
};

export default RazorpayCheckout;