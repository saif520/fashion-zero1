
import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema(
  {
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product", 
      required: true 
    },
    color: { 
      type: String, 
      required: true  // ✅ make color required since every wishlist item must have one
    },
  },
  { _id: false }
);

const wishlistSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      unique: true 
    },
    items: [wishlistItemSchema],
  },
  { timestamps: true }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
