import axios from "../utils/axios";

// Create payment intent
export const createPaymentIntent = async (totalAmount) => {
  try {
    const response = await axios.post("/payment/create-payment-intent", {
      totalAmount,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create payment intent";
  }
};
