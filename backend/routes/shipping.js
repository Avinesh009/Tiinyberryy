import express from 'express';
import ShippingSetting from '../models/ShippingSetting.js';
import { authAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get shipping settings
router.get('/settings', async (req, res) => {
  try {
    let settings = await ShippingSetting.findOne();
    if (!settings) {
      // Create default settings
      settings = await ShippingSetting.create({
        freeShippingThreshold: 3000,
        standardShippingRate: 100,
        expressShippingRate: 200,
        internationalShippingRate: 500
      });
    }
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update shipping settings (admin only)
router.put('/settings', authAdmin, async (req, res) => {
  try {
    const { freeShippingThreshold, standardShippingRate, expressShippingRate, internationalShippingRate } = req.body;
    
    let settings = await ShippingSetting.findOne();
    if (!settings) {
      settings = new ShippingSetting();
    }
    
    settings.freeShippingThreshold = freeShippingThreshold;
    settings.standardShippingRate = standardShippingRate;
    settings.expressShippingRate = expressShippingRate;
    settings.internationalShippingRate = internationalShippingRate;
    settings.updatedAt = Date.now();
    
    await settings.save();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Calculate shipping cost
router.post('/calculate', async (req, res) => {
  try {
    const { subtotal, shippingMethod = 'standard' } = req.body;
    const settings = await ShippingSetting.findOne();
    
    if (!settings) {
      return res.json({ shippingCost: 100, isFree: subtotal >= 3000 });
    }
    
    let shippingCost = 0;
    let isFree = false;
    
    if (subtotal >= settings.freeShippingThreshold) {
      isFree = true;
      shippingCost = 0;
    } else {
      switch (shippingMethod) {
        case 'standard':
          shippingCost = settings.standardShippingRate;
          break;
        case 'express':
          shippingCost = settings.expressShippingRate;
          break;
        case 'international':
          shippingCost = settings.internationalShippingRate;
          break;
        default:
          shippingCost = settings.standardShippingRate;
      }
    }
    
    res.json({ 
      success: true, 
      shippingCost, 
      isFree,
      freeShippingThreshold: settings.freeShippingThreshold,
      remainingForFree: Math.max(0, settings.freeShippingThreshold - subtotal)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;