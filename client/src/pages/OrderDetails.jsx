import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/OrderDetails.css";
import { getOrderById } from "../services/orderServices";
import Navbar from "../components/Navbar";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { order } = await getOrderById(id);
        setOrder(order);
      } catch (error) {
        alert("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="order-details-loading">Loading...</div>;

  if (!order) return <div className="order-details-error">Order not found</div>;

  return (
    <>
      <Navbar/>
      <div className="order-details-container">
      <h2>Order Details</h2>

      <div className="order-meta">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={`status ${order.orderStatus.toLowerCase()}`}>
            {order.orderStatus}
          </span>
        </p>
        <p><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Payment:</strong> {order.paymentInfo.method} ({order.paymentInfo.status})</p>
      </div>

      <div className="shipping-info">
        <h3>Shipping Info</h3>
        <p><strong>Name:</strong> {order.shippingInfo.name}</p>
        <p><strong>Phone:</strong> {order.shippingInfo.phone}</p>
        <p>
          <strong>Address:</strong> {order.shippingInfo.address}, {order.shippingInfo.locality}, {order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.pincode}
        </p>
        {order.shippingInfo.landmark && <p><strong>Landmark:</strong> {order.shippingInfo.landmark}</p>}
        <p><strong>Type:</strong> {order.shippingInfo.addressType}</p>
      </div>

      <div className="items-list">
        <h3>Ordered Items</h3>
        {order.orderItems.map((item, index) => (
          <div key={index} className="item">
            {item.product ? (
              <div className="item-content">
                <img
                  src={item.product.colors?.[0]?.images?.[0] || "/placeholder.png"}
                  alt={item.product.name}
                  className="item-image"
                />
                <div className="item-info">
                  <div className="item-name">{item.product.name}</div>
                  {/* <div className="item-category">Category: {item.product.category}</div> */}
                  <div className="item-details">
                    <span>Size: {item.size}</span>
                    {item.color && <span>Color: {item.color}</span>}
                    <span>Qty: {item.quantity}</span>
                    <span>Price: ₹{item.product.price?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="item-name">Product Deleted</div>
            )}
          </div>
        ))}
      </div>

      <div className="total-summary">
        <h4>Total Amount: ₹{order.totalAmount.toFixed(2)}</h4>
      </div>
    </div>
    </>
  );
};

export default OrderDetails;
