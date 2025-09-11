
// src/components/Filters.jsx
import React, { useState } from "react";
import "../styles/Filters.css"; 

const Filters = ({
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  brands = [],
  colors = [],
  sizes = [],
}) => {
  const [expanded, setExpanded] = useState({
    brand: false,
    color: false,
    size: false,
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const renderLimitedList = (items, key, renderItem) => {
    const limit = 6;
    const isExpanded = expanded[key];
    const visibleItems = isExpanded ? items : items.slice(0, limit);
    const hiddenCount = items.length - limit;

    return (
      <>
        {visibleItems.map(renderItem)}
        {hiddenCount > 0 && (
          <button
            type="button"
            className="show-more-btn"
            onClick={() =>
              setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
            }
          >
            {isExpanded ? "Show less" : `+${hiddenCount} more`}
          </button>
        )}
      </>
    );
  };

  return (
    <>
      {/* === Mobile Toggle Button === */}
      <button
        className="filters-toggle-btn"
        onClick={() => setShowFilters(true)}
      >
        Filters ☰
      </button>

      {/* === Overlay for mobile === */}
      {showFilters && (
        <div
          className="filters-overlay active"
          onClick={() => setShowFilters(false)}
        ></div>
      )}

      {/* === Sidebar Filters === */}
      <aside className={`filters-sidebar ${showFilters ? "show" : ""}`}>
        <div className="filters-header-mobile">
          <h3>Filters</h3>
          <button
            className="close-filters-btn"
            onClick={() => setShowFilters(false)}
          >
            ✕
          </button>
        </div>

        <button
          className="clear-filters"
          onClick={() =>
            setFilters({
              brand: "",
              color: "",
              size: "",
              minPrice: "",
              maxPrice: "",
              minDiscount: "",
            })
          }
        >
          Clear All
        </button>

        {/* Brand */}
        <div className="filter-group collapsible">
          <h4>Brand</h4>
          <div className="checkbox-list">
            {renderLimitedList(brands, "brand", (b) => (
              <label key={b}>
                <input
                  type="checkbox"
                  checked={filters.brand === b}
                  onChange={() =>
                    handleFilterChange("brand", filters.brand === b ? "" : b)
                  }
                />
                {b}
              </label>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="filter-group collapsible">
          <h4>Color</h4>
          <div className="filter-color-options">
            {renderLimitedList(colors, "color", (c) => (
              <label key={c} className="filter-color-checkbox">
                <input
                  type="checkbox"
                  checked={filters.color === c}
                  onChange={() =>
                    handleFilterChange("color", filters.color === c ? "" : c)
                  }
                />
                <span
                  className={`filter-color-circle ${c
                    .toLowerCase()
                    .replace(/\s+/g, "")}`}
                ></span>
                {c}
              </label>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="filter-group collapsible">
          <h4>Size</h4>
          <div className="checkbox-list">
            {renderLimitedList(sizes, "size", (s) => (
              <label key={s}>
                <input
                  type="checkbox"
                  checked={filters.size === s}
                  onChange={() =>
                    handleFilterChange("size", filters.size === s ? "" : s)
                  }
                />
                {s}
              </label>
            ))}
          </div>
        </div>

        {/* Price - Myntra Style */}
        <div className="filter-group collapsible">
          <h4>Price Range</h4>
          <div className="checkbox-list">
            {[
              { min: 0, max: 500, label: "Rs. 0 to Rs. 500" },
              { min: 501, max: 1000, label: "Rs. 501 to Rs. 1000" },
              { min: 1001, max: 2000, label: "Rs. 1001 to Rs. 2000" },
              { min: 2001, max: 5000, label: "Rs. 2001 to Rs. 5000" },
              { min: 5001, max: 10000, label: "Rs. 5001 to Rs. 10000" },
            ].map((range) => {
              const isChecked =
                filters.minPrice === String(range.min) &&
                filters.maxPrice === String(range.max);

              return (
                <label key={range.label}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      if (isChecked) {
                        setFilters((prev) => ({
                          ...prev,
                          minPrice: "",
                          maxPrice: "",
                        }));
                      } else {
                        setFilters((prev) => ({
                          ...prev,
                          minPrice: String(range.min),
                          maxPrice: String(range.max),
                        }));
                      }
                    }}
                  />
                  {range.label}
                </label>
              );
            })}
          </div>
        </div>

        {/* Discount */}
        <div className="filter-group collapsible">
          <h4>Discount</h4>
          <div className="checkbox-list">
            <label>
              <input
                type="checkbox"
                checked={filters.minDiscount === ""}
                onChange={() => handleFilterChange("minDiscount", "")}
              />
              All
            </label>
            {[10, 20, 30, 40, 50, 60].map((d) => (
              <label key={d}>
                <input
                  type="checkbox"
                  checked={filters.minDiscount === String(d)}
                  onChange={() =>
                    handleFilterChange(
                      "minDiscount",
                      filters.minDiscount === String(d) ? "" : String(d)
                    )
                  }
                />
                {d}% and above
              </label>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Filters;
