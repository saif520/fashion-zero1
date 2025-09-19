// src/pages/ProductDetails.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getProductById } from "../services/productServices";
import { addToCart, getMyCart } from "../services/cartServices";
import { addToWishlist } from "../services/wishlistServices";
import {
  getProductReviews,
  getRatingBreakdown,
} from "../services/reviewServices";
import "../styles/ProductDetails.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { Context } from "../main";

const ProductDetails = () => {
  const { isAuthenticated } = useContext(Context);

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [selectedImage, setSelectedImage] = useState("");

  const [reviews, setReviews] = useState([]);
  const [breakdown, setBreakdown] = useState([]);

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(
        1
      )
    : null;

  const totalRatings = breakdown.reduce((sum, item) => sum + item.count, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await getProductById(id);
        const prod = productRes.data.product;
        setProduct(prod);

        const urlParams = new URLSearchParams(location.search);
        const colorParam = urlParams.get("color");

        let initialColor = null;
        if (colorParam) {
          initialColor = prod.colors?.find(
            (c) => c.color.toLowerCase() === colorParam.toLowerCase()
          );
        }
        initialColor = initialColor || prod.colors?.[0] || null;

        setSelectedColor(initialColor);

        const reviewRes = await getProductReviews(id);
        setReviews(reviewRes.data.reviews);

        const breakdownRes = await getRatingBreakdown(id);
        setBreakdown(breakdownRes.data.breakdown);
      } catch (error) {
        console.error(
          "Error loading product:",
          error?.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, location.search]);

  useEffect(() => {
    if (selectedColor?.images?.length) {
      setSelectedImage(selectedColor.images[0]);
    } else {
      setSelectedImage("");
    }
  }, [selectedColor]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to add items to your bag.");
      navigate(`/auth?redirect=/product/${id}&type=login`);
      return;
    }

    if (!selectedColor) {
      toast.warn("Please select a color.");
      return;
    }

    if (!selectedSize) {
      toast.warn("Please select a size.");
      return;
    }

    try {
      await addToCart({
        productId: product._id,
        color: selectedColor.color,
        size: selectedSize,
        quantity,
      });
      toast.success("Product added to bag!");
      await getMyCart();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to add to bag."
      );
      console.error(error?.response?.data || error.message);
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.info("Please log in to add items to your wishlist.");
      navigate(`/auth?redirect=/product/${id}&type=login`);
      return;
    }

    if (!selectedColor) {
      toast.warn("Please select a color.");
      return;
    }

    try {
      const res = await addToWishlist({
        productId: product._id,
        color: selectedColor.color,
      });
      toast.success(res.message || "Added to wishlist!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add to wishlist.");
    }
  };

  const sizeOptions = selectedColor?.stock?.map((s) => s.size) || [
    "S",
    "M",
    "L",
    "XL",
  ];

  if (loading) return <p className="loading">Loading product details...</p>;
  if (!product) return <p className="error">Product not found.</p>;

  return (
    <>
      <Navbar />
      <div className="product-detail-container">
        <div className="product-detail-card">
          {/* ✅ Image + Thumbnail in a row */}
          <div className="product-image-gallery">
            {selectedColor?.images?.length > 1 && (
              <div className="thumbnail-list">
                {selectedColor.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className={`thumbnail ${
                      selectedImage === img ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            )}

            <div className="product-image-wrapper">
              <img
                src={selectedImage || "/no-image.png"}
                alt={product.name}
                className="product-detail-image"
              />
            </div>
          </div>

          <div className="product-info">
            <h1>{product.name}</h1>

            {averageRating && (
              <div className="average-rating">
                <div className="star-visual">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className="star"
                      style={{
                        color:
                          i < Math.round(averageRating) ? "#de7a25" : "#ccc",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="average-rating-text">{averageRating} out of 5</p>
              </div>
            )}

            <p className="product-price">₹ {product.finalPrice}</p>
            <p className="product-description">{product.description}</p>
            <p className="product-category">
              <strong>Category:</strong> {product.category}
            </p>

            {product.colors && product.colors.length > 1 && (
              <div className="product-colors">
                <p className="size-label">Select Color:</p>
                <div className="color-options">
                  {product.colors.map((c) => (
                    <button
                      key={c.color}
                      className={`color-circle ${c.color.toLowerCase()} ${
                        selectedColor?.color === c.color ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedColor(c);
                        setSelectedSize("");
                      }}
                      title={c.color}
                    />
                  ))}
                </div>
                {selectedColor && (
                  <p className="selected-color-name">
                    Selected: <strong>{selectedColor.color}</strong>
                  </p>
                )}
              </div>
            )}

            <div className="product-size">
              <p className="size-label">Select Size:</p>
              <div className="size-options">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    className={`size-circle ${
                      selectedSize === size ? "selected" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="quantity-wrapper">
              <p className="size-label">Quantity:</p>
              <div className="quantity-control">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>
            </div>

            <div className="product-buttons">
              <button className="btn-cart" onClick={handleAddToCart}>
                Add to Bag
              </button>
              <button className="btn-wishlist" onClick={handleAddToWishlist}>
                Wishlist
              </button>
            </div>
          </div>
        </div>

        <div className="rating-breakdown">
          <h3>Rating Breakdown</h3>
          <ul>
            {breakdown.map((item) => {
              const barWidth = Math.min(item.count * 20, 200);
              return (
                <li key={item.rating}>
                  <span className="star-label">
                    <span className="colored-star">★</span> {item.rating}
                  </span>
                  <span className="star-bar">
                    <div
                      className="filled"
                      style={{ width: `${barWidth}px` }}
                    />
                  </span>
                  <span className="star-count">{item.count}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="review-section">
          <h3>Customer Reviews ({reviews.length})</h3>
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="review">
                <p className="review-user">{r.user?.name || "Anonymous"}</p>
                <p className="review-rating">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </p>
                <p className="review-comment">{r.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
