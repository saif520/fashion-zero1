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

  const handleQuantityChange = async (productId, size, delta) => {
    const item = cartItems.find(
      (i) => i.product._id === productId && i.size === size
    );
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;

    try {
      await updateCartItem({
        productId,
        size,
        newQuantity,
      });
      fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleRemove = async (productId, size) => {
    try {
      await removeCartItem({ productId, size });
      fetchCart();
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to move item");
    }
  };

  const handleMoveToWishlist = async (productId, size) => {
    try {
      await moveToWishlist({ productId, size });
      fetchCart();
      toast.success("Moved to wishlist");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to move item");
    }
  };

  const getItemImage = (product) => {
    const firstImage = product.colors[0]?.images[0];
    return firstImage || "https://via.placeholder.com/150";
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.price * (1 - item.product.discount || 0);
      return total + price * item.quantity;
    }, 0);
  };

  if (loading) return <div className="cart-loading">Loading...</div>;

  return (
    <>
      <Navbar/>
      <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart-message">
          <p>Your cart is empty.</p>
          <a href="/category/all" className="go-shopping-btn">Go to Shopping</a>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => {
              const price = item.product.price * (1 - item.product.discount || 0);
              return (
                <div key={`${item.product._id}-${item.size}`} className="cart-item">
                  <img src={getItemImage(item.product)} alt={item.product.name} />
                  <div className="cart-item-details">
                    <h4>{item.product.name}</h4>
                    <p>Size: {item.size}</p>
                    <p>Price: ₹{price.toFixed(2)}</p>
                    <div className="quantity-control">
                      <button onClick={() => handleQuantityChange(item.product._id, item.size, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.product._id, item.size, 1)}>+</button>
                    </div>
                    <p>Total: ₹{(price * item.quantity).toFixed(2)}</p>
                    <div className="cart-item-actions">
                      <button onClick={() => handleMoveToWishlist(item.product._id, item.size)}>
                        Move to Wishlist
                      </button>
                      <button onClick={() => handleRemove(item.product._id, item.size)} className="remove-btn">
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
            <button className="checkout-btn" onClick={() => navigate("/checkout")}>
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
