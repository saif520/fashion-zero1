import React from "react";
import "../styles/Offer.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Offer = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar/>
      <div className="offer-page">
        <h2>No offer is available</h2>
        <button onClick={() => navigate("/")}>Go to Home</button>
      </div>
    </>
  );
};

export default Offer;
