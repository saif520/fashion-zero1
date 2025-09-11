
// src/pages/Checkout.jsx
import React, { useEffect, useState } from "react";
import "../styles/Checkout.css";
import { getMyCart } from "../services/cartServices";
import { createOrder } from "../services/orderServices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({ address: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("CARD");
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

  // ✅ Use finalPrice if available, fallback to price
  const calculateTotalAmount = () => {
    return cartItems.reduce((acc, item) => {
      const price = item.product.finalPrice || item.product.price;
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
        color: item.color,
        size: item.size,
        quantity: item.quantity,
      })),
      shippingInfo,
      paymentInfo: { method: paymentMethod },
      totalAmount,
    };

    try {
      if (paymentMethod === "COD") {
        await createOrder(orderData);
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
        {/* Left Form */}
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

        {/* Right Summary */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <table className="summary-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => {
                const price = item.product.finalPrice || item.product.price;

                // Find the correct color object
                const colorObj = item.product.colors.find(
                  (c) => c.color === item.color
                );

                // Fallback to product's first image if not found
                const productImage = colorObj?.images[0] || "";

                return (
                  <tr key={item.product._id + item.size}>
                    <td className="product-cell">
                      <img
                        src={productImage}
                        alt={item.product.name}
                        className="summary-product-img"
                      />
                      <span>{item.product.name}</span>
                    </td>
                    <td>{item.size}</td>
                    <td>{item.quantity}</td>
                    <td>₹{(price * item.quantity).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
