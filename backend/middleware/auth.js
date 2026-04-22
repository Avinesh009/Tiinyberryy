import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const JWT_SECRET = process.env.JWT_SECRET || 'tiinyberry_secret_key_2024';

export const authAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if admin exists
    const admin = await Admin.findById(decoded.adminId);
    if (!admin) {
      return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};