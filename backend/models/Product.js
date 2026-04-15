import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  images: [{ type: String }]
});

const productSchema = new mongoose.Schema({
  productId: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: null },
  badge: { type: String, default: null },
  image: { type: String, required: true },
  images: [{ type: String }],
  colors: [colorSchema],
 category: { type: String, required: true },
  subcategory: { type: String, default: '' }, // Add this field
  age: { type: String },
  description: { type: String, required: true },
  sizes: [{ type: String }],
  material: { type: String },
  care: { type: String },
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, default: 10 }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);