import express from 'express';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tiinyberry_secret_key_2024';

const getCartQuery = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return { userId: decoded.userId };
    } catch(e) {}
  }
  
  let sessionId = req.headers['x-session-id'];
  if (!sessionId) {
    sessionId = randomUUID();
  }
  return { sessionId };
};

// Get cart
router.get('/', async (req, res) => {
  try {
    const query = getCartQuery(req);
    let cart = await Cart.findOne(query);
    
    if (!cart) {
      cart = new Cart({ ...query, items: [] });
      await cart.save();
    }
    
    res.json({ items: cart.items || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get cart count
router.get('/count', async (req, res) => {
  try {
    const query = getCartQuery(req);
    const cart = await Cart.findOne(query);
    const count = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add item to cart with size and color
router.post('/add', async (req, res) => {
  try {
    const { productId, quantity = 1, size = '', color = '', colorImage = '' } = req.body;
    
    console.log('Add to cart request:', { productId, quantity, size, color, colorImage });
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID required' });
    }
    
    const product = await Product.findOne({ productId: parseInt(productId) });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Check if size is required
    const hasSizes = product.sizes && product.sizes.length > 0 && product.sizes[0] !== 'One Size';
    
    if (hasSizes && !size) {
      return res.status(400).json({ error: 'Please select a size' });
    }
    
    // Validate size if provided
    if (hasSizes && size && !product.sizes.includes(size)) {
      return res.status(400).json({ error: 'Invalid size selected' });
    }
    
    const query = getCartQuery(req);
    let cart = await Cart.findOne(query);
    
    if (!cart) {
      cart = new Cart({ ...query, items: [] });
    }
    
    // Check if same product, same size, same color exists
    const existingIndex = cart.items.findIndex(
      item => String(item.productId) === String(productId) && 
              item.size === size && 
              item.color === color
    );
    
    // Use the color image if provided, otherwise use product image
    const imageToUse = colorImage || product.image;
    
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
      console.log('Updated existing item, new quantity:', cart.items[existingIndex].quantity);
    } else {
      cart.items.push({
        productId: String(productId),
        name: product.name,
        price: product.price,
        image: imageToUse,
        size: size,
        color: color,
        colorImage: colorImage,
        quantity
      });
      console.log('Added new item:', product.name, 'Color:', color, 'Size:', size, 'Image:', imageToUse);
    }
    
    await cart.save();
    
    const totalCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    res.json({ success: true, items: cart.items, count: totalCount });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update item quantity
router.put('/update/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    
    const query = getCartQuery(req);
    const cart = await Cart.findOne(query);
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(item => String(item.productId) === String(productId));
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    res.json({ success: true, items: cart.items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item from cart
router.delete('/remove/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const query = getCartQuery(req);
    const cart = await Cart.findOne(query);
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => String(item.productId) !== String(productId));
    await cart.save();
    
    res.json({ success: true, items: cart.items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear cart
router.delete('/clear', async (req, res) => {
  try {
    const query = getCartQuery(req);
    const cart = await Cart.findOne(query);
    
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    
    res.json({ success: true, items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Merge guest cart
router.post('/merge', async (req, res) => {
  try {
    const { sessionId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token || !sessionId) {
      return res.status(400).json({ error: 'Missing data' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    
    const guestCart = await Cart.findOne({ sessionId });
    let userCart = await Cart.findOne({ userId });
    
    if (!userCart) {
      userCart = new Cart({ userId, items: [] });
    }
    
    if (guestCart && guestCart.items.length > 0) {
      for (const guestItem of guestCart.items) {
        const existingIndex = userCart.items.findIndex(
          item => String(item.productId) === String(guestItem.productId) && 
                  item.size === guestItem.size && 
                  item.color === guestItem.color
        );
        
        if (existingIndex > -1) {
          userCart.items[existingIndex].quantity += guestItem.quantity;
        } else {
          userCart.items.push(guestItem);
        }
      }
      
      await userCart.save();
      await Cart.deleteOne({ sessionId });
    } else {
      await userCart.save();
    }
    
    res.json({ success: true, items: userCart.items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;