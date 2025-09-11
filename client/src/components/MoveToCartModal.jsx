
// src/components/MoveToCartModal.jsx
import React, { useState } from "react";
import "../styles/MoveToCartModal.css";

const MoveToCartModal = ({ product, color, onClose, onConfirm }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState("1");

  // ✅ Get the specific color object from product
  const colorObj = product.colors.find(
    (c) => c.color.toLowerCase() === color.toLowerCase()
  );

  // ✅ Extract available sizes only from that color
  const availableSizes = colorObj?.stock?.map((s) => s.size) || [];

  const handleConfirm = () => {
    const qty = parseInt(quantity, 10);

    if (!selectedSize || isNaN(qty) || qty < 1) {
      alert("Please select a size and enter a valid quantity.");
      return;
    }

    onConfirm({
      size: selectedSize,
      quantity: qty,
      color, // ✅ pass fixed color
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>
          {product.name} ({color}) {/* ✅ show chosen color */}
        </h3>

        <div className="size-options">
          {availableSizes.length > 0 ? (
            availableSizes.map((size) => (
              <button
                key={size}
                className={`size-btn ${
                  selectedSize === size ? "selected" : ""
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))
          ) : (
            <p className="no-sizes">No sizes available for this color.</p>
          )}
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
