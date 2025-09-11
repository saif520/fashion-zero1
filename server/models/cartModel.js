
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  color: { type: String, required: true },   // ✅ new field
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [cartItemSchema],
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;

