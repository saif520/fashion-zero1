import axios from "../utils/axios";

// ✅ Add to wishlist
export const addToWishlist = async (productId) => {
  const response = await axios.post("/wishlist/add", { productId });
  return response.data;
};

// ✅ Get user's wishlist
export const getMyWishlist = async () => {
  const response = await axios.get("/wishlist/my-wishlist");
  return response.data;
};

// ✅ Remove from wishlist
export const removeFromWishlist = async (productId) => {
  const response = await axios.delete("/wishlist/remove", {
    data: { productId },
  });
  return response.data;
};

// ✅ Move item from wishlist to cart
export const moveToCart = async ({ productId, size, quantity }) => {
  const response = await axios.post("/wishlist/move-to-cart", {
    productId,
    size,
    quantity,
  });
  return response.data;
};
