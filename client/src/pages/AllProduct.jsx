
// src/pages/AllProduct.jsx
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { searchProducts } from "../services/productServices";
import "../styles/AllProduct.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Filters from "../components/Filters";

const AllProduct = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const keyword = searchParams.get("keyword")?.toLowerCase() || "";
  const categoriesParam = searchParams.get("categories") || "";
  const categoriesArray = categoriesParam ? categoriesParam.split(",") : [];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [filters, setFilters] = useState({
    brand: "",
    color: "",
    size: "",
    minPrice: "",
    maxPrice: "",
    minDiscount: "",
  });

  // sorting
  const [sort, setSort] = useState("recommended");

  // sidebar toggle (for mobile)
  const [showFilters, setShowFilters] = useState(false);

  // ✅ dynamic filter values
  const [brands, setBrands] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const query = { keyword, ...filters };
        if (categoriesParam) query.categories = categoriesParam;

        // Sorting options
        if (sort === "price-asc") {
          query.sortBy = "finalPrice";
          query.sortOrder = "asc";
        } else if (sort === "price-desc") {
          query.sortBy = "finalPrice";
          query.sortOrder = "desc";
        } else if (sort === "rating") {
          query.sortBy = "rating";
          query.sortOrder = "desc";
        } else if (sort === "newest") {
          query.sortBy = "createdAt";
          query.sortOrder = "desc";
        } else if (sort === "discount") {
          query.sortBy = "discount";
          query.sortOrder = "desc";
        } else if (sort === "featured") {
          query.sortBy = "isFeatured";
          query.sortOrder = "desc";
        } else if (sort === "new-arrival") {
          query.sortBy = "isNewArrival";
          query.sortOrder = "desc";
        } else if (sort === "recommended") {
          query.sortBy = "recommended";
          query.sortOrder = "desc";
        }

        const response = await searchProducts(query);
        const { products } = response.data;
        setProducts(products || []);

        // ✅ extract unique filter values
        if (products && products.length > 0) {
          const allBrands = [...new Set(products.map((p) => p.brand))];
          const allColors = [
            ...new Set(
              products.flatMap((p) => p.colors?.map((c) => c.color) || [])
            ),
          ];
          const allSizes = [
            ...new Set(
              products.flatMap(
                (p) =>
                  p.colors?.flatMap((c) => c.stock?.map((s) => s.size) || []) ||
                  []
              )
            ),
          ];

          setBrands(allBrands);
          setColors(allColors);
          setSizes(allSizes);
        }
      } catch (err) {
        console.error(
          "Error fetching products:",
          err?.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, categoriesParam, sort, filters]);

  // === Breadcrumbs ===
  const renderBreadcrumbs = () => {
    if (categoriesArray.length === 0) {
      return <div className="breadcrumb">Products Found</div>;
    }

    const crumbs = [];
    let pathCategories = [];

    crumbs.push(
      <Link key="home" to="/" className="breadcrumb-link">
        Home
      </Link>
    );

    categoriesArray.forEach((cat, idx) => {
      pathCategories.push(cat);
      const pathQuery = `/search?categories=${encodeURIComponent(
        pathCategories.join(",")
      )}`;

      if (idx === categoriesArray.length - 1) {
        crumbs.push(
          <span key={`sep-${idx}`} className="breadcrumb-separator">
            /
          </span>
        );
        crumbs.push(
          <span key={cat} className="breadcrumb-current">
            {cat}
          </span>
        );
      } else {
        crumbs.push(
          <span key={`sep-${idx}`} className="breadcrumb-separator">
            /
          </span>
        );
        crumbs.push(
          <Link key={cat} to={pathQuery} className="breadcrumb-link">
            {cat}
          </Link>
        );
      }
    });

    return <div className="breadcrumb">{crumbs}</div>;
  };

  if (loading) return <p className="loading">Loading products...</p>;

  return (
    <>
      <Navbar />
      <div className="all-products-layout">
        {/* === Sidebar Filters === */}
        <Filters
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
          brands={brands}
          colors={colors}
          sizes={sizes}
        />

        {/* Main Content */}
        <main className="products-main">
          <div className="products-header">
            {renderBreadcrumbs()}

            {/* Sort */}
            <div className="sort-section">
              <span className="sort-label">Sort by :</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Better Discount</option>
                <option value="rating">Customer Rating</option>
                <option value="featured">Featured</option>
                <option value="new-arrival">New Arrival</option>
                <option value="recommended">Recommended</option>
              </select>
            </div>
          </div>

          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => {
                // ✅ pick the right color variant image
                let displayColor = product.colors?.[0];
                if (filters.color) {
                  const matchedColor = product.colors?.find(
                    (c) => c.color.toLowerCase() === filters.color.toLowerCase()
                  );
                  if (matchedColor) {
                    displayColor = matchedColor;
                  }
                }

                return (
                  <Link
                    to={`/product/${product._id}?color=${encodeURIComponent(
                      displayColor?.color || ""
                    )}`}
                    key={product._id}
                  >
                    <div className="product-card">
                      <img
                        src={displayColor?.images?.[0]}
                        alt={product.name}
                        className="product-image"
                      />
                      <div className="product-info">
                        <h4 className="brand-name">{product.brand}</h4>
                        <h3 className="product-title">
                          {product.name.length > 27
                            ? product.name.slice(0, 24) + "..."
                            : product.name}
                        </h3>
                        <div className="price-discount">
                          <span className="final-price">
                            ₹{product.finalPrice || product.price}
                          </span>
                          {product.discount > 0 && (
                            <>
                              <span className="original-price">
                                ₹{product.price}
                              </span>
                              <span className="discount">
                                {product.discount}% OFF
                              </span>
                            </>
                          )}
                        </div>
                        <div className="rating-reviews">
                          <span className="star">★</span>
                          <span className="rating">
                            {product.rating?.toFixed(1) || "0.0"}
                          </span>
                          <span className="review-count">
                            ({product.reviewsCount || 0})
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default AllProduct;
