import axios from "../utils/axios";

// Register a new user
export const registerUser = async (userData) => {
  const response = await axios.post("/user/register", userData);
  return response.data;
};

// Verify OTP for email or phone
export const verifyOtp = async (otpData) => {
  const response = await axios.post("/user/otp-verification", otpData);
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await axios.post("/user/login", credentials);
  return response.data;
};

// Logout user
export const logoutUser = async () => {
  const response = await axios.get("/user/logout");
  return response.data;
};

// Get current logged-in user
export const getCurrentUser = async () => {
  const response = await axios.get("/user/me");
  return response.data;
};

// Forgot password (send reset link)
export const forgotPassword = async (email) => {
  const response = await axios.post("/user/password/forgot", { email });
  return response.data;
};

// Reset password using token
export const resetPassword = async (token, data) => {
  const response = await axios.put(`/user/password/reset/${token}`, data);
  return response.data;
};
