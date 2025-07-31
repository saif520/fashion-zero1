// components/MoveToCartModal.jsx
import React, { useState } from "react";
import "../styles/MoveToCartModal.css"; // Ensure this CSS file handles modal styling

const MoveToCartModal = ({ product, onClose, onConfirm }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState("1");

  // Collect all available sizes from colors[].stock[]
  const sizeSet = new Set();
  product.colors.forEach((color) =>
    color.stock.forEach((s) => sizeSet.add(s.size))
  );
  const availableSizes = Array.from(sizeSet);

  const handleConfirm = () => {
    const qty = parseInt(quantity, 10);

    if (!selectedSize || isNaN(qty) || qty < 1) {
      alert("Please select a size and enter a valid quantity.");
      return;
    }

    onConfirm({ size: selectedSize, quantity: qty });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Select Size and Quantity</h3>

        <div className="size-options">
          {availableSizes.map((size) => (
            <button
              key={size}
              className={`size-btn ${selectedSize === size ? "selected" : ""}`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
        />

        <div className="modal-actions">
          <button onClick={handleConfirm} className="btn confirm">
            Confirm
          </button>
          <button onClick={onClose} className="btn cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveToCartModal;

