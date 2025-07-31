import React, { useEffect, useState } from "react";
import "../styles/Checkout.css";
import { getMyCart } from "../services/cartServices";
import { createOrder } from "../services/orderServices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({ address: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { cart } = await getMyCart();
        setCartItems(cart.items || []);
      } catch (err) {
        toast.error("Failed to fetch cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const calculateTotalAmount = () => {
    return cartItems.reduce((acc, item) => {
      const price = item.product.price * (1 - item.product.discount || 0);
      return acc + price * item.quantity;
    }, 0);
  };

  const handlePlaceOrder = async () => {
  const totalAmount = calculateTotalAmount();

  const requiredFields = [
    { value: shippingInfo.name, label: "Full Name" },
    { value: shippingInfo.phone, label: "Phone Number" },
    { value: shippingInfo.pincode, label: "Pincode" },
    { value: shippingInfo.address, label: "Full Address" },
    { value: shippingInfo.city, label: "City" },
    { value: shippingInfo.state, label: "State" },
  ];

  for (const field of requiredFields) {
    if (!field.value || field.value.trim() === "") {
      return toast.error(`Please enter ${field.label}`);
    }
  }

  if (!/^\d{10}$/.test(shippingInfo.phone)) {
    return toast.error("Phone number must be exactly 10 digits");
  }

  if (!paymentMethod) {
    return toast.error("Please select a payment method");
  }

  const orderData = {
    orderItems: cartItems.map((item) => ({
      product: item.product._id,
      size: item.size,
      quantity: item.quantity,
    })),
    shippingInfo,
    paymentInfo: { method: paymentMethod },
    totalAmount,
  };

  try {
    if (paymentMethod === "COD") {
      const res = await createOrder(orderData);
      toast.success("Order placed successfully!");
      navigate("/my-orders");
    } else {
      navigate("/payment", {
        state: {
          orderItems: cartItems,
          shippingInfo,
          totalAmount,
        },
      });
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to place order");
  }
};


  if (loading) return <div className="checkout-loading">Loading...</div>;

  return (
    <div>
      <h2>Checkout</h2>
      <div className="checkout-container">
        <div className="checkout-form">
          <h3>Shipping Information</h3>
          <input
            type="text"
            placeholder="Full Name"
            value={shippingInfo.name}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={shippingInfo.phone}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, phone: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Alternate Phone (optional)"
            value={shippingInfo.altPhone}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, altPhone: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Pincode"
            value={shippingInfo.pincode}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, pincode: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Locality"
            value={shippingInfo.locality}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, locality: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Full Address"
            value={shippingInfo.address}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, address: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Landmark (optional)"
            value={shippingInfo.landmark}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, landmark: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="City"
            value={shippingInfo.city}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, city: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="State"
            value={shippingInfo.state}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, state: e.target.value })
            }
          />
          <select
            value={shippingInfo.addressType}
            onChange={(e) =>
              setShippingInfo({ ...shippingInfo, addressType: e.target.value })
            }
          >
            <option value="Home">Home</option>
            <option value="Work">Work</option>
          </select>

          <h3>Payment Method</h3>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="COD">Cash on Delivery</option>
            <option value="CARD">Card</option>
          </select>
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cartItems.map((item) => {
            const price = item.product.price * (1 - item.product.discount || 0);
            return (
              <div key={item.product._id + item.size} className="summary-item">
                <span>
                  {item.product.name} (Size: {item.size})
                </span>
                <span>Qty: {item.quantity}</span>
                <span>₹{(price * item.quantity).toFixed(2)}</span>
              </div>
            );
          })}
          <h4>Total: ₹{calculateTotalAmount().toFixed(2)}</h4>
          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
