 import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getAllProducts } from "../services/productServices";
import "../styles/AllProduct.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const AllProduct = () => {
  const { category: categoryFromParams } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword")?.toLowerCase() || "";

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Sort States
  const [sort, setSort] = useState("");

  const normalizedCategory = categoryFromParams
    ? categoryFromParams.replace(/-/g, " ").toLowerCase()
    : "";

  // Fetch all products initially
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        const allProducts = response.data.products || [];
        setProducts(allProducts);
        setFilteredProducts(allProducts);
        console.log("Fetched products:", allProducts);
      } catch (error) {
        console.error("Error fetching products:", error?.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply search, category filter, and sort logic
  useEffect(() => {
    let filtered = [...products];

    // Filter by category (from URL param)
    if (normalizedCategory && normalizedCategory !== "all") {
      filtered = filtered.filter((p) =>
        p.category?.toLowerCase() === normalizedCategory
      );
    }

    // Filter by keyword
    if (keyword) {
      filtered = filtered.filter((p) =>
        p.name?.toLowerCase().includes(keyword) ||
        p.description?.toLowerCase().includes(keyword) ||
        p.category?.toLowerCase().includes(keyword)
      );
    }

    // Sort by price
    if (sort === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [products, normalizedCategory, sort, keyword]);

  if (loading) return <p className="loading">Loading products...</p>;

  return (
    <>
      <Navbar />
      <div className="product-container">
        <h1>{normalizedCategory ? normalizedCategory : "All"} Products</h1>

        {/* Filter & Sort UI */}
        <div className="filter-section">
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id}>
              <div className="product-card" key={product._id}>
                <img
                  src={product.colors?.[0]?.images?.[0]}
                  alt={product.name}
                  className="product-image"
                />
                <h3>{product.name}</h3>
                <p className="price">₹{product.price}</p>
                <div className="rating-reviews">
                  <span className="rating">
                    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="#fec76f"
    style={{ marginRight: "4px" }}
  >
    <path d="M12 2l2.95 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 7.05-1.01z" />
  </svg>
  {product.rating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="review-count">
                    ({product.reviewsCount || 0})
                  </span>
                </div>
              </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AllProduct;