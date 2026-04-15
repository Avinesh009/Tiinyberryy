import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subcategory from '../models/Subcategory.js';

dotenv.config();

const subcategories = [
  // New Born Subcategories
  { name: "New Born Essential Kit", category: "newborn", path: "/category/collection/newborn", order: 1 },
  { name: "Organic Cotton Jablas & Nappies", category: "newborn", path: "/category/collection/newborn", order: 2 },
  { name: "Mittens & Booties", category: "newborn", path: "/category/collection/accessories", order: 3 },
  { name: "Muslin Hooded Towels", category: "newborn", path: "/category/collection/bathing", order: 4 },
  { name: "Cotton Wrap Bed", category: "newborn", path: "/category/collection/bedding", order: 5 },
  { name: "Receiving Towel", category: "newborn", path: "/category/collection/accessories", order: 6 },
  { name: "Muslin Reversible Blanket", category: "newborn", path: "/category/collection/bedding", order: 7 },
  { name: "Muslin Wipes", category: "newborn", path: "/category/collection/bathing", order: 8 },
  { name: "Thottil Starter Kit", category: "newborn", path: "/category/collection/thottil", order: 9 },
  { name: "Swaddles", category: "newborn", path: "/category/collection/bedding", order: 10 },
  { name: "Muslin Burp Cloth", category: "newborn", path: "/category/collection/accessories", order: 11 },
  { name: "Muslin Towels", category: "newborn", path: "/category/collection/bathing", order: 12 },
  
  // Clothing Subcategories
  { name: "Frocks", category: "clothing", path: "/category/collection/clothing", order: 1 },
  { name: "Boys Shirts", category: "clothing", path: "/category/collection/clothing", order: 2 },
  { name: "Comfy Wears (1–5 Yrs)", category: "clothing", path: "/category/collection/clothing", order: 3 },
  { name: "Comfy Wears (3–6 Months)", category: "clothing", path: "/category/collection/clothing", order: 4 },
  { name: "Comfy Wears (6–12 Months)", category: "clothing", path: "/category/collection/clothing", order: 5 },
  
  // Thottil Subcategories
  { name: "Thottil Starter Kit", category: "thottil", path: "/category/collection/thottil", order: 1 },
  { name: "Printed Thottil", category: "thottil", path: "/category/collection/thottil", order: 2 },
  { name: "Thottil & Net", category: "thottil", path: "/category/collection/thottil", order: 3 },
  { name: "Patched Thottil", category: "thottil", path: "/category/collection/thottil", order: 4 },
  { name: "Solid – Patched", category: "thottil", path: "/category/collection/thottil", order: 5 },
  { name: "Mosquito Net", category: "thottil", path: "/category/collection/thottil", order: 6 },
  { name: "Thottil Accessories", category: "thottil", path: "/category/collection/thottil", order: 7 },
  
  // Bathing Subcategories
  { name: "Muslin Hooded Towels", category: "bathing", path: "/category/collection/bathing", order: 1 },
  { name: "Muslin Towels", category: "bathing", path: "/category/collection/bathing", order: 2 },
  { name: "Muslin Wipes", category: "bathing", path: "/category/collection/bathing", order: 3 },
  
  // Bedding Subcategories
  { name: "Cotton Wrap Bed", category: "bedding", path: "/category/collection/bedding", order: 1 },
  { name: "Muslin Reversible Blanket", category: "bedding", path: "/category/collection/bedding", order: 2 },
  
  // Accessories Subcategories
  { name: "Receiving Towel", category: "accessories", path: "/category/collection/accessories", order: 1 },
  { name: "Muslin Burp Cloth", category: "accessories", path: "/category/collection/accessories", order: 2 }
];

const seedSubcategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tiinyberry');
    console.log('Connected to MongoDB');
    
    await Subcategory.deleteMany({});
    await Subcategory.insertMany(subcategories);
    console.log(`✅ Inserted ${subcategories.length} subcategories`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding subcategories:', error);
    process.exit(1);
  }
};

seedSubcategories();