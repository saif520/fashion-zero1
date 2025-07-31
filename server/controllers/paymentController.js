import { stripe } from "../utils/stripe.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";

export const createPaymentIntent = catchAsyncError(async (req, res, next) => {
  const { totalAmount } = req.body;

  if (!totalAmount || typeof totalAmount !== "number") {
    return next(new ErrorHandler("Total amount required", 400));
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalAmount * 100), // Stripe accepts amount in cents
    currency: "inr",
    metadata: { userId: req.user._id.toString() },
  });

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});
