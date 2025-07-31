import axios from "../utils/axios.js";

// Add or update a review
export const addOrUpdateReview = (data) => {
  return axios.post("/review", data);
};

// Get all reviews for a product
export const getProductReviews = (productId) => {
  return axios.get(`/review/product/${productId}`);
};

// Delete a review by ID
export const deleteReview = (reviewId) => {
  return axios.delete(`/review/${reviewId}`);
};

// Approve or reject a review (admin only)
export const moderateReview = (reviewId, status) => {
  return axios.put(`/review/moderate/${reviewId}`, { status });
};

// Get breakdown of ratings for a product
export const getRatingBreakdown = (productId) => {
  return axios.get(`/review/breakdown/${productId}`);
};
