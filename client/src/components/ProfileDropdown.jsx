import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "../styles/ProfileDropdown.css";
import { getCurrentUser, logoutUser } from "../services/authServices";
import { Context } from "../main";
import { useContext } from "react";
import { toast } from "react-toastify";

const ProfileDropdown = ({ onClose, onMouseEnter, onMouseLeave }) => {
  const { setUser, setIsAuthenticated } = useContext(Context);
  const [closing, setClosing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // 🔹 new state
  const navigate = useNavigate();

  const handleOptionClick = (path) => {
    setClosing(true);
    setTimeout(() => {
      navigate(path);
      onClose();
    }, 200);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUserData(res.user);
      } catch (err) {
        console.log("Not logged in");
        setUserData(null);
      } finally {
        setLoadingUser(false); // 🔹 stop loading
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    setClosing(true);
    try {
      const res = await logoutUser();
      setUser(null);
      setIsAuthenticated(false);

      // 🔹 Trigger global cart reset
      window.dispatchEvent(new Event("cartUpdated"));

      toast.success(res.message || "Logged out.", {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        onClose();
      }, 200);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Logout failed. Please try again.",
        { position: "top-center", autoClose: 2000 }
      );
      setClosing(false);
    }
  };

  return (
    <div
      className={`profile-dropdown ${closing ? "fade-out" : "fade-in"}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="profile-header">
        <div className="profile-icon-wrapper">
          <FaUser className="profile-icon" />
        </div>
        <div className="profile-info">
          <h4>{userData?.name || "Guest"}</h4>
          <p>{userData?.email || "Not logged in"}</p>
        </div>
      </div>

      <div className="profile-options">
        {loadingUser ? ( // 🔹 wait until user is fetched
          <p style={{ padding: "10px", fontSize: "13px", color: "#777" }}>
            Loading...
          </p>
        ) : !userData ? (
          <>
            <button onClick={() => handleOptionClick("/auth?type=login")}>
              Login
            </button>
            <button onClick={() => handleOptionClick("/auth?type=register")}>
              Register
            </button>
          </>
        ) : (
          <>
            <button onClick={() => handleOptionClick("/my-orders")}>
              My Orders
            </button>
            <button onClick={() => handleOptionClick("/wishlist")}>
              Wishlist
            </button>
            <button onClick={() => handleOptionClick("/cart")}>Cart</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileDropdown;
