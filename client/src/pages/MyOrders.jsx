import React, { useEffect, useState } from "react";
import "../styles/MyOrders.css";
import { getMyOrders, cancelOrderById } from "../services/orderServices";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import Navbar from "../components/Navbar";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { orders } = await getMyOrders();
        setOrders(orders);
      } catch (error) {
        toast.error("Failed to fetch your orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const confirmCancel = (orderId) => {
    setSelectedOrderId(orderId);
    setShowConfirm(true);
  };

  const handleCancel = async () => {
    setShowConfirm(false);

    try {
      await cancelOrderById(selectedOrderId);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === selectedOrderId ? { ...order, orderStatus: "Cancelled" } : order
        )
      );
      toast.success("Order cancelled successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to cancel order");
    } finally {
      setSelectedOrderId(null);
    }
  };

  if (loading) return <div className="orders-loading">Loading your orders...</div>;

  return (
    <>
      <Navbar/>
      <div className="orders-container">
        <h2>My Orders</h2>
        {orders.length === 0 ? (
          <div className="no-orders-box">
            <p className="no-orders">You haven’t placed any orders yet.</p>
            <Link to="/category/all" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div className="order-top">
                  <span><strong>Order ID:</strong> {order._id}</span>
                  <span className={`status ${order.orderStatus.toLowerCase()}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <div className="order-details">
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                  <p><strong>Items:</strong> {order.orderItems.length}</p>
                </div>
                <div className="order-items-preview">
                  {order.orderItems.slice(0, 3).map((item, index) => (
                    <div className="order-item-thumbnail" key={index}>
                      <img
                        src={item.product?.colors?.[0]?.images?.[0] || "/placeholder.png"}
                        alt={item.product?.name || "Product"}
                      />
                      <span>{item.product?.name || "Deleted Product"}</span>
                    </div>
                  ))}
                  {order.orderItems.length > 3 && (
                    <span className="more-items">+{order.orderItems.length - 3} more</span>
                  )}
                </div>

                <div className="order-actions">
                  <Link to={`/order/${order._id}`} className="view-order-btn">
                    View Details
                  </Link>

                  {order.orderStatus === "Pending" && (
                    <button
                      className="cancel-order-btn"
                      onClick={() => confirmCancel(order._id)}
                    >
                      Cancel Order
                    </button>
                  )}

                  {order.orderStatus === "Delivered" && (
                    <Link
                      to={`/review?orderId=${order._id}`}
                      className="review-order-btn"
                    >
                      Leave a Review
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Confirm Cancel Modal */}
        <ConfirmModal
          open={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleCancel}
          message="Are you sure you want to cancel this order?"
        />
      </div>
    </>
  );
};

export default MyOrders;
