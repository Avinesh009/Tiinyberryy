import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const products = [
  { 
    productId: 1, 
    name: "New Born Essential Kit", 
    price: 1299, 
    originalPrice: 1599, 
    badge: "Bestseller", 
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=800&fit=crop", 
    images: [
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=800&fit=crop"
    ],
    colors: [
      {
        name: "Pink",
        code: "#FFB6C1",
        images: [
          "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=600&h=800&fit=crop"
        ]
      },
      {
        name: "Blue",
        code: "#87CEEB",
        images: [
          "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=800&fit=crop"
        ]
      },
      {
        name: "Yellow",
        code: "#FFD700",
        images: [
          "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=800&fit=crop"
        ]
      }
    ],
    category: "newborn", 
    age: "0-3", 
    description: "Complete newborn care kit with organic cotton essentials",
    sizes: ["0-3 months", "3-6 months"],
    material: "100% Organic Cotton",
    care: "Machine wash cold",
    inStock: true,
    stockQuantity: 50
  },
  { 
    productId: 2, 
    name: "Organic Cotton Jabla Set", 
    price: 599, 
    originalPrice: 799, 
    badge: "Bestseller", 
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=800&fit=crop", 
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=800&fit=crop"
    ],
    colors: [
      {
        name: "White",
        code: "#FFFFFF",
        images: [
          "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=600&h=800&fit=crop"
        ]
      },
      {
        name: "Cream",
        code: "#FFFDD0",
        images: [
          "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=800&fit=crop"
        ]
      }
    ],
    category: "newborn", 
    age: "0-3", 
    description: "Soft organic cotton jablas for newborns",
    sizes: ["0-3 months", "3-6 months", "6-9 months"],
    material: "100% Organic Cotton",
    care: "Gentle machine wash",
    inStock: true,
    stockQuantity: 100
  },
  { 
    productId: 3, 
    name: "Muslin Summer Frock", 
    price: 749, 
    originalPrice: 949, 
    badge: null, 
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&h=800&fit=crop", 
    images: [
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=800&fit=crop"
    ],
    colors: [
      {
        name: "Pink",
        code: "#FFB6C1",
        images: [
          "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=600&h=800&fit=crop"
        ]
      },
      {
        name: "Lavender",
        code: "#E6E6FA",
        images: [
          "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&h=800&fit=crop"
        ]
      },
      {
        name: "Mint",
        code: "#98FB98",
        images: [
          "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=800&fit=crop",
          "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=800&fit=crop"
        ]
      }
    ],
    category: "clothing", 
    age: "3-6", 
    description: "Light and airy summer frock",
    sizes: ["3-6 months", "6-9 months", "9-12 months"],
    material: "Muslin Cotton",
    care: "Machine wash",
    inStock: true,
    stockQuantity: 75
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tiinyberry');
    console.log('Connected to MongoDB');
    
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`✅ Inserted ${products.length} products with color images`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();