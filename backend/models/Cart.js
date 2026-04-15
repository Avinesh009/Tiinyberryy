import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  size: { type: String, default: '' },
  color: { type: String, default: '' },
  colorImage: { type: String, default: '' },
  quantity: { type: Number, required: true, default: 1 }
});

const cartSchema = new mongoose.Schema({
  sessionId: { type: String, sparse: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', sparse: true },
  items: [cartItemSchema]
}, { timestamps: true });

cartSchema.index({ sessionId: 1 });
cartSchema.index({ userId: 1 });

export default mongoose.model('Cart', cartSchema);