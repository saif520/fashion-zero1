import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Wishlist.css";
import { getMyWishlist, removeFromWishlist, moveToCart } from "../services/wishlistServices";
import MoveToCartModal from "../components/MoveToCartModal";
import { toast } from "react-toastify"; // ✅ added toast import
import Navbar from "../components/Navbar";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moving, setMoving] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await getMyWishlist();
      setWishlist(res.wishlist.items || []);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error.message);
      toast.error("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((item) => item.product._id !== productId));
    } catch (error) {
      console.error("Remove error:", error.message);
      toast.error("Failed to remove item.");
    }
  };

  const openMoveModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleMoveToCart = async ({ size, quantity }) => {
    try {
      setMoving(selectedProduct._id);
      await moveToCart({
        productId: selectedProduct._id,
        size,
        quantity,
      });
      setWishlist((prev) => prev.filter((item) => item.product._id !== selectedProduct._id));
      toast.success("Moved to cart.");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error moving to cart");
    } finally {
      setMoving(null);
      setShowModal(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="wishlist-container">
        <h2>Your Wishlist</h2>

        {loading ? (
          <p>Loading wishlist...</p>
        ) : wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <p>Your wishlist is empty.</p>
            <button className="btn go-cart" onClick={() => navigate("/cart")}>
              Go to Cart
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map(({ product }) => (
              <div className="wishlist-item" key={product._id}>
                <img src={product.colors[0]?.images[0]} alt={product.name} />
                <div className="wishlist-details">
                  <h4>{product.name}</h4>
                  <p>₹{product.price}</p>
                  <div className="wishlist-buttons">
                    <button
                      className="btn move"
                      onClick={() => openMoveModal(product)}
                      disabled={moving === product._id}
                    >
                      {moving === product._id ? "Moving..." : "Move to Cart"}
                    </button>
                    <button
                      className="btn remove"
                      onClick={() => handleRemove(product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && selectedProduct && (
          <MoveToCartModal
            product={selectedProduct}
            onClose={() => setShowModal(false)}
            onConfirm={handleMoveToCart}
          />
        )}
      </div>
    </>
  );
};

export default Wishlist;

