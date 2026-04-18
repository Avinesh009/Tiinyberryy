import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search products - MUST BE BEFORE /:id route
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.json([]);
    }
    
    const searchTerm = q.trim();
    const searchRegex = new RegExp(searchTerm, 'i');
    
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { category: searchRegex },
        { subcategory: searchRegex },
        { description: searchRegex }
      ]
    }).limit(20);
    
    res.json(products);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get products by age
router.get('/age/:age', async (req, res) => {
  try {
    const { age } = req.params;
    const products = await Product.find({ age });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by subcategory name
router.get('/subcategory/:subcategoryName', async (req, res) => {
  try {
    const { subcategoryName } = req.params;
    const decodedSubcategory = decodeURIComponent(subcategoryName);
    const products = await Product.find({ subcategory: decodedSubcategory });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by subcategory:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single product by ID - THIS COMES AFTER SPECIFIC ROUTES
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let product;
    
    // Check if id is a number (numeric productId)
    if (!isNaN(id)) {
      product = await Product.findOne({ productId: parseInt(id) });
    } else {
      // Try to find by MongoDB _id
      product = await Product.findById(id);
    }
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get product by productId (alternative)
router.get('/product/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let product;
    
    if (!isNaN(id)) {
      product = await Product.findOne({ productId: parseInt(id) });
    } else {
      product = await Product.findById(id);
    }
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get bestsellers
router.get('/bestsellers', async (req, res) => {
  try {
    const products = await Product.find({ badge: 'Bestseller' });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;