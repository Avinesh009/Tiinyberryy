import mongoose from 'mongoose';

const comboOfferSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 },
    discountPercent: { type: Number, default: 0 }
  }],
  comboPrice: { type: Number, required: true },
  originalPrice: { type: Number },
  discountPercent: { type: Number },
  badge: { type: String, default: 'Combo' },
  image: { type: String },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Calculate original price before saving
comboOfferSchema.pre('save', async function(next) {
  if (this.products && this.products.length > 0) {
    const Product = mongoose.model('Product');
    let total = 0;
    for (const item of this.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    }
    this.originalPrice = total;
    if (this.comboPrice && this.originalPrice) {
      this.discountPercent = Math.round(((this.originalPrice - this.comboPrice) / this.originalPrice) * 100);
    }
  }
  next();
});

export default mongoose.model('ComboOffer', comboOfferSchema);