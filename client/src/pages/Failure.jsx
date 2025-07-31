import React from "react";
import { Link } from "react-router-dom";
import "../styles/Failure.css";

const Failure = () => {
  return (
    <div className="failure-page">
      <div className="failure-box">
        <h1>❌ Payment Failed</h1>
        <p>Please try again or use a different payment method.</p>
        <Link to="/checkout" className="failure-btn">Try Again</Link>
        <Link to="/home" className="failure-link">Back to Home</Link>
      </div>
    </div>
  );
};

export default Failure;
