
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/wishlist.css";
import {
  getMyWishlist,
  removeFromWishlist,
  moveToCart,
} from "../services/wishlistServices";
import MoveToCartModal from "../components/MoveToCartModal";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moving, setMoving] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // contains { product, color }
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

  const handleRemove = async (productId, color) => {
    try {
      await removeFromWishlist({ productId, color });
      setWishlist((prev) =>
        prev.filter(
          (item) => !(item.product._id === productId && item.color === color)
        )
      );
      toast.success("Removed from wishlist.");
    } catch (error) {
      console.error("Remove error:", error.message);
      toast.error("Failed to remove item.");
    }
  };

  const openMoveModal = (item) => {
    setSelectedItem(item); // contains both { product, color }
    setShowModal(true);
  };

  const handleMoveToCart = async ({ size, quantity, color }) => {
    try {
      setMoving(selectedItem.product._id);
      await moveToCart({
        productId: selectedItem.product._id,
        color, // already passed from modal
        size,
        quantity,
      });
      setWishlist((prev) =>
        prev.filter(
          (item) =>
            !(
              item.product._id === selectedItem.product._id &&
              item.color === selectedItem.color
            )
        )
      );
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
          <div className="wishlist-flex">
            {wishlist.map((item) => {
              const { product, color } = item;
              const colorObj = product.colors.find(
                (c) => c.color.toLowerCase() === color.toLowerCase()
              );
              const image = colorObj?.images?.[0] || product.images?.[0];

              return (
                <div className="wishlist-card" key={`${product._id}-${color}`}>
                  {/* ❌ Remove icon */}
                  <button
                    className="wishlist-remove-btn"
                    onClick={() => handleRemove(product._id, color)}
                  >
                    ✕
                  </button>

                  <img src={image} alt={product.name} />
                  <div className="wishlist-info">
                    <h4>
                      {product.name.length > 25
                        ? product.name.slice(0, 25) + "..."
                        : product.name}
                    </h4>
                    {/* ✅ Price Section */}
                    <div className="wishlist-price">
                      <span className="final-price">₹{product.finalPrice}</span>
                      <span className="original-price">₹{product.price}</span>
                      <span className="discount">{product.discount}% OFF</span>
                    </div>

                    {/* <p>Color: {color}</p> */}
                    <div className="wishlist-actions">
                      <button
                        className="btn move"
                        onClick={() => openMoveModal(item)}
                        disabled={moving === product._id}
                      >
                        {moving === product._id ? "Moving..." : "Move to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showModal && selectedItem && (
          <MoveToCartModal
            product={selectedItem.product} // ✅ product
            color={selectedItem.color} // ✅ fixed color
            onClose={() => setShowModal(false)}
            onConfirm={handleMoveToCart}
          />
        )}
      </div>
    </>
  );
};

export default Wishlist;
