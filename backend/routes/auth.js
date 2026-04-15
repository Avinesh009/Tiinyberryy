import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Order from '../models/Order.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tiinyberry_secret_key_2024';

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// GET /api/auth/profile - Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    console.log('Fetching profile for user:', req.userId);
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get user orders
    const orders = await Order.find({ 
      $or: [
        { userId: user._id },
        { guestEmail: user.email },
        { 'shippingAddress.email': user.email }
      ]
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        phone: user.phone,
        addresses: user.addresses || []
      },
      orders: orders
    });
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/auth/profile - Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    
    await user.save();
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        phone: user.phone,
        addresses: user.addresses || []
      }
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/address - Add address
router.post('/address', verifyToken, async (req, res) => {
  try {
    const { fullName, address, city, state, pincode, phone, email, isDefault } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses.push({
      fullName,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      isDefault: isDefault || false
    });
    
    await user.save();
    
    res.json({
      success: true,
      addresses: user.addresses
    });
    
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/auth/address/:addressId - Delete address
router.delete('/address/:addressId', verifyToken, async (req, res) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();
    
    res.json({
      success: true,
      addresses: user.addresses
    });
    
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Simple test endpoint
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Auth routes are working!' });
});

export default router;