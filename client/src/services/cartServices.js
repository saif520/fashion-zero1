import axios from "../utils/axios";

// Matches: addToCart (POST /cart/add)
export const addToCart = async (data) => {
  const response = await axios.post("/cart/add", data);
  return response.data;
};

// Matches: getMyCart (GET /cart/get)
export const getMyCart = async () => {
  const response = await axios.get("/cart/get");
  return response.data;
};

// Matches: updateCartItem (PUT /cart/update)
export const updateCartItem = async (data) => {
  const response = await axios.put("/cart/update", data);
  return response.data;
};

// Matches: removeCartItem (DELETE /cart/remove)
export const removeCartItem = async (data) => {
  const response = await axios.delete("/cart/remove", { data });
  return response.data;
};

// Matches: moveToWishlist (POST /cart/move-to-wishlist)
export const moveToWishlist = async (data) => {
  const response = await axios.post("/cart/move-to-wishlist", data);
  return response.data;
};
