import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../services/orderServices";
import { addOrUpdateReview } from "../services/reviewServices";
import "../styles/ReviewPage.css";
import { toast } from "react-toastify"; // ✅ Import toast
import Navbar from "../components/Navbar";

const ReviewPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState({}); // { productId: { rating, comment } }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(orderId);
        setOrder(res.order);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          toast.error("You must be logged in to submit a review.");
          navigate(`/auth?redirect=/review?orderId=${orderId}`);
        } else {
          toast.error("Failed to fetch order.");
          console.error("Fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId, navigate]);

  const handleChange = (productId, field, value) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (productId) => {
    const review = reviews[productId];
    if (!review?.rating || !review.comment) {
      return toast.warn("Please provide both rating and comment.");
    }

    try {
      await addOrUpdateReview({
        productId,
        rating: Number(review.rating),
        comment: review.comment,
      });
      toast.success("Review submitted successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit review.");
    }
  };

  if (loading) return <p className="loading">Loading order...</p>;
  if (!order && !loading) {
    return (
      <p className="error">
        Order not found or you are not authorized to view this order.
      </p>
    );
  }

  return (
    <>
      <Navbar/>
      <div className="review-page-container">
      <h2>Leave a Review</h2>
      <p>Order ID: {order._id}</p>

      {order.orderItems.map((item) => (
        <div key={item._id} className="review-card">
          <div className="review-product">
            <img
              src={item.product?.colors?.[0]?.images?.[0] || "/no-image.png"}
              alt={item.product?.name}
            />
            <div>
              <h4>{item.product?.name}</h4>
              <p>Category: {item.product?.category}</p>
            </div>
          </div>

          <div className="review-form">
            <label>
              Rating:
              <select
                value={reviews[item.product._id]?.rating || ""}
                onChange={(e) =>
                  handleChange(item.product._id, "rating", e.target.value)
                }
              >
                <option value="">Select</option>
                {[1, 2, 3, 4, 5].map((star) => (
                  <option key={star} value={star}>
                    {star} ★
                  </option>
                ))}
              </select>
            </label>

            <label>
              Comment:
              <textarea
                placeholder="Write your feedback..."
                value={reviews[item.product._id]?.comment || ""}
                onChange={(e) =>
                  handleChange(item.product._id, "comment", e.target.value)
                }
              />
            </label>

            <button onClick={() => handleSubmit(item.product._id)}>
              Submit Review
            </button>
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default ReviewPage;
