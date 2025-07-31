import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaHeart, FaShoppingBag, FaBars } from "react-icons/fa";
import "../styles/Navbar.css";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (trimmed) {
      navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
      setKeyword("");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mock user (replace with real auth user)
  const user = {
    name: "Saifuddin",
    email: "saif@example.com",
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">ZERO</Link>

        {/* Hamburger Menu */}
        <div className="menu-icon" onClick={toggleMenu}>
          <FaBars />
        </div>

        {/* Nav Links */}
        <nav className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <Link to="/category/all">All</Link>
          <Link to="/category/clothing">Clothing</Link>
          <Link to="/category/shoes">Shoes</Link>
          <Link to="/category/shirts">Shirts</Link>
          <Link to="/category/tshirts">T-Shirts</Link>
          <Link to="/category/jackets">Jackets</Link>
          <Link to="/category/accessories">Accessories</Link>
          <Link to="/category/electronics">Electronics</Link>
        </nav>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </form>

        {/* Icons */}
        <div className="navbar-icons">
          <div className="icon" ref={dropdownRef} onClick={() => setShowDropdown((prev) => !prev)}>
            <FaUser />
            <span>Profile</span>
            {showDropdown && (
              <ProfileDropdown user={user} onClose={() => setShowDropdown(false)} />
            )}
          </div>

          <Link to="/wishlist" className="icon">
            <FaHeart />
            <span>Wishlist</span>
          </Link>

          <Link to="/cart" className="icon">
            <FaShoppingBag />
            <span>Bag</span>
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
