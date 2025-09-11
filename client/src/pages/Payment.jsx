import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPaymentIntent } from "../services/paymentServices";
import { createOrder } from "../services/orderServices";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import "../styles/Payment.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ orderItems, shippingInfo, totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPayment = async () => {
      try {
        const { clientSecret } = await createPaymentIntent(totalAmount);
        setClientSecret(clientSecret);
      } catch (err) {
        toast.error("Failed to create payment intent");
      } finally {
        setLoading(false);
      }
    };

    initPayment();
  }, [totalAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
      },
    });

    if (result.error) {
      toast.error(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      const orderData = {
        orderItems: orderItems.map((item) => ({
          product: item.product._id,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
        })),
        shippingInfo,
        paymentInfo: {
          method: "CARD",
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
        },
        totalAmount,
      };

      try {
        await createOrder(orderData);
        // toast.success("Payment successful and order placed!");
        navigate("/success");
      } catch (err) {
        // toast.error(err.response?.data?.message || "Failed to create order");
        navigate("/failure");
      }
    }
  };

  if (loading) return <div>Loading payment gateway...</div>;

  return (
    <div className="payment-layout-container">
      <div className="payment-column payment-summary section-box visible">
        <p><strong>Subtotal:</strong> ₹ {(totalAmount - 50).toFixed(2)}</p>
        <p><strong>Shipping:</strong> ₹ 50.00</p>
        <hr />
        <p className="total-amount"><strong>Total:</strong> ₹ {totalAmount.toFixed(2)}</p>
      </div>

      <form onSubmit={handleSubmit} className="payment-column payment-form">
        <h2>Complete Your Payment</h2>

        <div className="section-box">
          <label htmlFor="card-number">Card Number</label>
          <CardNumberElement id="card-number" className="stripe-input" />

          <div className="card-details-row">
            <div>
              <label htmlFor="card-expiry">Expiry Date</label>
              <CardExpiryElement id="card-expiry" className="stripe-input" />
            </div>
            <div>
              <label htmlFor="card-cvc">CVC</label>
              <CardCvcElement id="card-cvc" className="stripe-input" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={!stripe || !elements} className="payment-btn">
          Pay ₹ {totalAmount.toFixed(2)}
        </button>
      </form>

      <div className="payment-column shipping-info section-box visible">
        <h3>Shipping Address</h3>
        <p>{shippingInfo.name}</p>
        <p>{shippingInfo.address}</p>
        <p>{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}</p>
        <p>{shippingInfo.country}</p>
        <p>Locality - {shippingInfo.locality}</p>
        <p>Landmark - {shippingInfo.landmark}</p>
        <p>Phone: {shippingInfo.phone}</p>
      </div>
    </div>
  );
};

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.orderItems || !state?.shippingInfo || !state?.totalAmount) {
    navigate("/checkout");
    return null;
  }

  const { orderItems, shippingInfo, totalAmount } = state;

  return (
    <div className="payment-page-wrapper">
      <Elements stripe={stripePromise}>
        <PaymentForm
          orderItems={orderItems}
          shippingInfo={shippingInfo}
          totalAmount={totalAmount}
        />
      </Elements>
    </div>
  );
};

export default Payment;
