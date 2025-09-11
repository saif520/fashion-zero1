import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  size: { type: String, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

const colorVariantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  images: [{ type: String }],
  stock: [stockSchema]
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  brand: { type: String },

  // Primary category (main placement)
  category: { type: String, required: true },

  // Additional categories (for filtering & multiple placements)
  categories: [{ type: String }],

  gender: { type: String, enum: ['Men', 'Women', 'Unisex', 'Kids'], required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  finalPrice: { type: Number },
  material: { type: String },
  sizes: [{ type: String }],
  colors: [colorVariantSchema],
  tags: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },

  // Admin who created the product
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
