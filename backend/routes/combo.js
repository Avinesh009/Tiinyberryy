import express from 'express';
import ComboOffer from '../models/ComboOffer.js';
import Product from '../models/Product.js';
import { authAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all active combo offers (public - no auth required)
router.get('/', async (req, res) => {
  try {
    const combos = await ComboOffer.find({ isActive: true, endDate: { $gte: new Date() } })
      .populate('products.productId', 'name price image productId');
    res.json({ success: true, combos });
  } catch (error) {
    console.error('Error fetching combos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all combos for admin (includes inactive)
router.get('/admin/all', authAdmin, async (req, res) => {
  try {
    const combos = await ComboOffer.find()
      .populate('products.productId', 'name price image productId')
      .sort({ createdAt: -1 });
    res.json({ success: true, combos });
  } catch (error) {
    console.error('Error fetching all combos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get combo by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const combo = await ComboOffer.findById(req.params.id)
      .populate('products.productId', 'name price image description productId');
    
    if (!combo) {
      return res.status(404).json({ success: false, message: 'Combo not found' });
    }
    
    res.json({ success: true, combo });
  } catch (error) {
    console.error('Error fetching combo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create combo offer (admin only) - FIXED: route should be at '/'
router.post('/', authAdmin, async (req, res) => {
  try {
    const { 
      name, 
      description, 
      products, 
      comboPrice, 
      originalPrice, 
      discountPercent, 
      badge, 
      image, 
      startDate, 
      endDate, 
      isActive 
    } = req.body;
    
    console.log('Creating combo with data:', { name, productsCount: products?.length });
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ success: false, message: 'Combo name is required' });
    }
    
    if (!products || products.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one product is required' });
    }
    
    // Create combo with products
    const combo = new ComboOffer({
      name,
      description: description || '',
      products: products.map(p => ({ 
        productId: p.productId, 
        quantity: p.quantity || 1 
      })),
      comboPrice: comboPrice || 0,
      originalPrice: originalPrice || 0,
      discountPercent: discountPercent || 0,
      badge: badge || 'Combo',
      image: image || '',
      startDate: startDate || null,
      endDate: endDate || null,
      isActive: isActive !== undefined ? isActive : true
    });
    
    await combo.save();
    console.log('Combo saved with ID:', combo._id);
    
    // Populate the products when returning
    const populatedCombo = await ComboOffer.findById(combo._id).populate('products.productId', 'name price image productId');
    
    res.status(201).json({ success: true, combo: populatedCombo });
  } catch (error) {
    console.error('Error creating combo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update combo offer (admin only)
router.put('/:id', authAdmin, async (req, res) => {
  try {
    const { 
      name, 
      description, 
      products, 
      comboPrice, 
      originalPrice, 
      discountPercent, 
      badge, 
      image, 
      startDate, 
      endDate, 
      isActive 
    } = req.body;
    
    const updateData = {
      name,
      description: description || '',
      products: products ? products.map(p => ({ 
        productId: p.productId, 
        quantity: p.quantity || 1 
      })) : [],
      comboPrice,
      originalPrice,
      discountPercent,
      badge: badge || 'Combo',
      image: image || '',
      startDate: startDate || null,
      endDate: endDate || null,
      isActive
    };
    
    const combo = await ComboOffer.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('products.productId', 'name price image productId');
    
    if (!combo) {
      return res.status(404).json({ success: false, message: 'Combo not found' });
    }
    
    res.json({ success: true, combo });
  } catch (error) {
    console.error('Error updating combo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete combo offer (admin only)
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    const combo = await ComboOffer.findByIdAndDelete(req.params.id);
    
    if (!combo) {
      return res.status(404).json({ success: false, message: 'Combo not found' });
    }
    
    res.json({ success: true, message: 'Combo deleted successfully' });
  } catch (error) {
    console.error('Error deleting combo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;