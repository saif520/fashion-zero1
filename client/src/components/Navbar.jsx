import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaShoppingBag,
  FaBars,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import "../styles/Navbar.css";
import ProfileDropdown from "./ProfileDropdown";
import { getMyCart } from "../services/cartServices"; // ✅ Import your cart API service
import { Context } from "../main"; // ✅ bring auth context

const categoryData = {
  Men: {
    Topwear: [
      "Tshirts",
      "Casual Shirts",
      "Formal Shirts",
      "Sweatshirts",
      "Jackets",
      "Sweaters",
      "Blazers",
    ],
    Bottomwear: ["Jeans", "Trousers", "Shorts", "Track Pants"],
    Innerwear: ["Briefs", "Vests"],
    Footwear: ["Casual Shoes", "Sports Shoes", "Formal Shoes"],
  },
  Women: {
    "Western Wear": ["Tops", "Dresses", "Jumpsuits", "Shrugs"],
    "Ethnic Wear": ["Kurtas", "Sarees", "Lehenga Cholis", "Salwar Suits"],
    Footwear: ["Flats", "Heels", "Casual Shoes"],
  },
  Kids: {
    Boys: ["Tshirts", "Shorts", "Ethnic Wear"],
    Girls: ["Frocks", "Skirts", "Ethnic Wear"],
  },
  Beauty: {
    Makeup: ["Lipstick", "Eyeliner", "Foundation", "Nail Polish"],
    Skincare: ["Moisturizers", "Face Wash", "Sunscreen", "Serums"],
    Haircare: ["Shampoo", "Conditioner", "Hair Oil", "Hair Mask"],
    Fragrances: ["Perfume", "Body Mist", "Deodorant"],
  },
  "Home & Living": {
    "Bed Linen & Furnishing": [
      "Bedsheets",
      "Bedding Sets",
      "Blankets",
      "Pillows",
    ],
    "Home Decor": ["Wall Art", "Clocks", "Photo Frames", "Showpieces"],
    "Kitchen & Dining": [
      "Cookware",
      "Tableware",
      "Storage Containers",
      "Kitchen Tools",
    ],
    Bath: ["Towels", "Bath Mats", "Shower Curtains"],
  },
  Art: {
    Paintings: [
      "Oil Painting",
      "Watercolor",
      "Acrylic Painting",
      "Digital Art",
    ],
    Sculptures: ["Wood Sculpture", "Metal Sculpture", "Clay Sculpture"],
    Photography: ["Landscape", "Portrait", "Abstract"],
    Crafts: ["Handmade Jewelry", "Paper Craft", "Pottery"],
  },
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0); // ✅ New state for cart count
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const hoverTimeout = useRef(null);

  const { isAuthenticated } = useContext(Context); // ✅ get auth status from context

  // ✅ Fetch cart count
  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated) {
        setCartCount(0); // 🔹 reset cart if not logged in
        return;
      }
      try {
        const data = await getMyCart();
        setCartCount(data?.cart?.items?.length || 0);
      } catch (err) {
        console.error("Failed to fetch cart", err);
        setCartCount(0);
      }
    };

    // Run on mount and whenever auth changes
    fetchCart();

    const handleCartUpdate = () => fetchCart();
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [isAuthenticated]); // 🔹 refetch when login/logout changes

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?keyword=${keyword}`);
      setKeyword("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <FaBars className="hamburger" onClick={() => setMenuOpen(!menuOpen)} />
        <Link to="/" className="logo">
          Fashion Zero
        </Link>
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          {Object.keys(categoryData).map((main) => (
            <li
              key={main}
              className="nav-item"
              onMouseEnter={() => setActiveCategory(main)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <Link
                to={`/search?categories=${encodeURIComponent(main)}`}
                className="main-link"
              >
                {main}
              </Link>
              {activeCategory === main && (
                <div className="mega-menu" ref={dropdownRef}>
                  {Object.entries(categoryData[main]).map(
                    ([section, items]) => (
                      <div key={section} className="mega-column">
                        <h4>
                          <Link
                            to={`/search?categories=${encodeURIComponent(
                              main
                            )},${encodeURIComponent(section)}`}
                          >
                            {section}
                          </Link>
                        </h4>
                        <ul>
                          {items.map((item) => (
                            <li key={item}>
                              <Link
                                to={`/search?categories=${encodeURIComponent(
                                  main
                                )},${encodeURIComponent(
                                  section
                                )},${encodeURIComponent(item)}`}
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-center">
        <form className="search-form" onSubmit={handleSearch}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </form>
      </div>

      <div className="navbar-right">
        {/* Profile Dropdown */}
        <div
          className="nav-icon"
          onMouseEnter={() => {
            clearTimeout(hoverTimeout.current);
            setShowProfileDropdown(true);
          }}
          onMouseLeave={() => {
            hoverTimeout.current = setTimeout(() => {
              setShowProfileDropdown(false);
            }, 200);
          }}
        >
          <FaUser />
          <span>Profile</span>
          {showProfileDropdown && (
            <ProfileDropdown
              onClose={() => setShowProfileDropdown(false)}
              onMouseEnter={() => {
                clearTimeout(hoverTimeout.current);
                setShowProfileDropdown(true);
              }}
              onMouseLeave={() => {
                hoverTimeout.current = setTimeout(() => {
                  setShowProfileDropdown(false);
                }, 200);
              }}
            />
          )}
        </div>

        <Link to="/wishlist" className="nav-icon">
          <FaHeart />
          <span>Wishlist</span>
        </Link>

        {/* ✅ Bag with count badge */}
        <Link to="/cart" className="nav-icon cart-icon">
          <FaShoppingBag />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          <span>Bag</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
