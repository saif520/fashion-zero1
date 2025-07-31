import React from "react";
import { Link } from "react-router-dom";
import "../styles/Success.css";

const Success = () => {
  return (
    <div className="success-page">
      <div className="success-box">
        <h1>🎉 Payment Successful!</h1>
        <p>Your order has been placed successfully.</p>
        <Link to="/my-orders" className="success-btn">View My Orders</Link>
        <Link to="/home" className="success-link">Back to Home</Link>
      </div>
    </div>
  );
};

export default Success;

