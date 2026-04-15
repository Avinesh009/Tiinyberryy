import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
  productId: { type: String, required: true }, // Changed from ObjectId to String
  name: String,
  price: Number,
  image: String,
  originalPrice: Number,
  badge: String
});

const wishlistSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  items: [wishlistItemSchema]
}, { timestamps: true });

export default mongoose.model('Wishlist', wishlistSchema);