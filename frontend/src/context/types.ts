export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  colorImage?: string;
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  loading: boolean;
  addToCart: (productId: number, quantity: number, size?: string, color?: string, colorImage?: string) => Promise<boolean>;
  updateQuantity: (productId: number, quantity: number, size?: string) => Promise<boolean>;
  removeFromCart: (productId: number, size?: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  mergeGuestCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}