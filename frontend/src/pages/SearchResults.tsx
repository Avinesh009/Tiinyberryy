/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/useCart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import AnnouncementBar from '@/components/AnnouncementBar';

interface Product {
  productId: number;
  name: string;
  price: number;
  originalPrice: number | null;
  badge: string | null;
  image: string;
  category: string;
  description?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState<number[]>([]);
  const [added, setAdded] = useState<number[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const searchProducts = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Search error:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    searchProducts();
  }, [query]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const sessionId = localStorage.getItem('tiinyberry_session_id');
      if (!sessionId) return;
      
      try {
        const response = await fetch(`${API_URL}/wishlist`, {
          headers: { 'x-session-id': sessionId }
        });
        if (response.ok) {
          const data = await response.json();
          setWishlisted(data.map((item: any) => item.productId));
        }
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      }
    };
    fetchWishlist();
  }, []);

  const toggleWish = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const sessionId = localStorage.getItem('tiinyberry_session_id');
    if (!sessionId) return;

    const isWishlisted = wishlisted.includes(id);
    
    try {
      if (isWishlisted) {
        await fetch(`${API_URL}/wishlist/remove/${id}`, {
          method: 'DELETE',
          headers: { 'x-session-id': sessionId }
        });
        setWishlisted(wishlisted.filter(x => x !== id));
      } else {
        await fetch(`${API_URL}/wishlist/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-session-id': sessionId
          },
          body: JSON.stringify({ productId: id })
        });
        setWishlisted([...wishlisted, id]);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const handleAdd = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await addToCart(product.productId, 1);
    if (success) {
      setAdded((prev) => [...prev, product.productId]);
      setTimeout(() => setAdded((prev) => prev.filter((x) => x !== product.productId)), 1800);
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const defaultImage = "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=500&fit=crop";

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Navbar />
      <main className="pt-8 pb-16">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-heading font-light mb-2">
            Search Results
          </h1>
          <p className="text-muted-foreground mb-8">
            {loading ? 'Searching...' : `Found ${products.length} result(s) for "${query}"`}
          </p>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg mb-2">No products found</p>
              <p className="text-muted-foreground mb-6">
                Try searching with different keywords
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <div 
                  key={product.productId} 
                  className="group product-card cursor-pointer"
                  onClick={() => handleProductClick(product.productId)}
                >
                  <div className="relative overflow-hidden rounded-xl bg-muted" style={{ aspectRatio: "3/4" }}>
                    <img 
                      src={product.image || defaultImage} 
                      alt={product.name} 
                      loading="lazy" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {product.badge}
                      </span>
                    )}
                    <button
                      onClick={(e) => toggleWish(product.productId, e)}
                      className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 rounded-full transition-all opacity-0 group-hover:opacity-100 ${wishlisted.includes(product.productId) ? "text-red-500" : "text-muted-foreground"}`}
                    >
                      <Heart size={14} fill={wishlisted.includes(product.productId) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="mt-3.5">
                    <h3 className="text-base font-medium text-foreground leading-snug">
                      {product.name}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-sm font-bold text-primary">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          Rs. {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleAdd(product, e)}
                      className={`w-full mt-3 py-2 text-xs font-bold uppercase tracking-wide rounded-sm border transition-all duration-300 ${
                        added.includes(product.productId) 
                          ? "bg-primary border-primary text-primary-foreground" 
                          : "border-border text-muted-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground"
                      }`}
                    >
                      {added.includes(product.productId) ? "Added! ✓" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default SearchResults;