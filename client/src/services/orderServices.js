import axios from "../utils/axios";

// Create a new order
export const createOrder = async (orderData) => {
  const response = await axios.post("/order/create", orderData);
  return response.data;
};

// Get current user's orders
export const getMyOrders = async () => {
  const response = await axios.get("/order/my-orders");
  return response.data;
};

// Search user orders
export const searchUserOrders = async (queryParams = {}) => {
  const query = new URLSearchParams(queryParams).toString();
  const response = await axios.get(`/order/my/search?${query}`);
  return response.data;
};

export const cancelOrderById = async (orderId) => {
  const response = await axios.put(`/order/${orderId}/cancel`);
  return response.data;
};


// Admin: Get all orders
export const getAllOrders = async () => {
  const response = await axios.get("/order/admin/orders");
  return response.data;
};

// Admin: Search orders
export const searchOrders = async (queryParams = {}) => {
  const query = new URLSearchParams(queryParams).toString();
  const response = await axios.get(`/order/admin/search?${query}`);
  return response.data;
};

// Admin: Update order status
export const updateOrderStatus = async (orderId, status) => {
  const response = await axios.put(`/order/admin/order/update/${orderId}`, {
    orderStatus: status,
  });
  return response.data;
};

// Admin: Delete order
export const deleteOrder = async (orderId) => {
  const response = await axios.delete(`/order/admin/order/delete/${orderId}`);
  return response.data;
};

// Get single order by ID (for user or admin)
export const getOrderById = async (orderId) => {
  const response = await axios.get(`/order/${orderId}`);
  return response.data;
};
