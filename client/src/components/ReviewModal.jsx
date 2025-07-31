import React, { useState } from "react";
import "../styles/ReviewModal.css";
import { addOrUpdateReview } from "../services/reviewServices";

const ReviewModal = ({ isOpen, onClose, productId, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) return alert("Please select a rating.");
    if (comment.trim().length < 10) {
      return alert("Comment must be at least 10 characters.");
    }

    try {
      setLoading(true);
      await addOrUpdateReview({ productId, rating, comment });
      alert("Review submitted!");
      onReviewSubmit?.(); // callback to refresh reviews
      onClose(); // close modal
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="review-modal-backdrop">
      <div className="review-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Write a Review</h3>

        <form onSubmit={handleSubmit}>
          <label>Rating:</label>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((val) => (
              <span
                key={val}
                className={`star ${val <= rating ? "filled" : ""}`}
                onClick={() => setRating(val)}
              >
                ★
              </span>
            ))}
          </div>

          <label>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            placeholder="Share your thoughts about this product..."
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
