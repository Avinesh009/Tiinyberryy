import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
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
    console.error('Error fetching products by age:', error);
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
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single product by ID (supports both MongoDB _id and numeric productId)
router.get('/product/:id', async (req, res) => {
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

// Alternative route for product by ID (supports both)
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

// Get bestsellers
router.get('/bestsellers', async (req, res) => {
  try {
    const products = await Product.find({ badge: 'Bestseller' });
    res.json(products);
  } catch (error) {
    console.error('Error fetching bestsellers:', error);
    res.status(500).json({ message: error.message });
  }
});
// Get products by subcategory
router.get('/subcategory/:subcategory', async (req, res) => {
  try {
    const { subcategory } = req.params;
    const products = await Product.find({ subcategory });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;