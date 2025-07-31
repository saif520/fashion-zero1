import axios from "../utils/axios"; // make sure you have an axios instance configured

// Get all products (protected)
// NO token needed in headers if using cookie + withCredentials
export const getAllProducts = async () => {
  return await axios.get("/product/get-all-products");
};


// Get product by ID
export const getProductById = async (id) => {
  return await axios.get(`/product/get-product-by-id/${id}`);
};

// Search products
export const searchProducts = async (params) => {
  return await axios.get("/product/search", { params });
};

// Get products created by current admin
export const getMyProducts = async (token) => {
  return await axios.get("/product/get-my-products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Create new product (admin only)
export const createProduct = async (productData, token) => {
  return await axios.post("/product/create-product", productData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Update product (admin only)
export const updateProduct = async (id, productData, token) => {
  return await axios.put(`/product/update-product/${id}`, productData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Delete product (admin only)
export const deleteProduct = async (id, token) => {
  return await axios.delete(`/product/delete-product/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
