// src/services/wishlistServices.js
import axios from "../utils/axios";

// ✅ Add to wishlist (with product + color)
export const addToWishlist = async ({ productId, color }) => {
  const response = await axios.post("/wishlist/add", { productId, color });
  return response.data;
};

// ✅ Get user's wishlist
export const getMyWishlist = async () => {
  const response = await axios.get("/wishlist/my-wishlist");
  return response.data;
};

// ✅ Remove from wishlist (needs productId + color)
export const removeFromWishlist = async ({ productId, color }) => {
  const response = await axios.delete("/wishlist/remove", {
    data: { productId, color },
  });
  return response.data;
};

// ✅ Move item from wishlist to cart (needs productId + color + size + quantity)
export const moveToCart = async ({ productId, color, size, quantity }) => {
  const response = await axios.post("/wishlist/move-to-cart", {
    productId,
    color,
    size,
    quantity,
  });
  return response.data;
};
