import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Zap, TrendingDown, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/useCart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import BackToTop from '@/components/BackToTop';

interface ComboProduct {
  productId: {
    _id: string;
    name: string;
    price: number;
    image: string;
    productId: number;
    description?: string;
  };
  quantity: number;
}

interface ComboOffer {
  _id: string;
  name: string;
  description: string;
  products: ComboProduct[];
  comboPrice: number;
  originalPrice: number;
  discountPercent: number;
  badge: string;
  image: string;
  isActive: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ComboDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [combo, setCombo] = useState<ComboOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchCombo();
  }, [id]);

  const fetchCombo = async () => {
    try {
      const response = await fetch(`${API_URL}/combos/${id}`);
      const data = await response.json();
      if (data.success) {
        setCombo(data.combo);
      }
    } catch (error) {
      console.error('Failed to fetch combo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComboToCart = async () => {
    if (!combo) return;
    setAddingToCart(true);
    
    try {
      for (const item of combo.products) {
        const numericProductId = item.productId?.productId;
        
        if (!numericProductId) {
          console.error('Missing productId for:', item.productId?.name);
          continue;
        }
        
        const success = await addToCart(
          numericProductId,
          item.quantity,
          '',
          '',
          ''
        );
        
        if (!success) {
          throw new Error(`Failed to add ${item.productId.name} to cart`);
        }
      }
      
      window.dispatchEvent(new Event('cartUpdated'));
      
      alert(`${combo.name} added to cart successfully!`);
      navigate('/cart');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Failed to add combo to cart:', error);
      alert(error.message || 'Failed to add combo to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5efff] via-[#e8f0fe] to-[#faf5ff]">
        <AnnouncementBar />
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="inline-block rounded-full h-8 w-8 border-2 border-purple-300 border-t-purple-600 animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!combo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5efff] via-[#e8f0fe] to-[#faf5ff]">
        <AnnouncementBar />
        <Navbar />
        <div className="text-center py-20">
          <h2 className="text-2xl font-heading bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Combo not found
          </h2>
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 text-purple-500 hover:text-purple-600 hover:underline transition-all"
          >
            Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const savings = combo.originalPrice - combo.comboPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5efff] via-[#e8f0fe] to-[#faf5ff]">
      <AnnouncementBar />
      <Navbar />
      <main className="pt-8 pb-16">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-purple-500 transition-all duration-300 mb-6 hover:-translate-x-1"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100/30 to-blue-100/30 shadow-lg">
                <img
                  src={combo.image || 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=600&fit=crop'}
                  alt={combo.name}
                  className="w-full aspect-square object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                  <Zap size={16} />
                  Save {combo.discountPercent}%
                </div>
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="mb-2">
                <span className="inline-block bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {combo.badge || 'Combo Offer'}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-heading font-light mb-3 bg-gradient-to-r from-[#1e1b4b] to-[#5b21b6] bg-clip-text text-transparent">
                {combo.name}
              </h1>
              <p className="text-gray-600 leading-relaxed mb-6">{combo.description}</p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    ₹{combo.comboPrice.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-400 line-through">₹{combo.originalPrice.toLocaleString()}</span>
                  <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
                    Save {combo.discountPercent}%
                  </span>
                </div>
                <p className="text-sm text-green-600 mt-1">You save ₹{savings.toLocaleString()}</p>
              </div>

              {/* Savings Breakdown */}
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <h3 className="font-semibold mb-2 text-green-700">Savings Breakdown</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Buying separately:</span>
                    <span className="text-gray-700">₹{combo.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-700">Combo price:</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                      ₹{combo.comboPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600 font-semibold pt-1 border-t border-green-200">
                    <span>Total savings:</span>
                    <span>₹{savings.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-[#1e1b4b]">Products in this combo:</h3>
                <div className="space-y-3">
                  {combo.products.map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-purple-100 transition-all duration-300 hover:shadow-md hover:bg-white/70">
                      <img
                        src={item.productId.image}
                        alt={item.productId.name}
                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-[#1e1b4b]">{item.productId.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        <p className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                          ₹{item.productId.price.toLocaleString()}
                        </p>
                      </div>
                      <CheckCircle size={20} className="text-green-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleAddComboToCart}
                disabled={addingToCart}
                className="w-full py-3 rounded-full font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-purple-300/30 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 text-lg bg-gradient-to-r from-purple-500 via-purple-400 to-blue-400"
              >
                <ShoppingBag size={20} />
                {addingToCart ? 'Adding to Cart...' : `Add Combo to Cart • ₹${combo.comboPrice.toLocaleString()}`}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Add entire combo to cart with one click. You can modify quantities in cart.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default ComboDetails;