  import express from 'express';
  import { randomUUID } from 'crypto';
  import Wishlist from '../models/Wishlist.js';
  import Product from '../models/Product.js';

  const router = express.Router();

  const getSessionId = (req) => {
    let sessionId = req.headers['x-session-id'];
    if (!sessionId) {
      sessionId = randomUUID();
    }
    return sessionId;
  };

  // Get wishlist
  router.get('/', async (req, res, next) => {
    try {
      const sessionId = getSessionId(req);
      let wishlist = await Wishlist.findOne({ sessionId });
      
      if (!wishlist) {
        wishlist = await Wishlist.create({ sessionId, items: [] });
      }
      
      res.json(wishlist.items || []);
    } catch (error) {
      next(error);
    }
  });

  // Add to wishlist
  router.post('/add', async (req, res, next) => {
    try {
      const sessionId = getSessionId(req);
      const { productId } = req.body;
      
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      let wishlist = await Wishlist.findOne({ sessionId });
      if (!wishlist) {
        wishlist = await Wishlist.create({ sessionId, items: [] });
      }
      
      const exists = wishlist.items.some(
        item => item.productId.toString() === productId
      );
      
      if (!exists) {
        wishlist.items.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          originalPrice: product.originalPrice,
          badge: product.badge
        });
        await wishlist.save();
      }
      
      res.json({ success: true, wishlist: wishlist.items });
    } catch (error) {
      next(error);
    }
  });

  // Remove from wishlist
  router.delete('/remove/:productId', async (req, res, next) => {
    try {
      const sessionId = getSessionId(req);
      const productId = req.params.productId;
      
      let wishlist = await Wishlist.findOne({ sessionId });
      if (!wishlist) {
        return res.status(404).json({ message: 'Wishlist not found' });
      }
      
      wishlist.items = wishlist.items.filter(
        item => item.productId.toString() !== productId
      );
      
      await wishlist.save();
      res.json({ success: true, wishlist: wishlist.items });
    } catch (error) {
      next(error);
    }
  });

  // Check if product is in wishlist
  router.get('/check/:productId', async (req, res, next) => {
    try {
      const sessionId = getSessionId(req);
      const productId = req.params.productId;
      
      let wishlist = await Wishlist.findOne({ sessionId });
      if (!wishlist) {
        return res.json({ isInWishlist: false });
      }
      
      const isInWishlist = wishlist.items.some(
        item => item.productId.toString() === productId
      );
      
      res.json({ isInWishlist });
    } catch (error) {
      next(error);
    }
  });

  export default router;