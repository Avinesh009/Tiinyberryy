import express from 'express';
import crypto from 'crypto';
import Order from '../models/Order.js';

const router = express.Router();

// Webhook endpoint - must use raw body for signature verification [citation:6]
router.post('/razorpay', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    
    // Verify webhook signature [citation:6]
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.body)
      .digest('hex');
    
    if (expectedSignature !== signature) {
      console.error('Invalid webhook signature');
      return res.status(400).send('Invalid signature');
    }
    
    const event = JSON.parse(req.body);
    console.log('Webhook event:', event.event);
    
    // Handle payment captured event [citation:6]
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      
      // Find and update order
      const order = await Order.findOne({ razorpayOrderId });
      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.razorpayPaymentId = payment.id;
        order.status = 'confirmed';
        await order.save();
        
        console.log(`Order ${order.orderNumber} payment confirmed via webhook`);
      }
    }
    
    // Handle payment failed event
    if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      
      const order = await Order.findOne({ razorpayOrderId });
      if (order) {
        order.paymentStatus = 'failed';
        await order.save();
        console.log(`Order ${order.orderNumber} payment failed`);
      }
    }
    
    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Webhook processing failed');
  }
});

export default router;