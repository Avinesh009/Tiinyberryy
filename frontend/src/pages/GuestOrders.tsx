import { useState, useEffect, useCallback } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const GuestOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const mobileNumber = localStorage.getItem('tiinyberry_mobile');

  const fetchOrders = useCallback(async () => {
    if (!mobileNumber) {
      window.location.href = '/';
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/otp/my-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber })
      });
      
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
        localStorage.setItem('tiinyberry_orders', JSON.stringify(data.orders));
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
    } finally {
      setLoading(false);
    }
  }, [mobileNumber]);

  useEffect(() => {
    if (!mobileNumber) {
      window.location.href = '/';
      return;
    }
    
    // Load from localStorage first
    const savedOrders = localStorage.getItem('tiinyberry_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
      setLoading(false);
    }
    
    fetchOrders();
  }, [mobileNumber, fetchOrders]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={20} className="text-yellow-500" />;
      case 'confirmed': return <CheckCircle size={20} className="text-green-500" />;
      case 'shipped': return <Truck size={20} className="text-blue-500" />;
      case 'delivered': return <CheckCircle size={20} className="text-green-600" />;
      default: return <Package size={20} className="text-purple-500" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'confirmed': return 'bg-green-50 text-green-700 border-green-200';
      case 'shipped': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5efff] via-[#e8f0fe] to-[#faf5ff]">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="inline-block rounded-full h-8 w-8 border-2 border-purple-300 border-t-purple-600 animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5efff] via-[#e8f0fe] to-[#faf5ff]">
      <Navbar />
      <main className="pt-8 pb-16">
        <div className="max-w-[1320px] mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-heading font-light mb-2 bg-gradient-to-r from-[#1e1b4b] to-[#5b21b6] bg-clip-text text-transparent">
            My Orders
          </h1>
          <p className="text-gray-500 mb-8">{orders.length} orders found</p>
          
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4 animate-float">
                <Package size={64} className="mx-auto text-purple-300" />
              </div>
              <p className="text-gray-500 text-lg mb-4">No orders found for this mobile number</p>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 rounded-full font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-purple-300/30 bg-gradient-to-r from-purple-500 via-purple-400 to-blue-400"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <div 
                  key={order._id} 
                  className="bg-white/70 backdrop-blur-md border border-purple-200/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1 animate-slideIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <p className="font-semibold text-lg text-[#1e1b4b]">Order #{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeClass(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-purple-100 pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                        </p>
                        <p className="font-semibold text-lg mt-1 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                          Total: ₹{order.total.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => window.location.href = `/order/${order._id}`}
                        className="px-4 py-2 rounded-full text-sm font-medium text-purple-600 border-2 border-purple-300 transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-400 hover:text-white hover:border-transparent hover:scale-105"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.4s ease forwards;
          opacity: 0;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default GuestOrders;