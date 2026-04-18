/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, ChevronDown, LogOut, Mail, Package } from 'lucide-react';
import { useCart } from '@/context/useCart';
import EmailOTPLogin from './EmailOTPLogin';
import SearchModal from './SearchModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
   const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const { cartCount } = useCart();
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('tiinyberry_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Fetch subcategories for navbar
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const response = await fetch(`${API_URL}/subcategories`);
      const data = await response.json();
      if (data.success) {
        setSubcategories(data.subcategories);
      }
    } catch (error) {
      console.error('Fetch subcategories error:', error);
    }
  };

  const handleLogin = (userData: any, orders: any[]) => {
    setUser(userData);
    if (orders && orders.length > 0) {
      localStorage.setItem('tiinyberry_orders', JSON.stringify(orders));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tiinyberry_token');
    localStorage.removeItem('tiinyberry_user');
    localStorage.removeItem('tiinyberry_email');
    localStorage.removeItem('tiinyberry_orders');
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  // Get subcategories by category
  const getSubcategoriesByCategory = (category: string) => {
    return subcategories.filter(sub => sub.category === category);
  };

  // Get orders count
  const ordersCount = () => {
    const orders = localStorage.getItem('tiinyberry_orders');
    if (orders) {
      return JSON.parse(orders).length;
    }
    return 0;
  };

  const navItems = [
    {
      label: "New Born",
      category: "newborn",
      path: "/category/collection/newborn",
    },
    {
      label: "Bathing",
      category: "bathing",
      path: "/category/collection/bathing",
    },
    {
      label: "Clothing",
      category: "clothing",
      path: "/category/collection/clothing",
    },
    {
      label: "Thottil",
      category: "thottil",
      path: "/category/collection/thottil",
    },
    {
      label: "Bedding",
      category: "bedding",
      path: "/category/collection/bedding",
    },
    {
      label: "Nursery & Accessories",
      category: "accessories",
      path: "/category/collection/accessories",
    },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 border-b border-border backdrop-blur-sm">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="font-heading text-2xl md:text-3xl font-semibold tracking-tight text-foreground flex-shrink-0 cursor-pointer"
            >
              Tiiny <span className="text-primary">Berry</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const subItems = getSubcategoriesByCategory(item.category);
                return (
                  <div key={item.label} className="group relative">
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className="flex items-center gap-1 px-3 lg:px-4 h-[72px] text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                    >
                      {item.label}
                      {subItems.length > 0 && <ChevronDown size={12} className="transition-transform group-hover:rotate-180" />}
                    </button>
                    {subItems.length > 0 && (
                      <div className="absolute left-0 top-full w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="bg-white shadow-xl rounded-lg border border-border mt-1 overflow-hidden">
                          <div className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border bg-secondary/30">
                            {item.label}
                          </div>
                          <div className="max-h-96 overflow-y-auto">
                            {subItems.map((sub) => (
                              <button
                                key={sub._id}
                                onClick={() => handleNavigation(`/category/subcategory/${sub.name}`)}
                                className="w-full text-left block px-4 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-accent/30 transition-all hover:pl-5 border-b border-border/40 last:border-0"
                              >
                                {sub.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-0.5">
              {/* Search */}
              <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 text-muted-foreground hover:text-primary hover:bg-accent/40 rounded-full transition-all"
            aria-label="Search"
          >
            <Search size={19} />
          </button>

              {/* Email Login Button */}
              {user ? (
                <div className="relative group">
                  <button className="p-2.5 text-muted-foreground hover:text-primary hover:bg-accent/40 rounded-full transition-all flex items-center gap-1">
                    <User size={19} />
                    <span className="text-sm hidden md:inline">{user.name?.split(' ')[0] || 'Account'}</span>
                    <ChevronDown size={14} />
                  </button>
                  <div className="absolute right-0 top-full w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-white shadow-xl rounded-lg border border-border mt-1 overflow-hidden">
                      <button
                        onClick={() => handleNavigation('/profile')}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent transition-colors flex items-center gap-2"
                      >
                        <User size={14} />
                        My Profile
                      </button>
                      <button
                        onClick={() => handleNavigation('/orders')}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent transition-colors flex items-center gap-2"
                      >
                        <Package size={14} />
                        My Orders ({ordersCount()})
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogOut size={14} />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="p-2.5 text-muted-foreground hover:text-primary hover:bg-accent/40 rounded-full transition-all"
                  aria-label="Email Login"
                >
                  <User size={19} />
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={() => handleNavigation('/cart')}
                className="p-2.5 text-muted-foreground hover:text-primary hover:bg-accent/40 rounded-full transition-all relative"
                aria-label="Cart"
              >
                <ShoppingBag size={19} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-primary text-primary-foreground text-[0.55rem] font-bold rounded-full flex items-center justify-center px-1">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 w-80 bg-background h-full overflow-y-auto shadow-2xl flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-background">
              <span className="font-heading text-xl font-semibold text-foreground">
                Tiiny Berry
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 hover:bg-accent rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 pb-20">
              {navItems.map((item) => {
                const subItems = getSubcategoriesByCategory(item.category);
                const isOpen = openMobileMenu === item.label;
                return (
                  <div key={item.label} className="border-b border-border/60">
                    <button
                      onClick={() => {
                        if (subItems.length > 0) {
                          setOpenMobileMenu(isOpen ? null : item.label);
                        } else {
                          handleNavigation(item.path);
                        }
                      }}
                      className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-foreground hover:bg-accent/30 transition-colors"
                    >
                      {item.label}
                      {subItems.length > 0 && (
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      )}
                    </button>
                    {isOpen && subItems.length > 0 && (
                      <div className="bg-secondary/30 px-2 pb-3">
                        {/* Show "All {item.label}" option */}
                        <button
                          onClick={() => handleNavigation(item.path)}
                          className="w-full text-left block px-5 py-2.5 text-sm font-medium text-primary hover:bg-accent/40 rounded-md transition-all border-b border-border/30"
                        >
                          All {item.label}
                        </button>
                        {subItems.map((sub) => (
                          <button
                            key={sub._id}
                            onClick={() => handleNavigation(`/category/subcategory/${sub.name}`)}
                            className="w-full text-left block px-5 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-accent/40 rounded-md transition-all border-b border-border/30 last:border-0"
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      )}

      {/* Email OTP Login Modal */}
      <EmailOTPLogin
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />
        <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default Navbar;