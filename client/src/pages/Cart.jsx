// src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Cart.css";
import {
  getMyCart,
  updateCartItem,
  removeCartItem,
  moveToWishlist,
} from "../services/cartServices";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const { cart } = await getMyCart();
      setCartItems(cart.items || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, color, size, delta) => {
    const item = cartItems.find(
      (i) => i.product._id === productId && i.size === size && i.color === color
    );
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;

    try {
      await updateCartItem({
        productId,
        color,
        size,
        newQuantity,
      });
      fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (productId, color, size) => {
    try {
      await removeCartItem({ productId, color, size });
      fetchCart();
      toast.success("Item removed from cart");

      // ✅ Trigger global update for Navbar cart count
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
    }
  };

  const handleMoveToWishlist = async (productId, color, size) => {
    try {
      await moveToWishlist({ productId, color, size });
      fetchCart();
      toast.success("Moved to wishlist");

      // ✅ Trigger global update for Navbar cart count
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to move item");
    }
  };

  // ✅ Pick image based on selected color in cart item
  const getItemImage = (product, selectedColor) => {
    const colorObj = product.colors.find(
      (c) => c.color.toLowerCase() === selectedColor.toLowerCase()
    );
    return colorObj?.images[0] || "https://via.placeholder.com/150";
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.finalPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  if (loading) return <div className="cart-loading">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="cart-container">
        <h2>Your Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <div className="empty-cart-message">
            <p>Your cart is empty.</p>
            <a href="/" className="go-shopping-btn">
              Go to Shopping
            </a>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {cartItems.map((item) => {
                const price = item.product.finalPrice || item.product.price;
                return (
                  <div
                    key={`${item.product._id}-${item.size}-${item.color}`}
                    className="cart-item"
                  >
                    <img
                      src={getItemImage(item.product, item.color)}
                      alt={item.product.name}
                    />
                    <div className="cart-item-details">
                      <h4>{item.product.name}</h4>
                      <p>Color: {item.color}</p>
                      <p>Size: {item.size}</p>
                      <p>Price: ₹{price.toFixed(2)}</p>
                      <div className="quantity-control">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.product._id,
                              item.color,
                              item.size,
                              -1
                            )
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.product._id,
                              item.color,
                              item.size,
                              1
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <p>Total: ₹{(price * item.quantity).toFixed(2)}</p>
                      <div className="cart-item-actions">
                        <button
                          onClick={() =>
                            handleMoveToWishlist(
                              item.product._id,
                              item.color,
                              item.size
                            )
                          }
                        >
                          Move to Wishlist
                        </button>
                        <button
                          onClick={() =>
                            handleRemove(
                              item.product._id,
                              item.color,
                              item.size
                            )
                          }
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="cart-summary">
              <h3>Subtotal: ₹{calculateSubtotal().toFixed(2)}</h3>
              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;



