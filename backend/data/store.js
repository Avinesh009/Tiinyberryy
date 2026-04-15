import { v4 as uuidv4 } from 'uuid';

// Complete Product Catalog
export const products = [
  // Newborn Essentials
  { id: 1, name: "New Born Essential Kit", price: 1299, originalPrice: 1599, badge: "Bestseller", image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=500&fit=crop", category: "newborn", age: "0-3", description: "Complete newborn care kit" },
  { id: 2, name: "Organic Cotton Jabla Set", price: 599, originalPrice: 799, badge: "Bestseller", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=500&fit=crop", category: "newborn", age: "0-3", description: "Soft organic cotton jablas" },
  
  // Clothing
  { id: 3, name: "Muslin Summer Frock", price: 749, originalPrice: 949, badge: null, image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=500&fit=crop", category: "clothing", age: "3-6", description: "Light and airy summer frock" },
  { id: 4, name: "Boys Casual Shirt", price: 649, originalPrice: 849, badge: null, image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop", category: "clothing", age: "6-12", description: "Stylish casual shirt" },
  { id: 5, name: "Boys Co-Ord Set", price: 1199, originalPrice: 1499, badge: "New", image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=500&fit=crop", category: "clothing", age: "1-10", description: "Matching co-ord set" },
  
  // Thottil
  { id: 6, name: "Printed Thottil", price: 1899, originalPrice: 2499, badge: "Bestseller", image: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=400&h=500&fit=crop", category: "thottil", age: "0-3", description: "Traditional printed thottil" },
  { id: 7, name: "Thottil Starter Kit", price: 2999, originalPrice: 3999, badge: "New", image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=500&fit=crop", category: "thottil", age: "0-3", description: "Complete thottil starter kit" },
  
  // Bathing
  { id: 8, name: "Muslin Hooded Towel", price: 499, originalPrice: 699, badge: "Bestseller", image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=500&fit=crop", category: "bathing", age: "0-3", description: "Soft muslin hooded towel" },
  { id: 9, name: "Muslin Towels Set", price: 399, originalPrice: 599, badge: null, image: "https://images.unsplash.com/photo-1544717305-996b815c338c?w=400&h=500&fit=crop", category: "bathing", age: "0-3", description: "Set of 3 muslin towels" },
  { id: 10, name: "Muslin Wipes Pack", price: 249, originalPrice: 399, badge: "New", image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop", category: "bathing", age: "0-3", description: "Reusable muslin wipes" },
  
  // Bedding
  { id: 11, name: "Cotton Wrap Bed", price: 1299, originalPrice: 1699, badge: "Bestseller", image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=500&fit=crop", category: "bedding", age: "0-3", description: "Comfortable cotton wrap bed" },
  { id: 12, name: "Muslin Reversible Blanket", price: 899, originalPrice: 1199, badge: null, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=500&fit=crop", category: "bedding", age: "0-3", description: "Dual-sided muslin blanket" },
  
  // Accessories
  { id: 13, name: "Mittens & Booties Set", price: 299, originalPrice: 399, badge: null, image: "https://images.unsplash.com/photo-1544717305-996b815c338c?w=400&h=500&fit=crop", category: "accessories", age: "0-3", description: "Protective mittens and booties" },
  { id: 14, name: "Muslin Burp Cloth Set", price: 299, originalPrice: 449, badge: null, image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400&h=500&fit=crop", category: "accessories", age: "0-3", description: "Set of 4 muslin burp cloths" },
  { id: 15, name: "Receiving Towel", price: 349, originalPrice: 499, badge: "New", image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=500&fit=crop", category: "accessories", age: "0-3", description: "Soft receiving towel" },
  
  // Essentials
  { id: 16, name: "Essential Baby Kit", price: 999, originalPrice: 1299, badge: "Bestseller", image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=500&fit=crop", category: "essentials", age: "0-3", description: "Complete baby essentials" },
];

// In-memory storage for user sessions
const sessions = new Map();

export const getSession = (sessionId) => {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, { cartItems: [], wishlistItems: [] });
  }
  return sessions.get(sessionId);
};

export const updateSession = (sessionId, data) => {
  const session = getSession(sessionId);
  sessions.set(sessionId, { ...session, ...data });
  return sessions.get(sessionId);
};

export const generateSessionId = () => uuidv4();

// Helper functions for filtering
export const getProductsByAge = (age) => {
  return products.filter(p => p.age === age);
};

export const getProductsByCategory = (category) => {
  return products.filter(p => p.category === category);
};

export const getProductsByCollection = (collection) => {
  if (collection === 'thottil') {
    return products.filter(p => p.category === 'thottil');
  }
  return products;
};