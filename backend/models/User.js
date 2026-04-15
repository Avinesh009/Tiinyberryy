import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, required: true, unique: true, lowercase: true },
  mobileNumber: { type: String, default: '' },
  phone: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  addresses: [{
    fullName: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    phone: String,
    email: String,
    isDefault: { type: Boolean, default: false }
  }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// Only index email
userSchema.index({ email: 1 }, { unique: true });
export default mongoose.model('User', userSchema);