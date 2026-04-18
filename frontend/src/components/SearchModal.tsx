import { useState, useEffect, useRef } from 'react';
import { X, Search, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Product {
  productId: number;
  name: string;
  price: number;
  originalPrice: number | null;
  badge: string | null;
  image: string;
  category: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Search products
  useEffect(() => {
    const searchProducts = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    
    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    saveRecentSearch(term);
    onClose();
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleProductClick = (productId: number) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-slide-in-down">
        {/* Search Input */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products... (e.g., jabla, frock, thottil)"
              className="flex-1 text-lg outline-none bg-transparent placeholder:text-muted-foreground"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : searchTerm ? (
            results.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No products found for "{searchTerm}"</p>
                <p className="text-sm text-muted-foreground mt-1">Try searching with different keywords</p>
              </div>
            ) : (
              <div>
                <div className="px-4 py-2 bg-gray-50 text-xs text-muted-foreground">
                  Found {results.length} result(s)
                </div>
                {results.map((product) => (
                  <div
                    key={product.productId}
                    onClick={() => handleProductClick(product.productId)}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-border"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=80&h=80&fit=crop';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-primary">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                        {product.badge && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        Category: {product.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : recentSearches.length > 0 ? (
            <div>
              <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
                <span className="text-xs text-muted-foreground">Recent Searches</span>
                <button onClick={clearRecentSearches} className="text-xs text-primary hover:underline">
                  Clear All
                </button>
              </div>
              {recentSearches.map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(term)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-border"
                >
                  <Search size={14} className="text-muted-foreground" />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Search for products</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try "jabla", "frock", "thottil", "towel"
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-gray-50">
          <p className="text-xs text-muted-foreground text-center">
            Press Enter to see all results
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;